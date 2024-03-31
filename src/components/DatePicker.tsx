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
  subDays,
} from "date-fns";
import { useState } from "react";
import styles from "./DataPicker.module.css";

type CalendarDateProps = {
  key: string;
  date: Date;
  currentMonth: number;
  minDate?: Date;
  onClickDate: (selectedDate: Date) => void;
};

type DatePickerProps = {
  minDate?: Date;
};

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

function CalendarDate({
  date,
  minDate,
  currentMonth,
  onClickDate,
}: CalendarDateProps) {
  const isDateInCurrentMonth = getMonth(date) === currentMonth;
  const isDateBeforeMinDate =
    minDate === undefined ? false : isBefore(date, minDate);
  return (
    <button
      disabled={!isDateInCurrentMonth || isDateBeforeMinDate}
      onClick={() => {
        onClickDate(date);
      }}
    >
      {getDate(date)}
    </button>
  );
}

function dropTime(date: Date) {
  return new Date(getYear(date), getMonth(date), getDate(date));
}

function DatePicker({ minDate }: DatePickerProps) {
  const _minDate = minDate === undefined ? undefined : dropTime(minDate);
  const todayOrMinDate =
    _minDate === undefined ? dropTime(new Date()) : _minDate;
  const [isOpend, setIsOpened] = useState(false);
  const [viewDate, setViewDate] = useState(todayOrMinDate);
  const [selectedDate, setSelectedDate] = useState(todayOrMinDate);

  const [calendarDates, setCalendarDates] = useState(
    getDatesInCalendarMonth(viewDate)
  );

  function moveMonth(step: number) {
    const newViewDate = addMonths(viewDate, step);
    const newMonthDates = getDatesInCalendarMonth(newViewDate);
    setCalendarDates(newMonthDates);
    setViewDate(newViewDate);
  }

  return (
    <div>
      <button onClick={() => setIsOpened(!isOpend)}>
        {format(selectedDate, "yyyy-MM-dd")}
      </button>
      {isOpend ? (
        <div className={styles.datePicker}>
          <div>
            <button onClick={() => moveMonth(-1)}>{"< 이전 달"}</button>
            <span>{format(viewDate, "yyyy-MM")}</span>
            <button onClick={() => moveMonth(1)}>{"다음 달 >"}</button>
          </div>
          <div className={styles.dateContainer}>
            {calendarDates.map((item) => (
              <CalendarDate
                key={format(item, "yyyy-MM-dd")}
                date={item}
                minDate={_minDate}
                currentMonth={getMonth(viewDate)}
                onClickDate={(d) => {
                  setSelectedDate(d);
                  setIsOpened(false);
                }}
              />
            ))}
          </div>
        </div>
      ) : (
        <div></div>
      )}
    </div>
  );
}

export default DatePicker;
