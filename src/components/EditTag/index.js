import { PlusOutlined } from '@ant-design/icons';
import React, { useEffect, useState, useRef } from 'react';
import { Input, Space, Tag, Tooltip } from 'antd';

const EditTag = ({
  value,
  onChange
}) => {
  
  const [inputVisible, setInputVisible] = useState(false)
  const [inputValue, setInputValue] = useState('')
  const [editInputIndex, setEditInputIndex] = useState(-1)
  const [editInputValue, setEditInputValue] = useState('')
  const editInputRef = useRef()
  const inputRef = useRef()
  const [tags,setTags] = useState(value?.split(',') || [])


  const handleInputConfirm = () => {
    let newTags = [...tags];
    if (inputValue && tags.indexOf(inputValue) === -1) {
      newTags = [...tags, inputValue];
    }
    setInputValue('')
    setInputVisible(false)
    setTags(newTags)
    onChange(newTags.join(',') || undefined)
  }

  const handleEditInputConfirm = () => {
    const newTags = [...value];
    newTags[editInputIndex] = editInputValue;
    setEditInputIndex(-1)
    setEditInputValue('')
    setTags(newTags)
    onChange(newTags.join(',') || undefined)
  }

  useEffect(() => {
    if (inputVisible) {
      inputRef.current?.focus()
    }
    if (editInputIndex != -1) {
      editInputRef.current?.focus()
    }
  }, [inputVisible, editInputIndex])

  return (
    <Space wrap>
      {tags?.map((tag, index) => {
        if (editInputIndex === index) {
          return (
            <Input
              ref={editInputRef}
              key={tag}
              type="text"
              size="small"
              value={editInputValue}
              onChange={e => setEditInputValue(e.target.value)}
              onBlur={handleEditInputConfirm}
              onPressEnter={handleEditInputConfirm}
            />
          );
        }
        const isLongTag = tag.length > 20;
        const tagElem = (
          <Tag
            key={tag}
            closable
            onClose={() => {
              setTags(tags.filter(r => r !== tag)) 
              onChange(tags.filter(r => r !== tag).join(',') || undefined)
            }}
          >
            <span
              onDoubleClick={e => {
                if (index !== 0) {
                  setEditInputValue(tag)
                  setEditInputIndex(index)
                  e.preventDefault();
                }
              }}
            >
              {isLongTag ? `${tag.slice(0, 20)}...` : tag}
            </span>
          </Tag>
        );
        return isLongTag ? (
          <Tooltip title={tag} key={tag}>
            {tagElem}
          </Tooltip>
        ) : (
          tagElem
        );
      })}
      {inputVisible && (
        <Input
          ref={inputRef}
          type="text"
          size="small"
          value={inputValue}
          onChange={e => setInputValue(e.target.value)}
          onBlur={handleInputConfirm}
          onPressEnter={handleInputConfirm}
        />
      )}
      {!inputVisible && (
        <Tag color="processing" onClick={() => setInputVisible(true)}>
          <PlusOutlined /> 添加
        </Tag>
      )}
    </Space>
  );
};

export default EditTag;
