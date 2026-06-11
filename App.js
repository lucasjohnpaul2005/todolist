import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [todos, setTodos] = useState(() => {
    const saved = localStorage.getItem('todos');
    return saved ? JSON.parse(saved) : [];
  });
  const [text, setText] = useState('');
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  const addTodo = () => {
    if (text.trim()) {
      setTodos([...todos, { id: Date.now(), text: text.trim(), done: false }]);
      setText('');
    }
  };

  const toggle = (id) => {
    setTodos(todos.map(t => t.id === id ? { ...t, done: !t.done } : t));
  };

  const edit = (id, oldText) => {
    const newText = prompt('Edit task:', oldText);
    if (newText?.trim()) {
      setTodos(todos.map(t => t.id === id ? { ...t, text: newText.trim() } : t));
    }
  };

  const del = (id) => {
    setTodos(todos.filter(t => t.id !== id));
  };

  const delAll = () => {
    if (todos.length && window.confirm('Delete all tasks?')) {
      setTodos([]);
    }
  };

  const filtered = todos.filter(t => {
    if (filter === 'done') return t.done;
    if (filter === 'active') return !t.done;
    return true;
  });

  return (
    <div className="container">
      <h1 className="title"> To do List</h1>
      
      <div className="input-section">
        <input
          value={text}
          onChange={e => setText(e.target.value)}
          onKeyPress={e => e.key === 'Enter' && addTodo()}
          placeholder="Unsa imong na human ron nga adlaw?"
          className="todo-input"
        />
        <button onClick={addTodo} className="add-btn">
          Add
        </button>
      </div>

      <div className="filter-section">
        <button 
          onClick={() => setFilter('all')} 
          className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
        >
          All ({todos.length})
        </button>
        <button 
          onClick={() => setFilter('activity')} 
          className={`filter-btn ${filter === 'activity' ? 'active' : ''}`}
        >
          Activity ({todos.filter(t => !t.done).length})
        </button>
        <button   
          onClick={() => setFilter('done')} 
          className={`filter-btn ${filter === 'done' ? 'active' : ''}`}
        >
          Done ({todos.filter(t => t.done).length})
        </button>
      </div>

      <div className="todo-list">
        {filtered.length === 0 ? (
          <p className="empty-message">No tasks. Add one above!</p>
        ) : (
          filtered.map(t => (
            <div key={t.id} className="todo-item">
              <input
                type="checkbox"
                checked={t.done}
                onChange={() => toggle(t.id)}
                className="todo-checkbox"
              />
              <span className={`todo-text ${t.done ? 'completed' : ''}`}>
                {t.text}
              </span>
              <div className="todo-buttons">
                <button onClick={() => edit(t.id, t.text)} className="edit-btn">
                  Edit
                </button>
                <button onClick={() => del(t.id)} className="delete-btn">
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {todos.length > 0 && (
        <div className="delete-all-section">
          <button onClick={delAll} className="delete-all-btn">
            Delete All
          </button>
        </div>
      )}
    </div>
  );
}

export default App;