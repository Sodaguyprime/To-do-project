import { useState, useEffect, useRef } from 'react'
import WeeklyStats from './weekly-stats-component'

const styles = {
    panel: {
        background: '#222734',
        border: '4px solid #2b3242',
        boxShadow: '0 0 0 4px #0b0d12 inset, 0 6px 0 0 #0b0d12',
        borderRadius: '8px',
        padding: '24px',
    },
    timerDisplay: {
        fontFamily: '"Press Start 2P", monospace',
        fontSize: 'clamp(48px, 12vw, 72px)',
        textAlign: 'center',
        margin: '32px 0',
        color: '#66ffc4',
        textShadow: '0 0 20px rgba(102, 255, 196, 0.5)',
    },
    modeLabel: {
        fontFamily: '"Press Start 2P", monospace',
        fontSize: '14px',
        textAlign: 'center',
        color: '#e5e5e5',
        textTransform: 'uppercase',
        marginBottom: '16px',
    },
    controls: {
        display: 'flex',
        gap: '12px',
        justifyContent: 'center',
        flexWrap: 'wrap',
        marginTop: '24px',
    },
    btnPrimary: {
        background: '#66ffc4',
        color: '#121418',
        border: '4px solid #0b0d12',
        borderRadius: '8px',
        padding: '14px 18px',
        fontFamily: '"Press Start 2P", monospace',
        fontSize: '14px',
        cursor: 'pointer',
        fontWeight: 'bold',
    },
    btnSecondary: {
        background: '#ffd166',
        color: '#121418',
        border: '4px solid #0b0d12',
        borderRadius: '8px',
        padding: '14px 18px',
        fontFamily: '"Press Start 2P", monospace',
        fontSize: '14px',
        cursor: 'pointer',
    },
    btnDanger: {
        background: '#ff6b6b',
        color: '#fff',
        border: '4px solid #0b0d12',
        borderRadius: '8px',
        padding: '14px 18px',
        fontFamily: '"Press Start 2P", monospace',
        fontSize: '14px',
        cursor: 'pointer',
    },
    stats: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
        gap: '12px',
        marginTop: '24px',
    },
    statCard: {
        background: '#2b3242',
        border: '4px solid #0b0d12',
        borderRadius: '8px',
        padding: '16px',
        textAlign: 'center',
    },
    statLabel: {
        fontFamily: '"VT323", monospace',
        fontSize: '16px',
        color: '#9aa1ac',
        marginBottom: '8px',
    },
    statValue: {
        fontFamily: '"Press Start 2P", monospace',
        fontSize: '24px',
        color: '#66ffc4',
    },
    progressBar: {
        width: '100%',
        height: '12px',
        background: '#0b0d12',
        border: '4px solid #2b3242',
        borderRadius: '8px',
        overflow: 'hidden',
        marginTop: '16px',
    },
    progressFill: {
        height: '100%',
        background: 'linear-gradient(90deg, #66ffc4, #4de0a8)',
        transition: 'width 0.3s ease',
    },
    durationSelector: {
        display: 'flex',
        gap: '8px',
        justifyContent: 'center',
        flexWrap: 'wrap',
        marginBottom: '16px',
    },
    durationBtn: {
        background: '#2b3242',
        color: '#e5e5e5',
        border: '3px solid #0b0d12',
        borderRadius: '6px',
        padding: '10px 16px',
        fontFamily: '"Press Start 2P", monospace',
        fontSize: '12px',
        cursor: 'pointer',
    }
}

const SHORT_BREAK = 5 * 60
const LONG_BREAK = 15 * 60
const WORK_DURATIONS = [25, 35, 40, 50] // in minutes

function Pomodoro({ pomodoroState, setPomodoroState }) {
    
   const { workDuration, mode, timeLeft, isRunning, completedPomodoros, totalStudyMinutes } = pomodoroState
    const intervalRef = useRef(null)
   

    const totalTime = mode === 'work' ? workDuration * 60 : mode === 'short' ? SHORT_BREAK : LONG_BREAK
    const progress = ((totalTime - timeLeft) / totalTime) * 100

    useEffect(() => {
    if (isRunning && timeLeft > 0) {
        intervalRef.current = setInterval(() => {
            setPomodoroState(prev => {
                if (prev.timeLeft <= 1) {
                    handleTimerComplete(prev)
                    return { ...prev, timeLeft: 0, isRunning: false }
                }
                return { ...prev, timeLeft: prev.timeLeft - 1 }
            })
        }, 1000)
    } else {
        clearInterval(intervalRef.current)
    }

    return () => clearInterval(intervalRef.current)
}, [isRunning, timeLeft])

    function handleTimerComplete(state) {
    const newState = { ...state, isRunning: false }

    if (state.mode === 'work') {
        const newCount = state.completedPomodoros + 1
        newState.completedPomodoros = newCount
        newState.totalStudyMinutes = state.totalStudyMinutes + state.workDuration

        if (newCount % 4 === 0) {
            newState.mode = 'long'
            newState.timeLeft = LONG_BREAK
        } else {
            newState.mode = 'short'
            newState.timeLeft = SHORT_BREAK
        }
    } else {
        newState.mode = 'work'
        newState.timeLeft = state.workDuration * 60
    }

    setPomodoroState(newState)

    if (typeof Audio !== 'undefined') {
        try {
            const beep = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYHGGm98OScTgwOUKrj8LReGgjh')
            beep.play().catch(() => {})
        } catch (e) {}
    }
}

    function formatTime(seconds) {
        const mins = Math.floor(seconds / 60)
        const secs = seconds % 60
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
    }

    function toggleTimer() {
    setPomodoroState(prev => ({ ...prev, isRunning: !prev.isRunning }))
}

function resetTimer() {
    setPomodoroState(prev => ({ ...prev, isRunning: false, timeLeft: totalTime }))
}

function switchMode(newMode) {
    const newTime = newMode === 'work' ? workDuration * 60 : newMode === 'short' ? SHORT_BREAK : LONG_BREAK
    setPomodoroState(prev => ({ ...prev, isRunning: false, mode: newMode, timeLeft: newTime }))
}

function changeWorkDuration(minutes) {
    if (!isRunning) {
        setPomodoroState(prev => ({
            ...prev,
            workDuration: minutes,
            timeLeft: prev.mode === 'work' ? minutes * 60 : prev.timeLeft
        }))
    }
}

    const modeLabel = mode === 'work' ? '🎯 FOCUS TIME' : mode === 'short' ? '☕ SHORT BREAK' : '🌴 LONG BREAK'
    const modeColor = mode === 'work' ? '#66ffc4' : mode === 'short' ? '#ffd166' : '#ff6b6b'

    return (
        <div style={styles.panel}>
            <div style={{...styles.modeLabel, color: modeColor}}>
                {modeLabel}
            </div>

            {mode === 'work' && !isRunning && (
                <div style={styles.durationSelector}>
                    {WORK_DURATIONS.map(duration => (
                        <button
                            key={duration}
                            onClick={() => changeWorkDuration(duration)}
                            style={{
                                ...styles.durationBtn,
                                background: workDuration === duration ? '#66ffc4' : '#2b3242',
                                color: workDuration === duration ? '#121418' : '#e5e5e5',
                                border: workDuration === duration ? '3px solid #0b0d12' : '3px solid #0b0d12'
                            }}
                        >
                            {duration}m
                        </button>
                    ))}
                </div>
            )}

            <div style={{...styles.timerDisplay, color: modeColor}}>
                {formatTime(timeLeft)}
            </div>

            <div style={styles.progressBar}>
                <div style={{...styles.progressFill, width: `${progress}%`, background: `linear-gradient(90deg, ${modeColor}, ${modeColor}dd)`}} />
            </div>

            <div style={styles.controls}>
                <button
                    onClick={toggleTimer}
                    style={styles.btnPrimary}
                >
                    {isRunning ? 'PAUSE' : 'START'}
                </button>
                <button
                    onClick={resetTimer}
                    style={styles.btnSecondary}
                >
                    End Session
                </button>
            </div>

            <div style={styles.controls}>
                <button
                    onClick={() => switchMode('work')}
                    style={{...styles.btnSecondary, background: mode === 'work' ? '#66ffc4' : '#2b3242', color: mode === 'work' ? '#121418' : '#e5e5e5'}}
                >
                    WORK
                </button>
                <button
                    onClick={() => switchMode('short')}
                    style={{...styles.btnSecondary, background: mode === 'short' ? '#ffd166' : '#2b3242', color: mode === 'short' ? '#121418' : '#e5e5e5'}}
                >
                    BREAK
                </button>
                <button
                    onClick={() => switchMode('long')}
                    style={{...styles.btnSecondary, background: mode === 'long' ? '#ff6b6b' : '#2b3242', color: mode === 'long' ? '#fff' : '#e5e5e5'}}
                >
                    LONG
                </button>
            </div>

            <div style={styles.stats}>
                <div style={styles.statCard}>
                    <div style={styles.statLabel}>Completed</div>
                    <div style={styles.statValue}>{completedPomodoros}</div>
                </div>
                <div style={styles.statCard}>
                    <div style={styles.statLabel}>Session</div>
                    <div style={styles.statValue}>{Math.floor(completedPomodoros / 4) + 1}</div>
                </div>
            </div>

            <WeeklyStats completedSessions={totalStudyMinutes} />
        </div>
    )
}

export default Pomodoro