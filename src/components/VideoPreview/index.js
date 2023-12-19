import React, { useState, useEffect } from 'react';
import { Image } from 'antd';
import { useModel } from '@umijs/max'

const VideoPreview = ({
  src,
  width,
  height,
}) => {
  const { initialState: { ossSuffix } } = useModel('@@initialState');
  const [visible, setVisible] = useState(false)

  return (
    <Image
      width={width}
      height={height}
      src={src + ossSuffix}
      preview={{
        visible,
        onVisibleChange: (value) => setVisible(value),
        imageRender: () => <video width="80%" controls src={src} />,
        toolbarRender: () => null,
      }}
    />
  );
};

export default VideoPreview