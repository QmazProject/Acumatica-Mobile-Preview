import React from 'react';
import { ArrowLeft, Plus, MoreVertical } from 'lucide-react';
import './Dashboard.css';

interface PurchasesProps {
    onBack: () => void;
}

const Purchases: React.FC<PurchasesProps> = ({ onBack }) => {
    return (
        <div className="dashboard-container">
            {/* Header with back button */}
            <div className="sticky-header" style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '12px',
                padding: '16px'
            }}>
                <ArrowLeft 
                    size={24} 
                    color="#000" 
                    onClick={onBack}
                    style={{ cursor: 'pointer' }}
                />
                <h2 style={{ 
                    fontSize: '24px', 
                    fontWeight: '400',
                    margin: 0,
                    flex: 1
                }}>
                    Purchases
                </h2>
            </div>

            <div className="dashboard-content" style={{ paddingTop: '80px' }}>
                {/* Add KPI Button */}
                <button style={{
                    width: '100%',
                    padding: '16px',
                    backgroundColor: '#f5f5f5',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '16px',
                    color: '#666',
                    cursor: 'pointer',
                    marginBottom: '24px'
                }}>
                    Add KPI
                </button>

                {/* Screens Section */}
                <div style={{ marginBottom: '24px' }}>
                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '16px'
                    }}>
                        <h3 style={{
                            fontSize: '16px',
                            fontWeight: '500',
                            color: '#666',
                            margin: 0
                        }}>
                            Screens
                        </h3>
                        <MoreVertical size={20} color="#666" style={{ cursor: 'pointer' }} />
                    </div>

                    {/* Screen Items */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px'
                        }}>
                            <button style={{
                                flex: 1,
                                padding: '16px',
                                backgroundColor: '#fee2e2',
                                border: 'none',
                                borderRadius: '12px',
                                fontSize: '16px',
                                color: '#000',
                                textAlign: 'left',
                                cursor: 'pointer',
                                fontWeight: '400'
                            }}>
                                Purchase Orders
                            </button>
                            <button style={{
                                width: '48px',
                                height: '48px',
                                backgroundColor: '#bbf7d0',
                                border: 'none',
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: 'pointer'
                            }}>
                                <Plus size={24} color="#000" />
                            </button>
                        </div>

                        <button style={{
                            width: '100%',
                            padding: '16px',
                            backgroundColor: '#fee2e2',
                            border: 'none',
                            borderRadius: '12px',
                            fontSize: '16px',
                            color: '#000',
                            textAlign: 'left',
                            cursor: 'pointer',
                            fontWeight: '400'
                        }}>
                            Purchase Receipts
                        </button>

                        <button style={{
                            width: '100%',
                            padding: '16px',
                            backgroundColor: '#fee2e2',
                            border: 'none',
                            borderRadius: '12px',
                            fontSize: '16px',
                            color: '#000',
                            textAlign: 'left',
                            cursor: 'pointer',
                            fontWeight: '400'
                        }}>
                            Requests
                        </button>

                        <button style={{
                            width: '100%',
                            padding: '16px',
                            backgroundColor: '#fee2e2',
                            border: 'none',
                            borderRadius: '12px',
                            fontSize: '16px',
                            color: '#000',
                            textAlign: 'left',
                            cursor: 'pointer',
                            fontWeight: '400'
                        }}>
                            Requisitions
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Purchases;
