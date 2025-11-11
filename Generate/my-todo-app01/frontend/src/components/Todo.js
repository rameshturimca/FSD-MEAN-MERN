import React, { useEffect, useState } from 'react';
import './Todo.css';

function Todo() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');

  // Fetch from backend
  useEffect(() => {
    fetch('http://localhost:5000/api/todos')
      .then((res) => res.json())
      .then((data) => setTasks(data))
      .catch((err) => console.error('Error loading todos:', err));
  }, []);

  const handleAddTask = () => {
    if (newTask.trim()) {
      const newItem = { id: tasks.length + 1, task: newTask, completed: false };
      setTasks([...tasks, newItem]);
      setNewTask('');
    }
  };

  const toggleCompletion = (id) => {
    setTasks(
      tasks.map((t) =>
        t.id === id ? { ...t, completed: !t.completed } : t
      )
    );
  };

  return (
    <div className="todo">
      <h2>Todo List (from Backend)</h2>
      <input
        type="text"
        value={newTask}
        onChange={(e) => setNewTask(e.target.value)}
        placeholder="Add new task"
      />
      <button onClick={handleAddTask}>Add Task</button>

      <ul>
        {tasks.map((task) => (
          <li
            key={task.id}
            style={{
              textDecoration: task.completed ? 'line-through' : 'none',
              color: task.completed ? 'gray' : 'black',
            }}
          >
            {task.task}
            <div>
              <button onClick={() => toggleCompletion(task.id)}>
                {task.completed ? 'Undo' : 'Done'}
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Todo;
