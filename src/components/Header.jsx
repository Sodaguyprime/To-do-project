import { styles } from "../styles.js";

const Header = ({ todos, activeTab, setActiveTab }) => {
    return (
        <header style={styles.header}>
            <div style={styles.headerTop}>
                <div style={styles.titleSection}>
                    <img src="/Pomotodo.png" alt="Pomotodo Logo" style={{ width: '10%', height: '10%', objectFit: 'contain' }} />
                    <h1 style={styles.title}>POMOTODO</h1>
                </div>
            </div>

            <div style={styles.tabs}>
                <button
                    style={{
                        ...styles.tab,
                        ...(activeTab === 'todos' ? styles.tabActive : {})
                    }}
                    onClick={() => setActiveTab('todos')}
                >
                     <img 
        src="task.png" 
        alt="Todo icon"
        style={{ width: '18px', height: '21px',  imageRendering: 'pixelated' ,transform: 'translatex(5px) translateY(-1.5px)'  }}
    />
    <span>Todo</span>
                    {todos.filter(t => !t.done).length > 0 && (
                        <span style={styles.badge}>{todos.filter(t => !t.done).length}</span>
                    )}
                </button>

                <button
                    style={{
                        ...styles.tab,
                        ...(activeTab === 'pomodoro' ? styles.tabActive : {})
                    }}
                    onClick={() => setActiveTab('pomodoro')}
                >
                    <img 
        src="Pixelated-tomato.png" 
        alt="Todo icon"
        style={{ width: '18px', height: '18px',  transform: 'translatex(5px) translateY(-1.5px)'  }}
    />
    <span>pomodoro</span>
                </button>
            </div>
        </header>
    )
}

export default Header;