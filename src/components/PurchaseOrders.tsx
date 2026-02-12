import React from 'react';
import { ArrowLeft, Search, MoreVertical, Plus } from 'lucide-react';
import './Dashboard.css';

interface PurchaseOrderData {
    id: string;
    company: string;
    amount: string;
    date: string;
    status: string;
    type?: string;
    promisedOn?: string;
    description?: string;
    location?: string;
    owner?: string;
    currency?: string;
}

interface PurchaseOrdersProps {
    onBack: () => void;
    onSelectPO: (po: PurchaseOrderData) => void;
}

const PurchaseOrders: React.FC<PurchaseOrdersProps> = ({ onBack, onSelectPO }) => {
    const [activeFilter, setActiveFilter] = React.useState<'all' | 'my' | 'adc' | 'qdc' | 'qmb'>('all');
    const [showSimulationMessage, setShowSimulationMessage] = React.useState(false);

    const purchaseOrders: PurchaseOrderData[] = [
        {
            id: 'PO0000000008832',
            company: 'ICONIC DEALERSHIP, INC.',
            amount: '20,000,000.00',
            date: 'Feb 11, 2026',
            status: 'Closed',
            type: 'Normal',
            promisedOn: 'Feb 11, 2026',
            description: 'Komatsu PC210 PART NO.23131313',
            location: 'Primary Location',
            owner: 'PATRICK EROJO',
            currency: 'PHP'
        },
        {
            id: 'PO0000000008831',
            company: 'TRUSALES CORPORATION',
            amount: '105,000.00',
            date: 'Feb 11, 2026',
            status: 'Open',
            type: 'Normal',
            promisedOn: 'Feb 11, 2026',
            description: 'Office Supplies',
            location: 'Primary Location',
            owner: 'PATRICK EROJO',
            currency: 'PHP'
        },
        {
            id: 'PO0000000008830',
            company: 'CEBU SEALTRUST AUTO SUPPLY',
            amount: '535.72',
            date: 'Feb 10, 2026',
            status: 'Closed',
            type: 'Normal',
            promisedOn: 'Feb 10, 2026',
            description: 'Auto Parts',
            location: 'Primary Location',
            owner: 'PATRICK EROJO',
            currency: 'PHP'
        },
        {
            id: 'PO0000000008829',
            company: 'TRUSALES CORPORATION',
            amount: '5,980.00',
            date: 'Feb 3, 2026',
            status: 'Pending Printing',
            type: 'Normal',
            promisedOn: 'Feb 3, 2026',
            description: 'for approval purpose to test in mobile ui',
            location: 'Primary Location',
            owner: 'PATRICK EROJO',
            currency: 'PHP'
        },
        {
            id: 'PO0000000008828',
            company: 'LIM, DERICK MASON',
            amount: '53,392.85',
            date: 'Jan 30, 2026',
            status: 'Open',
            type: 'Normal',
            promisedOn: 'Jan 30, 2026',
            description: 'Construction Materials',
            location: 'Primary Location',
            owner: 'PATRICK EROJO',
            currency: 'PHP'
        },
        {
            id: 'PO0000000008827',
            company: 'ESTRADA, LOWIN',
            amount: '9,000.00',
            date: 'Jan 30, 2026',
            status: 'Closed',
            type: 'Normal',
            promisedOn: 'Jan 30, 2026',
            description: 'Service Fee',
            location: 'Primary Location',
            owner: 'PATRICK EROJO',
            currency: 'PHP'
        }
    ];

    return (
        <div className="dashboard-container" style={{ backgroundColor: '#f5f5f5' }}>
            {/* Header */}
            <div style={{ 
                position: 'fixed',
                top: 0,
                left: '50%',
                transform: 'translateX(-50%)',
                width: '100%',
                maxWidth: '480px',
                zIndex: 100,
                backgroundColor: '#fff',
                borderBottom: '1px solid #e5e5e5'
            }}>
                <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'space-between',
                    padding: '16px'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <ArrowLeft 
                            size={24} 
                            color="#000" 
                            onClick={onBack}
                            style={{ cursor: 'pointer' }}
                        />
                        <h2 style={{ 
                            fontSize: '20px', 
                            fontWeight: '500',
                            margin: 0
                        }}>
                            Purchase Orders
                        </h2>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <Search size={24} color="#000" style={{ cursor: 'pointer' }} />
                        <MoreVertical size={24} color="#000" style={{ cursor: 'pointer' }} />
                    </div>
                </div>

                {/* Filter Buttons - Swipable */}
                <div style={{ 
                    display: 'flex', 
                    gap: '8px', 
                    padding: '16px',
                    backgroundColor: '#f5f5f5',
                    overflowX: 'auto',
                    overflowY: 'hidden',
                    WebkitOverflowScrolling: 'touch',
                    scrollbarWidth: 'none',
                    msOverflowStyle: 'none'
                }}>
                    <button
                        onClick={() => setActiveFilter('all')}
                        style={{
                            padding: '8px 16px',
                            borderRadius: '20px',
                            border: '1px solid #e5e5e5',
                            backgroundColor: activeFilter === 'all' ? '#e3f2fd' : '#fff',
                            color: '#000',
                            fontSize: '14px',
                            cursor: 'pointer',
                            whiteSpace: 'nowrap',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            flexShrink: 0
                        }}
                    >
                        <span style={{ fontSize: '16px' }}>☰</span> All
                    </button>
                    <button
                        onClick={() => setActiveFilter('my')}
                        style={{
                            padding: '8px 16px',
                            borderRadius: '20px',
                            border: '1px solid #e5e5e5',
                            backgroundColor: activeFilter === 'my' ? '#e3f2fd' : '#fff',
                            color: '#000',
                            fontSize: '14px',
                            cursor: 'pointer',
                            whiteSpace: 'nowrap',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            flexShrink: 0
                        }}
                    >
                        <span style={{ fontSize: '16px' }}>☰</span> My Purchase Orders
                    </button>
                    <button
                        onClick={() => setActiveFilter('adc')}
                        style={{
                            padding: '8px 16px',
                            borderRadius: '20px',
                            border: '1px solid #e5e5e5',
                            backgroundColor: activeFilter === 'adc' ? '#e3f2fd' : '#fff',
                            color: '#000',
                            fontSize: '14px',
                            cursor: 'pointer',
                            whiteSpace: 'nowrap',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            flexShrink: 0
                        }}
                    >
                        <span style={{ fontSize: '16px' }}>☰</span> ADC
                    </button>
                    <button
                        onClick={() => setActiveFilter('qdc')}
                        style={{
                            padding: '8px 16px',
                            borderRadius: '20px',
                            border: '1px solid #e5e5e5',
                            backgroundColor: activeFilter === 'qdc' ? '#e3f2fd' : '#fff',
                            color: '#000',
                            fontSize: '14px',
                            cursor: 'pointer',
                            whiteSpace: 'nowrap',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            flexShrink: 0
                        }}
                    >
                        <span style={{ fontSize: '16px' }}>☰</span> QDC
                    </button>
                    <button
                        onClick={() => setActiveFilter('qmb')}
                        style={{
                            padding: '8px 16px',
                            borderRadius: '20px',
                            border: '1px solid #e5e5e5',
                            backgroundColor: activeFilter === 'qmb' ? '#e3f2fd' : '#fff',
                            color: '#000',
                            fontSize: '14px',
                            cursor: 'pointer',
                            whiteSpace: 'nowrap',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            flexShrink: 0
                        }}
                    >
                        <span style={{ fontSize: '16px' }}>☰</span> QMB
                    </button>
                </div>

                {/* Sort By */}
                <div style={{
                    padding: '12px 16px',
                    backgroundColor: '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    color: '#666',
                    fontSize: '14px'
                }}>
                    <span>Sort By</span>
                    <span style={{ fontSize: '16px' }}>☰</span>
                </div>
            </div>

            {/* Purchase Orders List */}
            <div style={{ 
                paddingTop: '200px',
                backgroundColor: '#fff',
                minHeight: '100vh'
            }}>
                {purchaseOrders.map((order) => (
                    <div
                        key={order.id}
                        onClick={() => {
                            if (order.id === 'PO0000000008832') {
                                onSelectPO(order);
                            } else {
                                setShowSimulationMessage(true);
                                setTimeout(() => setShowSimulationMessage(false), 3000);
                            }
                        }}
                        style={{
                            backgroundColor: order.id === 'PO0000000008832' ? '#fef2f2' : '#fff',
                            padding: '16px',
                            cursor: 'pointer',
                            borderBottom: '1px solid #e5e5e5',
                            borderLeft: order.id === 'PO0000000008832' ? '4px solid #ef4444' : '4px solid transparent'
                        }}
                    >
                        {/* Row 1: PO Number | Amount */}
                        <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'flex-start',
                            marginBottom: '4px'
                        }}>
                            <h3 style={{
                                fontSize: '16px',
                                fontWeight: '600',
                                margin: 0,
                                color: '#000'
                            }}>
                                {order.id}
                            </h3>
                            <span style={{
                                fontSize: '16px',
                                fontWeight: '500',
                                color: '#000'
                            }}>
                                {order.amount}
                            </span>
                        </div>
                        
                        {/* Row 2: Description | Company */}
                        <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'flex-start',
                            marginBottom: '4px'
                        }}>
                            <span style={{
                                fontSize: '14px',
                                color: '#666',
                                flex: 1,
                                marginRight: '16px',
                                lineHeight: 1.4
                            }}>
                                {order.description || ''}
                            </span>
                            <span style={{
                                fontSize: '14px',
                                color: '#666',
                                textAlign: 'right',
                                flexShrink: 0
                            }}>
                                {order.company}
                            </span>
                        </div>
                        
                        {/* Row 3: Owner | Date */}
                        <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            marginBottom: '8px'
                        }}>
                            <span style={{
                                fontSize: '13px',
                                color: '#666'
                            }}>
                                Owner: {order.owner || ''}
                            </span>
                            <span style={{
                                fontSize: '13px',
                                color: '#666'
                            }}>
                                {order.date}
                            </span>
                        </div>
                        
                        {/* Row 4: Status */}
                        <div style={{
                            marginTop: '4px'
                        }}>
                            <span style={{
                                fontSize: '13px',
                                color: order.status === 'Closed' ? '#ef4444' : order.status === 'Open' ? '#22c55e' : '#999',
                                fontWeight: 500
                            }}>
                                {order.status}
                            </span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Simulation Message Toast */}
            {showSimulationMessage && (
                <div style={{
                    position: 'fixed',
                    bottom: '100px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    backgroundColor: '#1f2937',
                    color: '#fff',
                    padding: '12px 24px',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontWeight: 500,
                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                    zIndex: 1001,
                    textAlign: 'center',
                    maxWidth: '320px',
                    animation: 'fadeIn 0.2s ease-out'
                }}>
                    This isn't part of simulation process
                </div>
            )}

            {/* Floating Action Button */}
            <button style={{
                position: 'fixed',
                bottom: '24px',
                right: '24px',
                width: '56px',
                height: '56px',
                borderRadius: '50%',
                backgroundColor: '#ef4444',
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 12px rgba(239, 68, 68, 0.3)',
                cursor: 'pointer',
                zIndex: 1000
            }}>
                <Plus size={28} color="#fff" />
            </button>
        </div>
    );
};

export default PurchaseOrders;
