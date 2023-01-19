import React, { useRef, useEffect } from 'react';
// QQMap
const QQMapComponent = ({
  zoom,
  minZoom,
  maxZoom,
  scaleControl,
  zoomControl = false,
  panControl,
  mapTypeControl = false,
  draggable,
  scrollwheel,
  disableDoubleClickZoom,
  circle,
  style,
  onChange,
  onlyShow,
  value,
  address,
}) => {

  const containerRef = useRef()
  const QMap = useRef();
  const marker = useRef();
  const circleMap = useRef();
  const centerMap = useRef()

  useEffect(() => {
    centerMap.current = new qq.maps.LatLng(value?.lat || 30.660360, value?.lng || 104.072113);
    QMap.current = new qq.maps.Map(containerRef.current, {
      zoom: zoom || 12,
      center: centerMap.current,
      mapTypeId: qq.maps.MapTypeId.ROADMAP, //图类型显示普通的街道地图
      minZoom, //设置地图的最小缩放级别。
      maxZoom,//设置地图的最大缩放级别。
      scaleControl, //比例尺控件的初始启用/停用状态。
      zoomControl, //缩放控件的初始启用/停用状态。
      panControl, //移控件的初始启用/停用状态。
      mapTypeControl, //地图类型控件的初始启用/停用状态。
      draggable,//设置是否可以拖拽
      scrollwheel,//设置是否可以滚动
      disableDoubleClickZoom, //设置是否可以双击放大
    })
    QMap.current?.panTo(centerMap.current);

    if (circle && value.lat && value.lng) {
      circleMap.current?.setMap(null);
      circleMap.current = new qq.maps.Circle({
        map: QMap.current,
        center: centerMap.current,
        radius: circle.radius || 0,
        strokeWeight: 1
      })
    }

    // 地图标注单点时事件
    const listener = qq.maps.event.addListener(QMap.current, 'click', ({ latLng }) => {
      if (onlyShow) return
      // console.log(latLng)
      if (onChange) onChange(latLng)
      marker.current?.setMap(null);
      circleMap.current?.setMap(null);
      // 平移地图中心
      QMap.current?.panTo(new qq.maps.LatLng(latLng.lat, latLng.lng));
      //创建标记
      marker.current = new qq.maps.Marker({ position: latLng, map: QMap.current });
      // 创建圆形覆盖物
      centerMap.current = new qq.maps.LatLng(latLng.lat, latLng.lng);
      circleMap.current = circle ? new qq.maps.Circle({
        map: QMap.current,
        center: centerMap.current,
        radius: circle.radius || 0,
        strokeWeight: 1
      }) : null

    });
    return () => {
      qq.maps.event.removeListener(listener);
    }
  }, [])

  useEffect(() => {
    if (value) {
      centerMap.current = new qq.maps.LatLng(value?.lat || 30.660360, value?.lng || 104.072113);
      QMap.current?.panTo(centerMap.current);
      marker.current?.setMap(null);
      marker.current = new qq.maps.Marker({ position: centerMap.current, map: QMap.current });
    }
  }, [value]);

  // 拓展的逆地址解析
  // const timerRef = useRef()
  // useEffect(() => {
  //   const geocoder = new qq.maps.Geocoder()
  //   if (address) {
  //     clearTimeout(timerRef.current)
  //     timerRef.current = setTimeout(() => {
  //       geocoder.getLocation(address)
  //       geocoder.setComplete(res => {
  //         console.log(res)
  //         onChange?.(res.detail.location)
  //       })
  //     }, 500)
  //   }
  // }, [address]);


  return (
    <div ref={containerRef} style={{ maxWidth: '100%', minHeight: 400, height: 400, ...style }}></div>
  )
}

export default QQMapComponent