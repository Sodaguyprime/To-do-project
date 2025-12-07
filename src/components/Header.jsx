import { styles } from "../styles.js";
import { memo } from "react";

const Header = ({activeTab, setActiveTab, activeTodoCount }) => {
     const catStyle = {
        position: 'absolute',
        top: 0,
        left: '50%',
        transform: 'translate(-225px, 100%) scalex(-1)',
        width: '50px',
        height: 'auto',
        zIndex: 10,
        pointerEvents: 'none',
        imageRendering: 'pixelated'
    }
    return (
        <header style={{...styles.header, position: 'relative'}}>
            <img 
                src="/poppingcat.gif" 
                alt="Cat"
                style={catStyle}
            />
            <div style={styles.headerTop}>
                <div style={{...styles.titleSection, transform: 'translate(25%, 0%)'}}>
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

                    {activeTodoCount > 0 && (
    <span style={styles.badge}>{activeTodoCount}</span>

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