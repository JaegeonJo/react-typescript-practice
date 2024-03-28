import { useState } from "react";

type TodoItem = {
  key: string;
  content: string;
  dueDate: string;
  completed: boolean;
};

type TodoItemProps = {
  item: TodoItem;
  onChangeCheckbox: (checked: boolean) => void;
  onClickRemove: () => void;
  onChangeContent: (content: string) => void;
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
              if (userInput === "") {
                window.alert("내용을 입력해주세요.");
                setUserInput(item.content);
                return;
              }
              setUserInput(userInput);
              onChangeContent(userInput);
              setIsEdit(false);
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

export default TodoItemComponent;
export type { TodoItem };