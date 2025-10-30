import { useEffect, useMemo, useState } from 'react'
import './App.css'

const STORAGE_KEY = 'pixel_todos_v1'
const PRIORITIES = ['low', 'medium', 'high']
const nextPriority = (p) => {
  const i = PRIORITIES.indexOf(p)
  return PRIORITIES[(i + 1) % PRIORITIES.length]
}

function usePersistentTodos() {
  const [todos, setTodos] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      const parsed = raw ? JSON.parse(raw) : []
      // Migration: ensure priority exists; default to 'low' for old data
      return Array.isArray(parsed)
        ? parsed.map(t => ({ ...t, priority: t.priority || 'low' }))
        : []
    } catch {
      return []
    }
  })

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos))
  }, [todos])

  return [todos, setTodos]
}

function App() {
  const [todos, setTodos] = usePersistentTodos()
  const [text, setText] = useState('')
  const [filter, setFilter] = useState('all') // all | active | done

  const visibleTodos = useMemo(() => {
    if (filter === 'active') return todos.filter(t => !t.done)
    if (filter === 'done') return todos.filter(t => t.done)
    return todos
  }, [todos, filter])

  function addTodo() {
    const value = text.trim()
    if (!value) return
    const todo = { id: crypto.randomUUID(), text: value, done: false, priority: 'low', createdAt: Date.now() }
    setTodos([todo, ...todos])
    setText('')
  }

  function toggleTodo(id) {
    setTodos(todos.map(t => t.id === id ? { ...t, done: !t.done } : t))
  }

  function deleteTodo(id) {
    setTodos(todos.filter(t => t.id !== id))
  }

  function clearDone() {
    setTodos(todos.filter(t => !t.done))
  }

  function renameTodo(id, newText) {
    setTodos(todos.map(t => t.id === id ? { ...t, text: newText } : t))
  }

  function changePriority(id) {
    setTodos(todos.map(t => t.id === id ? { ...t, priority: nextPriority(t.priority || 'low') } : t))
  }

  function onSubmit(e) {
    e.preventDefault()
    addTodo()
  }

  return (
    <div className="app-shell crt">
      <header className="panel app-header">
        <h1 className="app-title heading">Pixel Todos</h1>
        <div className="count-chip">{todos.filter(t => !t.done).length} left</div>
      </header>

      <section className="panel">
        <form className="toolbar" onSubmit={onSubmit}>
          <div className="field">
            <input
              className="input"
              value={text}
              onChange={e => setText(e.target.value)}
              placeholder="Type a todo and press +"
              inputMode="text"
              autoFocus
            />
            <button type="submit" className="btn" aria-label="Add todo">+ Add</button>
          </div>
        </form>

        <div className="list">
          {visibleTodos.length === 0 ? (
            <div className="empty">No todos here yet.</div>
          ) : (
            visibleTodos.map(todo => (
              <TodoItem
                key={todo.id}
                todo={todo}
                onToggle={() => toggleTodo(todo.id)}
                onDelete={() => deleteTodo(todo.id)}
                onRename={(v) => renameTodo(todo.id, v)}
                onChangePriority={() => changePriority(todo.id)}
              />
            ))
          )}
        </div>
      </section>

      <footer className="panel footer">
        <div className="filter">
          <button className="btn secondary" onClick={() => setFilter('all')} aria-pressed={filter==='all'}>All</button>
          <button className="btn secondary" onClick={() => setFilter('active')} aria-pressed={filter==='active'}>Active</button>
          <button className="btn secondary" onClick={() => setFilter('done')} aria-pressed={filter==='done'}>Done</button>
        </div>
        <button className="btn danger" onClick={clearDone}>Clear Done</button>
      </footer>
    </div>
  )
}

function TodoItem({ todo, onToggle, onDelete, onRename, onChangePriority }) {
  const [isEditing, setIsEditing] = useState(false)
  const [draft, setDraft] = useState(todo.text)

  function submitEdit() {
    const v = draft.trim()
    if (v && v !== todo.text) onRename(v)
    setIsEditing(false)
  }

  const prioLabel = (todo.priority || 'low').toUpperCase()

  return (
    <div className={`item p-${todo.priority || 'low'}`}>
      <input
        type="checkbox"
        className="checkbox"
        checked={todo.done}
        onChange={onToggle}
        aria-label={todo.done ? 'Mark as not done' : 'Mark as done'}
      />
      {isEditing ? (
        <input
          className="input"
          value={draft}
          onChange={e => setDraft(e.target.value)}
          onBlur={submitEdit}
          onKeyDown={e => {
            if (e.key === 'Enter') submitEdit()
            if (e.key === 'Escape') { setIsEditing(false); setDraft(todo.text) }
          }}
          autoFocus
        />
      ) : (
        <div className={`title ${todo.done ? 'done' : ''}`} onDoubleClick={() => setIsEditing(true)}>
          {todo.text}
        </div>
      )}
      <div className="actions">
        <button className="btn secondary" onClick={onChangePriority} aria-label="Change priority">{prioLabel}</button>
        <button className="btn secondary" onClick={() => setIsEditing(v => !v)}>{isEditing ? 'Save' : 'Edit'}</button>
        <button className="btn danger" onClick={onDelete}>Del</button>
      </div>
    </div>
  )
}

export default App
