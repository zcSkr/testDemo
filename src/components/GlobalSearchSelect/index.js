import { Select, Spin } from 'antd';
import debounce from 'lodash/debounce';
import React, { useState, useRef, useMemo, useEffect } from 'react';

function DebounceSelect({
	fetchOptions,
	onLoad = true,
	debounceTimeout = 800, //防抖时间
	...props
}) {
	const [fetching, setFetching] = useState(false);
	const [options, setOptions] = useState([]);
	const fetchRef = useRef(0);
	useEffect(() => {
		//首次刷新数据
		if (onLoad) debounceFetcher()
	}, [])
	const debounceFetcher = useMemo(() => {
		const loadOptions = (value) => {
			fetchRef.current += 1;
			const fetchId = fetchRef.current;
			setOptions([]);
			setFetching(true);
			fetchOptions(value).then((newOptions) => {
				if (fetchId !== fetchRef.current) return;
				setOptions(newOptions);
				setFetching(false);
			});
		};
		return debounce(loadOptions, debounceTimeout);
	}, [fetchOptions, debounceTimeout]);
	return (
		<Select

			// mode='multiple'
			showSearch
			labelInValue
			filterOption={false}
			onSearch={debounceFetcher}
			notFoundContent={fetching ? <Spin size="small" /> : '暂无数据'}
			{...props}
			options={options}
		/>
	);
} // Usage of DebounceSelect

const GlobalSearchSelect = ({
	request,//数据接口
	...props
}) => {
	const [value, setValue] = useState([]);

	return (
		<DebounceSelect
			value={value}
			placeholder="请输入"
			fetchOptions={request}
			onChange={(newValue) => setValue(newValue)}
			style={{ width: '100%' }}
			{...props}
		/>
	);
};

export default GlobalSearchSelect;
