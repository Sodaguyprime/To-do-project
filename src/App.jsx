import { useEffect, useMemo, useState } from 'react'
import {styles} from './styles'
import AddTodo from "./components/AddTodo.jsx";
import ListTodos from "./components/ListTodos.jsx";
import Footer from "./components/Footer.jsx";
import Header from "./components/Header.jsx";
import TodoItem from "./components/TodoCard.jsx";
import Pomodoro from "./components/Pomodoro.jsx"

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
    const [activeTab, setActiveTab] = useState('todos');

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
    
    const activeTodoCount = useMemo(() => 
    todos.filter(t => !t.done).length, 
    [todos]
)

    return (

        <div style={styles.appShell}>
            <Header
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                activeTodoCount={activeTodoCount}
            />
            {activeTab === 'todos' && (
                <>
                <section style={styles.panel}>
                    <AddTodo onSubmit={onSubmit} setText={setText} text={text}/>
                    <ListTodos visibleTodos={visibleTodos} toggleTodo={toggleTodo}
                               deleteTodo ={deleteTodo}
                               renameTodo={ renameTodo}
                               changePriority = {changePriority}
                               TodoItem={TodoItem}
                    />
                </section>
                <Footer filter={filter} setFilter={setFilter} clearDone={clearDone} />
        </>
            )}

            {activeTab === 'pomodoro' && (
               <Pomodoro />
            )}

        </div>
    )

}

export default App