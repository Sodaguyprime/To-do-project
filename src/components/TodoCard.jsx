import {useState} from "react";
import {styles} from "../styles.js";

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
export default TodoItem;