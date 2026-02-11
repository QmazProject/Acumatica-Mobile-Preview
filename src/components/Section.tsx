
import React from 'react';
import { MoreHorizontal } from 'lucide-react';

interface SectionProps {
    title: string;
    hasMore?: boolean;
    children: React.ReactNode;
    className?: string;
}

const Section: React.FC<SectionProps> = ({ title, hasMore, children, className }) => {
    return (
        <div className={`section-container ${className || ''}`}>
            <div className="section-header">
                <h3>{title}</h3>
                {hasMore && <MoreHorizontal size={20} className="icon-more" />}
            </div>
            <div className="section-body">
                {children}
            </div>
        </div>
    );
};

export default Section;
