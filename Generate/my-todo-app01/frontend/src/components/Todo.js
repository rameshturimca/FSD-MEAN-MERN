import React, { useState, useEffect } from 'react';
import './Todo.css';

function Todo() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [loading, setLoading] = useState(true);

  // 🧩 Fetch tasks using Promises
  useEffect(() => {
    const fetchTasks = new Promise((resolve, reject) => {
      fetch('http://localhost:5000/api/todos')
        .then((response) => {
          if (!response.ok) {
            reject('Failed to fetch tasks');
          }
          return response.json();
        })
        .then((data) => resolve(data))
        .catch((error) => reject(error));
    });

    fetchTasks
      .then((data) => {
        setTasks(data.slice(0, 5)); // limit to 5 tasks for demo
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error loading tasks:', error);
        setLoading(false);
      });
  }, []);

  // 🧩 Add new task
  const handleAddTask = () => {
    if (newTask.trim()) {
      setTasks([...tasks, { id: Date.now(), title: newTask, completed: false }]);
      setNewTask('');
    }
  };

  // 🧩 Toggle task completion
  const toggleTaskCompletion = (id) => {
    const updatedTasks = tasks.map((task) =>
      task.id === id ? { ...task, completed: !task.completed } : task
    );
    setTasks(updatedTasks);
  };

  // 🧩 Delete task
  const handleDeleteTask = (id) => {
    const updatedTasks = tasks.filter((task) => task.id !== id);
    setTasks(updatedTasks);
  };

  if (loading) {
    return <div className="todo"><h3>Loading tasks...</h3></div>;
  }

  return (
    <div className="todo">
      <h2>Todo List (Using Promises)</h2>

      <div className="todo-input">
        <input
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="Add a new task"
        />
        <button onClick={handleAddTask}>Add Task</button>
      </div>

      <ul>
        {tasks.map((task) => (
          <li key={task.id} className={task.completed ? 'completed' : ''}>
            <span onClick={() => toggleTaskCompletion(task.id)}>{task.title}</span>
            <div>
              <button className="edit-btn">Edit</button>
              <button className="delete-btn" onClick={() => handleDeleteTask(task.id)}>
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Todo;
