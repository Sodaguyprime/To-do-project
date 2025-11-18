import {styles} from '../styles'
import TodoItem from './TodoCard.jsx'
const ListTodos = ({visibleTodos, toggleTodo, deleteTodo,renameTodo,changePriority, TodoItem}) => {
    return (
        <>
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
        </>
    )
}
export default ListTodos;