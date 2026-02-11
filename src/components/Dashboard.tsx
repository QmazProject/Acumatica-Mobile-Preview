import React from 'react';
import './Dashboard.css';
import { History, Megaphone, FolderKanban, HardHat, FileText, ShoppingCart, Truck, ShieldCheck, Folder, Settings } from 'lucide-react';
import Section from './Section';
import KeyPerformanceIndicator from './KeyPerformanceIndicator';
import WorkspaceItem from './WorkspaceItem';

const Dashboard: React.FC<{
    onNavigate: (screen: string) => void;
    showApprovals: boolean;
    approvalsCount: number;
}> = ({ onNavigate, showApprovals, approvalsCount }) => {
    return (
        <div className="dashboard-container">
            <div className="sticky-header">
                <h2 className="company-name">QMAZ HOLDING INC</h2>
            </div>
            <div className="sub-header">
                <h2 className="company-name">QMB EQUIPMENT</h2>
            </div>

            <section className="dashboard-content">
                <div className="kpi-banner">
                    <KeyPerformanceIndicator />
                </div>

                {/* Recently Visited */}
                <Section title="Recently Visited">
                    <div className="horizontal-scroll">
                        <div className="recent-card">
                            <span className="card-label">Purchase Receipts</span>
                            <p className="card-title">Return,PR00000<br />00004153</p>
                        </div>
                        <div className="recent-card">
                            <span className="card-label">Purchase Order</span>
                            <p className="card-title">Normal,PO0000<br />000002718</p>
                        </div>
                        <div className="recent-card">
                            <span className="card-label">Expense Receipt</span>
                            <p className="card-title">N/A replenishmrnt</p>
                        </div>
                    </div>
                </Section>

                {/* Favorites */}
                <Section title="Favorites" hasMore className="favorites-section">
                    <div className="favorites-list">
                        <div className="favorite-item">Expense Claims</div>
                        {showApprovals && (
                            <div
                                className="favorite-item favorite-item-clickable"
                                onClick={() => onNavigate('approvals')}
                            >
                                <span>Approvals</span>
                                <span className="favorites-badge">{approvalsCount}</span>
                            </div>
                        )}
                    </div>
                </Section>

                {/* Workspaces */}
                <Section title="Workspaces" hasMore>
                    <div className="workspace-list">
                        <WorkspaceItem icon={<History color="#ef4444" />} title="Time and Expenses" desc="Expense Receipts, Expense Claims, Approvals, Events, Task, Employee, Time Cards, Equipment Time Cards" />
                        <WorkspaceItem icon={<Megaphone color="#ef4444" />} title="CRM" desc="Contacts, Sales Orders" />
                        <WorkspaceItem icon={<FolderKanban color="#ef4444" />} title="Projects" desc="Projects, Change Orders, Subcontracts, Progress Worksheets" />
                        <WorkspaceItem icon={<HardHat color="#ef4444" />} title="Project Management" desc="Daily Field Reports, Drawing Log, Submittals, Photo Logs, Requests For Information, Project Issues" />
                        <WorkspaceItem icon={<FileText color="#ef4444" />} title="Sales Orders" desc="Sales Orders" />
                        <WorkspaceItem icon={<ShoppingCart color="#ef4444" />} title="Purchases" desc="Purchase Orders, Purchase Receipts, Request, Requisitions" />
                        <WorkspaceItem icon={<Truck color="#ef4444" />} title="Inventory" desc="Receipts, Issues, Storage Summary, Inventory Transaction History" />
                        <WorkspaceItem icon={<ShieldCheck color="#ef4444" />} title="User Security" desc="Location Tracking Distance" />
                        <WorkspaceItem icon={<Folder color="#ef4444" />} title="Other" desc="Cash Transactions" />
                    </div>
                </Section>

                <div className="edit-main-screen">
                    <Settings className="icon-settings" />
                    <span>Edit Main Screen</span>
                </div>

            </section>
        </div>
    );
};


export default Dashboard;
