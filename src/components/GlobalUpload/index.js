import React, { useEffect, useState, useRef } from 'react';
import { Upload, message, Button, Image, Space } from 'antd';
import { useModel } from 'umi';
import { PlusOutlined, UploadOutlined, CloseOutlined } from '@ant-design/icons'
import ImgCrop from 'antd-img-crop';
import { SortableContainer, SortableElement, arrayMove } from 'react-sortable-hoc';
import styles from './index.less';
import { getOSSData, getSuffix, randomString, getDuration } from '../_utils';
import { flushSync } from 'react-dom';
const GlobalUploadOss = ({
  maxCount = 1,
  onChange,
  onRemove,
  title,
  accept = 'image/*',
  value,
  crop,
  data: { type = 'default' },
  listType = 'picture-card',
  supportSort,
  ...props
}) => {
  const { initialState: { ossHost, ossSuffix } } = useModel('@@initialState');
  const [previewSrc, setPreviewSrc] = useState()
  const [ossSTSInfo, setOssSTSInfo] = useState();
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
        thumbUrl: /video/.test(accept) ? item + ossSuffix : item
      })) : []
    }
  })
  useEffect(() => {
    (async () => {
      const res = await getOSSData()
      setOssSTSInfo(res)
    })()
  }, [])

  const beforeUpload = async (file, fileList) => {
    //上传前文件重命名
    file.ossName = accept == '.apk' ? `${type}${getSuffix(file.name)}` : `${type}/${randomString(10)}${getSuffix(file.name)}`
    return file
  }

  const handleUploadChange = async ({ file, fileList }) => {
    // console.log(file,fileList)
    if (file.status === 'done') {
      message.success(`${file.name} 上传成功`);
      file.url = ossHost + '/' + file.ossName;
      if (/video/.test(accept)) {
        file.thumbUrl = file.url + ossSuffix;
      }
      if(/audio|video/.test(file.type) && props.getTime) {
        const time = await getDuration(file.originFileObj)
        props.getTime(time)
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
  }

  let previewProps = {}
  if (accept?.indexOf('image') != -1) { //目前仅针对图片利用Image组件4.7.0的新特性实现自定义预览
    previewProps = {
      onPreview: file => setPreviewSrc(file.url)
    }
  }
  if (accept?.indexOf('video') != -1) { //自定义的视频预览
    previewProps = {
      onPreview: file => {
        setVideoSrc(file.url)
        setClassNameVisible(true)
      }
    }
  }

  // 处理视频预览
  const [videoSrc, setVideoSrc] = useState(false)
  const [classNameVisible, setClassNameVisible] = useState(false)
  useEffect(() => {
    if (classNameVisible == false) {
      setTimeout(() => {
        setVideoSrc('')
      }, 200)
    }
  }, [classNameVisible]);


  const uploadComponent = (
    <Upload
      name='file'
      {...props}
      listType={listType}
      maxCount={maxCount}
      accept={accept}
      data={file => ({
        key: file.ossName,
        ...ossSTSInfo,
        'success_action_status': '200' //让服务端返回200,不然，默认会返回204
      })}
      action={ossHost}
      multiple={maxCount > 1}
      fileList={fileList}
      onChange={handleUploadChange}
      beforeUpload={beforeUpload}
      onRemove={file => onRemove && onRemove(file)}
      {...previewProps}
    >
      {
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
      }
    </Upload>
  )

  const SortableItem = SortableElement(({ item }) => <Image style={{ cursor: 'move' }} preview={false} width={50} height={50} src={item.url} />);
  const SortableList = SortableContainer(() => {
    return (
      <Space className={styles.SortContainer}>
        {fileList.map((item, index) => (
          <SortableItem key={`item-${index}`} disabled={false} index={index} item={item} />
        ))}
      </Space>
    );
  });
  const uploadWrapRef = useRef()
  const SortableComponent = () => {
    //.uploadImg_sort的样式写在主要是定义zIndex为1000+，因为antd的modal层级为1000.目的是为了解决拖拽时元素看不见的问题
    return (
      <SortableList
        helperContainer={() => uploadWrapRef.current}
        helperClass="uploadImg_sort"
        lockOffset={0}
        transitionDuration={500} //拖拽过度动画时长
        lockToContainerEdges={true}
        axis="xy"
        onSortEnd={({ oldIndex, newIndex }) => {
          console.log(arrayMove(fileList, oldIndex, newIndex))
          const sortFileList = arrayMove(fileList, oldIndex, newIndex)
          onChange(sortFileList.map(item => item.url).filter(r => r).join(','))
          setFileList(sortFileList)
        }}
      />
    )
  }

  return (
    <div ref={uploadWrapRef} style={{ overflow: 'hidden' }} className={styles.uploadWrap}>
      {
        !!crop ?
          <>
            <ImgCrop rotate grid>
              {uploadComponent}
            </ImgCrop>
            {supportSort && value?.length > 1 ? <SortableComponent /> : null}
          </>
          :
          <>
            {uploadComponent}
            {supportSort && value?.length > 1 ? <SortableComponent /> : null}
          </>
      }
      <Image
        width={0}
        height={0}
        src={previewSrc}
        preview={{
          visible: Boolean(previewSrc),
          onVisibleChange: (visible, prevVisible) => setPreviewSrc(undefined)
        }}
      />
      {
        videoSrc &&
        <div className={"ant-image-preview-mask " + (classNameVisible ? styles.videoPreviewMask : styles.videoPreviewMaskHide)} >
          <div className={"ant-image-preview-wrap " + (classNameVisible ? styles.videoPreviewWrap : styles.videoPreviewWrapHide)}>
            <ul className="ant-image-preview-operations">
              <li className="ant-image-preview-operations-operation">
                <CloseOutlined onClick={() => setClassNameVisible(false)} style={{ fontSize: 18, cursor: 'pointer' }} />
              </li>
            </ul>
            <div className="ant-image-preview-img-wrapper" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={() => setClassNameVisible(false)}>
              <video className="ant-image-preview-img" autoPlay controls poster={videoSrc + ossSuffix} src={videoSrc} onClick={e => e.stopPropagation()} />
            </div>
          </div>
        </div>
      }
    </div>
  )
}

export default GlobalUploadOss