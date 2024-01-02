import React, { useState } from 'react';
import { Image } from 'antd';

const VideoPreview = ({
  src,
  poster,
  width,
  height,
}) => {
  const [visible, setVisible] = useState(false)

  return (
    <Image
      width={width}
      height={height}
      src={poster}
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