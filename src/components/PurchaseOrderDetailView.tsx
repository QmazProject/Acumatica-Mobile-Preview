import React, { useState } from 'react';
import { X, Paperclip, MoreVertical, ArrowLeft, ArrowRight, Search, SlidersHorizontal } from 'lucide-react';
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

interface PurchaseOrderDetailViewProps {
    onBack: () => void;
    purchaseOrder: PurchaseOrderData;
}

// Line items data for the details table (2 items totaling 20,000,000.00)
const lineItemsData = [
    {
        branch: 'QMB CONSTRUCTION',
        inventoryId: 'INV008555',
        lineType: 'Non-Stock',
        warehouse: 'Dumanjug Technical Warehouse',
        lineDescription: 'Komatsu PC210-10M0 Hydraulic Excavator (HE)',
        orderQty: '1.00',
        uom: 'Unit',
        qtyOnReceipts: '1.00',
        unitCost: '10,000,000.000',
        extCost: '10,000,000.00',
        discountPercent: '0.000000',
        discountAmount: '0.00',
        discountCode: '',
        amount: '10,000,000.00',
        minReceipt: '0.00',
        maxReceipt: '100.00',
        completeOn: '100.00',
        receiptAction: 'Accept but Warn',
        taxCategory: 'PDOMESTIC',
        atcCode: '',
        account: '1900',
        accountDescription: 'Accrued Purchases - Fixed Assets',
        sub: '000-000-000-000',
        project: 'Non-Project Code.',
        projectTask: '-',
        costCode: '-',
        requested: 'Feb 11, 2026',
        promised: 'Feb 11, 2026',
        complete: true,
        cancelled: false,
        closed: false
    },
    {
        branch: 'QMB CONSTRUCTION',
        inventoryId: 'INV008556',
        lineType: 'Non-Stock',
        warehouse: 'Dumanjug Technical Warehouse',
        lineDescription: 'Komatsu PC210-10M0 Spare Parts & Accessories',
        orderQty: '1.00',
        uom: 'Lot',
        qtyOnReceipts: '1.00',
        unitCost: '10,000,000.000',
        extCost: '10,000,000.00',
        discountPercent: '0.000000',
        discountAmount: '0.00',
        discountCode: '',
        amount: '10,000,000.00',
        minReceipt: '0.00',
        maxReceipt: '100.00',
        completeOn: '100.00',
        receiptAction: 'Accept but Warn',
        taxCategory: 'PDOMESTIC',
        atcCode: '',
        account: '1900',
        accountDescription: 'Accrued Purchases - Fixed Assets',
        sub: '000-000-000-000',
        project: 'Non-Project Code.',
        projectTask: '-',
        costCode: '-',
        requested: 'Feb 11, 2026',
        promised: 'Feb 11, 2026',
        complete: true,
        cancelled: false,
        closed: false
    }
];

// Table header cell style
const thStyle: React.CSSProperties = {
    padding: '12px',
    textAlign: 'left',
    fontWeight: 600,
    color: '#000',
    borderRight: '1px solid #000',
    whiteSpace: 'nowrap',
    minWidth: '120px'
};

// Table data cell style
const tdStyle: React.CSSProperties = {
    padding: '12px',
    color: '#000',
    borderRight: '1px solid #000',
    borderBottom: '1px solid #000',
    whiteSpace: 'nowrap',
    minWidth: '120px'
};

const PurchaseOrderDetailView: React.FC<PurchaseOrderDetailViewProps> = ({ onBack, purchaseOrder }) => {
    const [activeTab, setActiveTab] = useState<'details' | 'vendor' | 'approvals' | 'taxes'>('details');
    const [showItemDetails, setShowItemDetails] = useState(false);
    const [showTaxes, setShowTaxes] = useState(false);
    const [showApprovals, setShowApprovals] = useState(false);
    const [showVendorInfo, setShowVendorInfo] = useState(false);

    const tabs = [
        { key: 'details' as const, label: 'Details' },
        { key: 'vendor' as const, label: 'Vendor/Shipping Info' },
        { key: 'approvals' as const, label: 'Approvals' },
        { key: 'taxes' as const, label: 'Taxes' },
    ];

    // Checkbox component
    const Checkbox = ({ checked }: { checked: boolean }) => (
        <div style={{
            width: '20px',
            height: '20px',
            border: '2px solid #ccc',
            borderRadius: '4px',
            backgroundColor: checked ? '#ef4444' : '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
        }}>
            {checked && (
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path d="M2 6L5 9L10 3" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
            )}
        </div>
    );

    const handleTabClick = (tabKey: 'details' | 'vendor' | 'approvals' | 'taxes') => {
        setActiveTab(tabKey);
        if (tabKey === 'details') {
            setShowItemDetails(true);
        } else if (tabKey === 'taxes') {
            setShowTaxes(true);
        } else if (tabKey === 'approvals') {
            setShowApprovals(true);
        } else if (tabKey === 'vendor') {
            setShowVendorInfo(true);
        }
    };

    const [expandedTax, setExpandedTax] = useState<number | null>(null);

    // Tax data
    const taxData = [
        {
            taxId: 'PURCHINCPDOMESTIC01',
            taxDescription: 'PURCHASE INC DOMESTIC GOODS - VAT VEND',
            taxRate: '12.000000',
            taxableAmount: '17,857,142.86',
            taxAmount: '2,142,857.14'
        },
        {
            taxId: 'PURCHINCPDOMESTIC04',
            taxDescription: 'PURCHASE INC DOMESTIC GOODS - NONVAT VEND',
            taxRate: '0.000000',
            taxableAmount: '17,857,142.86',
            taxAmount: '0.00'
        }
    ];

    return (
        <div className="dashboard-container" style={{ backgroundColor: '#fff', minHeight: '100vh', paddingBottom: '70px' }}>
            {/* Header */}
            <header style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '16px',
                borderBottom: '1px solid #f0f0f0',
                backgroundColor: '#fff',
                position: 'sticky',
                top: 0,
                zIndex: 10
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <X size={24} color="#1a1a1a" onClick={onBack} style={{ cursor: 'pointer' }} />
                    <h2 style={{ fontSize: '18px', fontWeight: 600, color: '#1a1a1a' }}>Purchase Order</h2>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <Paperclip size={22} color="#1a1a1a" style={{ cursor: 'pointer' }} />
                    <MoreVertical size={22} color="#1a1a1a" style={{ cursor: 'pointer' }} />
                </div>
            </header>

            {/* Two-Column Detail Fields */}
            <div style={{ padding: '0' }}>
                {/* Row 1: Type | Order Nbr. */}
                <div style={{ display: 'flex', borderBottom: '1px solid #f0f0f0' }}>
                    <div style={{ flex: 1, padding: '14px 16px' }}>
                        <div style={{ fontSize: '12px', color: '#888', marginBottom: '4px' }}>Type</div>
                        <div style={{ fontSize: '15px', color: '#1a1a1a' }}>{purchaseOrder.type || 'Normal'}</div>
                    </div>
                    <div style={{ flex: 1, padding: '14px 16px' }}>
                        <div style={{ fontSize: '12px', color: '#888', marginBottom: '4px' }}>Order Nbr.</div>
                        <div style={{ fontSize: '15px', color: '#1a1a1a' }}>{purchaseOrder.id}</div>
                    </div>
                </div>

                {/* Row 2: Status | Date */}
                <div style={{ display: 'flex', borderBottom: '1px solid #f0f0f0' }}>
                    <div style={{ flex: 1, padding: '14px 16px' }}>
                        <div style={{ fontSize: '12px', color: '#888', marginBottom: '4px' }}>Status</div>
                        <div style={{ fontSize: '15px', color: '#1a1a1a' }}>{purchaseOrder.status}</div>
                    </div>
                    <div style={{ flex: 1, padding: '14px 16px' }}>
                        <div style={{ fontSize: '12px', color: '#888', marginBottom: '4px' }}>Date *</div>
                        <div style={{ fontSize: '15px', color: '#1a1a1a' }}>{purchaseOrder.date}</div>
                    </div>
                </div>

                {/* Row 3: Promised On | Description */}
                <div style={{ display: 'flex', borderBottom: '1px solid #f0f0f0' }}>
                    <div style={{ flex: 1, padding: '14px 16px' }}>
                        <div style={{ fontSize: '12px', color: '#888', marginBottom: '4px' }}>Promised On</div>
                        <div style={{ fontSize: '15px', color: '#1a1a1a' }}>{purchaseOrder.promisedOn || purchaseOrder.date}</div>
                    </div>
                    <div style={{ flex: 1, padding: '14px 16px' }}>
                        <div style={{ fontSize: '12px', color: '#888', marginBottom: '4px' }}>Description</div>
                        <div style={{ fontSize: '15px', color: '#1a1a1a' }}>{purchaseOrder.description || ''}</div>
                    </div>
                </div>

                {/* Row 4: Vendor | Location */}
                <div style={{ display: 'flex', borderBottom: '1px solid #f0f0f0' }}>
                    <div style={{ flex: 1, padding: '14px 16px' }}>
                        <div style={{ fontSize: '12px', color: '#888', marginBottom: '4px' }}>Vendor *</div>
                        <div style={{ fontSize: '15px', color: '#1a1a1a' }}>{purchaseOrder.company}</div>
                    </div>
                    <div style={{ flex: 1, padding: '14px 16px' }}>
                        <div style={{ fontSize: '12px', color: '#888', marginBottom: '4px' }}>Location *</div>
                        <div style={{ fontSize: '15px', color: '#1a1a1a' }}>{purchaseOrder.location || 'Primary Location'}</div>
                    </div>
                </div>

                {/* Row 5: Owner | Currency */}
                <div style={{ display: 'flex', borderBottom: '1px solid #f0f0f0' }}>
                    <div style={{ flex: 1, padding: '14px 16px' }}>
                        <div style={{ fontSize: '12px', color: '#888', marginBottom: '4px' }}>Owner</div>
                        <div style={{ fontSize: '15px', color: '#1a1a1a' }}>{purchaseOrder.owner || ''}</div>
                    </div>
                    <div style={{ flex: 1, padding: '14px 16px' }}>
                        <div style={{ fontSize: '12px', color: '#888', marginBottom: '4px' }}>Currency *</div>
                        <div style={{ fontSize: '15px', color: '#1a1a1a' }}>{purchaseOrder.currency || 'PHP'}</div>
                    </div>
                </div>
            </div>

            {/* Divider */}
            <div style={{ height: '8px', backgroundColor: '#f0f0f0' }} />

            {/* Totals Section - Two Column */}
            <div style={{ padding: '0' }}>
                {/* Row 1: Detail Total Amount | Line Discounts */}
                <div style={{ display: 'flex', borderBottom: '1px solid #f0f0f0' }}>
                    <div style={{ flex: 1, padding: '14px 16px' }}>
                        <div style={{ fontSize: '12px', color: '#888', marginBottom: '4px' }}>Detail Total Amount</div>
                        <div style={{ fontSize: '15px', color: '#1a1a1a', fontWeight: 500 }}>{purchaseOrder.amount}</div>
                    </div>
                    <div style={{ flex: 1, padding: '14px 16px' }}>
                        <div style={{ fontSize: '12px', color: '#888', marginBottom: '4px' }}>Line Discounts</div>
                        <div style={{ fontSize: '15px', color: '#1a1a1a', fontWeight: 500 }}>0.00</div>
                    </div>
                </div>

                {/* Row 2: Document Discounts | Tax Total */}
                <div style={{ display: 'flex', borderBottom: '1px solid #f0f0f0' }}>
                    <div style={{ flex: 1, padding: '14px 16px' }}>
                        <div style={{ fontSize: '12px', color: '#888', marginBottom: '4px' }}>Document Discounts</div>
                        <div style={{ fontSize: '15px', color: '#1a1a1a', fontWeight: 500 }}>0.00</div>
                    </div>
                    <div style={{ flex: 1, padding: '14px 16px' }}>
                        <div style={{ fontSize: '12px', color: '#888', marginBottom: '4px' }}>Tax Total</div>
                        <div style={{ fontSize: '15px', color: '#1a1a1a', fontWeight: 500 }}>2,142,857.14</div>
                    </div>
                </div>

                {/* Row 3: Order Total | Shipment Mode */}
                <div style={{ display: 'flex', borderBottom: '1px solid #f0f0f0' }}>
                    <div style={{ flex: 1, padding: '14px 16px' }}>
                        <div style={{ fontSize: '12px', color: '#888', marginBottom: '4px' }}>Order Total</div>
                        <div style={{ fontSize: '15px', color: '#1a1a1a', fontWeight: 600 }}>{purchaseOrder.amount}</div>
                    </div>
                    <div style={{ flex: 1, padding: '14px 16px' }}>
                        <div style={{ fontSize: '12px', color: '#888', marginBottom: '4px' }}>Shipment Mode</div>
                        <div style={{ fontSize: '15px', color: '#1a1a1a' }}>Delivery</div>
                    </div>
                </div>
            </div>

            {/* Divider */}
            <div style={{ height: '8px', backgroundColor: '#f0f0f0' }} />

            {/* Vendor/Shipping Info Full-Screen Modal */}
            {showVendorInfo && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: '#fff',
                    zIndex: 60,
                    display: 'flex',
                    flexDirection: 'column',
                    animation: 'fadeIn 0.2s ease-out'
                }}>
                    {/* Modal Header */}
                    <div style={{
                        padding: '16px',
                        backgroundColor: '#fff',
                        borderBottom: '1px solid #e5e5e5',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px'
                    }}>
                        <ArrowLeft size={24} color="#1a1a1a" onClick={() => setShowVendorInfo(false)} style={{ cursor: 'pointer' }} />
                        <h2 style={{ fontSize: '18px', fontWeight: 600, margin: 0 }}>Vendor / Shipping Info</h2>
                    </div>

                    {/* Content */}
                    <div style={{ flex: 1, overflowY: 'auto' }}>

                        {/* VENDOR CONTACT Section */}
                        <div style={{ padding: '16px 16px 0 16px' }}>
                            <div style={{
                                fontSize: '14px',
                                fontWeight: 700,
                                color: '#166534',
                                borderBottom: '2px solid #166534',
                                paddingBottom: '6px',
                                marginBottom: '12px',
                                textTransform: 'uppercase',
                                letterSpacing: '0.5px'
                            }}>
                                Vendor Contact
                            </div>
                        </div>
                        <div style={{ padding: '0 16px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #f0f0f0' }}>
                                <span style={{ fontSize: '13px', color: '#888', minWidth: '120px' }}>Account Name</span>
                                <span style={{ fontSize: '14px', color: '#1a1a1a', fontWeight: 500, textAlign: 'right' }}>ICONIC DEALERSHIP, INC.</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #f0f0f0' }}>
                                <span style={{ fontSize: '13px', color: '#888', minWidth: '120px' }}>Attention</span>
                                <span style={{ fontSize: '14px', color: '#ccc' }}>—</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #f0f0f0' }}>
                                <span style={{ fontSize: '13px', color: '#888', minWidth: '120px' }}>Phone 1</span>
                                <span style={{ fontSize: '14px', color: '#ccc' }}>—</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #f0f0f0' }}>
                                <span style={{ fontSize: '13px', color: '#888', minWidth: '120px' }}>Email</span>
                                <span style={{ fontSize: '14px', color: '#ccc' }}>—</span>
                            </div>
                        </div>

                        {/* INFO Section */}
                        <div style={{ padding: '20px 16px 0 16px' }}>
                            <div style={{
                                fontSize: '14px',
                                fontWeight: 700,
                                color: '#166534',
                                borderBottom: '2px solid #166534',
                                paddingBottom: '6px',
                                marginBottom: '12px',
                                textTransform: 'uppercase',
                                letterSpacing: '0.5px'
                            }}>
                                Info
                            </div>
                        </div>
                        <div style={{ padding: '0 16px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #f0f0f0' }}>
                                <span style={{ fontSize: '13px', color: '#888', minWidth: '120px' }}>Terms</span>
                                <span style={{ fontSize: '14px', color: '#1a1a1a', fontWeight: 500, textAlign: 'right' }}>30D - 30 Days</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #f0f0f0' }}>
                                <span style={{ fontSize: '13px', color: '#888', minWidth: '120px' }}>Vendor Tax Zone</span>
                                <span style={{ fontSize: '14px', color: '#1a1a1a', fontWeight: 500, textAlign: 'right' }}>VAT - Vatable</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #f0f0f0' }}>
                                <span style={{ fontSize: '13px', color: '#888', minWidth: '120px' }}>Prepayment Percent</span>
                                <span style={{ fontSize: '14px', color: '#ccc' }}>—</span>
                            </div>
                        </div>

                        {/* VENDOR ADDRESS Section */}
                        <div style={{ padding: '20px 16px 0 16px' }}>
                            <div style={{
                                fontSize: '14px',
                                fontWeight: 700,
                                color: '#166534',
                                borderBottom: '2px solid #166534',
                                paddingBottom: '6px',
                                marginBottom: '12px',
                                textTransform: 'uppercase',
                                letterSpacing: '0.5px'
                            }}>
                                Vendor Address
                            </div>
                        </div>
                        <div style={{ padding: '0 16px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #f0f0f0' }}>
                                <span style={{ fontSize: '13px', color: '#888', minWidth: '120px' }}>Address Line 1</span>
                                <span style={{ fontSize: '14px', color: '#1a1a1a', fontWeight: 500, textAlign: 'right', flex: 1, marginLeft: '12px' }}>CALAJO-AN, MINGLANILLA, CEBU CITY</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #f0f0f0' }}>
                                <span style={{ fontSize: '13px', color: '#888', minWidth: '120px' }}>Address Line 2</span>
                                <span style={{ fontSize: '14px', color: '#ccc' }}>—</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #f0f0f0' }}>
                                <span style={{ fontSize: '13px', color: '#888', minWidth: '120px' }}>City</span>
                                <span style={{ fontSize: '14px', color: '#ccc' }}>—</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #f0f0f0' }}>
                                <span style={{ fontSize: '13px', color: '#888', minWidth: '120px' }}>Country</span>
                                <span style={{ fontSize: '14px', color: '#1a1a1a', fontWeight: 500, textAlign: 'right' }}>PH - Philippines</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #f0f0f0' }}>
                                <span style={{ fontSize: '13px', color: '#888', minWidth: '120px' }}>State</span>
                                <span style={{ fontSize: '14px', color: '#ccc' }}>—</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #f0f0f0' }}>
                                <span style={{ fontSize: '13px', color: '#888', minWidth: '120px' }}>Postal Code</span>
                                <span style={{ fontSize: '14px', color: '#ccc' }}>—</span>
                            </div>
                        </div>

                        {/* Divider */}
                        <div style={{ height: '8px', backgroundColor: '#f0f0f0', margin: '16px 0' }} />

                        {/* SHIP TO Section */}
                        <div style={{ padding: '0 16px' }}>
                            <div style={{
                                fontSize: '14px',
                                fontWeight: 700,
                                color: '#166534',
                                borderBottom: '2px solid #166534',
                                paddingBottom: '6px',
                                marginBottom: '12px',
                                textTransform: 'uppercase',
                                letterSpacing: '0.5px'
                            }}>
                                Ship To
                            </div>
                        </div>
                        <div style={{ padding: '0 16px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #f0f0f0' }}>
                                <span style={{ fontSize: '13px', color: '#888', minWidth: '140px' }}>Shipping Dest. Type</span>
                                <span style={{ fontSize: '14px', color: '#1a1a1a', fontWeight: 500, textAlign: 'right' }}>Branch</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #f0f0f0' }}>
                                <span style={{ fontSize: '13px', color: '#888', minWidth: '140px' }}>Ship To</span>
                                <span style={{ fontSize: '14px', color: '#1a1a1a', fontWeight: 500, textAlign: 'right', flex: 1, marginLeft: '12px' }}>QMB-CONSTR - QMB CONSTRUCTION</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #f0f0f0' }}>
                                <span style={{ fontSize: '13px', color: '#888', minWidth: '140px' }}>Shipping Location</span>
                                <span style={{ fontSize: '14px', color: '#1a1a1a', fontWeight: 500, textAlign: 'right', flex: 1, marginLeft: '12px' }}>MAIN - Primary Location</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #f0f0f0' }}>
                                <span style={{ fontSize: '13px', color: '#888', minWidth: '140px' }}>Sales Order Type</span>
                                <span style={{ fontSize: '14px', color: '#ccc' }}>—</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #f0f0f0' }}>
                                <span style={{ fontSize: '13px', color: '#888', minWidth: '140px' }}>Sales Order Nbr.</span>
                                <span style={{ fontSize: '14px', color: '#ccc' }}>—</span>
                            </div>
                        </div>

                        {/* SHIP-TO CONTACT Section */}
                        <div style={{ padding: '20px 16px 0 16px' }}>
                            <div style={{
                                fontSize: '14px',
                                fontWeight: 700,
                                color: '#166534',
                                borderBottom: '2px solid #166534',
                                paddingBottom: '6px',
                                marginBottom: '12px',
                                textTransform: 'uppercase',
                                letterSpacing: '0.5px'
                            }}>
                                Ship-To Contact
                            </div>
                        </div>
                        <div style={{ padding: '0 16px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #f0f0f0' }}>
                                <span style={{ fontSize: '13px', color: '#888', minWidth: '120px' }}>Account Name</span>
                                <span style={{ fontSize: '14px', color: '#1a1a1a', fontWeight: 500, textAlign: 'right' }}>QM BUILDERS</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #f0f0f0' }}>
                                <span style={{ fontSize: '13px', color: '#888', minWidth: '120px' }}>Attention</span>
                                <span style={{ fontSize: '14px', color: '#ccc' }}>—</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #f0f0f0' }}>
                                <span style={{ fontSize: '13px', color: '#888', minWidth: '120px' }}>Phone 1</span>
                                <span style={{ fontSize: '14px', color: '#ccc' }}>—</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #f0f0f0' }}>
                                <span style={{ fontSize: '13px', color: '#888', minWidth: '120px' }}>Email</span>
                                <span style={{ fontSize: '14px', color: '#ccc' }}>—</span>
                            </div>
                        </div>

                        {/* SHIP-TO ADDRESS Section */}
                        <div style={{ padding: '20px 16px 0 16px' }}>
                            <div style={{
                                fontSize: '14px',
                                fontWeight: 700,
                                color: '#166534',
                                borderBottom: '2px solid #166534',
                                paddingBottom: '6px',
                                marginBottom: '12px',
                                textTransform: 'uppercase',
                                letterSpacing: '0.5px'
                            }}>
                                Ship-To Address
                            </div>
                        </div>
                        <div style={{ padding: '0 16px 24px 16px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #f0f0f0' }}>
                                <span style={{ fontSize: '13px', color: '#888', minWidth: '120px' }}>Address Line 1</span>
                                <span style={{ fontSize: '14px', color: '#1a1a1a', fontWeight: 500, textAlign: 'right', flex: 1, marginLeft: '12px' }}>F. Gica St. Poblacion Central</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #f0f0f0' }}>
                                <span style={{ fontSize: '13px', color: '#888', minWidth: '120px' }}>Address Line 2</span>
                                <span style={{ fontSize: '14px', color: '#1a1a1a', fontWeight: 500, textAlign: 'right' }}>Dumanjug, Cebu</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #f0f0f0' }}>
                                <span style={{ fontSize: '13px', color: '#888', minWidth: '120px' }}>City</span>
                                <span style={{ fontSize: '14px', color: '#1a1a1a', fontWeight: 500, textAlign: 'right' }}>Cebu</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #f0f0f0' }}>
                                <span style={{ fontSize: '13px', color: '#888', minWidth: '120px' }}>Country</span>
                                <span style={{ fontSize: '14px', color: '#1a1a1a', fontWeight: 500, textAlign: 'right' }}>PH - Philippines</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #f0f0f0' }}>
                                <span style={{ fontSize: '13px', color: '#888', minWidth: '120px' }}>State</span>
                                <span style={{ fontSize: '14px', color: '#ccc' }}>—</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #f0f0f0' }}>
                                <span style={{ fontSize: '13px', color: '#888', minWidth: '120px' }}>Postal Code</span>
                                <span style={{ fontSize: '14px', color: '#1a1a1a', fontWeight: 500, textAlign: 'right' }}>6035</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Approvals Full-Screen Modal */}
            {showApprovals && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: '#fff',
                    zIndex: 60,
                    display: 'flex',
                    flexDirection: 'column',
                    animation: 'fadeIn 0.2s ease-out'
                }}>
                    {/* Modal Header */}
                    <div style={{
                        padding: '16px',
                        backgroundColor: '#fff',
                        borderBottom: '1px solid #e5e5e5',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <ArrowLeft size={24} color="#1a1a1a" onClick={() => setShowApprovals(false)} style={{ cursor: 'pointer' }} />
                            <h2 style={{ fontSize: '18px', fontWeight: 600, margin: 0 }}>Approvals</h2>
                        </div>
                        <Search size={22} color="#1a1a1a" style={{ cursor: 'pointer' }} />
                    </div>

                    {/* Sort By */}
                    <div style={{
                        padding: '12px 16px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        borderBottom: '1px solid #f0f0f0'
                    }}>
                        <span style={{ fontSize: '14px', color: '#666' }}>Sort By</span>
                        <SlidersHorizontal size={16} color="#666" />
                    </div>

                    {/* No Documents Found */}
                    <div style={{ 
                        flex: 1, 
                        display: 'flex', 
                        alignItems: 'flex-start', 
                        justifyContent: 'center',
                        paddingTop: '60px'
                    }}>
                        <span style={{ fontSize: '16px', color: '#666' }}>No documents found</span>
                    </div>
                </div>
            )}

            {/* Taxes Full-Screen Modal */}
            {showTaxes && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: '#fff',
                    zIndex: 60,
                    display: 'flex',
                    flexDirection: 'column',
                    animation: 'fadeIn 0.2s ease-out'
                }}>
                    {/* Modal Header */}
                    <div style={{
                        padding: '16px',
                        backgroundColor: '#fff',
                        borderBottom: '1px solid #e5e5e5',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <ArrowLeft size={24} color="#1a1a1a" onClick={() => setShowTaxes(false)} style={{ cursor: 'pointer' }} />
                            <h2 style={{ fontSize: '18px', fontWeight: 600, margin: 0 }}>Taxes</h2>
                        </div>
                        <Search size={22} color="#1a1a1a" style={{ cursor: 'pointer' }} />
                    </div>

                    {/* Sort By */}
                    <div style={{
                        padding: '12px 16px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        borderBottom: '1px solid #f0f0f0'
                    }}>
                        <span style={{ fontSize: '14px', color: '#666' }}>Sort By</span>
                        <SlidersHorizontal size={16} color="#666" />
                    </div>

                    {/* Tax Items List with Expandable Details */}
                    <div style={{ flex: 1, overflowY: 'auto' }}>
                        {taxData.map((tax, index) => (
                            <div key={index}>
                                {/* Tax Item Header - Clickable */}
                                <div style={{
                                    padding: '16px',
                                    borderBottom: expandedTax === index ? 'none' : '1px solid #f0f0f0',
                                    cursor: 'pointer',
                                    backgroundColor: expandedTax === index ? '#f9f9f9' : '#fff'
                                }} onClick={() => setExpandedTax(expandedTax === index ? null : index)}>
                                    <div style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'flex-start',
                                        marginBottom: '8px'
                                    }}>
                                        <div style={{
                                            fontSize: '15px',
                                            fontWeight: 600,
                                            color: '#1a1a1a',
                                            flex: 1,
                                            paddingRight: '16px',
                                            lineHeight: '1.4'
                                        }}>
                                            {tax.taxId}
                                        </div>
                                        <div style={{
                                            fontSize: '15px',
                                            color: '#1a1a1a',
                                            whiteSpace: 'nowrap'
                                        }}>
                                            {tax.taxRate}
                                        </div>
                                    </div>
                                    <div style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center'
                                    }}>
                                        <span style={{ fontSize: '14px', color: '#666' }}>{tax.taxableAmount}</span>
                                        <span style={{ fontSize: '14px', color: '#1a1a1a' }}>{tax.taxAmount}</span>
                                    </div>
                                </div>

                                {/* Expanded Tax Details */}
                                {expandedTax === index && (
                                    <div style={{ 
                                        backgroundColor: '#fef9c3',
                                        borderBottom: '1px solid #fde047',
                                        borderLeft: '4px solid #facc15'
                                    }}>
                                        <div style={{ padding: '16px', borderBottom: '1px solid #fde68a' }}>
                                            <div style={{ fontSize: '13px', color: '#713f12', marginBottom: '4px' }}>Tax ID *</div>
                                            <div style={{ fontSize: '16px', color: '#1a1a1a' }}>{tax.taxId}</div>
                                        </div>
                                        <div style={{ padding: '16px', borderBottom: '1px solid #fde68a' }}>
                                            <div style={{ fontSize: '13px', color: '#713f12', marginBottom: '4px' }}>Tax Rate</div>
                                            <div style={{ fontSize: '16px', color: '#1a1a1a' }}>{tax.taxRate}</div>
                                        </div>
                                        <div style={{ padding: '16px', borderBottom: '1px solid #fde68a' }}>
                                            <div style={{ fontSize: '13px', color: '#713f12', marginBottom: '4px' }}>Taxable Amount</div>
                                            <div style={{ fontSize: '16px', color: '#1a1a1a' }}>{tax.taxableAmount}</div>
                                        </div>
                                        <div style={{ padding: '16px' }}>
                                            <div style={{ fontSize: '13px', color: '#713f12', marginBottom: '4px' }}>Tax Amount</div>
                                            <div style={{ fontSize: '16px', color: '#1a1a1a' }}>{tax.taxAmount}</div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Item Details Full-Screen Modal */}
            {showItemDetails && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: '#f9f9f9',
                    zIndex: 60,
                    display: 'flex',
                    flexDirection: 'column',
                    animation: 'fadeIn 0.2s ease-out'
                }}>
                    {/* Modal Header */}
                    <div style={{
                        padding: '16px',
                        backgroundColor: '#fff',
                        borderBottom: '1px solid #e5e5e5',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px'
                    }}>
                        <ArrowLeft size={24} color="#1a1a1a" onClick={() => setShowItemDetails(false)} style={{ cursor: 'pointer' }} />
                        <h2 style={{ fontSize: '18px', fontWeight: 600, margin: 0 }}>Item Details</h2>
                    </div>

                    {/* Content */}
                    <div style={{ flex: 1, overflowY: 'auto', padding: '16px' }}>

                        {/* Description Section */}
                        <div style={{ marginBottom: '24px' }}>
                            <div style={{ fontSize: '13px', color: '#666', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 600 }}>Description</div>
                            <div style={{ fontSize: '15px', color: '#1a1a1a', fontWeight: 500 }}>
                                {purchaseOrder.description || 'Komatsu PC210 PART NO.23131313'}
                            </div>
                        </div>

                        {/* Items Table Section */}
                        <div style={{
                            backgroundColor: '#fff',
                            borderRadius: '8px',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                            border: '1px solid #000',
                            marginBottom: '24px',
                            overflowX: 'auto',
                            WebkitOverflowScrolling: 'touch'
                        }}>
                            <table style={{
                                borderCollapse: 'collapse',
                                fontSize: '13px',
                                minWidth: '3200px'
                            }}>
                                <thead>
                                    <tr style={{ backgroundColor: '#fff', borderBottom: '1px solid #000' }}>
                                        <th style={thStyle}>Branch *</th>
                                        <th style={thStyle}>Inventory ID</th>
                                        <th style={thStyle}>Line Type</th>
                                        <th style={{ ...thStyle, minWidth: '180px' }}>Warehouse</th>
                                        <th style={{ ...thStyle, minWidth: '280px' }}>Line Description</th>
                                        <th style={thStyle}>Order Qty.</th>
                                        <th style={thStyle}>UOM</th>
                                        <th style={thStyle}>Qty. on Receipts</th>
                                        <th style={thStyle}>Unit Cost</th>
                                        <th style={thStyle}>Ext Cost</th>
                                        <th style={thStyle}>Discount Percent</th>
                                        <th style={thStyle}>Discount Amount</th>
                                        <th style={thStyle}>Discount Code</th>
                                        <th style={thStyle}>Amount</th>
                                        <th style={thStyle}>Min. Receipt (%)</th>
                                        <th style={thStyle}>Max. Receipt (%)</th>
                                        <th style={thStyle}>Complete On (%)</th>
                                        <th style={thStyle}>Receipt Action</th>
                                        <th style={thStyle}>Tax Category</th>
                                        <th style={thStyle}>ATC Code</th>
                                        <th style={thStyle}>Account</th>
                                        <th style={{ ...thStyle, minWidth: '220px' }}>Description</th>
                                        <th style={thStyle}>Sub</th>
                                        <th style={thStyle}>Project *</th>
                                        <th style={thStyle}>Project Task</th>
                                        <th style={thStyle}>Cost Code</th>
                                        <th style={thStyle}>Requested</th>
                                        <th style={thStyle}>Promised</th>
                                        <th style={thStyle}>Complete</th>
                                        <th style={thStyle}>Cancelled</th>
                                        <th style={thStyle}>Closed</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {lineItemsData.map((item, index) => (
                                        <tr key={index}>
                                            <td style={tdStyle}>{item.branch}</td>
                                            <td style={tdStyle}>{item.inventoryId}</td>
                                            <td style={tdStyle}>{item.lineType}</td>
                                            <td style={{ ...tdStyle, minWidth: '180px' }}>{item.warehouse}</td>
                                            <td style={{ ...tdStyle, minWidth: '280px' }}>{item.lineDescription}</td>
                                            <td style={{ ...tdStyle, textAlign: 'center' }}>{item.orderQty}</td>
                                            <td style={{ ...tdStyle, textAlign: 'center' }}>{item.uom}</td>
                                            <td style={{ ...tdStyle, textAlign: 'center' }}>{item.qtyOnReceipts}</td>
                                            <td style={{ ...tdStyle, textAlign: 'right' }}>{item.unitCost}</td>
                                            <td style={{ ...tdStyle, textAlign: 'right' }}>{item.extCost}</td>
                                            <td style={{ ...tdStyle, textAlign: 'center' }}>{item.discountPercent}</td>
                                            <td style={{ ...tdStyle, textAlign: 'right' }}>{item.discountAmount}</td>
                                            <td style={tdStyle}>{item.discountCode || '-'}</td>
                                            <td style={{ ...tdStyle, textAlign: 'right' }}>{item.amount}</td>
                                            <td style={{ ...tdStyle, textAlign: 'center' }}>{item.minReceipt}</td>
                                            <td style={{ ...tdStyle, textAlign: 'center' }}>{item.maxReceipt}</td>
                                            <td style={{ ...tdStyle, textAlign: 'center' }}>{item.completeOn}</td>
                                            <td style={tdStyle}>{item.receiptAction}</td>
                                            <td style={tdStyle}>{item.taxCategory}</td>
                                            <td style={tdStyle}>{item.atcCode || '-'}</td>
                                            <td style={tdStyle}>{item.account}</td>
                                            <td style={{ ...tdStyle, minWidth: '220px' }}>{item.accountDescription}</td>
                                            <td style={tdStyle}>{item.sub}</td>
                                            <td style={tdStyle}>{item.project}</td>
                                            <td style={tdStyle}>{item.projectTask}</td>
                                            <td style={tdStyle}>{item.costCode}</td>
                                            <td style={tdStyle}>{item.requested}</td>
                                            <td style={tdStyle}>{item.promised}</td>
                                            <td style={{ ...tdStyle, textAlign: 'center' }}><Checkbox checked={item.complete} /></td>
                                            <td style={{ ...tdStyle, textAlign: 'center' }}><Checkbox checked={item.cancelled} /></td>
                                            <td style={{ ...tdStyle, textAlign: 'center' }}><Checkbox checked={item.closed} /></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Scrolling Indicators */}
                        <div style={{ display: 'flex', justifyContent: 'center', gap: '24px', marginBottom: '24px', fontSize: '12px', color: '#666' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                <ArrowLeft size={14} /> Swipe left to view back
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                Swipe right to view details <ArrowRight size={14} />
                            </div>
                        </div>

                        {/* Totals Section */}
                        <div style={{
                            backgroundColor: '#fff',
                            borderRadius: '12px',
                            padding: '16px',
                            border: '1px solid #f0f0f0'
                        }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                <span style={{ fontSize: '14px', color: '#666' }}>Gross Amount</span>
                                <span style={{ fontSize: '14px', fontWeight: 500 }}>{purchaseOrder.amount}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                                <span style={{ fontSize: '14px', color: '#666' }}>Less Discount</span>
                                <span style={{ fontSize: '14px', fontWeight: 500 }}>0.00</span>
                            </div>
                            <div style={{ height: '1px', backgroundColor: '#e5e5e5', margin: '0 -16px 12px -16px' }}></div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                                <span style={{ fontSize: '15px', fontWeight: 600, color: '#1a1a1a' }}>Net Amount</span>
                                <span style={{ fontSize: '18px', fontWeight: 700, color: '#059669' }}>{purchaseOrder.amount}</span>
                            </div>
                            <div style={{
                                fontSize: '13px',
                                color: '#555',
                                fontStyle: 'italic',
                                borderTop: '1px dashed #e5e5e5',
                                paddingTop: '8px',
                                textAlign: 'right'
                            }}>
                                Amount in words: Twenty Million Pesos Only
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Bottom Tab Buttons - Fixed */}
            <div style={{
                position: 'fixed',
                bottom: 0,
                left: '50%',
                transform: 'translateX(-50%)',
                width: '100%',
                maxWidth: '480px',
                backgroundColor: '#fff',
                borderTop: '1px solid #e5e5e5',
                display: 'flex',
                gap: '8px',
                padding: '12px 12px',
                zIndex: 40,
                boxShadow: '0 -4px 12px rgba(0,0,0,0.08)'
            }}>
                {tabs.map((tab) => (
                    <button
                        key={tab.key}
                        onClick={() => handleTabClick(tab.key)}
                        style={{
                            flex: 1,
                            padding: '12px 6px',
                            border: activeTab === tab.key ? '2px solid #dc2626' : '2px solid #ef4444',
                            borderRadius: '10px',
                            backgroundColor: activeTab === tab.key ? '#dc2626' : '#fff',
                            color: activeTab === tab.key ? '#fff' : '#ef4444',
                            fontSize: '11px',
                            fontWeight: 600,
                            cursor: 'pointer',
                            textAlign: 'center',
                            whiteSpace: 'nowrap',
                            transition: 'all 0.2s ease',
                            boxShadow: activeTab === tab.key ? '0 2px 8px rgba(220, 38, 38, 0.3)' : 'none'
                        }}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default PurchaseOrderDetailView;
