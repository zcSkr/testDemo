
import { CloseOutlined } from '@ant-design/icons';
import React, { useState, useEffect } from 'react';
import { Image } from 'antd';
import { useModel } from 'umi'
import styles from './index.less'

const VideoPreview = ({
  src,
  width,
  height,
}) => {
  const { initialState: { ossSuffix } } = useModel('@@initialState');
  const [visible, setVisible] = useState(false)
  const [classNameVisible, setClassNameVisible] = useState(false)

  useEffect(() => {
    if (classNameVisible == false) {
      setTimeout(() => {
        console.log('关闭visible')
        setVisible(false)
      }, 200)
    }
  }, [classNameVisible]);

  return (
    <>
      <Image
        width={width}
        height={height}
        src={src + ossSuffix}
        onClick={() => {
          // 4.23.4 onVisibleChange 只生效一次, 换成onClick
          setVisible(true)
          setClassNameVisible(true)
        }}
        preview={{ visible: false }}
      />
      {
        visible &&
        <div className={"ant-image-preview-mask " + (classNameVisible ? styles.videoPreviewMask : styles.videoPreviewMaskHide)} >
          <div className={"ant-image-preview-wrap " + (classNameVisible ? styles.videoPreviewWrap : styles.videoPreviewWrapHide)}>
            <ul className="ant-image-preview-operations">
              <li className="ant-image-preview-operations-operation">
                <CloseOutlined onClick={() => setClassNameVisible(false)} style={{ fontSize: 18, cursor: 'pointer' }} />
              </li>
            </ul>
            <div className="ant-image-preview-img-wrapper" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={() => setClassNameVisible(false)}>
              <video className="ant-image-preview-img" autoPlay controls poster={src + ossSuffix} src={src} onClick={e => e.stopPropagation()} />
            </div>
          </div>
        </div>
      }
    </>
  );
};

export default VideoPreview