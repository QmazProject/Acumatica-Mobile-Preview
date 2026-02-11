import React, { useState, useEffect } from 'react';
import { X, Paperclip, MoreVertical, ChevronDown, LayoutGrid, ArrowUpDown, File, Upload, Camera, ArrowLeft, Share2, ArrowRight } from 'lucide-react';
import { renderAsync } from 'docx-preview';
import { Document, Page, pdfjs } from 'react-pdf';
import { Loader2 } from 'lucide-react';
import DocViewer, { DocViewerRenderers } from '@cyntler/react-doc-viewer';
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
type PreviewFile = { url: string; type: string; name: string };

const WORD_EXTENSIONS = ['doc', 'docx', 'docm', 'dot', 'dotx', 'dotm', 'rtf'];

const getFileExtension = (name: string) => name.toLowerCase().split('.').pop() || '';
const isPdfFile = (file: { name: string; type: string }) => file.type.includes('pdf') || getFileExtension(file.name) === 'pdf';
const isWordFile = (file: { name: string; type: string }) => WORD_EXTENSIONS.includes(getFileExtension(file.name));
const isImageFile = (file: { name: string; type: string }) => file.type.startsWith('image/');
const isPreviewableFile = (file: { name: string; type: string }) => isImageFile(file) || isPdfFile(file) || isWordFile(file);

interface PurchaseOrderDetailsProps {
    onBack: () => void;
    poStatus: 'pending' | 'approved';
    isHistoryView: boolean;
    attachments: AttachmentFile[];
    onAttachmentsChange: React.Dispatch<React.SetStateAction<AttachmentFile[]>>;
    onApprove: () => void;
}

const PurchaseOrderDetails: React.FC<PurchaseOrderDetailsProps> = ({
    onBack,
    poStatus,
    isHistoryView,
    attachments,
    onAttachmentsChange,
    onApprove
}) => {
    const MOBILE_FRAME_MAX_WIDTH = 480;
    const isApprovedView = poStatus === 'approved' || isHistoryView;
    const [showAttachments, setShowAttachments] = useState(false);
    const [previewFile, setPreviewFile] = useState<PreviewFile | null>(null);
    const [showItemDetails, setShowItemDetails] = useState(false);
    const [showSignatories, setShowSignatories] = useState(false);
    const [showActionsMenu, setShowActionsMenu] = useState(false);
    const [showPrintablePO, setShowPrintablePO] = useState(false);
    const [showApproveModal, setShowApproveModal] = useState(false);
    const [showApprovalAnimation, setShowApprovalAnimation] = useState(false);
    const [approvalStep, setApprovalStep] = useState<'loading' | 'success'>('loading');
    const fileInputRef = React.useRef<HTMLInputElement>(null);

    const handleUploadClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (files && files.length > 0) {
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

    const handleAttachmentClick = (file: { name: string; type: string; previewUrl?: string }) => {
        if (!file.previewUrl) return;
        if (!isPreviewableFile(file)) return;
        setPreviewFile({ url: file.previewUrl, type: file.type, name: file.name });
    };

    const handleApproveNow = () => {
        setShowApprovalAnimation(true);
        setApprovalStep('loading');
        
        // Show loading for 1.5 seconds
        setTimeout(() => {
            setApprovalStep('success');
            
            // Show success for 1.5 seconds, then complete
            setTimeout(() => {
                setShowApprovalAnimation(false);
                onApprove();
            }, 1500);
        }, 1500);
    };

    return (
        <div className="dashboard-container" style={{ backgroundColor: '#fff', minHeight: '100vh', position: 'relative', paddingBottom: '80px' }}>
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
                    {!isApprovedView && (
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
                                    {(
                                        isApprovedView
                                            ? [
                                                { label: 'View Printable PO' },
                                                { label: 'Add Record to Favorites', separator: true }
                                            ]
                                            : [
                                                { label: 'Hold' },
                                                { label: 'Approve' },
                                                { label: 'Reject' },
                                                { label: 'View Printable PO' },
                                                { label: 'Add Record to Favorites', separator: true }
                                            ]
                                    ).map((action, idx) => (
                                        <div
                                            key={idx}
                                            style={{
                                                padding: '12px 16px',
                                                fontSize: '14px',
                                                color: '#333',
                                                cursor: 'pointer',
                                                borderTop: action.separator ? '1px solid #f0f0f0' : 'none',
                                                marginBottom: action.separator ? '0' : '0',
                                                backgroundColor: '#fff'
                                            }}
                                            onClick={() => {
                                                console.log(`Action: ${action.label}`);
                                                setShowActionsMenu(false);
                                                if (action.label === 'Approve' && !isApprovedView) {
                                                    setShowApproveModal(true);
                                                }
                                                if (action.label === 'View Printable PO') {
                                                    setShowPrintablePO(true);
                                                }
                                            }}
                                        >
                                            {action.label}
                                        </div>
                                    ))}
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </header >

            {/* Details API List */}
            <div className="details-list">
                {/* Previous Single Column Layout
                <DetailItem label="Order No.:" value="PO00000000008829" />
                <DetailItem label="Date *" value="2/3/2026" />
                <DetailItem label="Vendor ID:" value="S00000000000740" />
                <DetailItem label="Currency:" value="PHP" />
                <DetailItem label="Terms:" value="120 Days" />
                <DetailItem label="Promised Date:" value="2/3/2026" />
                <DetailItem label="Shipment Mode:" value="Delivery" />
                <DetailItem label="Request Category:" value="MATERIALS" />
                */}

                <div style={{ display: 'flex', gap: '16px' }}>
                    <div style={{ flex: 1 }}>
                        <DetailItem label="Order No.:" value="PO00000000008829" />
                    </div>
                    <div style={{ flex: 1 }}>
                        <DetailItem label="Date:" value="2/3/2026" />
                    </div>
                </div>
                <div style={{ display: 'flex', gap: '16px' }}>
                    <div style={{ flex: 1 }}>
                        <DetailItem label="Vendor ID:" value="S00000000000740" />
                    </div>
                    <div style={{ flex: 1 }}>
                        <DetailItem label="Currency:" value="PHP" />
                    </div>
                </div>
                <div style={{ display: 'flex', gap: '16px' }}>
                    <div style={{ flex: 1 }}>
                        <DetailItem label="Terms:" value="120 Days" />
                    </div>
                    <div style={{ flex: 1 }}>
                        <DetailItem label="Promised Date:" value="2/3/2026" />
                    </div>
                </div>
                <div style={{ display: 'flex', gap: '16px' }}>
                    <div style={{ flex: 1 }}>
                        <DetailItem label="Shipment Mode:" value="Delivery" />
                    </div>
                    <div style={{ flex: 1 }}>
                        <DetailItem label="Request Category:" value="MATERIALS" />
                    </div>
                </div>

                <DetailItem label="TO:" value={`TRUSALES CORPORATION
241-926-096-001
4TH ST., HAPPY VALLEY, LABANGON 6000
CITY OF CEBU CEBU PHILIPPINES
Philippines`} />
                <DetailItem label="SHIP TO:" value={`QM BUILDERS 
135-526-837-000
F. Gica St. Poblacion CentraL
Dumanjug, Cebu
Cebu 6035
Philippines
Attn: Greymark Faunillan`} />
            </div >



            {/* Fixed Footer */}
            < div style={{
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
                <button style={{
                    flex: 1,
                    padding: '12px',
                    borderRadius: '8px',
                    backgroundColor: '#f46464ff',
                    color: '#1f2937',
                    border: 'none',
                    fontSize: '13px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    textAlign: 'center',
                    whiteSpace: 'normal',
                    lineHeight: 1.2
                }}
                    onClick={() => setShowItemDetails(true)}
                >
                    Description & Item details
                </button>
                <button style={{
                    flex: 1,
                    padding: '12px',
                    borderRadius: '8px',
                    backgroundColor: '#f46464ff',
                    color: '#1f2937',
                    border: 'none',
                    fontSize: '13px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    textAlign: 'center',
                    whiteSpace: 'normal',
                    lineHeight: 1.2
                }}
                    onClick={() => setShowSignatories(true)}
                >
                    Signatories
                </button>
            </div >

            {/* Attachments Bottom Sheet Modal */}
            {
                showAttachments && (
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
                                    <LayoutGrid size={20} color="#666" />
                                    <MoreVertical size={20} color="#666" />
                                </div>
                            </div>

                            {/* Sort */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#888', fontSize: '13px', marginBottom: '20px' }}>
                                Sort By <ArrowUpDown size={14} />
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
                                            <File size={32} color="#ccc" />
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
                                                    {isImageFile(file) && file.previewUrl ? (
                                                        <img
                                                            src={file.previewUrl}
                                                            alt={file.name}
                                                            style={{
                                                                width: '100%',
                                                                height: '100%',
                                                                objectFit: 'contain', /* 'contain' fits whole image, 'cover' fills box */
                                                                borderRadius: '4px'
                                                            }}
                                                        />
                                                    ) : isPdfFile(file) ? (
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
                                                            <File size={30} color="#dc2626" strokeWidth={2} />
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
                                                    ) : isWordFile(file) ? (
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
                                                            <File size={30} color="#1d4ed8" strokeWidth={2} />
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
                                                        <File size={42} color="#6b7280" fill="#f3f4f6" strokeWidth={1.5} /> /* Gray for others */
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
                                <button style={actionButtonStyle} onClick={handleUploadClick}>
                                    <Upload size={18} /> Upload
                                </button>
                                <button style={actionButtonStyle}>
                                    <Camera size={18} /> Camera
                                </button>
                            </div>
                        </div>
                    </>
                )
            }

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

            {/* Approve Confirmation Modal */}
            {showApproveModal && (
                <>
                    <div
                        style={{
                            position: 'fixed',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            backgroundColor: 'rgba(0,0,0,0.45)',
                            zIndex: 80
                        }}
                        onClick={() => setShowApproveModal(false)}
                    />
                    <div
                        style={{
                            position: 'fixed',
                            left: '50%',
                            top: '50%',
                            transform: 'translate(-50%, -50%)',
                            width: '90%',
                            maxWidth: '360px',
                            backgroundColor: '#fff',
                            borderRadius: '12px',
                            padding: '16px',
                            zIndex: 81,
                            boxShadow: '0 10px 30px rgba(0,0,0,0.2)'
                        }}
                    >
                        <h3 style={{ fontSize: '16px', margin: '0 0 8px 0', color: '#1a1a1a' }}>Approve Purchase Order?</h3>
                        <p style={{ fontSize: '13px', color: '#666', margin: 0 }}>
                            Approved by: ALLAN QUIRANTE
                        </p>
                        <p style={{ fontSize: '13px', color: '#666', margin: '4px 0 14px 0' }}>
                            Status: Pending for Approval (Allan Quirante)
                        </p>
                        <div style={{ display: 'flex', gap: '10px' }}>
                            <button
                                onClick={() => setShowApproveModal(false)}
                                style={{
                                    flex: 1,
                                    padding: '10px',
                                    borderRadius: '8px',
                                    border: '1px solid #e5e5e5',
                                    backgroundColor: '#fff',
                                    color: '#666',
                                    fontSize: '13px',
                                    fontWeight: 600
                                }}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleApproveNow}
                                style={{
                                    flex: 1,
                                    padding: '10px',
                                    borderRadius: '8px',
                                    border: 'none',
                                    backgroundColor: '#ef4444',
                                    color: '#fff',
                                    fontSize: '13px',
                                    fontWeight: 700
                                }}
                            >
                                Approve Now
                            </button>
                        </div>
                    </div>
                </>
            )}

            {/* Item Details Modal */}
            {
                showItemDetails && (
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
                                    for approval purpose to test in mobile ui
                                </div>
                            </div>

                            {/* Items Table Section */}

                            <div style={{
                                backgroundColor: '#fff',
                                borderRadius: '8px',
                                boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                                border: '1px solid #000',
                                marginBottom: '24px',
                                overflowX: 'auto' // Enable horizontal scrolling
                            }}>
                                <table style={{
                                    width: '100%',
                                    borderCollapse: 'collapse',
                                    fontSize: '13px',
                                    minWidth: '600px' // Force width to trigger scroll on mobile
                                }}>
                                    <thead>
                                        <tr style={{ backgroundColor: '#fff', borderBottom: '1px solid #000' }}>
                                            <th style={{ padding: '12px', textAlign: 'left', fontWeight: 600, color: '#000', borderRight: '1px solid #000' }}>PROJECT</th>
                                            <th style={{ padding: '12px', textAlign: 'left', fontWeight: 600, color: '#000', borderRight: '1px solid #000' }}>INVENTORY ID</th>
                                            <th style={{ padding: '12px', textAlign: 'left', fontWeight: 600, color: '#000', borderRight: '1px solid #000' }}>ITEM</th>
                                            <th style={{ padding: '12px', textAlign: 'center', fontWeight: 600, color: '#000', borderRight: '1px solid #000' }}>QTY.</th>
                                            <th style={{ padding: '12px', textAlign: 'center', fontWeight: 600, color: '#000', borderRight: '1px solid #000' }}>UOM</th>
                                            <th style={{ padding: '12px', textAlign: 'right', fontWeight: 600, color: '#000', borderRight: '1px solid #000' }}>UNIT PRICE</th>
                                            <th style={{ padding: '12px', textAlign: 'right', fontWeight: 600, color: '#000' }}>AMOUNT</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td style={{ padding: '12px', color: '#000', borderRight: '1px solid #000', borderBottom: '1px solid #000' }}>25H00120</td>
                                            <td style={{ padding: '12px', color: '#000', borderRight: '1px solid #000', borderBottom: '1px solid #000' }}>INV000194</td>
                                            <td style={{ padding: '12px', color: '#000', borderRight: '1px solid #000', borderBottom: '1px solid #000' }}>TIE WIRE #16</td>
                                            <td style={{ padding: '12px', textAlign: 'center', color: '#000', borderRight: '1px solid #000', borderBottom: '1px solid #000' }}>5.00</td>
                                            <td style={{ padding: '12px', textAlign: 'center', color: '#000', borderRight: '1px solid #000', borderBottom: '1px solid #000' }}>ROLL</td>
                                            <td style={{ padding: '12px', textAlign: 'right', color: '#000', borderRight: '1px solid #000', borderBottom: '1px solid #000' }}>1,196.000</td>
                                            <td style={{ padding: '12px', textAlign: 'right', color: '#000', borderBottom: '1px solid #000' }}>5,980.00</td>
                                        </tr>
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
                                    <span style={{ fontSize: '14px', fontWeight: 500 }}>5,980.00</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                                    <span style={{ fontSize: '14px', color: '#666' }}>Less Discount</span>
                                    <span style={{ fontSize: '14px', fontWeight: 500 }}>0.00</span>
                                </div>
                                <div style={{ height: '1px', backgroundColor: '#e5e5e5', margin: '0 -16px 12px -16px' }}></div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                                    <span style={{ fontSize: '15px', fontWeight: 600, color: '#1a1a1a' }}>Net Amount</span>
                                    <span style={{ fontSize: '18px', fontWeight: 700, color: '#059669' }}>5,980.00</span>
                                </div>
                                <div style={{
                                    fontSize: '13px',
                                    color: '#555',
                                    fontStyle: 'italic',
                                    borderTop: '1px dashed #e5e5e5',
                                    paddingTop: '8px',
                                    textAlign: 'right'
                                }}>
                                    Amount in words: Five Thousand Nine Hundred Eighty Pesos Only
                                </div>
                            </div>
                        </div>
                    </div>
                )
            }

            {/* Signatories Modal */}
            {
                showSignatories && (
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
                            <ArrowLeft size={24} color="#1a1a1a" onClick={() => setShowSignatories(false)} style={{ cursor: 'pointer' }} />
                            <h2 style={{ fontSize: '18px', fontWeight: 600, margin: 0 }}>Signatories</h2>
                        </div>

                        {/* Content */}
                        <div style={{ flex: 1, overflowY: 'auto', padding: '24px 16px', display: 'flex', flexDirection: 'column', gap: '40px' }}>

                            {/* Prepared By Section */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
                                    <span style={{ fontSize: '15px', fontWeight: 600, color: '#1a1a1a', paddingBottom: '25px' }}>Prepared by:</span>
                                    <div style={{ flex: 1, marginLeft: '16px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                        <span style={{ fontSize: '13px', color: '#1a1a1a', marginBottom: '4px' }}>Signed: 2/3/2026 1:23:31 PM</span>
                                        <div style={{ height: '1px', backgroundColor: '#000', width: '100%', marginBottom: '8px' }}></div>
                                        <span style={{ fontSize: '15px', fontWeight: 700, color: '#1a1a1a', textTransform: 'uppercase' }}>ED CHRISTOPHER ESTOY</span>
                                    </div>
                                </div>
                            </div>

                            {/* Approved By Section */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
                                    <span style={{ fontSize: '15px', fontWeight: 600, color: '#1a1a1a', paddingBottom: '50px' }}>Approved by:</span>
                                    <div style={{ flex: 1, marginLeft: '16px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                        {isApprovedView ? (
                                            <span style={{ fontSize: '13px', color: '#1a1a1a', marginBottom: '4px' }}>Signed: 2/3/2026 1:30:12 PM</span>
                                        ) : (
                                            <div style={{ height: '24px' }}></div>
                                        )}
                                        <div style={{ height: '1px', backgroundColor: '#000', width: '100%', marginBottom: '8px' }}></div>
                                        <span style={{ fontSize: '15px', fontWeight: 700, color: '#1a1a1a', textTransform: 'uppercase' }}>ALLAN QUIRANTE</span>
                                        {isApprovedView ? (
                                            <span style={{ fontSize: '13px', color: '#059669', marginTop: '4px', fontStyle: 'italic' }}>Approved by Allan Quirante</span>
                                        ) : (
                                            <span style={{ fontSize: '13px', color: '#dc2626', marginTop: '4px', fontStyle: 'italic' }}>Pending for Approval: Allan Quirante</span>
                                        )}
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                )
            }

            {/* Printable PO Modal */}
            {showPrintablePO && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: '#000', // Dark background for better viewing
                    zIndex: 70, // Higher than other modals
                    display: 'flex',
                    flexDirection: 'column',
                    animation: 'fadeIn 0.2s ease-out'
                }}>
                    <div style={{
                        padding: '16px',
                        backgroundColor: '#fff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        borderBottom: '1px solid #e5e5e5'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <ArrowLeft size={24} color="#1a1a1a" onClick={() => setShowPrintablePO(false)} style={{ cursor: 'pointer' }} />
                            <h2 style={{ fontSize: '18px', fontWeight: 600, margin: 0 }}>Printable PO</h2>
                        </div>
                        <Share2 size={20} color="#1a1a1a" />
                    </div>

                    <div style={{
                        flex: 1,
                        overflow: 'auto',
                        display: 'flex',
                        justifyContent: 'center',
                        padding: '16px',
                        backgroundColor: '#525659' // Common PDF viewer background color
                    }}>
                        <img
                            src="./printable_po.png"
                            alt="Printable Purchase Order"
                            style={{
                                maxWidth: '100%',
                                height: 'auto',
                                boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                                objectFit: 'contain'
                            }}
                        />
                    </div>
                </div>
            )}

            {/* Full Screen File Preview Overlay */}
            {
                previewFile && (
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
                        {/* Native-like Header */}
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
                                {/* Placeholder icons for screenshot match */}
                                <Share2 size={24} color="#1a1a1a" />
                                <MoreVertical size={24} color="#1a1a1a" />
                            </div>
                        </div>

                        {/* Content Container */}
                        <div style={{
                            flex: 1,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            overflow: 'hidden',
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
                                <LocalPdfPreview file={previewFile} />
                            ) : (
                                /* Local DOCX Preview or Fallback */
                                <LocalDocPreview file={previewFile} />
                            )}
                        </div>
                    </div>
                )
            }
        </div >
    );
};

// Sub-component for local Word document preview (.doc, .docx, .docm, .dot, .dotx, .dotm, .rtf)
const LocalDocPreview: React.FC<{ file: { url: string, name: string, type: string } }> = ({ file }) => {
    const fileExtension = getFileExtension(file.name);
    const isWordDoc = WORD_EXTENSIONS.includes(fileExtension);
    const isDocxFamily = ['docx', 'docm', 'dotx', 'dotm'].includes(fileExtension);
    const [loading, setLoading] = useState(true);
    const [docxError, setDocxError] = useState<string | null>(null);
    const containerRef = React.useRef<HTMLDivElement>(null);

    if (!isWordDoc) {
        return (
            <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }} onClick={e => e.stopPropagation()}>
                <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '16px', fontWeight: 500, color: '#333' }}>Cannot preview this file type</div>
                    <div style={{ fontSize: '14px', color: '#666' }}>Only PDF and Word files are supported in in-app preview.</div>
                </div>
            </div>
        );
    }

    useEffect(() => {
        if (!isDocxFamily || !containerRef.current) {
            return undefined;
        }
        
        let mounted = true;
        setLoading(true);
        setDocxError(null);

        const renderDocx = async () => {
            try {
                const response = await fetch(file.url);
                const blob = await response.blob();
                if (!mounted || !containerRef.current) return;
                containerRef.current.innerHTML = '';
                await renderAsync(blob, containerRef.current, undefined, {
                    inWrapper: false,
                    ignoreWidth: true,
                    ignoreHeight: true
                });
                if (mounted) setLoading(false);
            } catch (error) {
                console.error('Word preview error:', error);
                if (mounted) {
                    setDocxError('This Word file could not be rendered in-app.');
                    setLoading(false);
                }
            }
        };

        renderDocx();

        return () => {
            mounted = false;
        };
    }, [file.url, fileExtension, isDocxFamily]);

    if (isDocxFamily) {
        return (
            <div style={{ width: '100%', height: '100%', position: 'relative', overflowY: 'auto', backgroundColor: '#fff' }} onClick={e => e.stopPropagation()}>
                {loading && (
                    <div style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '12px',
                        backgroundColor: '#fff',
                        zIndex: 10
                    }}>
                        <Loader2 className="animate-spin" size={32} color="#3b82f6" />
                        <span style={{ color: '#666', fontSize: '14px' }}>Opening Word document...</span>
                    </div>
                )}
                {docxError ? (
                    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
                        <div style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: '15px', fontWeight: 600, color: '#333', marginBottom: '6px' }}>{docxError}</div>
                            <div style={{ fontSize: '13px', color: '#666' }}>Try another Word file format such as `.docx`.</div>
                        </div>
                    </div>
                ) : (
                    <>
                        <div ref={containerRef} style={{ width: '100%', minHeight: '100%', padding: '12px', backgroundColor: '#fff' }} />
                        <style>{`
                            .docx {
                                width: 100% !important;
                                max-width: 100% !important;
                                min-height: auto !important;
                                padding: 16px !important;
                                margin: 0 !important;
                                box-sizing: border-box !important;
                                overflow-wrap: anywhere !important;
                            }
                            .docx section {
                                width: 100% !important;
                                max-width: 100% !important;
                                min-height: auto !important;
                                padding: 0 !important;
                                margin: 0 !important;
                                box-sizing: border-box !important;
                            }
                            .docx article,
                            .docx p,
                            .docx span,
                            .docx table {
                                max-width: 100% !important;
                                word-break: break-word !important;
                                overflow-wrap: anywhere !important;
                            }
                            .docx img {
                                max-width: 100% !important;
                                height: auto !important;
                            }
                        `}</style>
                    </>
                )}
            </div>
        );
    }

    return (
        <div style={{ width: '100%', height: '100%', backgroundColor: '#f5f5f5' }} onClick={e => e.stopPropagation()}>
            <DocViewer
                documents={[
                    {
                        uri: file.url,
                        fileName: file.name,
                        fileType: fileExtension
                    }
                ]}
                pluginRenderers={DocViewerRenderers}
                config={{
                    header: {
                        disableHeader: true,
                        disableFileName: true,
                        retainURLParams: false
                    }
                }}
                style={{ width: '100%', height: '100%' }}
            />
        </div>
    );
};

const LocalPdfPreview: React.FC<{ file: { url: string, name: string } }> = ({ file }) => {
    const [numPages, setNumPages] = useState<number | null>(null);
    const [loading, setLoading] = useState(true);

    function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
        setNumPages(numPages);
        setLoading(false);
    }

    return (
        <div style={{ width: '100%', height: '100%', overflowY: 'auto', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '16px' }} onClick={e => e.stopPropagation()}>
            {loading && (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', marginTop: '40px' }}>
                    <Loader2 className="animate-spin" size={32} color="#3b82f6" />
                    <span style={{ color: '#666', fontSize: '14px' }}>Loading PDF...</span>
                </div>
            )}
            <Document
                file={file.url}
                onLoadSuccess={onDocumentLoadSuccess}
                loading={
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', marginTop: '40px' }}>
                        <Loader2 className="animate-spin" size={32} color="#3b82f6" />
                        <span style={{ color: '#666', fontSize: '14px' }}>Loading PDF...</span>
                    </div>
                }
                error={
                    <div style={{ padding: '20px', textAlign: 'center', color: '#ef4444' }}>
                        <p>Failed to load PDF.</p>
                    </div>
                }
            >
                {/* Render all pages for scrolling experience */}
                {numPages && Array.from(new Array(numPages), (_, index) => (
                    <Page
                        key={`page_${index + 1}`}
                        pageNumber={index + 1}
                        width={window.innerWidth > 600 ? 600 : window.innerWidth - 40}
                        renderTextLayer={false}
                        renderAnnotationLayer={false}
                        className="pdf-page"
                    />
                ))}
            </Document>
            <style>{`
                .pdf-page canvas {
                    margin-bottom: 20px;
                    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
                    border-radius: 4px;
                }
                .animate-spin {
                    animation: spin 1s linear infinite;
                }
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );
};

const actionButtonStyle: React.CSSProperties = {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    backgroundColor: '#dbeafe', // Light blue
    color: '#000', // Black text per image?? No, typically blue. Let's check image. 
    // Image shows Light Blue bg, Dark Text (maybe dark blue or black). 
    // Let's use a nice dark slate or blue.
    // Actually image shows text seems dark.
    padding: '12px',
    borderRadius: '24px',
    border: 'none',
    fontSize: '15px',
    fontWeight: 500,
    cursor: 'pointer'
};

const DetailItem: React.FC<{ label: string; value: string; hasDropdown?: boolean }> = ({ label, value, hasDropdown }) => (
    <div style={{
        padding: '16px',
        borderBottom: '1px solid #f0f0f0',
        display: 'flex',
        flexDirection: 'column',
        gap: '4px'
    }}>
        <div style={{ fontSize: '13px', color: '#888' }}>{label}</div>
        <div style={{
            fontSize: '15px',
            color: '#1a1a1a',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            whiteSpace: 'pre-line' // Allow newlines
        }}>
            {value}
            {hasDropdown && <ChevronDown size={16} color="#666" />}
        </div>
    </div>
);

export default PurchaseOrderDetails;

