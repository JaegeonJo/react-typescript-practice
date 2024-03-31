import type { TodoItem } from "./components/TodoItem";
import { useState } from "react";
import { isAfter, isEqual } from "date-fns";
import TodoItemComponent from "./components/TodoItem";
import DatePicker from "./components/DatePicker";
// styling: radix ui(headless UI), mui

/*
Task3: Style 다듬기.
Task3-1: Dialog로 빼기.
Task3-2: 날짜형태로 만들기
Task4: API 붙이기.
*/

function App() {
  const today = new Date();
  const [todoList, setTodoList] = useState<TodoItem[]>([]);
  const [inputDueDate, setInputDueDate] = useState(today);
  const [inputContent, setInputContent] = useState("");
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

  function compareTodoItem(prevItem: TodoItem, currItem: TodoItem) {
    if (isEqual(prevItem.dueDate, currItem.dueDate)) {
      return 0; // don't change order
    }
    if (isAfter(prevItem.dueDate, currItem.dueDate)) {
      // currItem.dueDate is After preItem.dueDate
      return 1;
    } else {
      return -1;
    }
  }
  return (
    <div>
      <div id="InputBox">
        <DatePicker
          value={inputDueDate}
          minDate={new Date()}
          onSelectDate={(d) => setInputDueDate(d)}
        />
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
            if (inputContent === "") {
              window.alert("내용을 입력해주세요.");
              return;
            }
            setTodoList(() => {
              return [...todoList, newTodoItem].sort(compareTodoItem);
            });
            setInputContent("");
            setInputDueDate(today);
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
