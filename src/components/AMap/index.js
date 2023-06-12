import React, { useRef, useEffect } from 'react';

const AMapComponent = ({
  style,
  onChange,
  onlyShow,
  value
}) => {
  const containerRef = useRef()
  const map = useRef()
	const marker = useRef()
  const centerMap = useRef()

  useEffect(() => {
    map.current = new AMap.Map(containerRef.current, {
      zoom: 12,//级别
      center: [value?.lng || 104.072113, value?.lat || 30.660360],//中心点坐标
      viewMode: '3D'//使用3D视图
    });

    // 地图标注单点时事件
    const clickHandler = ({ lnglat }) => {
      if (onlyShow) return
      // console.log(latLng)
      if (onChange) onChange(lnglat)
      marker.current && map.current?.remove(marker.current);
      // 平移地图中心
      centerMap.current = new AMap.LngLat(lnglat?.lng || 104.072113, lnglat?.lat || 30.660360);
      map.current?.setCenter(centerMap.current);
      //创建标记
      marker.current = new AMap.Marker({
        position: new AMap.LngLat(lnglat?.lng, lnglat?.lat),   // 经纬度对象，也可以是经纬度构成的一维数组[116.39, 39.9]
        title: ''
      });
      map.current?.add(marker.current);
    }
    map.current?.on('click', clickHandler);
    return () => {
      // 解绑事件
      map.current?.off('click', clickHandler)
    }
  }, [])

  useEffect(() => {
    if (value) {
      // 移动中心位置
      centerMap.current = new AMap.LngLat(value?.lng || 104.072113, value?.lat || 30.660360);
      map.current?.setCenter(centerMap.current);
      // 重新打点
      marker.current && map.current?.remove(marker.current);
      marker.current = new AMap.Marker({
        position: centerMap.current,   // 经纬度对象，也可以是经纬度构成的一维数组[116.39, 39.9]
        title: ''
      });
      map.current?.add(marker.current);
    }
  }, [value]);


  return (
    <div ref={containerRef} style={{ maxWidth: '100%', minHeight: 400, height: 400, ...style }}></div>
  )
}

export default AMapComponent