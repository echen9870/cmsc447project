import { useEffect, useState, ChangeEvent } from "react";
import { format, addMonths, subMonths, startOfMonth, eachDayOfInterval, isSameMonth, isToday, getDay, isSameDay } from 'date-fns';
//import { utcToZonedTime, zonedTimeToUtc } from 'date-fns-tz';
import Axios from "axios";
import './Calendar.css';

interface Props {
  username: string;
}

interface Task {
  _id: string;
  name: string;
  description: string;
  assignedUsers: string[];
  completed: boolean;
  dueAt: string; // Use dueAt as the timestamp
}

const Calendar = ({ username }: Props) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [inputMonth, setInputMonth] = useState('');
  const [inputYear, setInputYear] = useState('');
  const [tasks, setTasks] = useState<Task[]>([]);
  // Add these state variables
  const [showModal, setShowModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);


  useEffect(() => {
    // Function to fetch all tasks
    const fetchAllTasks = async () => {
      const apiEndpoint = `http://localhost:3000/task/get_all_tasks/${username}`;

      try {
        const response = await Axios.get(apiEndpoint);

        if (response.data) {
          // Sort tasks by dueAt date in ascending order (sooner due dates first)
          const sortedTasks = response.data.sort(
            (a: Task, b: Task) =>
              new Date(a.dueAt).getTime() - new Date(b.dueAt).getTime()
          );

          setTasks(sortedTasks);
        }
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    };

    // Call the functions when the component mounts
    fetchAllTasks();
    
  }, [username]);

  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));

  const firstDayOfMonth = getDay(startOfMonth(currentDate));
  const daysOfWeek = [];

  // Add empty cells for days before the start of the month
  for (let i = 0; i < firstDayOfMonth; i++) {
    daysOfWeek.push(<div key={`empty-${i}`} className="empty-cell"></div>);
  }

  // Add days of the month
  const daysInMonth = eachDayOfInterval({
    start: startOfMonth(currentDate),
    end: addMonths(startOfMonth(currentDate), 1),
  });

  // Add days of the month
  daysInMonth.forEach((day) => {
    const tasksDueOnDay = tasks.filter((task) => isSameDay(new Date(task.dueAt), day));
    
    daysOfWeek.push(
      <div
        key={day.toString()}
        className={`day ${isToday(day) ? 'today' : ''} ${isSameMonth(day, currentDate) ? '' : 'outside'}`}
        onClick={() => handleDayClick(day)}
        style={{ backgroundColor: tasksDueOnDay.length > 0 ? 'black' : '' }}
      >
        {format(day, 'd')}
      </div>
    );
  });

  const handleMonthChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInputMonth(e.target.value);
  };

  const handleYearChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInputYear(e.target.value);
  };

  const handleSearch = () => {
    const parsedMonth = parseInt(inputMonth, 10);
    const parsedYear = parseInt(inputYear, 10);

    if (!isNaN(parsedMonth) && parsedMonth >= 1 && parsedMonth <= 12 && !isNaN(parsedYear) && parsedYear >= 2000 && parsedYear <= 2500) {
      setCurrentDate(new Date(parsedYear, parsedMonth - 1, 1));
    }  
    else {
      alert("Please choose a Year and Month between 2000 and 2500");
    }
  };

  const handleGoToToday = () => {
    setCurrentDate(new Date());
  };

  const handleDayClick = (day: Date) => {
    const tasksDueOnDay = tasks.filter((task) => isSameDay(new Date(task.dueAt), day));
  
    if (tasksDueOnDay.length > 0) {
      setSelectedTask(tasksDueOnDay);
      setShowModal(true);
    } else {
      setSelectedDate(day);
    }
  };
  
  

  return (
    <div className="calendar">
      <div className="header">
        <h2>{format(currentDate, 'MMMM yyyy')}</h2>
        <button onClick={prevMonth}>←</button>
        <button onClick={handleGoToToday}>Today</button>
        <button onClick={nextMonth}>→</button>
      </div>
      <div className="container">
        <div className="search">
          <input
            className="bg-black"
            style={{ width: '100px' }}
            type="number"
            placeholder="Month"
            value={inputMonth}
            onChange={handleMonthChange}
            min="1"
            max="12"
          />
          <input
            className="bg-black"
            style={{ width: '100px' }}
            type="number"
            placeholder="Year"
            value={inputYear}
            onChange={handleYearChange}
            min="2000"
            max="2500"
          />
          <button onClick={handleSearch}>Search</button>
        </div>
      </div>
      <div className="day-labels">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((label) => (
          <div key={label} className="day-label">
            {label}
          </div>
        ))}
      </div>
      <div className="days">
        {daysOfWeek}
      </div>
      <div className="selected-day">
        {selectedDate && (
          <p>
            Selected Day: {format(selectedDate, 'MMMM d, yyyy')}
          </p>
        )}
      </div>
      <div className={`task-modal ${showModal ? 'visible' : ''}`}>
      {selectedTask && (
        <div>
          {selectedTask.map((task) => (
            <div key={task._id} className="task-card">
              <h2 className="task-name">{task.name}</h2>
              <p className="task-description">{task.description}</p>
              <p className="task-assigned-users">
                Assigned Users: {task.assignedUsers.join(", ")}
              </p>
              <p className={`task-status ${task.completed ? "done" : "undone"}`}>
                {task.completed ? "Done" : "Undone"}
              </p>
            </div>
          ))}
          <button className="bg-gray-900" onClick={() => setShowModal(false)}>Close</button>
        </div>
      )}
    </div>
    </div>
  );
};

export default Calendar;
