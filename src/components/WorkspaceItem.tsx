
import React from 'react';

interface WorkspaceItemProps {
    icon: React.ReactNode;
    title: string;
    desc: string;
    onClick?: () => void;
    highlighted?: boolean;
}

const WorkspaceItem: React.FC<WorkspaceItemProps> = ({ icon, title, desc, onClick, highlighted }) => {
    return (
        <div 
            className="workspace-item"
            onClick={onClick}
            style={{
                cursor: onClick ? 'pointer' : 'default',
                backgroundColor: highlighted ? '#fee2e2' : 'transparent',
                borderRadius: highlighted ? '8px' : '0',
                padding: highlighted ? '12px' : '0',
                transition: 'all 0.2s ease'
            }}
        >
            <div className="workspace-icon">{icon}</div>
            <div className="workspace-details">
                <h4 style={{ color: highlighted ? '#ef4444' : 'inherit', fontWeight: highlighted ? '600' : 'normal' }}>
                    {title}
                </h4>
                <p>{desc}</p>
            </div>
        </div>
    );
};

export default WorkspaceItem;
