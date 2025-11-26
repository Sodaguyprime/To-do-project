import { useState, useEffect } from 'react'

const styles = {
    statsContainer: {
        background: '#2b3242',
        border: '4px solid #0b0d12',
        borderRadius: '8px',
        padding: '20px',
        marginTop: '24px',
    },
    statsTitle: {
        fontFamily: '"Press Start 2P", monospace',
        fontSize: '14px',
        color: '#66ffc4',
        textAlign: 'center',
        marginBottom: '20px',
        textTransform: 'uppercase',
    },
    weekGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(7, 1fr)',
        gap: '8px',
        marginBottom: '16px',
    },
    dayCard: {
        background: '#222734',
        border: '3px solid #0b0d12',
        borderRadius: '6px',
        padding: '12px 8px',
        textAlign: 'center',
    },
    dayLabel: {
        fontFamily: '"VT323", monospace',
        fontSize: '14px',
        color: '#9aa1ac',
        marginBottom: '8px',
    },
    dayValue: {
        fontFamily: '"Press Start 2P", monospace',
        fontSize: '16px',
        color: '#66ffc4',
    },
    totalCard: {
        background: '#222734',
        border: '4px solid #66ffc4',
        borderRadius: '8px',
        padding: '16px',
        textAlign: 'center',
        marginTop: '12px',
    },
    totalLabel: {
        fontFamily: '"VT323", monospace',
        fontSize: '18px',
        color: '#9aa1ac',
        marginBottom: '8px',
    },
    totalValue: {
        fontFamily: '"Press Start 2P", monospace',
        fontSize: '32px',
        color: '#66ffc4',
        textShadow: '0 0 10px rgba(102, 255, 196, 0.5)',
    },
}

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

function WeeklyStats({ completedSessions }) {
    const [weeklyData, setWeeklyData] = useState(() => {
        const stored = localStorage.getItem('weeklyStudyData')
        if (stored) {
            const data = JSON.parse(stored)
            // Check if we need to reset (new week)
            const lastUpdate = new Date(data.lastUpdate)
            const now = new Date()
            const daysSinceUpdate = Math.floor((now - lastUpdate) / (1000 * 60 * 60 * 24))
            
            if (daysSinceUpdate >= 7 || now.getDay() < lastUpdate.getDay()) {
                // New week, reset
                return {
                    days: [0, 0, 0, 0, 0, 0, 0],
                    lastUpdate: now.toISOString()
                }
            }
            return data
        }
        return {
            days: [0, 0, 0, 0, 0, 0, 0],
            lastUpdate: new Date().toISOString()
        }
    })

    useEffect(() => {
        // Update today's count when a session is completed
        if (completedSessions > 0) {
            const today = new Date().getDay()
            const todayIndex = today === 0 ? 6 : today - 1 // Convert Sunday (0) to index 6, Monday (1) to 0, etc.
            
            setWeeklyData(prev => {
                const newDays = [...prev.days]
                newDays[todayIndex] = completedSessions
                const updated = {
                    days: newDays,
                    lastUpdate: new Date().toISOString()
                }
                localStorage.setItem('weeklyStudyData', JSON.stringify(updated))
                return updated
            })
        }
    }, [completedSessions])

    const totalMinutes = weeklyData.days.reduce((sum, minutes) => sum + minutes, 0)
    const hours = Math.floor(totalMinutes / 60)
    const minutes = totalMinutes % 60

    return (
        <div style={styles.statsContainer}>
            <div style={styles.statsTitle}>📊 This Week</div>
            
            <div style={styles.weekGrid}>
                {DAYS.map((day, index) => (
                    <div key={day} style={styles.dayCard}>
                        <div style={styles.dayLabel}>{day}</div>
                        <div style={styles.dayValue}>{weeklyData.days[index]}</div>
                    </div>
                ))}
            </div>

            <div style={styles.totalCard}>
                <div style={styles.totalLabel}>Total Study Time</div>
                <div style={styles.totalValue}>
                    {hours > 0 ? `${hours}h ` : ''}{minutes}m
                </div>
            </div>
        </div>
    )
}

export default WeeklyStats