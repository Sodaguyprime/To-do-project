import {styles} from '../styles'
import TodoItem from './TodoCard.jsx'
const ListTodos = ({visibleTodos, toggleTodo, deleteTodo,renameTodo,changePriority, TodoItem}) => {
    const priorityOrder = { high: 1, medium: 2, low: 3 };

    return (
        <>
            <div style={styles.list}>
                {visibleTodos.length === 0 ? (
                    <div style={styles.empty}>No todos here yet.</div>
                ) : 
                
                (
                    [...visibleTodos].sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]).map(todo => (
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
        </>
    )
}
export default ListTodos;