import React, { useRef, useEffect } from 'react';

const BMapCpmponent = ({
	value,
	onChange,
	onlyShow,
	style,
	id = 'defaultBMap'
}) => {
	const map = useRef()
	const marker = useRef()

	useEffect(() => {
		map.current = new BMap.Map(id, { enableMapClick: false }); // 创建Map实例
		map.current?.setCurrentCity("成都");
		map.current?.disableDoubleClickZoom() //禁用双击放大。
		map.current?.enableScrollWheelZoom(true) //开启鼠标滚轮缩放
		map.current?.centerAndZoom(new BMap.Point(value?.lng || 104.072113, value?.lat || 30.660360), 12); // 初始化地图,设置中心点坐标和地图级别

		// 监听地图点击事件
		map.current?.addEventListener('click', handleClick, true)
		const handleClick = ({
			type,
			target,
			point,
			pixel,
			overlay
		}) => {
			if (onlyShow) return
			if (onChange) onChange(point)
			marker.current = new BMap.Marker(point); // 创建标注
			map.current?.clearOverlays();
			map.current?.addOverlay(marker.current);
		}

		return () => {
			map.current?.removeEventListener('click', handleClick);
		}
	}, [])

	useEffect(() => {
		if (value) {
			map.current?.centerAndZoom(new BMap.Point(value?.lng || 104.072113, value?.lat || 30.660360), 12); // 初始化地图,设置中心点坐标和地图级别
			marker.current = new BMap.Marker({
				lng: value.lng,
				lat: value.lat
			});
			// 创建标注
			map.current?.addOverlay(marker.current);
		}
	}, [value]);

	return <div id={id} style={{ maxWidth: '100%', minHeight: 400, height: 400, ...style }}></div>
}

export default BMapCpmponent