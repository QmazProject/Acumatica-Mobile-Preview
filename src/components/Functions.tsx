import React from 'react';
import './Dashboard.css'; // Re-using basic layout styles

const Functions: React.FC<{
    onNavigate: (screen: string) => void;
    onEnableApprovals: () => void;
    onEnableBillApprovals: () => void;
    onEnablePrepaymentApprovals: () => void;
    onDisableBillApprovals: () => void;
    onDisablePrepaymentApprovals: () => void;
    onDisableApprovals: () => void;
    isApprovalsEnabled: boolean;
    isBillApprovalsEnabled: boolean;
    isPrepaymentApprovalsEnabled: boolean;
}> = ({
    onNavigate,
    onEnableApprovals,
    onEnableBillApprovals,
    onEnablePrepaymentApprovals,
    onDisableBillApprovals,
    onDisablePrepaymentApprovals,
    onDisableApprovals,
    isApprovalsEnabled,
    isBillApprovalsEnabled,
    isPrepaymentApprovalsEnabled
}) => {
    const [activeModal, setActiveModal] = React.useState<'po' | 'bill' | 'prepayment' | null>(null);

    return (
        <div className="dashboard-container">
            <div className="sticky-header">
                <h2 className="company-name" style={{ textAlign: 'center', fontSize: '18px' }}>Functions</h2>
            </div>

            <div className="dashboard-content">
                <div style={{ padding: '16px 0', position: 'relative' }}>
                    <button 
                        className="function-tab" 
                        type="button" 
                        disabled={isBillApprovalsEnabled || isPrepaymentApprovalsEnabled}
                        style={{
                            opacity: (isBillApprovalsEnabled || isPrepaymentApprovalsEnabled) ? 0.5 : 1,
                            cursor: (isBillApprovalsEnabled || isPrepaymentApprovalsEnabled) ? 'not-allowed' : 'pointer'
                        }}
                        onClick={() => {
                            if (!isBillApprovalsEnabled && !isPrepaymentApprovalsEnabled) {
                                setActiveModal(activeModal === 'po' ? null : 'po');
                            }
                        }}
                    >
                        PO for approval
                    </button>
                    <button
                        className="function-tab"
                        type="button"
                        disabled={isApprovalsEnabled || isPrepaymentApprovalsEnabled}
                        style={{ 
                            marginTop: '8px',
                            opacity: (isApprovalsEnabled || isPrepaymentApprovalsEnabled) ? 0.5 : 1,
                            cursor: (isApprovalsEnabled || isPrepaymentApprovalsEnabled) ? 'not-allowed' : 'pointer'
                        }}
                        onClick={() => {
                            if (!isApprovalsEnabled && !isPrepaymentApprovalsEnabled) {
                                setActiveModal(activeModal === 'bill' ? null : 'bill');
                            }
                        }}
                    >
                        Approval on bill
                    </button>
                    <button
                        className="function-tab"
                        type="button"
                        disabled={isApprovalsEnabled || isBillApprovalsEnabled}
                        style={{ 
                            marginTop: '8px',
                            opacity: (isApprovalsEnabled || isBillApprovalsEnabled) ? 0.5 : 1,
                            cursor: (isApprovalsEnabled || isBillApprovalsEnabled) ? 'not-allowed' : 'pointer'
                        }}
                        onClick={() => {
                            if (!isApprovalsEnabled && !isBillApprovalsEnabled) {
                                setActiveModal(activeModal === 'prepayment' ? null : 'prepayment');
                            }
                        }}
                    >
                        Prepayment Approval
                    </button>
                    <button
                        className="function-tab"
                        type="button"
                        style={{ 
                            marginTop: '8px',
                            cursor: 'pointer'
                        }}
                        onClick={() => {
                            alert('Enabled Purchases for PO functionality');
                        }}
                    >
                        Enabled Purchases for PO
                    </button>
                    {activeModal === 'prepayment' && (
                        <div style={{
                            position: 'absolute',
                            top: 'calc(100% + 92px)',
                            left: 0,
                            right: 0,
                            zIndex: 2000,
                            marginTop: '12px',
                            animation: 'fadeIn 0.2s ease-out'
                        }}>
                            <div style={{
                                backgroundColor: '#fff',
                                borderRadius: '12px',
                                padding: '16px',
                                boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
                                border: '1px solid #e5e5e5'
                            }}>
                                {!isPrepaymentApprovalsEnabled ? (
                                    <>
                                        <p style={{
                                            fontSize: '14px',
                                            color: '#666',
                                            marginBottom: '16px',
                                            lineHeight: 1.5
                                        }}>
                                            Enable Prepayment Approval simulation to test the approval workflow in the mobile interface.
                                        </p>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                            <button
                                                style={{
                                                    width: '100%',
                                                    padding: '10px',
                                                    borderRadius: '8px',
                                                    border: 'none',
                                                    backgroundColor: '#10b981',
                                                    color: '#fff',
                                                    fontSize: '13px',
                                                    fontWeight: 600,
                                                    cursor: 'pointer'
                                                }}
                                                onClick={() => {
                                                    onEnablePrepaymentApprovals();
                                                    setActiveModal(null);
                                                }}
                                            >
                                                Start Simulation
                                            </button>
                                            <button
                                                style={{
                                                    width: '100%',
                                                    padding: '10px',
                                                    borderRadius: '8px',
                                                    border: '1px solid #e5e5e5',
                                                    backgroundColor: '#fff',
                                                    color: '#666',
                                                    fontSize: '13px',
                                                    fontWeight: 600,
                                                    cursor: 'pointer'
                                                }}
                                                onClick={() => setActiveModal(null)}
                                            >
                                                Close
                                            </button>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <p style={{
                                            fontSize: '14px',
                                            color: '#666',
                                            marginBottom: '16px',
                                            lineHeight: 1.5
                                        }}>
                                            Prepayment Approval simulation is currently active. You can stop it to remove the approval from your dashboard.
                                        </p>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                            <button
                                                style={{
                                                    width: '100%',
                                                    padding: '10px',
                                                    borderRadius: '8px',
                                                    border: 'none',
                                                    backgroundColor: '#ef4444',
                                                    color: '#fff',
                                                    fontSize: '13px',
                                                    fontWeight: 600,
                                                    cursor: 'pointer'
                                                }}
                                                onClick={() => {
                                                    onDisablePrepaymentApprovals();
                                                    setActiveModal(null);
                                                }}
                                            >
                                                Stop Simulation
                                            </button>
                                            <button
                                                style={{
                                                    width: '100%',
                                                    padding: '10px',
                                                    borderRadius: '8px',
                                                    border: '1px solid #e5e5e5',
                                                    backgroundColor: '#fff',
                                                    color: '#666',
                                                    fontSize: '13px',
                                                    fontWeight: 600,
                                                    cursor: 'pointer'
                                                }}
                                                onClick={() => setActiveModal(null)}
                                            >
                                                Close
                                            </button>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    )}
                    {activeModal === 'bill' && (
                        <div style={{
                            position: 'absolute',
                            top: 'calc(100% + 46px)',
                            left: 0,
                            right: 0,
                            zIndex: 2000,
                            marginTop: '12px',
                            animation: 'fadeIn 0.2s ease-out'
                        }}>
                            <div style={{
                                backgroundColor: '#fff',
                                borderRadius: '12px',
                                padding: '16px',
                                boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
                                border: '1px solid #e5e5e5'
                            }}>
                                {!isBillApprovalsEnabled ? (
                                    <>
                                        <p style={{
                                            fontSize: '14px',
                                            color: '#666',
                                            marginBottom: '16px',
                                            lineHeight: 1.5
                                        }}>
                                            Enable Bill Approval simulation to test the approval workflow in the mobile interface.
                                        </p>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                            <button
                                                style={{
                                                    width: '100%',
                                                    padding: '10px',
                                                    borderRadius: '8px',
                                                    border: 'none',
                                                    backgroundColor: '#10b981',
                                                    color: '#fff',
                                                    fontSize: '13px',
                                                    fontWeight: 600,
                                                    cursor: 'pointer'
                                                }}
                                                onClick={() => {
                                                    onEnableBillApprovals();
                                                    setActiveModal(null);
                                                    onNavigate('dashboard');
                                                }}
                                            >
                                                Start Simulation
                                            </button>
                                            <button
                                                style={{
                                                    width: '100%',
                                                    padding: '10px',
                                                    borderRadius: '8px',
                                                    border: '1px solid #e5e5e5',
                                                    backgroundColor: '#fff',
                                                    color: '#666',
                                                    fontSize: '13px',
                                                    fontWeight: 600,
                                                    cursor: 'pointer'
                                                }}
                                                onClick={() => setActiveModal(null)}
                                            >
                                                Close
                                            </button>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <p style={{
                                            fontSize: '14px',
                                            color: '#666',
                                            marginBottom: '16px',
                                            lineHeight: 1.5
                                        }}>
                                            Bill Approval simulation is currently active. You can stop it to remove the approval from your dashboard.
                                        </p>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                            <button
                                                style={{
                                                    width: '100%',
                                                    padding: '10px',
                                                    borderRadius: '8px',
                                                    border: 'none',
                                                    backgroundColor: '#ef4444',
                                                    color: '#fff',
                                                    fontSize: '13px',
                                                    fontWeight: 600,
                                                    cursor: 'pointer'
                                                }}
                                                onClick={() => {
                                                    onDisableBillApprovals();
                                                    setActiveModal(null);
                                                }}
                                            >
                                                Stop Simulation
                                            </button>
                                            <button
                                                style={{
                                                    width: '100%',
                                                    padding: '10px',
                                                    borderRadius: '8px',
                                                    border: '1px solid #e5e5e5',
                                                    backgroundColor: '#fff',
                                                    color: '#666',
                                                    fontSize: '13px',
                                                    fontWeight: 600,
                                                    cursor: 'pointer'
                                                }}
                                                onClick={() => setActiveModal(null)}
                                            >
                                                Close
                                            </button>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    )}

                    {/* PO Approval Modal */}
                    {activeModal === 'po' && (
                        <div style={{
                            position: 'absolute',
                            top: 'calc(100% - 10px)',
                            left: 0,
                            right: 0,
                            zIndex: 2000,
                            marginTop: '12px',
                            animation: 'fadeIn 0.2s ease-out'
                        }}>
                            <div style={{
                                backgroundColor: '#fff',
                                borderRadius: '12px',
                                padding: '16px',
                                boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
                                border: '1px solid #e5e5e5'
                            }}>
                                {!isApprovalsEnabled ? (
                                    <>
                                        <p style={{
                                            fontSize: '14px',
                                            color: '#666',
                                            marginBottom: '16px',
                                            lineHeight: 1.5
                                        }}>
                                            Enable PO Approval simulation to test the approval workflow in the mobile interface.
                                        </p>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                            <button
                                                style={{
                                                    width: '100%',
                                                    padding: '10px',
                                                    borderRadius: '8px',
                                                    border: 'none',
                                                    backgroundColor: '#10b981',
                                                    color: '#fff',
                                                    fontSize: '13px',
                                                    fontWeight: 600,
                                                    cursor: 'pointer'
                                                }}
                                                onClick={() => {
                                                    onEnableApprovals();
                                                    setActiveModal(null);
                                                    onNavigate('dashboard');
                                                }}
                                            >
                                                Start Simulation
                                            </button>
                                            <button
                                                style={{
                                                    width: '100%',
                                                    padding: '10px',
                                                    borderRadius: '8px',
                                                    border: '1px solid #e5e5e5',
                                                    backgroundColor: '#fff',
                                                    color: '#666',
                                                    fontSize: '13px',
                                                    fontWeight: 600,
                                                    cursor: 'pointer'
                                                }}
                                                onClick={() => setActiveModal(null)}
                                            >
                                                Close
                                            </button>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <p style={{
                                            fontSize: '14px',
                                            color: '#666',
                                            marginBottom: '16px',
                                            lineHeight: 1.5
                                        }}>
                                            PO Approval simulation is currently active. You can stop it to remove the approval from your dashboard.
                                        </p>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                            <button
                                                style={{
                                                    width: '100%',
                                                    padding: '10px',
                                                    borderRadius: '8px',
                                                    border: 'none',
                                                    backgroundColor: '#ef4444',
                                                    color: '#fff',
                                                    fontSize: '13px',
                                                    fontWeight: 600,
                                                    cursor: 'pointer'
                                                }}
                                                onClick={() => {
                                                    onDisableApprovals();
                                                    setActiveModal(null);
                                                }}
                                            >
                                                Stop Simulation
                                            </button>
                                            <button
                                                style={{
                                                    width: '100%',
                                                    padding: '10px',
                                                    borderRadius: '8px',
                                                    border: '1px solid #e5e5e5',
                                                    backgroundColor: '#fff',
                                                    color: '#666',
                                                    fontSize: '13px',
                                                    fontWeight: 600,
                                                    cursor: 'pointer'
                                                }}
                                                onClick={() => setActiveModal(null)}
                                            >
                                                Close
                                            </button>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Functions;
