import { DownCircleTwoTone } from '@ant-design/icons';
import {
  message,
  Checkbox,
  Timeline,
} from 'antd';
import { ProForm, PageContainer, ProCard, ProFormTextArea, ProFormSelect, ProFormText, ProFormDependency } from '@ant-design/pro-components';
import React, { useState, useEffect, useRef } from 'react';
import GlobalUpload from '@/components/GlobalUpload';
import dayjs from 'dayjs'

import * as services_uploadApp from '@/services/sys/uploadApp';

const formLayout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 18 },
};

const UploadApp = () => {
  const [activeKey, setActiveKey] = useState('member')
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 })
  const { current, pageSize, total } = pagination
  const [list, setList] = useState([])
  const formRef = useRef()

  useEffect(() => {
    queryList()
  }, [activeKey]);

  const queryList = async (pageNum = 1) => {
    const response = await services_uploadApp.query({ updatePort: activeKey, pageNum, pageSize: 10 })
    if (response.code == 200) {
      setPagination({
        current: response.data.pageNum,
        pageSize: response.data.pageSize,
        total: response.data.total
      })
      setList(pageNum > 1 ? list.concat(response.data.list) : response.data.list)
    }
  }

  const handleUpdate = async fields => {
    const hide = message.loading({ content: '操作中', key: 'loading' });
    const res = await services_uploadApp.add({
      isConstraint: fields.isConstraint ? 1 : 0,
      newVersion: fields.newVersion,
      updateLog: fields.updateLog,
      updatePort: fields.updatePort,
      apkFileUrl: fields.apkFileUrl[0]?.url,
      targetSize: parseFloat(fields.apkFileUrl[0].size / 1024 / 1024).toFixed(2) + 'Mb',
      newMd5: 'app'
    })
    hide();
    if (res?.code == 200) {
      message.success({ content: '操作成功', key: 'success' });
      formRef.current.resetFields()
      queryList()
    } else {
      message.error({ content: res.msg, key: 'error' });
    }
  };

  // 一般项目只有一个端，那么修改tabs数组和去掉端口下拉选择传参写固定值即可
  const tabs = [{ key: 'member', title: '用户端' }]
  return (
    <PageContainer>
      <ProCard>
        <ProForm
          onFinish={fieldsValue => handleUpdate({ ...fieldsValue })}
          submitter={{
            render: (props, doms) => <div style={{ textAlign: 'center' }}>{doms[1]}</div>
          }}
          layout="horizontal"
          {...formLayout}
          formRef={formRef}
          initialValues={{
            isConstraint: false,
            updatePort: 'member'
          }}
        >
          <ProFormSelect
            name="updatePort"
            label="端口"
            rules={[{ required: true }]}
            fieldProps={{
              showSearch: true,
            }}
            options={[{ label: '用户端', value: 'member' }]}
          />
          <ProFormDependency name={['updatePort']}>
            {({ updatePort }) => (
              <ProForm.Item
                name="apkFileUrl"
                label="安装包"
                rules={[{ required: true, message: '请上传.apk文件' }]}
              >
                <GlobalUpload
                  accept='.apk'
                  listType="text"
                  data={{ type: 'APK/' + updatePort }}
                  totalNum={1}
                />
              </ProForm.Item>
            )}
          </ProFormDependency>
          <ProFormText
            name="newVersion"
            label="版本号"
            rules={[{ required: true }]}
            placeholder="请输入版本号（例1.0.0）"
            fieldProps={{ maxLength: 50 }}
          />
          <ProForm.Item
            name="isConstraint"
            label="是否强制更新"
            valuePropName="checked"
          >
            <Checkbox>是</Checkbox>
          </ProForm.Item>
          <ProFormTextArea
            name="updateLog"
            label="更新描述"
            rules={[{ required: true }]}
            placeholder="请输入更新描述"
            fieldProps={{ autoSize: { minRows: 2, maxRows: 6 }, maxLength: 500, allowClear: true, showCount: true }}
          />
        </ProForm>
      </ProCard>
      <ProCard
        tabs={{
          type: 'card',
          activeKey,
          onChange: activeKey => setActiveKey(activeKey),
          items: tabs.map(item => ({
            key: item.key,
            label: item.title,
            children: (<>
              <Timeline
                items={list.map((item, index) => ({
                  children: (
                    <>
                      {dayjs(item.createTime).format("YYYY/MM/DD")}
                      <span style={{ margin: 20 }}>{item.updateLog} </span>
                      Size:{item.targetSize}
                      <br />
                      版本号:{item.newVersion}
                    </>
                  )
                }))}
              />
              {current * pageSize < total && (
                <DownCircleTwoTone
                  onClick={() => queryList()}
                  style={{ fontSize: 48, color: "#1677ff", cursor: " pointer" }}
                />
              )}
            </>)
          })),
        }}
      />
    </PageContainer>
  );
};

export default UploadApp
