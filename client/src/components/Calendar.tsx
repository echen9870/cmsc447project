import React, { useState } from 'react';

const Calendar: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [inputValue, setInputValue] = useState<string>('');
  const [currentDate, setCurrentDate] = useState<Date>(new Date());

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  const handleInputSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const [inputMonth, inputYear] = inputValue.split('-');
    if (inputMonth && inputYear) {
      const newDate = new Date(Number(inputYear), Number(inputMonth) - 1, 1);
      if (!isNaN(newDate.getTime())) {
        setCurrentDate(newDate);
        setInputValue('');
      }
    }
  };

  const renderCalendar = (): JSX.Element => {
    const currentDay: number = currentDate.getDate();
    const currentMonth: number = currentDate.getMonth();
    const currentYear: number = currentDate.getFullYear();

    const daysInMonth: number = new Date(currentYear, currentMonth + 1, 0).getDate();
    const firstDayIndex: number = new Date(currentYear, currentMonth, 1).getDay();
    const blanks: JSX.Element[] = [];
    const days: JSX.Element[] = [];

    // Create blank cells for previous month's days
    for (let i = 0; i < firstDayIndex; i++) {
      blanks.push(<div key={`blank-${i}`} className="calendar-day empty text-white">{''}</div>);
    }

    // Create cells for days in the current month
    for (let i = 1; i <= daysInMonth; i++) {
      const isSelected: boolean = selectedDate ? selectedDate.getDate() === i : false;
      days.push(
        <div
          key={i}
          className={`calendar-day cursor-pointer text-center ${isSelected ? 'bg-blue-500' : 'text-white'}`}
          onClick={() => handleDateClick(i)}
        >
          {i}
        </div>
      );
    }

    const totalSlots: JSX.Element[] = [...blanks, ...days];
    const rows: JSX.Element[] = [];
    let cells: JSX.Element[] = [];

    // Add day names as the first row
    const daysOfWeek: string[] = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    rows.push(
      <div key="days" className="calendar-row grid grid-cols-7">
        {daysOfWeek.map((day, index) => (
          <div key={index} className="calendar-day text-white text-center">{day}</div>
        ))}
      </div>
    );

    // Group the cells into rows
    totalSlots.forEach((day, index) => {
      if (index % 7 !== 0) {
        cells.push(day);
      } else {
        rows.push(<div key={index} className="calendar-row grid grid-cols-7">{cells}</div>);
        cells = [];
        cells.push(day);
      }
      if (index === totalSlots.length - 1) {
        rows.push(<div key={index + 1} className="calendar-row grid grid-cols-7">{cells}</div>);
      }
    });

    return <div className="calendar-grid border border-white">{rows}</div>;
  };

  const handleDateClick = (day: number) => {
    const currentMonth: number = currentDate.getMonth();
    const currentYear: number = currentDate.getFullYear();
    setSelectedDate(new Date(currentYear, currentMonth, day));
  };

  const prevMonth = () => {
    const prevDate = new Date(currentDate);
    prevDate.setMonth(currentDate.getMonth() - 1);
    setCurrentDate(prevDate);
  };

  const nextMonth = () => {
    const nextDate = new Date(currentDate);
    nextDate.setMonth(currentDate.getMonth() + 1);
    setCurrentDate(nextDate);
  };

  const getCurrentMonthAndYear = (): string => {
    return currentDate.toLocaleString('default', { month: 'long', year: 'numeric' });
  };
  
  return (
    <div className="px-8 text-white text-center">
      <h2 className="text-2xl font-bold mb-4 ">Calendar</h2>
      <div className="calendar">
        <div className="calendar-header mb-4 flex justify-between items-center">
          <button className="text-lg font-semibold" onClick={prevMonth}>
            {'<'}
          </button>
          <form onSubmit={handleInputSubmit} className="flex">
            <input
              type="text"
              value={inputValue}
              onChange={handleInputChange}
              placeholder="MM-YYYY"
              className="border border-white p-1 text-black"
            />
            <button type="submit" className="ml-2 p-1 bg-blue-500 text-white font-semibold">
              Go
            </button>
          </form>
          <button className="text-lg font-semibold" onClick={nextMonth}>
            {'>'}
          </button>
        </div>
        <h3 className="text-lg mb-2">{getCurrentMonthAndYear()}</h3>
        <div className="calendar-body">{renderCalendar()}</div>
      </div>
    </div>
  );
};

export default Calendar;
