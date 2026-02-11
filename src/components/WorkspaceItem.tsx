
import React from 'react';

interface WorkspaceItemProps {
    icon: React.ReactNode;
    title: string;
    desc: string;
}

const WorkspaceItem: React.FC<WorkspaceItemProps> = ({ icon, title, desc }) => {
    return (
        <div className="workspace-item">
            <div className="workspace-icon">{icon}</div>
            <div className="workspace-details">
                <h4>{title}</h4>
                <p>{desc}</p>
            </div>
        </div>
    );
};

export default WorkspaceItem;
