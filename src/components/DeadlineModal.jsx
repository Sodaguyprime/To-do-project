import { useState } from "react";
import { createPortal } from "react-dom";

const DeadlineModal = ({ isOpen, onClose, onSave, currentDeadline }) => {
    const [selectedDate, setSelectedDate] = useState(currentDeadline || '');

    if (!isOpen) return null;

    const handleSave = () => {
        onSave(selectedDate);
        onClose();
    };

    const handleClear = () => {
        onSave(null);
        onClose();
    };

    return createPortal(
        <div 
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'rgba(0, 0, 0, 0.85)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 9999,
                padding: '16px',
                overflow: 'auto'
            }}
            onClick={onClose}
        >
            <div 
                style={{
                    background: '#222734',
                    border: '4px solid #0b0d12',
                    borderRadius: '8px',
                    padding: '24px',
                    maxWidth: '400px',
                    width: '100%',
                    boxShadow: '0 0 0 2px #3a3f52 inset, 0 8px 0 0 #0b0d12',
                    margin: 'auto'
                }}
                onClick={(e) => e.stopPropagation()}
            >
                <h3 style={{ 
                    margin: '0 0 16px 0', 
                    color: '#e5e5e5',
                    fontFamily: '"Press Start 2P", monospace',
                    fontSize: '14px',
                    textTransform: 'uppercase'
                }}>
                    Set Deadline
                </h3>
                
                <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    style={{
                        width: '100%',
                        padding: '14px 12px',
                        fontSize: '18px',
                        border: '3px solid #0b0d12',
                        borderRadius: '8px',
                        background: '#2b3242',
                        color: '#e5e5e5',
                        marginBottom: '16px',
                        fontFamily: '"VT323", monospace',
                        outline: 'none'
                    }}
                />
                
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    <button
                        onClick={handleSave}
                        style={{
                            flex: 1,
                            minWidth: '100px',
                            padding: '12px 16px',
                            fontSize: '11px',
                            border: '4px solid #0b0d12',
                            borderRadius: '6px',
                            background: '#66ffc4',
                            color: '#121418',
                            fontWeight: 'bold',
                            cursor: 'pointer',
                            fontFamily: '"Press Start 2P", monospace',
                            textTransform: 'uppercase'
                        }}
                    >
                        Save
                    </button>
                    
                    {currentDeadline && (
                        <button
                            onClick={handleClear}
                            style={{
                                flex: 1,
                                minWidth: '100px',
                                padding: '12px 16px',
                                fontSize: '11px',
                                border: '4px solid #0b0d12',
                                borderRadius: '6px',
                                background: '#ff6b6b',
                                color: '#fff',
                                cursor: 'pointer',
                                fontFamily: '"Press Start 2P", monospace',
                                textTransform: 'uppercase'
                            }}
                        >
                            Clear
                        </button>
                    )}
                    
                    <button
                        onClick={onClose}
                        style={{
                            flex: 1,
                            minWidth: '100px',
                            padding: '12px 16px',
                            fontSize: '11px',
                            border: '4px solid #0b0d12',
                            borderRadius: '6px',
                            background: '#3a3d5c',
                            color: '#9ca3af',
                            cursor: 'pointer',
                            fontFamily: '"Press Start 2P", monospace',
                            textTransform: 'uppercase'
                        }}
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>,
        document.body
    );
};

export default DeadlineModal;