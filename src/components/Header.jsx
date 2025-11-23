import { useState } from 'react';
import { styles } from "../styles.js";

const Header = ({ todos, activeTab, setActiveTab }) => {
    return (
        <header style={styles.header}>
            <h1 style={styles.title}>Pixel Productivity</h1>

            <div style={styles.tabs}>
                <button
                    style={{
                        ...styles.tab,
                        ...(activeTab === 'todos' ? styles.tabActive : {})
                    }}
                    onClick={() => setActiveTab('todos')}
                >
                    Todo List
                    <span style={styles.badge}>{todos.filter(t => !t.done).length}</span>
                </button>

                <button
                    style={{
                        ...styles.tab,
                        ...(activeTab === 'pomodoro' ? styles.tabActive : {})
                    }}
                    onClick={() => setActiveTab('pomodoro')}
                >
                    Pomodoro Timer
                </button>
            </div>
        </header>
    )
}

export default Header;