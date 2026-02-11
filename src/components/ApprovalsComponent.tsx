import React from 'react';
import { ArrowLeft, Search, MoreVertical, Filter, GripVertical } from 'lucide-react';
import './Dashboard.css'; // Re-use general styles

interface ApprovalsProps {
    onBack: () => void;
    onDetails: (context?: { fromHistory?: boolean; recordType?: 'po' | 'bill' | 'prepayment' }) => void;
    onNavigateToPO?: () => void;
    poStatus: 'pending' | 'approved';
    billStatus: 'pending' | 'approved';
    prepaymentStatus?: 'pending' | 'approved';
    approvalType: 'po' | 'bill' | 'prepayment';
}

type ApprovalsTab = 'all' | 'my' | 'workgroup' | 'reassigned' | 'history';

type ApprovalRecord = {
    type: 'po' | 'bill' | 'prepayment';
    recordNumber: string;
    purchaseOrderNumber?: string;
    documentDate: string;
    vendor: string;
    description: string;
    vendorId: string;
    amount: string;
    currency: string;
};

const Approvals: React.FC<ApprovalsProps> = ({ onBack, onDetails, onNavigateToPO, poStatus, billStatus, prepaymentStatus = 'pending', approvalType }) => {
    const [activeTab, setActiveTab] = React.useState<ApprovalsTab>('my');

    const pendingApprovals: ApprovalRecord[] = approvalType === 'bill'
        ? (billStatus === 'pending' ? [sampleBillApproval] : [])
        : approvalType === 'prepayment'
        ? (prepaymentStatus === 'pending' ? [samplePrepayment] : [])
        : poStatus === 'pending'
            ? [samplePurchaseOrder]
            : [];
    const approvedHistory: ApprovalRecord[] = 
        approvalType === 'po' && poStatus === 'approved' 
            ? [samplePurchaseOrder] 
            : approvalType === 'bill' && billStatus === 'approved'
                ? [{ ...sampleBillApproval }]
                : approvalType === 'prepayment' && prepaymentStatus === 'approved'
                    ? [samplePrepayment]
                    : [];

    const approvalsByTab: Record<ApprovalsTab, typeof pendingApprovals> = {
        all: pendingApprovals,
        my: pendingApprovals,
        workgroup: [],
        reassigned: [],
        history: approvedHistory
    };

    const activeRows = approvalsByTab[activeTab];

    return (
        <div className="dashboard-container" style={{ backgroundColor: '#fff', minHeight: '100vh' }}>
            {/* Header */}
            <header style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '16px',
                borderBottom: '1px solid #f0f0f0'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <ArrowLeft size={24} color="#1a1a1a" onClick={onBack} style={{ cursor: 'pointer' }} />
                    <h2 style={{ fontSize: '18px', fontWeight: 600, color: '#1a1a1a' }}>Approvals</h2>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <Search size={22} color="#1a1a1a" />
                    <MoreVertical size={22} color="#1a1a1a" />
                </div>
            </header>

            {/* Filter Tabs */}
            <div style={{
                display: 'flex',
                gap: '8px',
                padding: '12px 16px',
                overflowX: 'auto',
                borderBottom: '1px solid #f0f0f0',
                scrollbarWidth: 'none', /* Hide scrollbar for mobile feel */
                msOverflowStyle: 'none'
            }}>
                <button style={activeTab === 'all' ? activeFilterBtnStyle : filterBtnStyle} onClick={() => setActiveTab('all')}>
                    <Filter size={14} style={{ marginRight: '4px' }} /> All
                </button>
                <button style={activeTab === 'my' ? activeFilterBtnStyle : filterBtnStyle} onClick={() => setActiveTab('my')}>
                    <Filter size={14} style={{ marginRight: '4px' }} /> My Approvals
                </button>
                <button style={activeTab === 'workgroup' ? activeFilterBtnStyle : filterBtnStyle} onClick={() => setActiveTab('workgroup')}>
                    <Filter size={14} style={{ marginRight: '4px' }} /> My Workgroup's Approvals
                </button>
                <button style={activeTab === 'reassigned' ? activeFilterBtnStyle : filterBtnStyle} onClick={() => setActiveTab('reassigned')}>
                    <Filter size={14} style={{ marginRight: '4px' }} /> Reassigned
                </button>
                <button style={activeTab === 'history' ? activeFilterBtnStyle : filterBtnStyle} onClick={() => setActiveTab('history')}>
                    <Filter size={14} style={{ marginRight: '4px' }} /> Approval History
                </button>
            </div>

            {/* Sort Header */}
            <div style={{
                padding: '12px 16px',
                fontSize: '12px',
                color: '#888',
                display: 'flex',
                alignItems: 'center',
                borderBottom: '1px solid #f0f0f0'
            }}>
                Document Date <GripVertical size={12} style={{ marginLeft: '4px' }} />
            </div>

            {/* Content List */}
            <div className="approval-list">
                {activeRows.length > 0 ? (
                    activeRows.map((record) => (
                        <div
                            key={record.recordNumber}
                            className="approval-item"
                            onClick={() => {
                                if (record.type === 'po') {
                                    onDetails({ fromHistory: activeTab === 'history', recordType: 'po' });
                                }
                                if (record.type === 'bill') {
                                    onDetails({ fromHistory: activeTab === 'history', recordType: 'bill' });
                                }
                                if (record.type === 'prepayment') {
                                    onDetails({ fromHistory: activeTab === 'history', recordType: 'prepayment' });
                                }
                            }}
                            style={{
                                padding: '16px',
                                borderBottom: '1px solid #f0f0f0',
                                cursor: 'pointer',
                                backgroundColor: record.type === 'bill' ? '#f3f4f6' : '#fff'
                            }}
                        >
                            {record.type === 'prepayment' ? (
                                <div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                                        <h4 style={{ fontSize: '15px', fontWeight: 600 }}>Prepayment</h4>
                                        <span style={{ fontSize: '13px', color: '#666' }}>{record.recordNumber}</span>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                                        <span style={{ fontSize: '13px', color: '#111', fontWeight: 700 }}>PO Number</span>
                                        <span 
                                            style={{ 
                                                fontSize: '13px', 
                                                color: '#2563eb', 
                                                textDecoration: 'underline',
                                                cursor: 'pointer'
                                            }}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                onNavigateToPO?.();
                                            }}
                                        >
                                            {record.purchaseOrderNumber}
                                        </span>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                                        <span style={{ fontSize: '13px', color: '#666' }}>{record.documentDate}</span>
                                        <span style={{ fontSize: '13px', color: '#666' }}>{record.vendor}</span>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                                        <span style={{ fontSize: '13px', color: '#666' }}>{record.description}</span>
                                        <span style={{ fontSize: '13px', color: '#666' }}>{record.vendorId}</span>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                                        <span />
                                        <span style={{ fontSize: '15px', fontWeight: 500, color: '#555' }}>{record.amount}</span>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                        {activeTab !== 'history' ? (
                                            <span style={{ fontSize: '12px', color: '#dc2626', fontWeight: 700 }}>
                                                Pending for Approval: Allan Quirante
                                            </span>
                                        ) : (
                                            <span style={{ fontSize: '12px', color: '#059669', fontWeight: 700 }}>
                                                Approved by: Allan Quirante
                                            </span>
                                        )}
                                        <span style={{ fontSize: '12px', color: '#888' }}>{record.currency}</span>
                                    </div>
                                </div>
                            ) : record.type === 'bill' ? (
                                <div style={{
                                    backgroundColor: '#fff',
                                    borderRadius: '14px',
                                    padding: '14px'
                                }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                                        <h4 style={{ fontSize: '15px', fontWeight: 600 }}>Bill</h4>
                                        <span style={{ fontSize: '13px', color: '#666' }}>{record.recordNumber}</span>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                                        <span style={{ fontSize: '13px', color: '#111', fontWeight: 700 }}>Purchase Order</span>
                                        <span 
                                            style={{ 
                                                fontSize: '13px', 
                                                color: '#2563eb', 
                                                textDecoration: 'underline',
                                                cursor: 'pointer'
                                            }}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                onNavigateToPO?.();
                                            }}
                                        >
                                            {record.purchaseOrderNumber}
                                        </span>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                                        <span style={{ fontSize: '13px', color: '#666' }}>{record.documentDate}</span>
                                        <span style={{ fontSize: '13px', color: '#666', textAlign: 'right' }}>{record.vendor}</span>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                                        <span style={{ fontSize: '13px', color: '#666' }}>{record.description}</span>
                                        <span style={{ fontSize: '13px', color: '#666' }}>{record.vendorId}</span>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                                        <span />
                                        <span style={{ fontSize: '15px', fontWeight: 500, color: '#555' }}>{record.amount}</span>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <span style={{ fontSize: '12px', color: activeTab === 'history' ? '#059669' : '#dc2626', fontWeight: 700 }}>
                                            {activeTab === 'history' ? 'Approved by: Allan Quirante' : 'Pending for Approval: Allan Quirante'}
                                        </span>
                                        <span style={{ fontSize: '12px', color: '#888' }}>{record.currency}</span>
                                    </div>
                                </div>
                            ) : (
                                <div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                                        <h4 style={{ fontSize: '15px', fontWeight: 600 }}>Purchase Order</h4>
                                        <span style={{ fontSize: '13px', color: '#666' }}>{record.recordNumber}</span>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                                        <span style={{ fontSize: '13px', color: '#666' }}>{record.documentDate}</span>
                                        <span style={{ fontSize: '13px', color: '#666' }}>{record.vendor}</span>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <div style={{ maxWidth: '60%' }}>
                                            <p style={{ fontSize: '13px', color: '#666' }}>
                                                {record.description}
                                            </p>
                                            {activeTab !== 'history' ? (
                                                <span style={{ fontSize: '12px', color: '#dc2626', fontWeight: 700 }}>
                                                    Pending for Approval: Allan Quirante
                                                </span>
                                            ) : (
                                                <span style={{ fontSize: '12px', color: '#059669', fontWeight: 700 }}>
                                                    Approved by: Allan Quirante
                                                </span>
                                            )}
                                        </div>
                                        <div style={{ textAlign: 'right' }}>
                                            <span style={{ fontSize: '13px', color: '#666', display: 'block' }}>{record.vendorId}</span>
                                            <span style={{ fontSize: '15px', fontWeight: 500, marginTop: '4px', display: 'block', color: '#555' }}>
                                                {record.amount}
                                            </span>
                                            <span style={{ fontSize: '12px', fontWeight: 400, color: '#888' }}>
                                                {record.currency}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))
                ) : (
                    <div style={{ padding: '28px 16px', color: '#888', fontSize: '13px', textAlign: 'center' }}>
                        No records in this tab.
                    </div>
                )}
            </div>
        </div>
    );
};

// Styling Object for simpler prototyping
const filterBtnStyle = {
    padding: '8px 12px',
    borderRadius: '16px',
    border: '1px solid #e5e5e5',
    backgroundColor: '#fff',
    fontSize: '13px',
    color: '#666',
    whiteSpace: 'nowrap' as const,
    display: 'flex',
    alignItems: 'center'
}

const activeFilterBtnStyle = {
    ...filterBtnStyle,
    backgroundColor: '#dbeafe',
    color: '#1da1f2',
    border: 'none'
};

const samplePurchaseOrder = {
    type: 'po' as const,
    recordNumber: 'PO00000000008829',
    documentDate: 'Feb 3, 2026',
    vendor: 'TRUSALES CORPORATION',
    description: 'for approval purpose to test in mobile ui',
    vendorId: 'S00000000000740',
    amount: '5,980.00',
    currency: 'PHP'
};

const sampleBillApproval = {
    type: 'bill' as const,
    recordNumber: 'AP0000000020285',
    purchaseOrderNumber: 'PO0000000008830',
    documentDate: 'Feb 10, 2026',
    vendor: 'CEBU SEALTRUST AUTO SUPPLY',
    description: 'test',
    vendorId: 'S0000000000023',
    amount: '535.72',
    currency: 'PHP'
};

const samplePrepayment = {
    type: 'prepayment' as const,
    recordNumber: 'AP0000000020286',
    purchaseOrderNumber: 'PO00000000008831',
    documentDate: 'Feb 11, 2026',
    vendor: 'TRUSALES CORPORATION',
    description: 'test approval',
    vendorId: 'S0000000000740',
    amount: '105,000.00',
    currency: 'PHP'
};

export default Approvals;
