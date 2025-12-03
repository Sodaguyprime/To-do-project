import {styles} from "../styles.js";

const AddTodo = ({onSubmit, setText, text, selectedPriority = "low", setSelectedPriority}) => {
    const PRIORITIES = ['low', 'medium', 'high']
    
    const prioColor = {
        low: '#66ffc4',
        medium: '#ffd166',
        high: '#ff6b6b'
    }
    const nextPriority = () => {
        const i = PRIORITIES.indexOf(selectedPriority)
        setSelectedPriority(PRIORITIES[(i + 1) % PRIORITIES.length])
    }
    return (
        <>
            <form style={styles.toolbar} onSubmit={onSubmit}>
                <div style={styles.field}>
                    <input
                        style={styles.input}
                        value={text}
                        onChange={e => setText(e.target.value)}
                        placeholder="Type in your To-do"
                        inputMode="text"
                        autoComplete="on"
                    />
                    
                    {text.trim() && (
                        <button
                            type="button"
                            onClick={nextPriority}
                            style={{
                                ...styles.prioBtn,
                                background: prioColor[selectedPriority],
                                transform: 'translateY(0.5px) translateX(5px)',
                                width: '53px',
                                height: '53px',
                                fontSize: '17px',
                                marginLeft: '-12px',
                                postion: 'relative',
                               
                            }}
                            aria-label="Change priority"
                        >
                          <span style={{ transform: 'translate(1.5px, 0px)', display: 'inline-block' }}>
            {selectedPriority[0].toUpperCase()}
        </span>
                        </button>
                    )}
                    
                    <button type="submit" style={styles.btnPrimary} aria-label="Add todo">+</button>
                </div>
            </form>
        </>
    )
}
export default AddTodo