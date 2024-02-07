import { Form, Input, message, Popover, theme } from 'antd';
import React, { useState, useRef, useEffect, useContext, useCallback, forwardRef } from 'react';
import { useEmotionCss } from '@ant-design/use-emotion-css';
import { ProTable } from '@ant-design/pro-components';

const StandardTable = ({ columns, handleSave, request, ...props }) => {
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 })
  const { token } = theme.useToken()
  const EditableContext = React.createContext();
  const EditableRow = useCallback(({ index, ...props }) => {
    const [form] = Form.useForm();
    return (
      <Form form={form} component={false}>
        <EditableContext.Provider value={form}>
          <tr {...props} />
        </EditableContext.Provider>
      </Form>
    );
  }, []);
  const EditableCell = useCallback(({
    title,
    editable,
    children,
    dataIndex,
    record,
    handleSave,
    formItemProps,
    ...restProps
  }) => {
    const [editing, setEditing] = useState(false);
    const inputRef = useRef();
    const form = useContext(EditableContext);
    useEffect(() => {
      if (editing) {
        inputRef.current?.focus();
      }
    }, [editing]);

    const toggleEdit = () => {
      setEditing(!editing);
      form.setFieldsValue({
        [dataIndex]: record[dataIndex],
      });
    };

    const save = async e => {
      try {
        const values = await form.validateFields([dataIndex]);
        toggleEdit();
        if (record[dataIndex] !== values[dataIndex]) {
          handleSave(dataIndex, { ...record, ...values });
        }
      } catch (errInfo) {
        console.log('Save failed:', errInfo);
      }
    };

    let childNode = children;
    const newFormItemProps = typeof formItemProps == 'function' ? formItemProps() : formItemProps
    if (editable) {
      childNode = editing ? (
        <Form.Item
          label={title}
          name={dataIndex}
          noStyle
          {...newFormItemProps}
        >
          <CustomInput editable={editable} save={save} ref={inputRef} />
        </Form.Item>
      ) : (
        <div className="editableCellValueWrap" onClick={toggleEdit}>
          {children}
        </div>
      );
    }

    return <td {...restProps}>{childNode}</td>;
  }, []);

  const CustomInput = forwardRef(({ value, onChange, editable, save }, ref) => {
    const { errors } = Form.Item.useStatus()
    const props = { value, onChange, ref, size: 'small', style: { width: '100%' }, onBlur: save }
    return (
      <Popover content={<span style={{ color: token.colorError }}>{errors[0]}</span>} open={Boolean(errors[0])}>
        {
          editable.renderEditCell?.({ ...props, save }) ||
          <Input {...props} onPressEnter={save} placeholder="请输入" allowClear />
        }
      </Popover>
    )
  })

  const components = {
    body: {
      row: EditableRow,
      cell: EditableCell,
    },
  };

  columns = columns.map(col => {
    if (!col.editable) {
      return col;
    }

    return {
      ...col,
      onCell: record => ({
        record,
        editable: col.editable,
        dataIndex: col.dataIndex,
        title: col.title,
        formItemProps: col.formItemProps,
        handleSave: handleSave,
      }),
    };
  });

  const editableRowClassName = useEmotionCss(({ token }) => {
    return {
      '.editableCellValueWrap': {
        border: '1px solid transparent',
      },
      ':hover .editableCellValueWrap': {
        cursor: 'pointer',
        borderColor: token.colorPrimaryHover,
        borderRadius: token.borderRadiusSM,
      },
    };
  });

  return (
    <ProTable
      rowKey={record => record.key || record.id}
      search={{ labelWidth: 'auto' }}
      dateFormatter={false}
      {...props}
      rowClassName={() => [editableRowClassName, typeof props.rowClassName == 'function' ? props.rowClassName() : props.rowClassName]}
      request={request ? async (params, sort, filter) => {
        const res = await request(params, sort, filter)
        if (res.code == 200) {
          setPagination({ current: res.data.pageNum, pageSize: res.data.pageSize, total: res.data.total })
        } else {
          message.error({ content: res.msg, key: 'error' });
        }
        return res
      } : undefined}
      beforeSearchSubmit={params => {
        params.startTime = params.createTime?.[0].startOf('day').format('YYYY-MM-DD HH:mm:ss')
        params.endTime = params.createTime?.[1].endOf('day').format('YYYY-MM-DD HH:mm:ss')
        delete params.createTime
        const propsParams = props.beforeSearchSubmit?.(params) //外部透传拓展
        return { ...params, ...propsParams }
      }}
      components={components}
      columns={columns}
      pagination={
        typeof props.pagination == 'boolean' ? props.pagination :
          {
            pageSizeOptions: [10, 20, 50, 100],
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: total => `共 ${total} 条`,
            ...pagination
          }
      }
    />
  );
};
export default StandardTable
