import {
  addDays,
  addMonths,
  eachDayOfInterval,
  format,
  getDate,
  getDay,
  getMonth,
  getYear,
  isBefore,
  lastDayOfMonth,
  startOfDay,
  subDays,
} from "date-fns";
import { useEffect, useState } from "react";
import * as Popover from "@radix-ui/react-popover";
import $styles from "./DataPicker.module.css";

function getDatesInCalendarMonth(viewDate: Date) {
  const firstDate = new Date(getYear(viewDate), getMonth(viewDate), 1);
  const lastDate = lastDayOfMonth(firstDate);
  const firstDay = getDay(firstDate); // 0 is sunday
  const lastDay = getDay(lastDate);
  const calendarStartDate = subDays(firstDate, firstDay);
  const calendarEndDate = addDays(lastDate, 6 - lastDay);
  const dates = eachDayOfInterval({
    start: calendarStartDate,
    end: calendarEndDate,
  });
  return dates;
}

type CalendarDateProps = {
  key: string;
  date: Date;
  currentMonth: number;
  minDate?: Date;
  onClickDate: (selectedDate: Date) => void;
}; // Compontent 선언부랑 타입이랑 붙여두는 게 읽기 편함
function CalendarDate({
  date,
  minDate,
  currentMonth,
  onClickDate,
}: CalendarDateProps) {
  const isDateInCurrentMonth = getMonth(date) === currentMonth;
  const isDateBeforeMinDate =
    minDate === undefined ? false : isBefore(date, startOfDay(minDate));
  return (
    <button
      className={$styles.button}
      disabled={!isDateInCurrentMonth || isDateBeforeMinDate}
      onClick={() => {
        onClickDate(date);
      }}
    >
      {getDate(date)}
    </button>
  );
}

type DatePickerProps = {
  minDate?: Date;
  value: Date;
  onSelectDate: (selectedDate: Date) => void;
};
function DatePicker({ value, minDate, onSelectDate }: DatePickerProps) {
  const [isOpend, setIsOpened] = useState(false);
  const [viewDate, setViewDate] = useState(value);

  /* 중요!!! 
  특정 상태로부터 유도될 수 있는 것들은 상태로 관리하면 안됨. 
  const [calendarDates, setCalendarDates] = useState(
    getDatesInCalendarMonth(viewDate)
  ); 
  */

  // 중요!!!
  // React Hook 모든 렌더링 사이클에서 동일해야한다.
  // React Hook은 반복문, 조건문안에 넣지말아라.
  // Clean Up function
  useEffect(() => {
    if (isOpend) {
      setViewDate(value);
    }
  }, [isOpend]); // Render시 sideeffect 발생을 관리, 예) API 콜, 변경에 반응해서 로직을 실행할 때

  function moveMonth(step: number) {
    const newViewDate = addMonths(viewDate, step);
    setViewDate(newViewDate);
  }

  return (
    <Popover.Root open={isOpend} onOpenChange={(value) => setIsOpened(value)}>
      <Popover.Trigger asChild>
        <button
          className={$styles.button}
          onClick={() => setIsOpened(!isOpend)}
        >
          {format(value, "yyyy-MM-dd")}
        </button>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content>
          <div className={$styles.datePicker}>
            <div className={$styles.header}>
              <button className={$styles.button} onClick={() => moveMonth(-1)}>
                {"<"}
              </button>
              <span>{format(viewDate, "yyyy-MM")}</span>
              <button className={$styles.button} onClick={() => moveMonth(1)}>
                {">"}
              </button>
            </div>
            <div className={$styles.content}>
              {getDatesInCalendarMonth(viewDate).map((item) => (
                <CalendarDate
                  key={format(item, "yyyy-MM-dd")}
                  date={item}
                  minDate={minDate}
                  currentMonth={getMonth(viewDate)}
                  onClickDate={(d) => {
                    setIsOpened(false);
                    onSelectDate(d);
                  }}
                />
              ))}
            </div>
          </div>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}

export default DatePicker;
