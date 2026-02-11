import React from 'react';
import { X, Paperclip, MoreVertical, ChevronDown, ArrowLeft, ArrowRight, Search } from 'lucide-react';
import { pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';
import '@cyntler/react-doc-viewer/dist/index.css';

// Configure PDF worker
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
    'pdfjs-dist/build/pdf.worker.min.mjs',
    import.meta.url,
).toString();
import './Dashboard.css';

type AttachmentFile = { name: string; size: string; date: string; type: string; previewUrl?: string };

const WORD_EXTENSIONS = ['doc', 'docx', 'docm', 'dot', 'dotx', 'dotm', 'rtf'];

const getFileExtension = (name: string) => name.toLowerCase().split('.').pop() || '';
const isPdfFile = (file: { name: string; type: string }) => file.type.includes('pdf') || getFileExtension(file.name) === 'pdf';
const isWordFile = (file: { name: string; type: string }) => WORD_EXTENSIONS.includes(getFileExtension(file.name));
const isImageFile = (file: { name: string; type: string }) => file.type.startsWith('image/');
const isPreviewableFile = (file: { name: string; type: string }) => isImageFile(file) || isPdfFile(file) || isWordFile(file);

interface BillDetailsProps {
    onBack: () => void;
    attachments?: AttachmentFile[];
    onAttachmentsChange?: React.Dispatch<React.SetStateAction<AttachmentFile[]>>;
    isHistoryView?: boolean;
    isPrepayment?: boolean;
    onNavigateToPO?: () => void;
    onApproveBill?: () => void;
}

const SortOption: React.FC<{ label: string; onClick: () => void }> = ({ label, onClick }) => (
    <button
        onClick={onClick}
        style={{
            padding: '16px 0',
            backgroundColor: 'transparent',
            border: 'none',
            borderBottom: '1px solid #f0f0f0',
            fontSize: '15px',
            color: '#1a1a1a',
            textAlign: 'left',
            cursor: 'pointer',
            fontWeight: 400
        }}
    >
        {label}
    </button>
);

const BillDetails: React.FC<BillDetailsProps> = ({ 
    onBack, 
    isHistoryView, 
    isPrepayment, 
    onNavigateToPO, 
    onApproveBill,
    attachments = [],
    onAttachmentsChange
}) => {
    const MOBILE_FRAME_MAX_WIDTH = 480;
    const [notes, setNotes] = React.useState('');
    const [isEditingNotes, setIsEditingNotes] = React.useState(false);
    const [showNotes, setShowNotes] = React.useState(false);
    const [showDetailsModal, setShowDetailsModal] = React.useState(false);
    const [showTaxesModal, setShowTaxesModal] = React.useState(false);
    const [showSortModal, setShowSortModal] = React.useState(false);
    const [showApprovalsModal, setShowApprovalsModal] = React.useState(false);
    const [showApprovalsSortModal, setShowApprovalsSortModal] = React.useState(false);
    const [expandedTaxId, setExpandedTaxId] = React.useState<string | null>(null);
    const [expandedApprovalId, setExpandedApprovalId] = React.useState<string | null>(null);
    const [showActionsMenu, setShowActionsMenu] = React.useState(false);
    const [showAttachments, setShowAttachments] = React.useState(false);
    const [previewFile, setPreviewFile] = React.useState<{ url: string; type: string; name: string } | null>(null);
    const [showApprovalAnimation, setShowApprovalAnimation] = React.useState(false);
    const [approvalStep, setApprovalStep] = React.useState<'loading' | 'success'>('loading');
    const fileInputRef = React.useRef<HTMLInputElement>(null);
    const hasNotes = notes.trim().length > 0;

    const handleApproveNow = () => {
        setShowApprovalAnimation(true);
        setApprovalStep('loading');
        
        // Show loading for 1.5 seconds
        setTimeout(() => {
            setApprovalStep('success');
            
            // Show success for 1.5 seconds, then complete
            setTimeout(() => {
                setShowApprovalAnimation(false);
                onApproveBill?.();
            }, 1500);
        }, 1500);
    };

    const handleAttachmentClick = (file: { name: string; type: string; previewUrl?: string }) => {
        if (!file.previewUrl) return;
        if (!isPreviewableFile(file)) return;
        setPreviewFile({ url: file.previewUrl, type: file.type, name: file.name });
    };

    const handleUploadClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (files && files.length > 0 && onAttachmentsChange) {
            const fileList = Array.from(files);
            const newAttachments = fileList.map(file => ({
                name: file.name,
                size: (file.size / (1024 * 1024)).toFixed(1) + ' MB',
                date: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                type: file.type,
                previewUrl: URL.createObjectURL(file)
            }));
            onAttachmentsChange(prev => [...prev, ...newAttachments]);
        }
    };

    return (
        <div className="dashboard-container" style={{ backgroundColor: '#fff', minHeight: '100vh', position: 'relative', paddingBottom: '84px' }}>
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
                    <h2 style={{ fontSize: '18px', fontWeight: 600, color: '#1a1a1a' }}>
                        {isPrepayment ? 'Prepayment' : 'Bills and Adjustments'}
                    </h2>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    {!isHistoryView && (
                        <button
                            onClick={handleApproveNow}
                            style={{
                                backgroundColor: '#ef4444',
                                color: '#fff',
                                border: 'none',
                                borderRadius: '16px',
                                padding: '6px 10px',
                                fontSize: '12px',
                                fontWeight: 700,
                                cursor: 'pointer'
                            }}
                        >
                            Approve Now
                        </button>
                    )}
                    
                    <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                        <Paperclip
                            size={22}
                            color="#1a1a1a"
                            onClick={() => setShowAttachments(true)}
                            style={{ cursor: 'pointer' }}
                        />
                        {attachments.length > 0 && (
                            <span style={{
                                position: 'absolute',
                                top: '-6px',
                                right: '-6px',
                                backgroundColor: '#ef4444',
                                color: '#fff',
                                fontSize: '10px',
                                fontWeight: 700,
                                height: '14px',
                                minWidth: '14px',
                                borderRadius: '7px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                padding: '0 2px'
                            }}>
                                {attachments.length}
                            </span>
                        )}
                    </div>
                    
                    <div style={{ position: 'relative' }}>
                        <MoreVertical
                            size={22}
                            color="#1a1a1a"
                            style={{ cursor: 'pointer' }}
                            onClick={() => setShowActionsMenu(!showActionsMenu)}
                        />
                        {showActionsMenu && (
                            <>
                                <div
                                    style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 49 }}
                                    onClick={() => setShowActionsMenu(false)}
                                />
                                <div style={{
                                    position: 'absolute',
                                    top: '100%',
                                    right: 0,
                                    width: '200px',
                                    backgroundColor: '#fff',
                                    borderRadius: '8px',
                                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                                    zIndex: 50,
                                    marginTop: '8px',
                                    border: '1px solid #f0f0f0',
                                    overflow: 'hidden'
                                }}>
                                    <div
                                        style={{
                                            padding: '12px 16px',
                                            fontSize: '14px',
                                            color: '#333',
                                            cursor: 'pointer',
                                            backgroundColor: '#fff'
                                        }}
                                        onClick={() => {
                                            console.log('Reject clicked');
                                            setShowActionsMenu(false);
                                        }}
                                    >
                                        Reject
                                    </div>
                                    <div
                                        style={{
                                            padding: '12px 16px',
                                            fontSize: '14px',
                                            color: '#333',
                                            cursor: 'pointer',
                                            borderTop: '1px solid #f0f0f0',
                                            backgroundColor: '#fff'
                                        }}
                                        onClick={() => {
                                            console.log('Add Record to Favorites clicked');
                                            setShowActionsMenu(false);
                                        }}
                                    >
                                        Add Record to Favorites
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </header>

            <div className="details-list">
                <div style={{ display: 'flex', gap: '16px' }}>
                    <div style={{ flex: 1 }}>
                        <DetailItem label="Type:" value={isPrepayment ? "Prepayment" : "Bill"} />
                    </div>
                    <div style={{ flex: 1 }}>
                        <DetailItem label="Reference Nbr." value={isPrepayment ? "AP0000000020286" : "AP00000020285"} />
                    </div>
                </div>

                <div style={{ display: 'flex', gap: '16px' }}>
                    <div style={{ flex: 1 }}>
                        <DetailItem label="Status:" value={isHistoryView ? "Balance" : "Pending Approval"} />
                    </div>
                    <div style={{ flex: 1 }}>
                        <DetailItem label="Date*" value={isPrepayment ? "Feb 11, 2026" : "Feb 10, 2026"} />
                    </div>
                </div>

                <div style={{ display: 'flex', gap: '16px' }}>
                    <div style={{ flex: 1 }}>
                        <DetailItem label="Vendor Ref*" value="SI#2132" />
                    </div>
                    <div style={{ flex: 1 }}>
                        <DetailItem label="Description:" value={isPrepayment ? "test approval" : "test"} />
                    </div>
                </div>

                <DetailItem label="Vendor*" value={isPrepayment ? "TRUSALES CORPORATION" : "CEBU SEALTRUST AUTO SUPPLY"} />
                
                <DetailItem label="Vendor ID" value={isPrepayment ? "S0000000000740" : "S0000000000023"} />

                <div style={{ display: 'flex', gap: '16px' }}>
                    <div style={{ flex: 1 }}>
                        <DetailItem label="Currency*" value="PHP" />
                    </div>
                    <div style={{ flex: 1 }}>
                        <DetailItem label="Terms*" value="120 Days" />
                    </div>
                </div>
                <div style={{ display: 'flex', gap: '16px' }}>
                    <div style={{ flex: 1 }}>
                        <LinkDetailItem label="PO Number" value={isPrepayment ? "PO00000000008831" : "PO00000008830"} onClick={onNavigateToPO} />
                    </div>
                    <div style={{ flex: 1 }}>
                        <LinkDetailItem label="PO Receipt Nbr." value={isPrepayment ? "PR00000000011089" : "PR000000011088"} />
                    </div>
                </div>

                <DetailItem label="Amount:" value={isPrepayment ? "105,000.00" : "535.72"} />
                <div style={{
                    padding: '16px',
                    borderBottom: '1px solid #f0f0f0',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '6px'
                }}>
                    <button
                        type="button"
                        onClick={() => {
                            setShowNotes(!showNotes);
                            if (!showNotes) {
                                setIsEditingNotes(true);
                            }
                        }}
                        style={{
                            width: '100%',
                            textAlign: 'left',
                            background: hasNotes ? '#fef3c7' : 'transparent',
                            border: hasNotes ? '1px solid #fcd34d' : 'none',
                            borderRadius: hasNotes ? '8px' : 0,
                            padding: hasNotes ? '8px 10px' : 0,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            cursor: 'pointer'
                        }}
                    >
                        <span style={{ fontSize: '13px', color: hasNotes ? '#b45309' : '#888', fontWeight: hasNotes ? 700 : 400 }}>
                            Notes:{hasNotes ? ' Filled' : ''}
                        </span>
                        {hasNotes && (
                            <span style={{
                                width: '8px',
                                height: '8px',
                                borderRadius: '999px',
                                backgroundColor: '#f59e0b',
                                marginLeft: '8px',
                                marginRight: '8px'
                            }} />
                        )}
                        <ChevronDown
                            size={16}
                            color="#666"
                            style={{ transform: showNotes ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s ease' }}
                        />
                    </button>
                    {showNotes && (isEditingNotes ? (
                        <textarea
                            value={notes}
                            onChange={(event) => setNotes(event.target.value)}
                            onBlur={() => {
                                setIsEditingNotes(false);
                                setShowNotes(false);
                            }}
                            onKeyDown={(event) => {
                                if (event.key === 'Enter' && !event.shiftKey) {
                                    event.preventDefault();
                                    setIsEditingNotes(false);
                                    setShowNotes(false);
                                }
                            }}
                            autoFocus
                            rows={3}
                            placeholder="input notes here"
                            style={{
                                width: '100%',
                                border: '1px solid #e5e7eb',
                                borderRadius: '8px',
                                padding: '10px',
                                fontSize: '14px',
                                color: '#1a1a1a',
                                resize: 'vertical',
                                outline: 'none'
                            }}
                        />
                    ) : (
                        <button
                            type="button"
                            onClick={() => setIsEditingNotes(true)}
                            style={{
                                width: '100%',
                                textAlign: 'left',
                                background: 'transparent',
                                border: '1px dashed #d1d5db',
                                borderRadius: '8px',
                                padding: '10px',
                                fontSize: '15px',
                                color: '#1a1a1a',
                                cursor: 'text'
                            }}
                        >
                            {notes || 'input notes here'}
                        </button>
                    ))}
                </div>
            </div>

            <div style={{
                position: 'fixed',
                bottom: 0,
                left: '50%',
                transform: 'translateX(-50%)',
                width: '100%',
                maxWidth: `${MOBILE_FRAME_MAX_WIDTH}px`,
                backgroundColor: '#fff',
                borderTop: '1px solid #e5e5e5',
                padding: '12px 16px',
                display: 'flex',
                gap: '12px',
                zIndex: 40,
                boxShadow: '0 -2px 10px rgba(0,0,0,0.05)'
            }}>
                <button style={poFooterBtnStyle} onClick={() => setShowDetailsModal(true)}>Details</button>
                <button style={poFooterBtnStyle} onClick={() => setShowTaxesModal(true)}>Taxes</button>
                <button style={poFooterBtnStyle} onClick={() => setShowApprovalsModal(true)}>Approvals</button>
            </div>

            {showDetailsModal && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: '#f9f9f9',
                    zIndex: 60,
                    display: 'flex',
                    flexDirection: 'column'
                }}>
                    <header style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '16px',
                        backgroundColor: '#fff',
                        borderBottom: '1px solid #e5e5e5'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <X size={24} color="#1a1a1a" onClick={() => setShowDetailsModal(false)} style={{ cursor: 'pointer' }} />
                            <h2 style={{ fontSize: '18px', fontWeight: 600, margin: 0 }}>Details</h2>
                        </div>
                        <Paperclip size={22} color="#1a1a1a" style={{ cursor: 'pointer' }} />
                    </header>

                    <div style={{ flex: 1, overflowY: 'auto', padding: '16px' }}>
                        <div style={{
                            backgroundColor: '#fff',
                            borderRadius: '10px',
                            border: '1px solid #e5e7eb',
                            overflow: 'hidden'
                        }}>
                            <div style={{ overflowX: 'auto' }}>
                                <table style={{ width: 'max-content', minWidth: '1700px', borderCollapse: 'collapse' }}>
                                    <thead>
                                        <tr style={{ backgroundColor: '#f3f4f6' }}>
                                            <th style={tableHeaderCellStyle}>Branch*</th>
                                            <th style={tableHeaderCellStyle}>Inventory ID</th>
                                            <th style={tableHeaderCellStyle}>Transaction Descr.</th>
                                            <th style={tableHeaderCellStyle}>Qty</th>
                                            <th style={tableHeaderCellStyle}>UOM</th>
                                            <th style={tableHeaderCellStyle}>Unit Cost</th>
                                            <th style={tableHeaderCellStyle}>Discount Amount</th>
                                            <th style={tableHeaderCellStyle}>Project*</th>
                                            <th style={tableHeaderCellStyle}>Project Task</th>
                                            <th style={tableHeaderCellStyle}>Cost Code</th>
                                            <th style={tableHeaderCellStyle}>Tax Category</th>
                                            <th style={tableHeaderCellStyle}>PO Number</th>
                                            <th style={tableHeaderCellStyle}>PO Receipt Nbr.</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td style={tableBodyCellStyle}>ADC CONSTRUCTION</td>
                                            <td style={tableBodyCellStyle}>INV012642</td>
                                            <td style={tableBodyCellStyle}>Alternator Assy 6M60</td>
                                            <td style={tableBodyCellStyle}>10</td>
                                            <td style={tableBodyCellStyle}>PCS</td>
                                            <td style={tableBodyCellStyle}>10,500.000</td>
                                            <td style={tableBodyCellStyle}>0.00</td>
                                            <td style={tableBodyCellStyle}>25HO0135</td>
                                            <td style={tableBodyCellStyle}>A.1.1(6)</td>
                                            <td style={tableBodyCellStyle}>000-000</td>
                                            <td style={tableBodyCellStyle}>PDOMESTIC</td>
                                            <td style={tableBodyCellStyle}>{isPrepayment ? "PO00000000008831" : "PO0000008830"}</td>
                                            <td style={tableBodyCellStyle}>{isPrepayment ? "PR00000000011089" : "PR00000011088"}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Scrolling Indicators */}
                        <div style={{ display: 'flex', justifyContent: 'center', gap: '24px', marginTop: '24px', fontSize: '12px', color: '#666' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                <ArrowLeft size={14} /> Swipe left to view back
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                Swipe right to view details <ArrowRight size={14} />
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Taxes/Discounts Modal */}
            {showTaxesModal && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: '#fff',
                    zIndex: 60,
                    display: 'flex',
                    flexDirection: 'column'
                }}>
                    <header style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '16px',
                        backgroundColor: '#fff',
                        borderBottom: '1px solid #e5e5e5'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <ArrowLeft size={24} color="#1a1a1a" onClick={() => setShowTaxesModal(false)} style={{ cursor: 'pointer' }} />
                            <h2 style={{ fontSize: '18px', fontWeight: 600, margin: 0 }}>Taxes</h2>
                        </div>
                        <Search size={22} color="#1a1a1a" style={{ cursor: 'pointer' }} />
                    </header>

                    <div style={{ flex: 1, overflowY: 'auto', backgroundColor: '#fff', position: 'relative' }}>
                        {/* Sort By */}
                        <button
                            onClick={() => setShowSortModal(true)}
                            style={{
                                width: '100%',
                                padding: '16px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                color: '#666',
                                fontSize: '14px',
                                backgroundColor: 'transparent',
                                border: 'none',
                                borderBottom: '1px solid #f0f0f0',
                                cursor: 'pointer',
                                textAlign: 'left'
                            }}
                        >
                            <span>Sort By</span>
                            <MoreVertical size={16} color="#666" style={{ transform: 'rotate(90deg)' }} />
                        </button>

                        {/* Tax Items List */}
                        <div>
                            <TaxItem
                                category="PURCHINCPDOMESTIC01"
                                leftAmount="478.32"
                                rightTop="12.000000"
                                rightBottom="57.40"
                                isExpanded={expandedTaxId === "PURCHINCPDOMESTIC01"}
                                onToggle={() => setExpandedTaxId(expandedTaxId === "PURCHINCPDOMESTIC01" ? null : "PURCHINCPDOMESTIC01")}
                            />
                            <TaxItem
                                category="PURCHINCPDOMESTIC04"
                                leftAmount="478.32"
                                rightTop="0.000000"
                                rightBottom="0.00"
                                isExpanded={expandedTaxId === "PURCHINCPDOMESTIC04"}
                                onToggle={() => setExpandedTaxId(expandedTaxId === "PURCHINCPDOMESTIC04" ? null : "PURCHINCPDOMESTIC04")}
                            />
                        </div>

                        {/* Sort By Bottom Sheet Modal */}
                        {showSortModal && (
                            <>
                                {/* Backdrop */}
                                <div
                                    style={{
                                        position: 'fixed',
                                        top: 0,
                                        left: 0,
                                        right: 0,
                                        bottom: 0,
                                        backgroundColor: 'rgba(0,0,0,0.5)',
                                        zIndex: 70
                                    }}
                                    onClick={() => setShowSortModal(false)}
                                />

                                {/* Bottom Sheet */}
                                <div style={{
                                    position: 'fixed',
                                    bottom: 0,
                                    left: 0,
                                    right: 0,
                                    backgroundColor: '#fff',
                                    borderRadius: '16px 16px 0 0',
                                    padding: '20px',
                                    zIndex: 80,
                                    boxShadow: '0 -4px 12px rgba(0,0,0,0.1)',
                                    animation: 'slideUp 0.3s ease-out'
                                }}>
                                    {/* Header */}
                                    <div style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        marginBottom: '20px'
                                    }}>
                                        <h3 style={{ fontSize: '18px', fontWeight: 600, margin: 0, color: '#1a1a1a' }}>Sort By</h3>
                                        <button
                                            onClick={() => setShowSortModal(false)}
                                            style={{
                                                backgroundColor: 'transparent',
                                                border: 'none',
                                                color: '#2563eb',
                                                fontSize: '15px',
                                                fontWeight: 600,
                                                cursor: 'pointer',
                                                padding: 0
                                            }}
                                        >
                                            RESET
                                        </button>
                                    </div>

                                    {/* Sort Options */}
                                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                                        <SortOption label="Tax ID" onClick={() => setShowSortModal(false)} />
                                        <SortOption label="Tax Rate" onClick={() => setShowSortModal(false)} />
                                        <SortOption label="Taxable Amount" onClick={() => setShowSortModal(false)} />
                                        <SortOption label="Tax Amount" onClick={() => setShowSortModal(false)} />
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}

            {/* Approvals Modal */}
            {showApprovalsModal && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: '#fff',
                    zIndex: 60,
                    display: 'flex',
                    flexDirection: 'column'
                }}>
                    <header style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '16px',
                        backgroundColor: '#fff',
                        borderBottom: '1px solid #e5e5e5'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <ArrowLeft size={24} color="#1a1a1a" onClick={() => setShowApprovalsModal(false)} style={{ cursor: 'pointer' }} />
                            <h2 style={{ fontSize: '18px', fontWeight: 600, margin: 0 }}>Approvals</h2>
                        </div>
                        <Search size={22} color="#1a1a1a" style={{ cursor: 'pointer' }} />
                    </header>

                    <div style={{ flex: 1, overflowY: 'auto', backgroundColor: '#fff', position: 'relative' }}>
                        {/* Sort By */}
                        <button
                            onClick={() => setShowApprovalsSortModal(true)}
                            style={{
                                width: '100%',
                                padding: '16px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                color: '#666',
                                fontSize: '14px',
                                backgroundColor: 'transparent',
                                border: 'none',
                                borderBottom: '1px solid #f0f0f0',
                                cursor: 'pointer',
                                textAlign: 'left'
                            }}
                        >
                            <span>Sort By</span>
                            <MoreVertical size={16} color="#666" style={{ transform: 'rotate(90deg)' }} />
                        </button>

                        {/* Approvals List */}
                        <div>
                            <ApprovalItem
                                name="Jennylyn Calago"
                                status="Approved"
                                date="Feb 10, 2026"
                                isExpanded={expandedApprovalId === "jennylyn"}
                                onToggle={() => setExpandedApprovalId(expandedApprovalId === "jennylyn" ? null : "jennylyn")}
                                approvalDate="Feb 10, 2026"
                                workgroup=""
                                approvedBy="Jennylyn Calago"
                            />
                            <ApprovalItem
                                name="Allan Quirante"
                                status={isHistoryView ? "Approved" : "Pending for Approval"}
                                date={isHistoryView ? "Feb 10, 2026" : "--/--/---"}
                                isExpanded={expandedApprovalId === "allan"}
                                onToggle={() => setExpandedApprovalId(expandedApprovalId === "allan" ? null : "allan")}
                                approvalDate={isHistoryView ? "Feb 10, 2026" : ""}
                                workgroup=""
                                approvedBy={isHistoryView ? "Allan Quirante" : ""}
                            />
                        </div>

                        {/* Sort By Bottom Sheet Modal for Approvals */}
                        {showApprovalsSortModal && (
                            <>
                                {/* Backdrop */}
                                <div
                                    style={{
                                        position: 'fixed',
                                        top: 0,
                                        left: 0,
                                        right: 0,
                                        bottom: 0,
                                        backgroundColor: 'rgba(0,0,0,0.5)',
                                        zIndex: 70
                                    }}
                                    onClick={() => setShowApprovalsSortModal(false)}
                                />

                                {/* Bottom Sheet */}
                                <div style={{
                                    position: 'fixed',
                                    bottom: 0,
                                    left: 0,
                                    right: 0,
                                    backgroundColor: '#fff',
                                    borderRadius: '16px 16px 0 0',
                                    padding: '20px',
                                    zIndex: 80,
                                    boxShadow: '0 -4px 12px rgba(0,0,0,0.1)',
                                    animation: 'slideUp 0.3s ease-out'
                                }}>
                                    {/* Header */}
                                    <div style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        marginBottom: '20px'
                                    }}>
                                        <h3 style={{ fontSize: '18px', fontWeight: 600, margin: 0, color: '#1a1a1a' }}>Sort By</h3>
                                        <button
                                            onClick={() => setShowApprovalsSortModal(false)}
                                            style={{
                                                backgroundColor: 'transparent',
                                                border: 'none',
                                                color: '#2563eb',
                                                fontSize: '15px',
                                                fontWeight: 600,
                                                cursor: 'pointer',
                                                padding: 0
                                            }}
                                        >
                                            RESET
                                        </button>
                                    </div>

                                    {/* Sort Options */}
                                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                                        <SortOption label="Name" onClick={() => setShowApprovalsSortModal(false)} />
                                        <SortOption label="Status" onClick={() => setShowApprovalsSortModal(false)} />
                                        <SortOption label="Date" onClick={() => setShowApprovalsSortModal(false)} />
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}

            {/* Approval Animation Modal */}
            {showApprovalAnimation && (
                <>
                    <div
                        style={{
                            position: 'fixed',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            backgroundColor: 'rgba(0,0,0,0.6)',
                            zIndex: 90,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                    >
                        <div
                            style={{
                                backgroundColor: '#fff',
                                borderRadius: '16px',
                                padding: '40px',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                gap: '20px',
                                minWidth: '200px'
                            }}
                        >
                            {approvalStep === 'loading' ? (
                                <>
                                    <div style={{
                                        width: '60px',
                                        height: '60px',
                                        border: '4px solid #f3f4f6',
                                        borderTop: '4px solid #ef4444',
                                        borderRadius: '50%',
                                        animation: 'spin 1s linear infinite'
                                    }} />
                                    <div style={{ fontSize: '16px', fontWeight: 600, color: '#1a1a1a' }}>
                                        Approving...
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div style={{
                                        width: '60px',
                                        height: '60px',
                                        borderRadius: '50%',
                                        backgroundColor: '#10b981',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        animation: 'scaleIn 0.3s ease-out'
                                    }}>
                                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                            <polyline points="20 6 9 17 4 12" />
                                        </svg>
                                    </div>
                                    <div style={{ fontSize: '16px', fontWeight: 600, color: '#10b981' }}>
                                        Approved Successfully!
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                    <style>{`
                        @keyframes spin {
                            from { transform: rotate(0deg); }
                            to { transform: rotate(360deg); }
                        }
                        @keyframes scaleIn {
                            from { transform: scale(0); }
                            to { transform: scale(1); }
                        }
                    `}</style>
                </>
            )}

            {/* Attachments Bottom Sheet Modal */}
            {showAttachments && (
                <>
                    {/* Backdrop */}
                    <div
                        style={{
                            position: 'fixed',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            backgroundColor: 'rgba(0,0,0,0.5)',
                            zIndex: 50
                        }}
                        onClick={() => setShowAttachments(false)}
                    />

                    {/* Bottom Sheet */}
                    <div style={{
                        position: 'fixed',
                        bottom: 0,
                        left: 0,
                        right: 0,
                        backgroundColor: '#fff',
                        borderRadius: '16px 16px 0 0',
                        padding: '20px',
                        zIndex: 60,
                        boxShadow: '0 -4px 12px rgba(0,0,0,0.1)',
                        maxHeight: '80vh',
                        display: 'flex',
                        flexDirection: 'column',
                        animation: 'slideUp 0.3s ease-out'
                    }}>
                        {/* Sheet Header */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                            <h3 style={{ fontSize: '18px', margin: 0 }}>Attachments {attachments.length > 0 && <span style={{ color: '#666' }}>{attachments.length}</span>}</h3>
                            <div style={{ display: 'flex', gap: '16px' }}>
                                <MoreVertical size={20} color="#666" />
                            </div>
                        </div>

                        {/* Content Area */}
                        <div style={{ flex: 1, overflowY: 'auto', marginBottom: '20px' }}>
                            {attachments.length === 0 ? (
                                /* Empty State */
                                <div style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '16px',
                                    padding: '40px 0'
                                }}>
                                    <div style={{
                                        width: '64px',
                                        height: '80px',
                                        border: '2px dashed #ccc',
                                        borderRadius: '8px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}>
                                        <Paperclip size={32} color="#ccc" />
                                    </div>
                                    <span style={{ color: '#888', fontSize: '14px' }}>Select existing file or use camera</span>
                                </div>
                            ) : (
                                /* Attachments Grid */
                                <div style={{
                                    display: 'grid',
                                    gridTemplateColumns: 'repeat(2, 1fr)',
                                    gap: '12px'
                                }}>
                                    {attachments.map((file, index) => (
                                        <div key={index}
                                            onClick={() => handleAttachmentClick(file)}
                                            style={{
                                                cursor: 'pointer',
                                                border: '1px solid #e5e5e5',
                                                borderRadius: '12px',
                                                padding: '12px',
                                                display: 'flex',
                                                flexDirection: 'column',
                                                justifyContent: 'space-between',
                                                textAlign: 'left',
                                                aspectRatio: '0.85',
                                                backgroundColor: '#fff',
                                                position: 'relative',
                                                overflow: 'hidden'
                                            }}>
                                            {/* Top area with Preview or Icon */}
                                            <div style={{
                                                flex: 1,
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                marginBottom: '12px',
                                                overflow: 'hidden',
                                                width: '100%'
                                            }}>
                                                {file.type.startsWith('image/') && file.previewUrl ? (
                                                    <img
                                                        src={file.previewUrl}
                                                        alt={file.name}
                                                        style={{
                                                            width: '100%',
                                                            height: '100%',
                                                            objectFit: 'contain',
                                                            borderRadius: '4px'
                                                        }}
                                                    />
                                                ) : file.type.includes('pdf') ? (
                                                    <div style={{
                                                        width: '56px',
                                                        height: '68px',
                                                        borderRadius: '10px',
                                                        backgroundColor: '#fee2e2',
                                                        border: '1px solid #fca5a5',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        position: 'relative'
                                                    }}>
                                                        <Paperclip size={30} color="#dc2626" strokeWidth={2} />
                                                        <span style={{
                                                            position: 'absolute',
                                                            bottom: '-8px',
                                                            backgroundColor: '#dc2626',
                                                            color: '#fff',
                                                            fontSize: '9px',
                                                            fontWeight: 700,
                                                            borderRadius: '8px',
                                                            padding: '1px 6px',
                                                            letterSpacing: '0.4px'
                                                        }}>
                                                            PDF
                                                        </span>
                                                    </div>
                                                ) : (file.name.endsWith('.doc') || file.name.endsWith('.docx')) ? (
                                                    <div style={{
                                                        width: '56px',
                                                        height: '68px',
                                                        borderRadius: '10px',
                                                        backgroundColor: '#dbeafe',
                                                        border: '1px solid #93c5fd',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        position: 'relative'
                                                    }}>
                                                        <Paperclip size={30} color="#1d4ed8" strokeWidth={2} />
                                                        <span style={{
                                                            position: 'absolute',
                                                            bottom: '-8px',
                                                            backgroundColor: '#1d4ed8',
                                                            color: '#fff',
                                                            fontSize: '10px',
                                                            fontWeight: 700,
                                                            borderRadius: '8px',
                                                            padding: '1px 8px',
                                                            letterSpacing: '0.4px'
                                                        }}>
                                                            W
                                                        </span>
                                                    </div>
                                                ) : (
                                                    <Paperclip size={42} color="#6b7280" strokeWidth={1.5} />
                                                )}
                                            </div>

                                            {/* Bottom area with text */}
                                            <div style={{ width: '100%' }}>
                                                <div style={{
                                                    fontSize: '13px',
                                                    fontWeight: 500,
                                                    color: '#1a1a1a',
                                                    whiteSpace: 'nowrap',
                                                    overflow: 'hidden',
                                                    textOverflow: 'ellipsis',
                                                    marginBottom: '4px'
                                                }}>
                                                    {file.name}
                                                </div>
                                                <div style={{ fontSize: '11px', color: '#666' }}>
                                                    {file.size}, {file.date}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Actions */}
                        <div style={{ display: 'flex', gap: '16px' }}>
                            <input
                                type="file"
                                ref={fileInputRef}
                                style={{ display: 'none' }}
                                onChange={handleFileChange}
                                accept="image/*,.pdf,.doc,.docx,.docm,.dot,.dotx,.dotm,.rtf,.txt"
                                multiple
                            />
                            <button 
                                onClick={handleUploadClick}
                                style={{
                                    flex: 1,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '8px',
                                    backgroundColor: '#dbeafe',
                                    color: '#000',
                                    padding: '12px',
                                    borderRadius: '24px',
                                    border: 'none',
                                    fontSize: '15px',
                                    fontWeight: 500,
                                    cursor: 'pointer'
                                }}
                            >
                                <ArrowLeft size={18} style={{ transform: 'rotate(-90deg)' }} /> Upload
                            </button>
                            <button style={{
                                flex: 1,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '8px',
                                backgroundColor: '#dbeafe',
                                color: '#000',
                                padding: '12px',
                                borderRadius: '24px',
                                border: 'none',
                                fontSize: '15px',
                                fontWeight: 500,
                                cursor: 'pointer'
                            }}>
                                <Search size={18} /> Camera
                            </button>
                        </div>
                    </div>
                </>
            )}

            {/* Full Screen File Preview Overlay */}
            {previewFile && (
                <div
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: '#fff',
                        zIndex: 100,
                        display: 'flex',
                        flexDirection: 'column',
                    }}
                    onClick={() => setPreviewFile(null)}
                >
                    {/* Header */}
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '12px 16px',
                        backgroundColor: '#fff',
                        borderBottom: '1px solid #e0e0e0',
                        color: '#1a1a1a',
                        height: '56px',
                        boxSizing: 'border-box'
                    }} onClick={e => e.stopPropagation()}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flex: 1, overflow: 'hidden' }}>
                            <ArrowLeft size={24} color="#1a1a1a" onClick={() => setPreviewFile(null)} style={{ cursor: 'pointer' }} />
                            <span style={{
                                fontSize: '18px',
                                fontWeight: 500,
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis'
                            }}>
                                {previewFile.name}
                            </span>
                        </div>
                        <div style={{ display: 'flex', gap: '16px' }}>
                            <MoreVertical size={24} color="#1a1a1a" />
                        </div>
                    </div>

                    {/* Content Container */}
                    <div style={{
                        flex: 1,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        overflow: 'auto',
                        backgroundColor: '#f5f5f5',
                        position: 'relative'
                    }}>
                        {isImageFile(previewFile) ? (
                            <img
                                src={previewFile.url}
                                alt="Preview"
                                style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
                                onClick={(e) => e.stopPropagation()}
                            />
                        ) : isPdfFile(previewFile) ? (
                            <div style={{
                                width: '100%',
                                height: '100%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                padding: '20px'
                            }} onClick={(e) => e.stopPropagation()}>
                                <div style={{
                                    textAlign: 'center',
                                    color: '#666'
                                }}>
                                    <Paperclip size={64} color="#dc2626" style={{ marginBottom: '16px' }} />
                                    <div style={{ fontSize: '16px', fontWeight: 500, marginBottom: '8px' }}>PDF Document</div>
                                    <div style={{ fontSize: '14px' }}>{previewFile.name}</div>
                                    <div style={{ fontSize: '12px', marginTop: '16px', color: '#999' }}>
                                        PDF preview not available in this view
                                    </div>
                                </div>
                            </div>
                        ) : null}
                    </div>
                </div>
            )}
        </div>
    );
};

const poFooterBtnStyle: React.CSSProperties = {
    flex: 1,
    padding: '12px',
    borderRadius: '8px',
    border: 'none',
    backgroundColor: '#f46464ff',
    color: '#1f2937',
    fontSize: '13px',
    fontWeight: 600,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    whiteSpace: 'normal',
    lineHeight: 1.2
};

const DetailItem: React.FC<{ label: string; value: string }> = ({ label, value }) => (
    <div style={{
        padding: '16px',
        borderBottom: '1px solid #f0f0f0',
        display: 'flex',
        flexDirection: 'column',
        gap: '4px'
    }}>
        <div style={{ fontSize: '13px', color: '#888' }}>{label}</div>
        <div style={{ fontSize: '15px', color: '#1a1a1a' }}>{value}</div>
    </div>
);

const LinkDetailItem: React.FC<{ label: string; value: string; onClick?: () => void }> = ({ label, value, onClick }) => (
    <div style={{
        padding: '16px',
        borderBottom: '1px solid #f0f0f0',
        display: 'flex',
        flexDirection: 'column',
        gap: '4px'
    }}>
        <div style={{ fontSize: '13px', color: '#888' }}>{label}</div>
        <div 
            style={{ 
                fontSize: '15px', 
                color: '#2563eb', 
                textDecoration: 'underline',
                cursor: onClick ? 'pointer' : 'default'
            }}
            onClick={onClick}
        >
            {value}
        </div>
    </div>
);

const tableHeaderCellStyle: React.CSSProperties = {
    borderBottom: '1px solid #d1d5db',
    borderRight: '1px solid #e5e7eb',
    padding: '10px 12px',
    fontSize: '12px',
    fontWeight: 700,
    color: '#374151',
    textAlign: 'left',
    whiteSpace: 'nowrap'
};

const tableBodyCellStyle: React.CSSProperties = {
    borderBottom: '1px solid #e5e7eb',
    borderRight: '1px solid #f3f4f6',
    padding: '10px 12px',
    fontSize: '13px',
    color: '#1f2937',
    whiteSpace: 'nowrap'
};

const ApprovalItem: React.FC<{ 
    name: string; 
    status: string; 
    date: string;
    isExpanded: boolean;
    onToggle: () => void;
    approvalDate: string;
    workgroup: string;
    approvedBy: string;
}> = ({ 
    name, 
    status, 
    date,
    isExpanded,
    onToggle,
    approvalDate,
    workgroup,
    approvedBy
}) => (
    <div style={{ borderBottom: '1px solid #f0f0f0' }}>
        {/* Clickable Header */}
        <button
            onClick={onToggle}
            style={{
                width: '100%',
                padding: '16px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                backgroundColor: 'transparent',
                border: 'none',
                cursor: 'pointer',
                textAlign: 'left'
            }}
        >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <div style={{ fontSize: '15px', fontWeight: 500, color: '#1a1a1a' }}>{name}</div>
                <div style={{ fontSize: '14px', color: '#666' }}>{status}</div>
            </div>
            <div style={{ fontSize: '14px', color: '#666' }}>{date}</div>
        </button>

        {/* Expanded Details */}
        {isExpanded && (
            <div style={{
                padding: '16px',
                backgroundColor: '#f9fafb',
                borderTop: '1px solid #e5e7eb'
            }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ fontSize: '14px', color: '#666' }}>Assigned To</span>
                        <span style={{ fontSize: '14px', fontWeight: 500, color: '#1a1a1a' }}>{name}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ fontSize: '14px', color: '#666' }}>Status</span>
                        <span style={{ fontSize: '14px', fontWeight: 500, color: '#1a1a1a' }}>{status}</span>
                    </div>
                    {approvalDate && (
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span style={{ fontSize: '14px', color: '#666' }}>Approval Date</span>
                            <span style={{ fontSize: '14px', fontWeight: 500, color: '#1a1a1a' }}>{approvalDate}</span>
                        </div>
                    )}
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ fontSize: '14px', color: '#666' }}>Workgroup</span>
                        <span style={{ fontSize: '14px', fontWeight: 500, color: '#1a1a1a' }}>{workgroup || '-'}</span>
                    </div>
                    {approvedBy && (
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span style={{ fontSize: '14px', color: '#666' }}>Approved By</span>
                            <span style={{ fontSize: '14px', fontWeight: 500, color: '#1a1a1a' }}>{approvedBy}</span>
                        </div>
                    )}
                </div>
            </div>
        )}
    </div>
);

const TaxItem: React.FC<{ 
    category: string; 
    leftAmount: string; 
    rightTop: string; 
    rightBottom: string;
    isExpanded: boolean;
    onToggle: () => void;
}> = ({ 
    category, 
    leftAmount, 
    rightTop, 
    rightBottom,
    isExpanded,
    onToggle
}) => (
    <div style={{ borderBottom: '1px solid #f0f0f0' }}>
        {/* Clickable Header */}
        <button
            onClick={onToggle}
            style={{
                width: '100%',
                padding: '16px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                backgroundColor: 'transparent',
                border: 'none',
                cursor: 'pointer',
                textAlign: 'left'
            }}
        >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <div style={{ fontSize: '15px', fontWeight: 500, color: '#1a1a1a' }}>{category}</div>
                <div style={{ fontSize: '14px', color: '#666' }}>{leftAmount}</div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', alignItems: 'flex-end' }}>
                <div style={{ fontSize: '15px', fontWeight: 500, color: '#1a1a1a' }}>{rightTop}</div>
                <div style={{ fontSize: '14px', color: '#666' }}>{rightBottom}</div>
            </div>
        </button>

        {/* Expanded Details */}
        {isExpanded && (
            <div style={{
                padding: '16px',
                backgroundColor: '#f9fafb',
                borderTop: '1px solid #e5e7eb'
            }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ fontSize: '14px', color: '#666' }}>Tax ID*</span>
                        <span style={{ fontSize: '14px', fontWeight: 500, color: '#1a1a1a' }}>{category}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ fontSize: '14px', color: '#666' }}>Tax Rate</span>
                        <span style={{ fontSize: '14px', fontWeight: 500, color: '#1a1a1a' }}>{rightTop}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ fontSize: '14px', color: '#666' }}>Taxable Amount</span>
                        <span style={{ fontSize: '14px', fontWeight: 500, color: '#1a1a1a' }}>{leftAmount}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ fontSize: '14px', color: '#666' }}>Tax Amount</span>
                        <span style={{ fontSize: '14px', fontWeight: 500, color: '#1a1a1a' }}>{rightBottom}</span>
                    </div>
                </div>
            </div>
        )}
    </div>
);

export default BillDetails;
