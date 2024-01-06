import { PlusOutlined } from '@ant-design/icons';
import React, { useEffect, useState, useRef, useCallback } from 'react';
import { Input, Space, Tag, Tooltip } from 'antd';
import { DndContext, PointerSensor, useSensor, closestCenter } from '@dnd-kit/core';
import { arrayMove, SortableContext, useSortable, horizontalListSortingStrategy } from '@dnd-kit/sortable';

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
  const [tags, setTags] = useState(value?.split(',') || [])


  const handleInputConfirm = () => {
    let newTags = [...tags];
    if (inputValue && tags.indexOf(inputValue) === -1) {
      newTags = [...tags, inputValue];
    }
    setInputValue('')
    setInputVisible(false)
    setTags(newTags)
    onChange(newTags.join(',') || void 0)
  }

  const handleEditInputConfirm = () => {
    const newTags = [...value];
    newTags[editInputIndex] = editInputValue;
    setEditInputIndex(-1)
    setEditInputValue('')
    setTags(newTags)
    onChange(newTags.join(',') || void 0)
  }

  useEffect(() => {
    if (inputVisible) {
      inputRef.current?.focus()
    }
    if (editInputIndex != -1) {
      editInputRef.current?.focus()
    }
  }, [inputVisible, editInputIndex])


  const sensor = useSensor(PointerSensor, { activationConstraint: { distance: 10 } });

  const handleDragEnd = useCallback(({ active, over }) => {
    if (!over) return;
    if (active.id !== over.id) {
      setTags((data) => {
        const oldIndex = data.findIndex((item) => item === active.id);
        const newIndex = data.findIndex((item) => item === over.id);
        const sortTags = arrayMove(data, oldIndex, newIndex)
        onChange(sortTags.join(',') || void 0)
        return sortTags
      });
    }
  }, []);

  const DraggableTag = ({ tag, index }) => {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: tag });
    const commonStyle = {
      cursor: 'move',
      transition: 'unset', // Prevent element from shaking after drag
    };
    const style = transform
      ? {
        ...commonStyle,
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
        transition: isDragging ? 'unset' : transition, // Improve performance/visual effect when dragging
      }
      : commonStyle;
    const isLongTag = tag.length > 20;
    return (
      <Tag
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
        closable
        onClose={() => {
          setTags(tags.filter(r => r !== tag))
          onChange(tags.filter(r => r !== tag).join(',') || void 0)
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
  };

  return (
    <Space wrap>
      <DndContext sensors={[sensor]} onDragEnd={handleDragEnd} collisionDetection={closestCenter}>
        <SortableContext items={tags} strategy={horizontalListSortingStrategy}>
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
            return isLongTag ? (
              <Tooltip title={tag} key={tag}>
                <DraggableTag tag={tag} key={tag} index={index} />
              </Tooltip>
            ) : <DraggableTag tag={tag} key={tag} index={index} />;
          })}
        </SortableContext>
      </DndContext>
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
