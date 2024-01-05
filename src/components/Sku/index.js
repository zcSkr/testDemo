import React, { useState, useEffect } from 'react';
import { ProForm, ProFormDependency } from '@ant-design/pro-components';

import SkuList from './SkuList'
import SkuTable from './SkuTable'

const Sku = ({
  separator = '卐',
}) => {
  const form = ProForm.useFormInstance();
  const sku = ProForm.useWatch('sku', form); //监听sku变化

  useEffect(() => {
    handleResetSkuList(sku)
  },[sku])

  const handleResetSkuList = (sku) => {
    if(!sku) return
    sku = sku.filter(item => item)
    const flatten = setArray(sku.map(item => item.tags?.split(',') || [])) || []
    const newList = flatten.map((item, i) => {
      const obj = { key: `key_${i}`  }
      const specsJson = sku.map((record, i) => {
        obj[record.name] = item.split(separator)[i]
        return ({ key: record.name, value: item.split(separator)[i] })
      })
      obj.specsJson = JSON.stringify(specsJson)
      const skuList = form.getFieldValue('skuList')
      if (skuList?.length) { //处理数据回显
        skuList.forEach(item => {
          if (obj.specsJson == item.specsJson) {
            for (let key in item) {
              if(key != 'key') obj[key] = item[key] //除24行的唯一键外，对其他字段赋值
            }
          }
        })
      }
      return obj
    })
    // console.log(newList, 'newList')
    form.setFieldsValue({ skuList: newList })
  }

  //得出规格笛卡尔积
  const setArray = (arr) => {
    let len = arr.length;
    // 当数组大于等于2个的时候
    if (len >= 2) {
      // 第一个数组的长度
      let len1 = arr[0].length;
      // 第二个数组的长度
      let len2 = arr[1].length;
      // 2个数组产生的组合数
      let lenBoth = len1 * len2;
      //  申明一个新数组,做数据暂存
      let items = new Array(lenBoth);
      // 申明新数组的索引
      let index = 0;
      // 2层嵌套循环,将组合放到新数组中
      for (let i = 0; i < len1; i++) {
        for (let j = 0; j < len2; j++) {
          items[index] = arr[0][i] + separator + arr[1][j];
          index++;
        }
      }
      // 将新组合的数组并到原数组中
      let newArr = new Array(len - 1);
      for (let i = 2; i < arr.length; i++) {
        newArr[i - 1] = arr[i];
      }
      newArr[0] = items;
      // 执行回调
      return setArray(newArr);
    } else {
      return arr[0];
    }
  }

  return (
    <>
      <ProForm.Item
        name="sku"
        label="商品规格"
        rules={[
          { required: true, message: '请创建规格！' },
          {
            validator(rule, value) {
              if (value?.some(item => (!item.name || !item.tags))) {
                return Promise.reject('请完善规格名/规格值!');
              }
              return Promise.resolve();
            },
          }
        ]}
      >
        <SkuList />
      </ProForm.Item>

      <ProFormDependency name={['sku', 'skuList']}>
        {({ sku, skuList }) => {
          if (skuList?.length > 0) {
            return (
              <ProForm.Item
                name='skuList'
                label='规格项目表'
                rules={[
                  { required: true, message: '请创建规格！' },
                  {
                    validator(rule, value) {
                      if (value?.some(item => item.price === void 0)) {
                        return Promise.reject('请输入规格项价格!');
                      }
                      if (value?.some(item => item.num === void 0)) {
                        return Promise.reject('请输入规格项库存!');
                      }
                      // if (value?.some(item => (item.img === void 0))) {
                      //   return Promise.reject('请上传规格图片!');
                      // }
                      return Promise.resolve();
                    },
                  }
                ]}
              >
                <SkuTable sku={sku.filter(item => item)} />
              </ProForm.Item>
            )
          }
        }}
      </ProFormDependency>
    </>
  )
}

export default Sku