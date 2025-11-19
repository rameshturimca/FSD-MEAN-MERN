import { useEffect, useState } from "react";
import { useAuth } from "../auth/AuthProvider";

export default function TodoPage() {
  const { user, logout } = useAuth();
  const [task, setTask] = useState("");
  const [todos, setTodos] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");

  // Load from localStorage
  useEffect(() => {
    const raw = localStorage.getItem("todo_app_items");
    if (raw) setTodos(JSON.parse(raw));
  }, []);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem("todo_app_items", JSON.stringify(todos));
  }, [todos]);

  // ✅ Add task
  const addTodo = () => {
    if (!task.trim()) return;
    setTodos([...todos, { id: Date.now(), text: task.trim(), done: false }]);
    setTask("");
  };

  // ✅ Toggle complete
  const toggle = (id) => {
    setTodos((prev) =>
      prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t))
    );
  };

  // ✅ Delete
  const remove = (id) => {
    setTodos((prev) => prev.filter((t) => t.id !== id));
  };

  // ✅ Start edit
  const startEdit = (id, text) => {
    setEditingId(id);
    setEditText(text);
  };

  // ✅ Save edit
  const saveEdit = (id) => {
    if (!editText.trim()) return;
    setTodos((prev) =>
      prev.map((t) => (t.id === id ? { ...t, text: editText.trim() } : t))
    );
    setEditingId(null);
    setEditText("");
  };

  return (
    <div style={styles.wrapper}>
      <header style={styles.header}>
        <h1>📝 {user?.name || "User"}'s Todo</h1>
        <button style={styles.logoutBtn} onClick={logout}>
          Logout
        </button>
      </header>

      <main style={styles.container}>
        <div style={styles.card}>
          {/* Add section */}
          <div style={styles.addSection}>
            <input
              value={task}
              onChange={(e) => setTask(e.target.value)}
              placeholder="Enter new task..."
              style={styles.input}
              onKeyDown={(e) => e.key === "Enter" && addTodo()}
            />
            <button style={styles.addBtn} onClick={addTodo}>
              Add
            </button>
          </div>

          {/* Todo list */}
          <ul style={styles.list}>
            {todos.length === 0 && (
              <li style={styles.empty}>No tasks yet. Add one! 🚀</li>
            )}
            {todos.map((t) => (
              <li
                key={t.id}
                style={{
                  ...styles.todoItem,
                  backgroundColor: t.done ? "#dcfce7" : "#f9fafb",
                  transition: "all 0.2s ease",
                }}
              >
                {editingId === t.id ? (
                  <>
                    <input
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                      style={styles.editInput}
                    />
                    <button
                      onClick={() => saveEdit(t.id)}
                      style={{ ...styles.actionBtn, background: "#3b82f6" }}
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditingId(null)}
                      style={{ ...styles.actionBtn, background: "#9ca3af" }}
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <span
                      onClick={() => toggle(t.id)}
                      style={{
                        ...styles.todoText,
                        textDecoration: t.done ? "line-through" : "none",
                        color: t.done ? "#6b7280" : "#111827",
                      }}
                    >
                      {t.text}
                    </span>
                    <div style={styles.actions}>
                      <button
                        onClick={() => startEdit(t.id, t.text)}
                        style={{ ...styles.actionBtn, background: "#facc15" }}
                      >
                        ✏️
                      </button>
                      <button
                        onClick={() => remove(t.id)}
                        style={{ ...styles.actionBtn, background: "#ef4444" }}
                      >
                        ❌
                      </button>
                    </div>
                  </>
                )}
              </li>
            ))}
          </ul>
        </div>
      </main>
    </div>
  );
}

const styles = {
  wrapper: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #93c5fd, #d8b4fe)",
    fontFamily: "Inter, system-ui, sans-serif",
    paddingBottom: "40px",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "18px 24px",
    background: "white",
    boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
  },
  logoutBtn: {
    background: "#ef4444",
    color: "white",
    border: "none",
    padding: "8px 14px",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: 600,
    transition: "0.2s",
  },
  container: {
    display: "flex",
    justifyContent: "center",
    marginTop: "40px",
  },
  card: {
    width: "600px",
    background: "white",
    padding: "24px",
    borderRadius: "12px",
    boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
  },
  addSection: {
    display: "flex",
    gap: "8px",
    marginBottom: "20px",
  },
  input: {
    flex: 1,
    padding: "10px 14px",
    borderRadius: "8px",
    border: "1px solid #d1d5db",
    fontSize: "15px",
  },
  addBtn: {
    padding: "10px 18px",
    background: "#10b981",
    color: "white",
    border: "none",
    borderRadius: "8px",
    fontWeight: 600,
    cursor: "pointer",
    transition: "0.2s",
  },
  list: { listStyle: "none", padding: 0, margin: 0 },
  todoItem: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "12px 16px",
    borderRadius: "10px",
    marginBottom: "10px",
    boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
  },
  todoText: {
    flex: 1,
    textAlign: "left",
    cursor: "pointer",
    fontSize: "16px",
  },
  actions: {
    display: "flex",
    gap: "8px",
  },
  actionBtn: {
    border: "none",
    color: "white",
    padding: "6px 10px",
    borderRadius: "6px",
    cursor: "pointer",
    transition: "all 0.2s ease",
  },
  editInput: {
    flex: 1,
    padding: "8px 10px",
    fontSize: "15px",
    border: "1px solid #d1d5db",
    borderRadius: "6px",
    marginRight: "10px",
  },
  empty: {
    textAlign: "center",
    padding: "20px 0",
    color: "#6b7280",
    fontStyle: "italic",
  },
};
