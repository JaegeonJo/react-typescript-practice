import { useState, PropsWithChildren } from "react";

type TodoItem = {
  key: number;
  content: string;
  completed: boolean;
};

type TodoItemProps = PropsWithChildren<{
  item: TodoItem;
  onChangeCheckbox: (checked: boolean) => void;
  onClickRemove: () => void;
  onChangeContent: (content: string) => void;
}>;

function TodoItemComponent({
  item,
  onChangeCheckbox,
  onClickRemove,
  onChangeContent,
  children,
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
      {children}
    </div>
  );
}

function App() {
  const [todoList, setTodoList] = useState<TodoItem[]>([]);
  const [inputContent, setInputContent] = useState<string>("");
  const newTodoItem: TodoItem = {
    key: todoList.length,
    content: inputContent,
    completed: false,
  };
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
        {todoList.map((item, itemIdx) => {
          return (
            <TodoItemComponent
              key={item.key}
              item={item}
              onChangeCheckbox={(checked) => {
                setTodoList(() => {
                  return todoList.map((value, index) => {
                    if (itemIdx === index) {
                      return {
                        key: value.key,
                        content: value.content,
                        completed: checked,
                      };
                    }
                    return value;
                  });
                });
              }}
              onClickRemove={() => {
                setTodoList(() => {
                  return todoList.filter((_, index) => {
                    if (itemIdx === index) {
                      return false;
                    }
                    return true;
                  });
                });
              }}
              onChangeContent={(content) => {
                setTodoList(() => {
                  return todoList.map((value, index) => {
                    if (itemIdx === index) {
                      return {
                        key: value.key,
                        content: content,
                        completed: value.completed,
                      };
                    }
                    return value;
                  });
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
