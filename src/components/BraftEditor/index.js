import 'braft-editor/dist/index.css'
import 'braft-extensions/dist/table.css'
import React, { useState, useRef, useEffect, useReducer } from 'react'
import BraftEditor from 'braft-editor'
import { ContentUtils } from 'braft-utils'
import { Upload, message, Spin } from 'antd'
import { PictureFilled, PlaySquareFilled } from '@ant-design/icons'
import { imageControls, excludeControls, controls, tableOptions } from './config'
import { useModel } from 'umi';
import Table from 'braft-extensions/dist/table'
import { getOSSData, getSuffix, randomString } from '../_utils';
const BraftEditorComponentOSS = ({
  value,
  readOnly, //仅读模式
  onChange,
}) => {
  const { initialState: { ossHost } } = useModel('@@initialState');
  // BraftEditor.use(Table(tableOptions)) //表格插入拓展,需要时放开
  const editorReducer = (state, action) => {
    switch (action.type) {
      case 'insertImage':
        return ContentUtils.insertMedias(state, [{
          type: 'IMAGE',
          url: action.payload
        }])
      case 'insertVideo':
        return ContentUtils.insertMedias(state, [{
          type: 'VIDEO',
          url: action.payload
        }])
      case 'default': return action.payload
      default:
        return state
    }
  }
  const blockImportFn = Table()[2].importer;
  const blockExportFn = Table()[2].exporter;//解决回显表格不展示问题 issues链接 https://github.com/margox/braft-extensions/issues/58
  const [editorState, dispatchReducer] = useReducer(editorReducer, BraftEditor.createEditorState(value, { editorId: 'editor-oss', blockImportFn, blockExportFn }));
  const [uploading, setUploading] = useState(false);
  const editorRef = useRef()
  const timer = useRef();
  const [ossSTSInfo, setOssSTSInfo] = useState();
  useEffect(() => {
    (async () => {
      const res = await getOSSData()
      setOssSTSInfo(res)
    })()
    return () => {
      clearTimeout(timer.current)
    };
  }, [])

  const uploadProps = {
    name: 'file',
    accept: "image/*",
    multiple: true,
    showUploadList: false,
    action: ossHost,
    data: (file) => ({
      key: file.ossName,
      ...ossSTSInfo,
      'success_action_status': '200' //让服务端返回200,不然，默认会返回204
    }),
    beforeUpload: async (file, fileList) => {//上传前文件重命名
      file.ossName = `BraftEditor/${randomString(10)}${getSuffix(file.name)}`
      return file
    },
    onChange: ({ file, fileList, event }) => {
      if (file.status === 'uploading') {
        setUploading(true)
      } else if (file.status === 'error') {
        message.error('图片上传失败')
        setUploading(false)
      } else if (file.status === 'done') {
        setUploading(false)
        let src = ossHost + '/' + file.ossName
        if (/video/.test(file.type)) {
          dispatchReducer({ type: 'insertVideo', payload: src })
        } else {
          dispatchReducer({ type: 'insertImage', payload: src })
        }
      }
    }
  }

  const extendControls = [ //额外的工具条
    {
      key: 'antd-uploader',
      type: 'component',
      component: (
        <>
          <Upload {...uploadProps}>
            {/* 这里的按钮最好加上type="button"，以避免在表单容器中触发表单提交，用Antd的Button组件则无需如此 */}
            <button type="button" className="control-item button upload-button" data-title="插入图片">
              <PictureFilled />
            </button>
          </Upload>
          {/* 可拓展的上传视频，需要时放开 */}
          {/* <Upload {...uploadProps} accept="video/*">
            <button type="button" className="control-item button upload-button" data-title="插入视频">
              <PlaySquareFilled />
            </button>
          </Upload> */}
        </>
      )
    },
  ]

  const handleChange = (editorState) => {
    dispatchReducer({ type: 'default', payload: editorState })
    if (onChange) {
      //函数节流
      clearTimeout(timer.current)
      timer.current = setTimeout(() => {
        onChange(/^(<p>\s*<\/p>)*$/g.test(editorState.toHTML()) ? '' : editorState.toHTML())
      }, 300)
    }
  }

  return (
    <div className="editor-wrapper" style={{ border: '1px solid #d9d9d9', borderRadius: 4 }}>
      <Spin spinning={uploading} tip="图片上传中">
        <BraftEditor
          id="editor-oss"
          ref={editorRef}
          value={editorState}
          placeholder="请输入内容"
          onChange={handleChange}
          readOnly={!!readOnly}
          // controls={controls} //不要全屏就配置controls
          excludeControls={excludeControls} //excludeControls
          extendControls={extendControls}
          imageControls={imageControls}
          fontSizes={[12, 14, 16, 18, 20, 24, 28, 30, 32, 36, 40, 48]}
          contentStyle={{ height: 500 }}
          onSave={() => editorRef.current?.getDraftInstance().blur()} //ctrl+s保存的回调
        />
      </Spin>
    </div>
  )
}

export default BraftEditorComponentOSS