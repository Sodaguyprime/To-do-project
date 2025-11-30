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
                    <span style={{ transform: 'translateY(-2.5px) translateX(4px)'  }}>📝</span>Todo
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
                    <span style={{ transform: 'translateY(-3px) translateX(3px)'  }}>🍅</span> Pomodoro
                </button>
            </div>
        </header>
    )
}

export default Header;