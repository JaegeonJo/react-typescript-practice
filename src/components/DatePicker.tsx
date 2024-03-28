import {
  addDays,
  eachDayOfInterval,
  format,
  getDate,
  getDay,
  getMonth,
  getYear,
  lastDayOfMonth,
  subDays,
} from "date-fns";
import { useState } from "react";

type CalendarDateProps = {
  date: Date;
  currentMonth: number;
  onClickDate: (selectedDate: Date) => void;
};

function getDatesInCalendarMonth(year: number, month: number) {
  const firstDate = new Date(year, month, 1);
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

function CalendarDate({ date, currentMonth, onClickDate }: CalendarDateProps) {
  const isDateInCurrentMonth = getMonth(date) === currentMonth;
  return (
    <button
      disabled={!isDateInCurrentMonth}
      onClick={() => {
        onClickDate(date);
      }}
    >
      {getDate(date)}
    </button>
  );
}

function DatePicker() {
  const today = new Date();
  const [isOpend, setIsOpened] = useState(false);
  const [selectedYear] = useState(getYear(today));
  const [selectedMonth] = useState(getMonth(today));
  const [selectedDate, setSelectedDate] = useState(today);

  const [calendarDates] = useState(
    getDatesInCalendarMonth(selectedYear, selectedMonth)
  );
  return (
    <div>
      <button onClick={() => setIsOpened(!isOpend)}>
        {format(selectedDate, "yyyy-MM-dd")}
      </button>
      {isOpend ? (
        <div>
          {calendarDates.map((item) => (
            <CalendarDate
              date={item}
              currentMonth={selectedMonth}
              onClickDate={(d) => setSelectedDate(d)}
            />
          ))}
        </div>
      ) : (
        <div></div>
      )}
    </div>
  );
}

export default DatePicker;
