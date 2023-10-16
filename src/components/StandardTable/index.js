import { Form, Input, message } from 'antd';
import React, { useState, useRef, useEffect, useContext } from 'react';
import { useEmotionCss } from '@ant-design/use-emotion-css';
import { ProTable } from '@ant-design/pro-components';

const FormItem = Form.Item
const StandardTable = ({ columns, handleSave, request, ...props }) => {
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 })
  const EditableContext = React.createContext();
  const EditableRow = ({ index, ...props }) => {
    const [form] = Form.useForm();
    return (
      <Form form={form} component={false}>
        <EditableContext.Provider value={form}>
          <tr {...props} />
        </EditableContext.Provider>
      </Form>
    );
  };
  const EditableCell = ({
    title,
    editable,
    children,
    dataIndex,
    record,
    handleSave,
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
        handleSave(dataIndex, { ...record, ...values });
      } catch (errInfo) {
        console.log('Save failed:', errInfo);
      }
    };

    const editableCellValueWrapClassName = useEmotionCss(({ token }) => {
      return {
        border: '1px solid transparent',
        cursor: 'pointer',
        ':hover': {
          borderColor: token.colorPrimaryHover,
          borderRadius: token.borderRadiusSM,
          padding: `0 ${token.paddingXXS}px`,
        },
      };
    });

    let childNode = children;

    if (editable) {
      childNode = editing ? (
        <FormItem
          style={{ margin: 0 }}
          name={dataIndex}
          rules={[{ required: editable.required ?? true, message: `${title}是必填项！` }]}
        >
          {
            editable.renderEditCell?.(inputRef, save) ||
            <Input ref={inputRef} onPressEnter={save} onBlur={save} placeholder="请输入" size="small" style={{ width: '100%' }} />
          }
        </FormItem>
      ) : (
        <div className={editableCellValueWrapClassName} onClick={toggleEdit}>
          {children}
        </div>
      );
    }

    return <td {...restProps}>{childNode}</td>;
  };

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
        handleSave: handleSave,
      }),
    };
  });

  return (
    <ProTable
      rowKey={record => record.key || record.id}
      search={{ labelWidth: 'auto' }}
      dateFormatter={false}
      {...props}
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
