"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InventoryList = void 0;
const tslib_1 = require("tslib");
const React = tslib_1.__importStar(require("react"));
const DetailsList_1 = require("@fluentui/react/lib/DetailsList");
const Button_1 = require("@fluentui/react/lib/Button");
const InventoryManagement_module_scss_1 = tslib_1.__importDefault(require("./InventoryManagement.module.scss"));
const strings = tslib_1.__importStar(require("InventoryManagementWebPartStrings"));
const LocalizationUtils_1 = require("../utils/LocalizationUtils");
const InventoryList = (props) => {
    const [currentPage, setCurrentPage] = React.useState(1);
    const columns = [
        { key: 'column1', name: strings.Columns.Id, fieldName: 'id', minWidth: 40, maxWidth: 40, isResizable: true },
        { key: 'column2', name: strings.Columns.Title, fieldName: 'title', minWidth: 100, maxWidth: 150, isResizable: true },
        { key: 'column3', name: strings.Columns.AssetName, fieldName: 'assetName', minWidth: 100, maxWidth: 150, isResizable: true },
        { key: 'column4', name: strings.Columns.Type, fieldName: 'assetType', minWidth: 80, maxWidth: 100, isResizable: true },
        { key: 'column5', name: strings.Columns.SerialNumber, fieldName: 'serialNumber', minWidth: 100, maxWidth: 120, isResizable: true },
        { key: 'column6', name: strings.Columns.PurchaseDate, fieldName: 'purchaseDate', minWidth: 100, maxWidth: 120, isResizable: true },
        { key: 'columnVendor', name: strings.Columns.Vendor, fieldName: 'vendor', minWidth: 80, maxWidth: 100, isResizable: true },
        { key: 'columnCondition', name: strings.Columns.Condition, fieldName: 'condition', minWidth: 80, maxWidth: 100, isResizable: true },
        { key: 'columnWarranty', name: strings.Columns.WarrantyExpiry, fieldName: 'warrantyExpiry', minWidth: 100, maxWidth: 120, isResizable: true },
        {
            key: 'column7',
            name: strings.Columns.Status,
            fieldName: 'status',
            minWidth: 80,
            maxWidth: 100,
            isResizable: true,
            onRender: (item) => {
                const isAvailable = item.status === 'Yes' || item.status === 'In Stock';
                const isPendingReturn = item.status === 'Pending Return';
                const isReturnApproved = item.status === 'Return Approved';
                let backgroundColor = '#fee2e2';
                let textColor = '#991b1b';
                if (isAvailable) {
                    backgroundColor = '#dcfce7';
                    textColor = '#166534';
                }
                else if (isPendingReturn) {
                    backgroundColor = '#ffedd5';
                    textColor = '#9a3412';
                }
                else if (isReturnApproved) {
                    backgroundColor = '#dcfce7';
                    textColor = '#166534';
                }
                return (React.createElement("span", { style: {
                        backgroundColor,
                        color: textColor,
                        padding: '4px 12px',
                        borderRadius: '9999px',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        display: 'inline-block'
                    } }, item.status));
            }
        },
        {
            key: 'columnActivation',
            name: strings.Columns.ActivationState,
            minWidth: 100,
            maxWidth: 120,
            isResizable: true,
            onRender: (item) => {
                const statusVal = (item.status || '').toLowerCase();
                let activationState = strings.InventoryList.ActivationDeactivated;
                let badgeColor = '#991b1b'; // Red
                let bgColor = '#fee2e2';
                if (statusVal === 'assigned') {
                    activationState = strings.InventoryList.ActivationActivated;
                    badgeColor = '#166534'; // Green
                    bgColor = '#dcfce7';
                }
                else if (statusVal === 'in stock' || statusVal === 'yes') {
                    activationState = strings.InventoryList.ActivationInactivated;
                    badgeColor = '#92400e'; // Dark orange/amber
                    bgColor = '#fef3c7'; // Amber 100
                }
                return (React.createElement("span", { style: {
                        backgroundColor: bgColor,
                        color: badgeColor,
                        padding: '4px 12px',
                        borderRadius: '9999px',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        display: 'inline-block'
                    } }, activationState));
            }
        },
        { key: 'column8', name: strings.Columns.AssignedTo, fieldName: 'assignedTo', minWidth: 100, maxWidth: 150, isResizable: true },
        { key: 'column9', name: strings.Columns.Specifications, fieldName: 'specifications', minWidth: 150, maxWidth: 300, isResizable: true },
        ...(props.onReturnAsset ? [
            {
                key: 'columnActions',
                name: strings.Columns.Actions,
                minWidth: 100,
                maxWidth: 120,
                isResizable: true,
                onRender: (item) => {
                    const isPendingReturn = item.status === 'Pending Return';
                    const isReturnApproved = item.status === 'Return Approved';
                    if (isPendingReturn) {
                        return (React.createElement("span", { style: { color: '#ea580c', fontWeight: 600, fontSize: '0.8rem' } }, strings.InventoryList.ActionPendingReturn));
                    }
                    if (isReturnApproved) {
                        return (React.createElement("span", { style: { color: '#16a34a', fontWeight: 600, fontSize: '0.8rem' } }, strings.InventoryList.ActionApproved));
                    }
                    return (React.createElement(Button_1.PrimaryButton, { text: strings.InventoryList.ActionReturn, onClick: () => props.onReturnAsset(item), styles: { root: { height: 26, padding: '4px 8px', fontSize: '0.8rem' } } }));
                }
            }
        ] : [])
    ]; // Reset page when items array changes
    React.useEffect(() => {
        setCurrentPage(1);
    }, [props.items]);
    const normalizeGroupTitle = (title) => {
        const t = (title || 'Uncategorized').trim();
        if (/^company\s*assets?$/i.test(t))
            return 'Company Assets';
        if (/^leased\s*assets?$/i.test(t))
            return 'Leased Assets';
        return t;
    };
    // 1. Process items (new-to-old sorting)
    const itemsToProcess = React.useMemo(() => {
        return [...props.items].sort((a, b) => {
            const dateA = a.purchaseDate || a.assignedDate || '';
            const dateB = b.purchaseDate || b.assignedDate || '';
            if (dateA && dateB && dateA !== dateB) {
                return new Date(dateB).getTime() - new Date(dateA).getTime();
            }
            const numA = parseInt((a.id || '0').replace(/\D/g, ''), 10);
            const numB = parseInt((b.id || '0').replace(/\D/g, ''), 10);
            if (!isNaN(numA) && !isNaN(numB) && numA !== numB) {
                return numB - numA;
            }
            return (b.id || '').localeCompare(a.id || '');
        });
    }, [props.items]);
    // 2. Paginate if enabled
    const pageSize = props.pageSize || 10;
    const totalItems = itemsToProcess.length;
    const totalPages = Math.ceil(totalItems / pageSize);
    const activePage = Math.min(currentPage, Math.max(1, totalPages));
    const startIndex = props.enablePagination ? (activePage - 1) * pageSize : 0;
    const itemsToRender = props.enablePagination
        ? itemsToProcess.slice(startIndex, startIndex + pageSize)
        : itemsToProcess;
    // 3. Compute groups based on the actual items to render
    let groups = undefined;
    if (props.isAdmin && itemsToRender.length > 0) {
        groups = [];
        let currentGroupName = normalizeGroupTitle(itemsToRender[0].title);
        let currentGroupStartIndex = 0;
        itemsToRender.forEach((item, index) => {
            const itemGroup = normalizeGroupTitle(item.title);
            if (itemGroup !== currentGroupName) {
                groups.push({
                    key: currentGroupName,
                    name: currentGroupName,
                    startIndex: currentGroupStartIndex,
                    count: index - currentGroupStartIndex,
                    isCollapsed: false,
                });
                currentGroupName = itemGroup;
                currentGroupStartIndex = index;
            }
        });
        if (itemsToRender.length > 0) {
            groups.push({
                key: currentGroupName,
                name: currentGroupName,
                startIndex: currentGroupStartIndex,
                count: itemsToRender.length - currentGroupStartIndex,
                isCollapsed: false,
            });
        }
    }
    const getPageNumbers = () => {
        const pages = [];
        const maxVisiblePages = 5;
        if (totalPages <= maxVisiblePages) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        }
        else {
            pages.push(1);
            const start = Math.max(2, activePage - 1);
            const end = Math.min(totalPages - 1, activePage + 1);
            if (start > 2) {
                pages.push('...');
            }
            for (let i = start; i <= end; i++) {
                pages.push(i);
            }
            if (end < totalPages - 1) {
                pages.push('...');
            }
            pages.push(totalPages);
        }
        return pages;
    };
    return (React.createElement("div", { style: { marginTop: '10px' } },
        React.createElement("div", { className: InventoryManagement_module_scss_1.default.tableWrapper },
            React.createElement(DetailsList_1.DetailsList, { items: itemsToRender, columns: columns, groups: groups, setKey: "set", layoutMode: DetailsList_1.DetailsListLayoutMode.justified, selectionMode: DetailsList_1.SelectionMode.none })),
        props.enablePagination && totalPages > 1 && (React.createElement("div", { className: InventoryManagement_module_scss_1.default.paginationContainer },
            React.createElement("div", { className: InventoryManagement_module_scss_1.default.paginationInfo }, (0, LocalizationUtils_1.formatString)(strings.Pagination.ShowingEntries, startIndex + 1, Math.min(startIndex + pageSize, totalItems), totalItems)),
            React.createElement("div", { className: InventoryManagement_module_scss_1.default.paginationControls },
                React.createElement("button", { className: InventoryManagement_module_scss_1.default.paginationButton, disabled: activePage === 1, onClick: () => setCurrentPage(1), title: strings.Pagination.FirstPage }, "\u00AB"),
                React.createElement("button", { className: InventoryManagement_module_scss_1.default.paginationButton, disabled: activePage === 1, onClick: () => setCurrentPage(prev => prev - 1), title: strings.Pagination.PreviousPage }, "\u2039"),
                getPageNumbers().map((page, idx) => {
                    if (page === '...') {
                        return React.createElement("span", { key: `ellipsis-${idx}`, style: { padding: '0 8px', color: 'var(--text-muted)' } }, "...");
                    }
                    return (React.createElement("button", { key: page, className: `${InventoryManagement_module_scss_1.default.paginationButton} ${activePage === page ? InventoryManagement_module_scss_1.default.active : ''}`, onClick: () => setCurrentPage(page) }, page));
                }),
                React.createElement("button", { className: InventoryManagement_module_scss_1.default.paginationButton, disabled: activePage === totalPages, onClick: () => setCurrentPage(prev => prev + 1), title: strings.Pagination.NextPage }, "\u203A"),
                React.createElement("button", { className: InventoryManagement_module_scss_1.default.paginationButton, disabled: activePage === totalPages, onClick: () => setCurrentPage(totalPages), title: strings.Pagination.LastPage }, "\u00BB"))))));
};
exports.InventoryList = InventoryList;
//# sourceMappingURL=InventoryList.js.map