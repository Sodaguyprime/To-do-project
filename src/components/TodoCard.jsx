import {useState, memo} from "react";
import {styles} from "../styles.js";

function TodoItem({ todo, onToggle, onDelete, onRename, onChangePriority}) {
    const [isEditing, setIsEditing] = useState(false)
    const [draft, setDraft] = useState(todo.text)
    const [showActions, setShowActions] = useState(false)

    const [touchStart, setTouchStart] = useState(0)
    const [touchEnd, setTouchEnd] = useState(0)
    const [swiping, setSwiping] = useState(false)
    const [swipeDistance, setSwipeDistance] = useState(0)


    function handleTouchStart(e) {
        if (!todo.done) return // Only allow swipe on completed tasks
        setTouchStart(e.targetTouches[0].clientX)
        setTouchEnd(e.targetTouches[0].clientX) // Initialize touchEnd
        setSwiping(false) // Not swiping yet
        setSwipeDistance(0)
    }

    function handleTouchMove(e) {
        if (!todo.done) return
        const currentTouch = e.targetTouches[0].clientX
        const distance = touchStart - currentTouch
        
        // Only consider it a swipe if moved more than 10px
        if (Math.abs(distance) > 10) {
            setSwiping(true)
        }
        
        if (distance > 0) { // Only allow left swipe
            setSwipeDistance(distance)
            setTouchEnd(currentTouch)
        }
    }

    function handleTouchEnd() {
        if (!todo.done) return
        const swipeThreshold = 100 // Minimum swipe distance to trigger delete
        const actualSwipeDistance = touchStart - touchEnd
        
        // Only delete if it was actually a swipe (not just a tap)
        if (swiping && actualSwipeDistance > swipeThreshold) {
            onDelete() // Delete the task
        }
        
        // Reset swipe state
        setSwiping(false)
        setSwipeDistance(0)
        setTouchStart(0)
        setTouchEnd(0)
    }

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
      <div 
        style={{
            ...styles.item, 
            borderLeftColor: prioColor,
            transform: swiping ? `translateX(-${Math.min(swipeDistance, 150)}px)` : 'translateX(0)',
            transition: swiping ? 'none' : 'transform 0.3s ease',
            opacity: swiping ? Math.max(1 - (swipeDistance / 150), 0.3) : 1,
            position: 'relative'
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
    >
        {todo.done && swiping && swipeDistance > 50 && (
            <div style={{
                position: 'absolute',
                right: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#ff6b6b',
                fontSize: '24px',
                fontWeight: 'bold',
                pointerEvents: 'none',
                opacity: Math.min(swipeDistance / 100, 1)
            }}>
                🗑️
            </div>
        )}
            <div style={styles.itemMain}>
                <div style={{ position: 'relative', width: '28px', height: '28px', flexShrink: 0 }}>
                    <input
                        type="checkbox"
                        style={styles.checkbox}
                        checked={todo.done}
                        onChange={onToggle}
                        aria-label={todo.done ? 'Mark as not done' : 'Mark as done'}
                    />
                    {todo.done && (
                        <div style={{
                            position: 'absolute',
                            top: '65%',
                            left: '67%',
                            transform: 'translate(-50%, -50%)',
                            color: '#66ffc4',
                            fontSize: '25px',
                            fontWeight: 'bold',
                            pointerEvents: 'none',
                            lineHeight: 1
                        }}>
                            ✓
                        </div>
                    )}
                </div>
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
export default memo(TodoItem);