const DeadlineDisplay = ({ deadline }) => {
    if (!deadline) return null;

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const deadlineDate = new Date(deadline);
    deadlineDate.setHours(0, 0, 0, 0);
    
    const diffTime = deadlineDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    const isOverdue = diffDays < 0;
    const isToday = diffDays === 0;

    let displayText = '';
    let color = '#66ffc4';
    let borderColor = '#0b0d12';

    if (isOverdue) {
        displayText = 'OVERDUE';
        color = '#ff6b6b';
    } else if (isToday) {
        displayText = 'TODAY';
        color = '#ffd166';
    } else if (diffDays === 1) {
        displayText = 'TOMORROW';
        color = '#ffd166';
    } else {
        displayText = `${diffDays}D`;
        if (diffDays <= 3) color = '#ffd166';
    }

    return (
        <div style={{
            position: 'absolute',
            top: '4px',
            right: '1px',
            fontSize: '8px',
            fontWeight: 'bold',
            padding: '10px 5px',
            borderRadius: '6px',
            background: color,
            color: '#121418',
            border: `2px solid ${borderColor}`,
            fontFamily: '"Press Start 2P", monospace',
            textTransform: 'uppercase',
            boxShadow: isOverdue ? '0 0 8px rgba(255, 107, 107, 0.6)' : 'none',
            zIndex: 10
        }}>
            {displayText}
        </div>
    );
};

export default DeadlineDisplay;