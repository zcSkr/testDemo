import React, { useState, useEffect } from 'react';
import { Form } from 'antd';

import SkuList from './SkuList'
import SkuTableOss from './SkuTableOss' //oss上传

const FormItem = Form.Item;
const Sku = ({
  productList,
  sku = [{ key: '', inputVisible: false, inputValue: '', tags: [] }],
  // sku = [ //模拟数据
  //   { key: '颜色', inputVisible: false, inputValue: '', tags: ['红', '黄'] },
  //   { key: '尺寸', inputVisible: false, inputValue: '', tags: ['大', '小'] }
  // ],
}) => {
  const form = Form.useFormInstance();
  const [specList, setSpecList] = useState(sku);

  useEffect(() => {
    handleChangeSku(sku)
  }, [sku])

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
          items[index] = arr[0][i] + '卐' + arr[1][j];
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

  const handleChangeSku = specList => {
    setSpecList([...specList])
    form?.setFieldsValue({ sku: [...specList] })
    let newList = []
    const flatten = setArray(specList.map(item => item.tags)) || []
    // console.log(123)
    flatten.forEach((item, i) => {
      let obj = {
        key: `key_${i}`,
        price: null,
        num: null,
        img: null
      }
      let attributes = []
      specList.forEach((record, i) => {
        obj[record.key] = item.split('卐')[i]
        attributes.push({ key: record.key, value: item.split('卐')[i] })
      })
      obj.attributes = JSON.stringify(attributes)

      if (productList?.length) { //有数据回显的话
        productList.forEach(item => {
          if (obj.attributes == item.attributes) {
            obj.id = item.id
            obj.price = item.price
            obj.num = item.num
            obj.fileList = item.img ? [{
              uid: -1,
              name: item.img.split('/')[2],
              status: 'done',
              url: item.img,
              response: { data: item.img, code: 200 }
            }] : []
          }
        })
      }
      newList.push(obj)
    })
    form.setFieldsValue({ skuList: newList })
  }

  return (
    <>
      <FormItem
        name='sku'
        label='商品规格'
        required
        initialValue={sku}
        rules={[
          {
            validator(rule, value) {
              if (!value) {
                return Promise.reject('请创建规格！');
              }
              if (value.some(item => (!item.key || item.tags.length === 0))) {
                return Promise.reject('请创建规格项!');
              }
              return Promise.resolve();
            },
          }
        ]}
      >
        <SkuList handleChangeSku={handleChangeSku} />
      </FormItem>
      {!!form.getFieldValue('skuList')?.length &&
        <FormItem
          name='skuList'
          label='规格项目表'
          required
          rules={[
            {
              validator(rule, value) {
                if (!value) {
                  return Promise.reject('请创建商品规格！');
                }
                if (value.some(item => item.price === null)) {
                  return Promise.reject('请输入规格项价格!');
                }
                if (value.some(item => item.num === null)) {
                  return Promise.reject('请输入规格项库存!');
                }
                if (value.some(item => (item.img === null || item.img.length === 0))) {
                  return Promise.reject('请上传规格图片!');
                }
                return Promise.resolve();
              },
            }
          ]}
        >
          {/* oss用SkuTableOss，普通用SkuTable */}
          <SkuTableOss
            handleSkuTableChange={skuList => form.setFieldsValue({ skuList })}
            sku={specList}
          />
        </FormItem>
      }
    </>
  )
}

export default Sku