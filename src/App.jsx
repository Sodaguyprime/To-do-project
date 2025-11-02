import { useEffect, useMemo, useState } from 'react'

const STORAGE_KEY = 'pixel_todos_v1'
const PRIORITIES = ['low', 'medium', 'high']
const nextPriority = (p) => {
    const i = PRIORITIES.indexOf(p)
    return PRIORITIES[(i + 1) % PRIORITIES.length]
}

function usePersistentStorage() {
    const [todos, setTodos] = useState(() => {
        try {
            const raw = window.storage ? null : localStorage.getItem(STORAGE_KEY)
            const parsed = raw ? JSON.parse(raw) : []
            return Array.isArray(parsed)
                ? parsed.map(t => ({ ...t, priority: t.priority || 'low' }))
                : []
        } catch {
            return []
        }
    })

    useEffect(() => {
        if (!window.storage) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(todos))
        }
    }, [todos])

    return [todos, setTodos]
}

function App() {
    const [todos, setTodos] = usePersistentStorage()
    const [text, setText] = useState('')
    const [filter, setFilter] = useState('all')

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
        <div style={styles.appShell}>
            <header style={styles.header}>
                <h1 style={styles.title}>Pixel Todos</h1>
                <div style={styles.countChip}>{todos.filter(t => !t.done).length} left</div>
            </header>

            <section style={styles.panel}>
                <form style={styles.toolbar} onSubmit={onSubmit}>
                    <div style={styles.field}>
                        <input
                            style={styles.input}
                            value={text}
                            onChange={e => setText(e.target.value)}
                            placeholder="Type a todo..."
                            inputMode="text"
                            autoComplete="off"
                        />
                        <button type="submit" style={styles.btnPrimary} aria-label="Add todo">+</button>
                    </div>
                </form>

                <div style={styles.list}>
                    {visibleTodos.length === 0 ? (
                        <div style={styles.empty}>No todos here yet.</div>
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

            <footer style={styles.footer}>
                <div style={styles.filter}>
                    <button style={{...styles.btnSecondary, ...(filter==='all' ? styles.btnActive : {})}} onClick={() => setFilter('all')}>All</button>
                    <button style={{...styles.btnSecondary, ...(filter==='active' ? styles.btnActive : {})}} onClick={() => setFilter('active')}>Active</button>
                    <button style={{...styles.btnSecondary, ...(filter==='done' ? styles.btnActive : {})}} onClick={() => setFilter('done')}>Done</button>
                </div>
                <button style={styles.btnDanger} onClick={clearDone}>Clear</button>
            </footer>
        </div>
    )
}

function TodoItem({ todo, onToggle, onDelete, onRename, onChangePriority }) {
    const [isEditing, setIsEditing] = useState(false)
    const [draft, setDraft] = useState(todo.text)
    const [showActions, setShowActions] = useState(false)

    function submitEdit() {
        const v = draft.trim()
        if (v && v !== todo.text) onRename(v)
        setIsEditing(false)
    }

    const prioLabel = (todo.priority || 'low')[0].toUpperCase()
    const prioColor = {
        low: '#66ffc4',
        medium: '#ffd166',
        high: '#ff6b6b'
    }[todo.priority || 'low']

    return (
        <div style={{...styles.item, borderLeftColor: prioColor}}>
            <div style={styles.itemMain}>
                <input
                    type="checkbox"
                    style={styles.checkbox}
                    checked={todo.done}
                    onChange={onToggle}
                    aria-label={todo.done ? 'Mark as not done' : 'Mark as done'}
                />
                {isEditing ? (
                    <input
                        style={styles.editInput}
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
                    <div
                        style={{...styles.todoText, ...(todo.done ? styles.todoTextDone : {})}}
                        onClick={() => setShowActions(!showActions)}
                    >
                        {todo.text}
                    </div>
                )}
                <button
                    style={{...styles.prioBtn, background: prioColor}}
                    onClick={onChangePriority}
                    aria-label="Change priority"
                >
                    {prioLabel}
                </button>
            </div>

            {showActions && !isEditing && (
                <div style={styles.actions}>
                    <button style={styles.btnSecondary} onClick={() => { setIsEditing(true); setShowActions(false); }}>Edit</button>
                    <button style={styles.btnDanger} onClick={onDelete}>Delete</button>
                </div>
            )}
        </div>
    )
}

const styles = {
    appShell: {
        width: '100%',
        maxWidth: '520px',
        minHeight: '100dvh',
        display: 'grid',
        gridTemplateRows: 'auto 1fr auto',
        gap: '12px',
        padding: '12px',
        background: 'repeating-linear-gradient(0deg, #1b1f28, #1b1f28 4px, #171a22 4px, #171a22 8px)',
        fontFamily: '"VT323", monospace',
        color: '#e5e5e5',
    },
    panel: {
        background: '#222734',
        border: '4px solid #2b3242',
        boxShadow: '0 0 0 4px #0b0d12 inset, 0 6px 0 0 #0b0d12',
        borderRadius: '8px',
    },
    header: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '14px 16px',
        background: '#222734',
        border: '4px solid #2b3242',
        boxShadow: '0 0 0 4px #0b0d12 inset, 0 6px 0 0 #0b0d12',
        borderRadius: '8px',
        flexWrap: 'wrap',
        gap: '8px',
    },
    title: {
        fontFamily: '"Press Start 2P", monospace',
        fontSize: 'clamp(14px, 4vw, 18px)',
        margin: 0,
        textTransform: 'uppercase',
    },
    countChip: {
        background: '#2b3242',
        border: '4px solid #0b0d12',
        borderRadius: '8px',
        padding: '8px 12px',
        fontFamily: '"Press Start 2P", monospace',
        fontSize: 'clamp(10px, 2.5vw, 12px)',
    },
    toolbar: {
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        padding: '12px',
    },
    field: {
        display: 'flex',
        gap: '8px',
        width: '100%',
    },
    input: {
        flex: 1,
        background: '#2b3242',
        color: '#e5e5e5',
        border: '4px solid #0b0d12',
        borderRadius: '8px',
        padding: '14px 12px',
        fontFamily: '"VT323", monospace',
        fontSize: '20px',
        outline: 'none',
        minWidth: 0,
    },
    editInput: {
        flex: 1,
        background: '#2b3242',
        color: '#e5e5e5',
        border: '2px solid #66ffc4',
        borderRadius: '6px',
        padding: '8px',
        fontFamily: '"VT323", monospace',
        fontSize: '20px',
        outline: 'none',
    },
    btnPrimary: {
        background: '#66ffc4',
        color: '#121418',
        border: '4px solid #0b0d12',
        borderRadius: '8px',
        padding: '14px 18px',
        fontFamily: '"Press Start 2P", monospace',
        fontSize: '16px',
        cursor: 'pointer',
        fontWeight: 'bold',
        flexShrink: 0,
    },
    btnSecondary: {
        background: '#ffd166',
        color: '#121418',
        border: '4px solid #0b0d12',
        borderRadius: '8px',
        padding: '10px 14px',
        fontFamily: '"Press Start 2P", monospace',
        fontSize: '10px',
        cursor: 'pointer',
        textTransform: 'uppercase',
    },
    btnDanger: {
        background: '#ff6b6b',
        color: '#fff',
        border: '4px solid #0b0d12',
        borderRadius: '8px',
        padding: '10px 14px',
        fontFamily: '"Press Start 2P", monospace',
        fontSize: '10px',
        cursor: 'pointer',
        textTransform: 'uppercase',
    },
    btnActive: {
        boxShadow: '0 3px 0 0 #0b0d12 inset',
        transform: 'translateY(2px)',
    },
    list: {
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        padding: '12px',
        maxHeight: '60vh',
        overflowY: 'auto',
    },
    item: {
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
        background: '#2b3242',
        border: '4px solid #0b0d12',
        borderRadius: '8px',
        padding: '12px',
        borderLeft: '8px solid',
    },
    itemMain: {
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
    },
    checkbox: {
        width: '28px',
        height: '28px',
        flexShrink: 0,
        appearance: 'none',
        background: '#0f1116',
        border: '4px solid #0b0d12',
        borderRadius: '6px',
        position: 'relative',
        cursor: 'pointer',
    },
    todoText: {
        flex: 1,
        fontFamily: '"VT323", monospace',
        fontSize: '22px',
        wordBreak: 'break-word',
        cursor: 'pointer',
        minWidth: 0,
    },
    todoTextDone: {
        textDecoration: 'line-through',
        color: '#9aa1ac',
    },
    prioBtn: {
        width: '36px',
        height: '36px',
        flexShrink: 0,
        border: '4px solid #0b0d12',
        borderRadius: '8px',
        fontFamily: '"Press Start 2P", monospace',
        fontSize: '12px',
        cursor: 'pointer',
        color: '#121418',
        fontWeight: 'bold',
    },
    actions: {
        display: 'flex',
        gap: '8px',
        paddingTop: '4px',
    },
    footer: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '8px',
        padding: '12px',
        background: '#222734',
        border: '4px solid #2b3242',
        boxShadow: '0 0 0 4px #0b0d12 inset, 0 6px 0 0 #0b0d12',
        borderRadius: '8px',
        flexWrap: 'wrap',
    },
    filter: {
        display: 'flex',
        gap: '6px',
        flexWrap: 'wrap',
    },
    empty: {
        textAlign: 'center',
        padding: '24px 12px',
        color: '#9aa1ac',
        fontFamily: '"VT323", monospace',
        fontSize: '20px',
    },
}

export default App