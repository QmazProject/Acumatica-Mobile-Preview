# Purchase Order Detail View Implementation

## Steps

- [x] 1. Create new component `src/components/PurchaseOrderDetailView.tsx` - Detail view matching the provided image
- [x] 2. Update `src/components/PurchaseOrders.tsx` - Make PO items clickable, add onSelectPO prop
- [x] 3. Update `src/App.tsx` - Add new view state `purchaseOrderDetail`, navigation logic, selected PO state
- [x] 4. Test and verify the flow

## Summary of Changes

### 1. Created `src/components/PurchaseOrderDetailView.tsx`
- New component displaying PO details matching the provided image
- Shows: Type, Order Nbr, Status, Date, Promised On, Description, Vendor, Location, Owner, Currency
- Header with X button, "Purchase Order" title, paperclip icon, and more options

### 2. Updated `src/components/PurchaseOrders.tsx`
- Added `PurchaseOrderData` interface with all required fields
- Added `onSelectPO` prop to handle PO selection
- Made each PO item clickable with `onClick={() => onSelectPO(order)}`
- Enhanced PO data with additional fields (type, promisedOn, description, location, owner, currency)

### 3. Updated `src/App.tsx`
- Added import for `PurchaseOrderDetailView`
- Added `PurchaseOrderData` type definition
- Added `purchaseOrderDetail` to view state type
- Added `selectedPurchaseOrder` state with localStorage persistence
- Added navigation logic: clicking PO sets selected PO and navigates to detail view
- Added `PurchaseOrderDetailView` component rendering
- Updated bottom nav to hide on `purchaseOrderDetail` view

## Additional Updates (User Feedback)

### Updated PO List Item Layout in `PurchaseOrders.tsx`
- Row 1: PO Number | Amount
- Row 2: Description | Company  
- Row 3: Owner | Date
- Row 4: Status

### Updated PO0000000008832 Description
- Changed from "Komatsu PC210" to "Komatsu PC210 PART NO.23131313"

### PurchaseOrderDetailView.tsx Features
- Two-column layout for detail fields
- Totals section (Detail Total Amount, Line Discounts, Document Discounts, Tax Total, Order Total, Shipment Mode)
- Bottom tab buttons (Details, Vendor/Shipping Info, Approvals, Taxes)
- PO0000000008832 highlighted with red left border in list
