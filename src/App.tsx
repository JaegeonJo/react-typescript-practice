import { useState } from "react";

type TodoItem = {
  key: string,
  content: string,
  completed: boolean,
};

type TodoItemProps = {
  item: TodoItem,
  onChangeCheckbox: (checked: boolean) => void,
  onClickRemove: () => void,
  onChangeContent: (content: string) => void,
};

function TodoItemComponent({
  item,
  onChangeCheckbox,
  onClickRemove,
  onChangeContent,
}: TodoItemProps) {
  const [isEdit, setIsEdit] = useState(false);
  return (
    <div>
      <input
        type="checkbox"
        checked={item.completed}
        onChange={({ target }) => {
          onChangeCheckbox(target.checked);
        }}
      />
      {isEdit ? (
        <span>
          <input
            type="text"
            value={item.content}
            onChange={(e) => {
              onChangeContent(e.target.value);
            }}
          />
          <button
            onClick={() => {
              setIsEdit(false);
            }}
          >
            Update
          </button>
        </span>
      ) : (
        <span>
          {item.content}
          <button
            onClick={() => {
              setIsEdit(true);
            }}
          >
            Edit
          </button>
        </span>
      )}
      <button onClick={onClickRemove}>Remove</button>
    </div>
  );
}

function App() {
  const [todoList, setTodoList] = useState<TodoItem[]>([]);
  const [inputContent, setInputContent] = useState<string>("");
  const newTodoItem: TodoItem = {
    key: crypto.randomUUID(),
    content: inputContent,
    completed: false,
  };

  function getUpdatedList(
    itemList: TodoItem[],
    itemKey: string,
    updator: (prevItem: TodoItem) => TodoItem
  ) {
    return itemList.map((item) => {
      if (item.key === itemKey) return updator(item);
      return item;
    });
  }
  return (
    <div>
      <label>
        Todo:
        <input
          type="text"
          value={inputContent}
          onChange={(event) => {
            setInputContent(event.target.value);
          }}
        />
      </label>
      <button
        onClick={() => {
          if (inputContent !== "") {
            setTodoList(() => {
              return [...todoList, newTodoItem];
            });
            setInputContent("");
          }
        }}
      >
        Add
      </button>
      <div>
        {todoList.map((item) => {
          return (
            <TodoItemComponent
              key={item.key}
              item={item}
              onChangeCheckbox={(checked) => {
                setTodoList(() => {
                  return getUpdatedList(todoList, item.key, (prevItem) => ({
                    key: prevItem.key,
                    content: prevItem.content,
                    completed: checked,
                  }));
                });
              }}
              onClickRemove={() => {
                setTodoList(() => {
                  return todoList.filter((value) => {
                    if (item.key === value.key) {
                      return false;
                    }
                    return true;
                  });
                });
              }}
              onChangeContent={(content) => {
                setTodoList(() => {
                  return getUpdatedList(todoList, item.key, (prevItem) => ({
                    key: prevItem.key,
                    content: content,
                    completed: prevItem.completed,
                  }));
                });
              }}
            />
          );
        })}
      </div>
    </div>
  );
}

export default App;
