import { useState } from "react";
import { format, isFuture, isAfter } from "date-fns";

type TodoItem = {
  key: string,
  content: string,
  dueDate: string,
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
  const [userInput, setUserInput] = useState("");
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "120px 1fr auto",
        justifyContent: "space-between",
      }}
    >
      <label>
        <input
          type="checkbox"
          checked={item.completed}
          onChange={({ target }) => {
            onChangeCheckbox(target.checked);
          }}
        />
        {`[${item.dueDate}]`}
      </label>

      {isEdit ? (
        <span>
          <input
            type="text"
            value={userInput}
            onChange={(e) => {
              setUserInput(e.target.value);
            }}
          />
        </span>
      ) : (
        <span>{item.content}</span>
      )}
      <span>
        {isEdit ? (
          <button
            style={{ width: "70px" }}
            onClick={() => {
              if (userInput !== "") {
                setUserInput(userInput);
                onChangeContent(userInput);
                setIsEdit(false);
              } else {
                window.alert("내용을 입력해주세요.");
                setUserInput(item.content);
              }
            }}
          >
            Update
          </button>
        ) : (
          <button
            style={{ width: "70px" }}
            onClick={() => {
              setIsEdit(true);
              setUserInput(item.content);
            }}
          >
            Edit
          </button>
        )}
        <button onClick={onClickRemove}>Remove</button>
      </span>
    </div>
  );
}

function App() {
  const today: string = format(new Date(), "yyyy-MM-dd");
  const [todoList, setTodoList] = useState<TodoItem[]>([]);
  const [inputDueDate, setInputDueDate] = useState<string>(today);
  const [inputContent, setInputContent] = useState<string>("");
  const newTodoItem: TodoItem = {
    key: crypto.randomUUID(),
    content: inputContent,
    dueDate: inputDueDate,
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
      <div id="InputBox">
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
        <input
          type="date"
          value={inputDueDate}
          onChange={(event) => {
            const selectedDate: string = event.target.value;
            if (isFuture(selectedDate)) {
              setInputDueDate(event.target.value);
            } else {
              window.alert("오늘 날짜부터 선택 가능합니다.");
            }
          }}
        />
        <button
          onClick={() => {
            if (inputContent !== "") {
              setTodoList(() => {
                return [...todoList, newTodoItem].sort((a, b) =>
                  isAfter(a.dueDate, b.dueDate) ? 1 : -1
                );
              });
              setInputContent("");
              setInputDueDate(today);
            } else {
              window.alert("내용을 입력해주세요.");
            }
          }}
        >
          Add
        </button>
      </div>
      <div id="TodoList">
        {todoList.map((item) => {
          return (
            <TodoItemComponent
              key={item.key}
              item={item}
              onChangeCheckbox={(completed) => {
                setTodoList(() => {
                  return getUpdatedList(todoList, item.key, (prevItem) => ({
                    ...prevItem,
                    completed,
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
                    ...prevItem,
                    content,
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
