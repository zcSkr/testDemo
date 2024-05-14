import React, { useState, useRef, useCallback } from 'react';
import { Upload, message, Button, Image } from 'antd';
import { useModel } from '@umijs/max';
import { PlusOutlined, UploadOutlined } from '@ant-design/icons'
import ImgCrop from 'antd-img-crop';
import { getOSSData, getSuffix, randomString, getDuration } from '../_utils';
import { flushSync } from 'react-dom';
import { useEmotionCss } from '@ant-design/use-emotion-css';
import { DndContext, PointerSensor, useSensor } from '@dnd-kit/core';
import { arrayMove, SortableContext, useSortable, verticalListSortingStrategy, horizontalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

const GlobalUpload = ({
  maxCount = 1,
  onChange,
  onRemove,
  title,
  accept = 'image/*',
  value,
  crop,
  data,
  listType = 'picture-card',
  poster,
  ...props
}) => {
  const { initialState: { ossHost } } = useModel('@@initialState');
  const [previewSrc, setPreviewSrc] = useState('')
  const ossSTSInfo = useRef()
  const { type = 'webDefault' } = data || {}
  const [fileList, setFileList] = useState(() => {
    if (accept === '.apk') { //上传apk专用
      return []
    } else {
      return value?.length > 0 ? value.split(',').map((item, index) => ({
        uid: 'img' + index,
        // name: item.split('/').at(-1), //google兼容，safari等其他浏览器不兼容
        name: item.split('/').slice(-1)?.[0],
        status: 'done',
        url: item,
        thumbUrl: /video/.test(accept) ? poster : item
      })) : []
    }
  })

  const renameFile = useCallback((file) => {
    file.uid = accept == '.apk' ? `${type}${getSuffix(file.name)}` : `${type}/${randomString(10)}${getSuffix(file.name)}`
  }, [])

  const handleUploadChange = useCallback(async ({ file, fileList }) => {
    // console.log(file,fileList)
    if (file.status === 'done') {
      message.success(`${file.name} 上传成功`);
      file.name = file.uid.split('/').slice(-1)?.[0] //修改文件显示名
      file.url = ossHost + '/' + file.uid;
      if (/audio|video/.test(file.type) && props.getTime) {
        const time = await getDuration(file.originFileObj)
        props.getTime?.(time)
      }
    } else if (file.status === 'error') {
      message.error(`${file.name} 上传失败`);
    }
    fileList = fileList.filter(item => item.status);
    if (accept === '.apk') { //上传apk专用
      onChange(fileList)
    } else {
      onChange(fileList.map(item => item.url).filter(r => r).join(','))
    }
    flushSync(() => setFileList(fileList)) //React18 Automatic batching 原因会导致只渲染一次导致多文件上传状态问题
  }, [])

  let imageProps = {}
  if (accept?.indexOf('video') != -1) { //自定义的视频预览
    imageProps = {
      imageRender: () => <video width="80%" controls src={previewSrc} />,
      toolbarRender: () => null,
    }
  }

  const DraggableUploadListItem = useCallback(({ originNode, file }) => {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: file.uid });
    const divClassName = useEmotionCss(({ token }) => {
      return {
        transform: CSS.Transform.toString(transform),
        transition,
        cursor: 'move',
        width: '100%',
        height: '100%',
        'a': {
          pointerEvents: isDragging ? 'none' : 'auto',
        }
      };
    });
    return (
      <div ref={setNodeRef} className={divClassName} {...attributes} {...listeners}>
        {/* hide error tooltip when dragging */}
        {file.status === 'error' && isDragging ? originNode.props.children : originNode}
      </div>
    );
  }, []);

  const sensor = useSensor(PointerSensor, { activationConstraint: { distance: 10 } });

  const handleDragEnd = useCallback(({ active, over }) => {
    if (active.id !== over?.id) {
      setFileList((prev) => {
        const activeIndex = prev.findIndex((i) => i.uid === active.id);
        const overIndex = prev.findIndex((i) => i.uid === over?.id);
        const sortFileList = arrayMove(prev, activeIndex, overIndex)
        onChange(sortFileList.map(item => item.url).filter(r => r).join(','))
        return sortFileList;
      });
    }
  }, []);

  return (
    <>
      <DndContext sensors={[sensor]} onDragEnd={handleDragEnd}>
        <SortableContext items={fileList.map((i) => i.uid)} strategy={['picture-card', 'picture-circle'].includes(listType) ? horizontalListSortingStrategy : verticalListSortingStrategy}>
          <ImgCrop aspect={crop?.aspect || 1} cropShape={listType == 'picture-circle' ? 'round' : 'rect'} rotationSlider showGrid modalTitle="裁剪图片"
            beforeCrop={(file, fileList) => {
              renameFile(file)
              return !!crop //裁切弹窗打开前的回调，若返回 false 或 reject，弹窗将不会打开
            }}
          >
            <Upload
              name='file'
              {...props}
              listType={listType}
              maxCount={maxCount}
              accept={accept}
              data={async file => {
                if (!ossSTSInfo.current) ossSTSInfo.current = await getOSSData()
                return {
                  key: file.uid,
                  ...ossSTSInfo.current,
                  'success_action_status': '200' //让服务端返回200,不然，默认会返回204
                }
              }}
              action={ossHost}
              multiple={maxCount > 1}
              fileList={fileList}
              onChange={handleUploadChange}
              onRemove={file => onRemove?.(file)}
              onPreview={file => setPreviewSrc(file.url)}
              itemRender={(originNode, file) => <DraggableUploadListItem originNode={originNode} file={file} />}
            >
              {
                props.children || (
                  fileList.length >= maxCount ? null :
                    (
                      ['text', 'picture'].includes(listType) ?
                        <Button icon={<UploadOutlined />}>上传文件</Button> :
                        <div>
                          <PlusOutlined />
                          <div className="ant-upload-text">上传{/video/.test(accept) ? '视频' : '图片'}{maxCount ? `(${fileList.length}/${maxCount})` : ''}</div>
                          {title ? <div>{title}</div> : null}
                        </div>
                    )
                )
              }
            </Upload>
          </ImgCrop>
        </SortableContext>
      </DndContext>
      <Image
        width={0}
        height={0}
        src={previewSrc}
        preview={{
          visible: Boolean(previewSrc),
          onVisibleChange: (visible, prevVisible) => setPreviewSrc(void 0),
          ...imageProps
        }}
      />
    </>
  )
}

export default GlobalUpload
