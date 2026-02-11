import { useState, useEffect } from 'react';
import Dashboard from './components/Dashboard';
import Functions from './components/Functions';
import Approvals from './components/ApprovalsComponent';
import PurchaseOrderDetails from './components/PurchaseOrderDetails';
import BillDetails from './components/BillDetails';
import Purchases from './components/Purchases';
import InstallPrompt from './components/InstallPrompt';
import { Search, Star, User } from 'lucide-react';

type AttachmentFile = { name: string; size: string; date: string; type: string; previewUrl?: string };

// Helper functions for localStorage
const getStoredState = <T,>(key: string, defaultValue: T): T => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch {
    return defaultValue;
  }
};

const setStoredState = <T,>(key: string, value: T) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Ignore localStorage errors
  }
};

function App() {
  const [view, setView] = useState<'dashboard' | 'functions' | 'approvals' | 'details' | 'billDetails' | 'prepaymentDetails' | 'purchases'>(() => 
    getStoredState('appView', 'dashboard')
  );
  const [isApprovalsVisible, setIsApprovalsVisible] = useState(() => 
    getStoredState('isApprovalsVisible', false)
  );
  const [isPurchasesEnabled, setIsPurchasesEnabled] = useState(() => 
    getStoredState('isPurchasesEnabled', false)
  );
  const [approvalType, setApprovalType] = useState<'po' | 'bill' | 'prepayment'>(() => 
    getStoredState('approvalType', 'po')
  );
  const [poStatus, setPoStatus] = useState<'pending' | 'approved'>(() => 
    getStoredState('poStatus', 'pending')
  );
  const [billStatus, setBillStatus] = useState<'pending' | 'approved'>(() => 
    getStoredState('billStatus', 'pending')
  );
  const [prepaymentStatus, setPrepaymentStatus] = useState<'pending' | 'approved'>(() => 
    getStoredState('prepaymentStatus', 'pending')
  );
  const [isHistoryView, setIsHistoryView] = useState(() => 
    getStoredState('isHistoryView', false)
  );
  const [poAttachments, setPoAttachments] = useState<AttachmentFile[]>(() => 
    getStoredState('poAttachments', [])
  );
  const [billAttachments, setBillAttachments] = useState<AttachmentFile[]>(() => 
    getStoredState('billAttachments', [])
  );
  const [prepaymentAttachments, setPrepaymentAttachments] = useState<AttachmentFile[]>(() => 
    getStoredState('prepaymentAttachments', [])
  );

  // Persist state changes to localStorage
  useEffect(() => {
    setStoredState('appView', view);
  }, [view]);

  useEffect(() => {
    setStoredState('isApprovalsVisible', isApprovalsVisible);
  }, [isApprovalsVisible]);

  useEffect(() => {
    setStoredState('approvalType', approvalType);
  }, [approvalType]);

  useEffect(() => {
    setStoredState('poStatus', poStatus);
  }, [poStatus]);

  useEffect(() => {
    setStoredState('billStatus', billStatus);
  }, [billStatus]);

  useEffect(() => {
    setStoredState('prepaymentStatus', prepaymentStatus);
  }, [prepaymentStatus]);

  useEffect(() => {
    setStoredState('isHistoryView', isHistoryView);
  }, [isHistoryView]);

  useEffect(() => {
    setStoredState('poAttachments', poAttachments);
  }, [poAttachments]);

  useEffect(() => {
    setStoredState('billAttachments', billAttachments);
  }, [billAttachments]);

  useEffect(() => {
    setStoredState('prepaymentAttachments', prepaymentAttachments);
  }, [prepaymentAttachments]);

  useEffect(() => {
    setStoredState('isPurchasesEnabled', isPurchasesEnabled);
  }, [isPurchasesEnabled]);

  const getPendingApprovalsCount = () => {
    if (!isApprovalsVisible) return 0;
    
    if (approvalType === 'po') {
      return poStatus === 'pending' ? 1 : 0;
    } else if (approvalType === 'bill') {
      return billStatus === 'pending' ? 1 : 0;
    } else if (approvalType === 'prepayment') {
      return prepaymentStatus === 'pending' ? 1 : 0;
    }
    
    return 0;
  };

  return (
    <>
      <InstallPrompt />
      {view === 'dashboard' && (
        <Dashboard
          onNavigate={(screen) => setView(screen as any)}
          showApprovals={isApprovalsVisible}
          approvalsCount={getPendingApprovalsCount()}
          isPurchasesEnabled={isPurchasesEnabled}
        />
      )}
      {view === 'functions' && (
        <Functions
          onNavigate={(screen) => setView(screen as any)}
          onEnableApprovals={() => {
            setIsApprovalsVisible(true);
            setApprovalType('po');
            setPoStatus('pending');
            setPoAttachments([]);
          }}
          onEnableBillApprovals={() => {
            setIsApprovalsVisible(true);
            setApprovalType('bill');
            setBillStatus('pending');
          }}
          onEnablePrepaymentApprovals={() => {
            setIsApprovalsVisible(true);
            setApprovalType('prepayment');
            setPrepaymentStatus('pending');
          }}
          onDisableApprovals={() => setIsApprovalsVisible(false)}
          onDisableBillApprovals={() => {
            setIsApprovalsVisible(false);
            setApprovalType('po');
          }}
          onDisablePrepaymentApprovals={() => {
            setIsApprovalsVisible(false);
            setApprovalType('po');
          }}
          onEnablePurchases={() => setIsPurchasesEnabled(true)}
          onDisablePurchases={() => setIsPurchasesEnabled(false)}
          isApprovalsEnabled={isApprovalsVisible && approvalType === 'po'}
          isBillApprovalsEnabled={isApprovalsVisible && approvalType === 'bill'}
          isPrepaymentApprovalsEnabled={isApprovalsVisible && approvalType === 'prepayment'}
          isPurchasesEnabled={isPurchasesEnabled}
        />
      )}
      {view === 'approvals' && (
        <Approvals
          onBack={() => setView('dashboard')}
          onDetails={(context) => {
            if (context?.recordType === 'bill') {
              setIsHistoryView(Boolean(context?.fromHistory));
              setView('billDetails');
              return;
            }
            if (context?.recordType === 'prepayment') {
              setIsHistoryView(Boolean(context?.fromHistory));
              setView('prepaymentDetails');
              return;
            }
            setIsHistoryView(Boolean(context?.fromHistory));
            setView('details');
          }}
          onNavigateToPO={() => {
            setPoStatus('approved');
            setIsHistoryView(false);
            setView('details');
          }}
          poStatus={poStatus}
          billStatus={billStatus}
          prepaymentStatus={prepaymentStatus}
          approvalType={approvalType}
        />
      )}
      {view === 'details' && (
        <PurchaseOrderDetails
          onBack={() => setView('approvals')}
          poStatus={poStatus}
          isHistoryView={isHistoryView}
          attachments={poAttachments}
          onAttachmentsChange={setPoAttachments}
          onApprove={() => {
            setPoStatus('approved');
            setView('approvals');
          }}
        />
      )}
      {view === 'billDetails' && (
        <BillDetails
          onBack={() => setView('approvals')}
          isHistoryView={isHistoryView}
          attachments={billAttachments}
          onAttachmentsChange={setBillAttachments}
          onNavigateToPO={() => {
            setPoStatus('approved');
            setIsHistoryView(false);
            setView('details');
          }}
          onApproveBill={() => {
            setBillStatus('approved');
            setView('approvals');
          }}
        />
      )}
      {view === 'prepaymentDetails' && (
        <BillDetails
          onBack={() => setView('approvals')}
          isHistoryView={isHistoryView}
          isPrepayment={true}
          attachments={prepaymentAttachments}
          onAttachmentsChange={setPrepaymentAttachments}
          onNavigateToPO={() => {
            setPoStatus('approved');
            setIsHistoryView(false);
            setView('details');
          }}
          onApproveBill={() => {
            setPrepaymentStatus('approved');
            setView('approvals');
          }}
        />
      )}
      {view === 'purchases' && (
        <Purchases
          onBack={() => setView('dashboard')}
        />
      )}
      {/* Changed onBack to go to 'dashboard' since 'approvals' is now entered from Dashboard */}

      {/* Bottom Nav - Hide on Approvals screen if desired, or keep sticky? Use case usually hides nav on full screen detail views or keeps it. Let's keep it but maybe it's cleaner to hide for 'Approvals' separate page feel. Let's keep it for now as it's a main nav. Actually image has back button so it might be a sub-screen. Let's hide bottom nav on approvals to match native feel or keep consistent? The image shows a full screen with back button. Let's hide bottom nav for Approvals for more real estate. */}
      {view !== 'approvals' && view !== 'details' && view !== 'billDetails' && view !== 'prepaymentDetails' && view !== 'purchases' && (
        <div style={{
          position: 'fixed',
          bottom: 0,
          left: '50%',
          transform: 'translateX(-50%)',
          width: '100%',
          maxWidth: '480px',
          backgroundColor: '#f9dcdc', /* Light pinkish background from image */
          display: 'flex',
          justifyContent: 'space-around',
          padding: '16px 0',
          zIndex: 100
        }}>
          <NavIcon
            icon="home"
            active={view === 'dashboard'}
            onClick={() => setView('dashboard')}
          />
          <NavIcon icon="search" />
          <NavIcon icon="star" />
          <NavIcon
            icon="user"
            active={view === 'functions'}
            onClick={() => setView('functions')}
          />
        </div>
      )}

    </>
  );
}

const NavIcon = ({ icon, onClick, active }: { icon: string, onClick?: () => void, active?: boolean }) => {
  /* All icons are red (#ef4444 or #d32f2f) */
  const color = "#ef4444";

  const getIcon = () => {
    switch (icon) {
      case 'home': return <img src="/Home icon.png" alt="Home" style={{ width: '28px', height: '28px' }} />;
      case 'search': return <Search size={28} color={color} strokeWidth={2.5} />;
      case 'star': return <Star size={28} color={color} strokeWidth={2.5} />;
      case 'user': return <User size={28} color={color} fill={color} />;
      default: return null;
    }
  }

  return (
    <div
      onClick={onClick}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '0 12px',
        cursor: 'pointer',
        opacity: active === false ? 0.7 : 1 /* Optional visual feedback */
      }}>
      {getIcon()}
    </div>
  );
}

export default App;
