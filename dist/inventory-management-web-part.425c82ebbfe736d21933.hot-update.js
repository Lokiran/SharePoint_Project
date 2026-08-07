"use strict";
self["webpackHotUpdate_56f8f2dc_8391_46cb_b74c_2806d6953063_0_0_1"]("inventory-management-web-part",{

/***/ 4938:
/*!**********************************************************************!*\
  !*** ./lib/webparts/inventoryManagement/components/InventoryList.js ***!
  \**********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   InventoryList: () => (/* binding */ InventoryList)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ 85959);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _fluentui_react_lib_DetailsList__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @fluentui/react/lib/DetailsList */ 79370);
/* harmony import */ var _fluentui_react_lib_DetailsList__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @fluentui/react/lib/DetailsList */ 37805);
/* harmony import */ var _fluentui_react_lib_DetailsList__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @fluentui/react/lib/DetailsList */ 74423);
/* harmony import */ var _fluentui_react_lib_Button__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @fluentui/react/lib/Button */ 29425);
/* harmony import */ var _InventoryManagement_module_scss__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./InventoryManagement.module.scss */ 99623);




const InventoryList = (props) => {
    const [currentPage, setCurrentPage] = react__WEBPACK_IMPORTED_MODULE_0__.useState(1);
    const columns = [
        { key: 'column1', name: 'ID', fieldName: 'id', minWidth: 40, maxWidth: 40, isResizable: true },
        { key: 'column2', name: 'Title', fieldName: 'title', minWidth: 100, maxWidth: 150, isResizable: true },
        { key: 'column3', name: 'Asset Name', fieldName: 'assetName', minWidth: 100, maxWidth: 150, isResizable: true },
        { key: 'column4', name: 'Type', fieldName: 'assetType', minWidth: 80, maxWidth: 100, isResizable: true },
        { key: 'column5', name: 'Serial Number', fieldName: 'serialNumber', minWidth: 100, maxWidth: 120, isResizable: true },
        { key: 'column6', name: 'Purchase Date', fieldName: 'purchaseDate', minWidth: 100, maxWidth: 120, isResizable: true },
        { key: 'columnVendor', name: 'Vendor', fieldName: 'vendor', minWidth: 80, maxWidth: 100, isResizable: true },
        { key: 'columnCondition', name: 'Condition', fieldName: 'condition', minWidth: 80, maxWidth: 100, isResizable: true },
        { key: 'columnWarranty', name: 'Warranty Expiry', fieldName: 'warrantyExpiry', minWidth: 100, maxWidth: 120, isResizable: true },
        {
            key: 'column7',
            name: 'Status',
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
                return (react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", { style: {
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
            name: 'Activation State',
            minWidth: 100,
            maxWidth: 120,
            isResizable: true,
            onRender: (item) => {
                const statusVal = (item.status || '').toLowerCase();
                let activationState = 'Deactivated';
                let badgeColor = '#991b1b'; // Red
                let bgColor = '#fee2e2';
                if (statusVal === 'assigned') {
                    activationState = 'Activated';
                    badgeColor = '#166534'; // Green
                    bgColor = '#dcfce7';
                }
                else if (statusVal === 'in stock' || statusVal === 'yes') {
                    activationState = 'Inactivated';
                    badgeColor = '#92400e'; // Dark orange/amber
                    bgColor = '#fef3c7'; // Amber 100
                }
                return (react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", { style: {
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
        { key: 'column8', name: 'Assigned To', fieldName: 'assignedTo', minWidth: 100, maxWidth: 150, isResizable: true },
        { key: 'column9', name: 'Specifications', fieldName: 'specifications', minWidth: 150, maxWidth: 300, isResizable: true },
        ...(props.onReturnAsset ? [
            {
                key: 'columnActions',
                name: 'Actions',
                minWidth: 100,
                maxWidth: 120,
                isResizable: true,
                onRender: (item) => {
                    const isPendingReturn = item.status === 'Pending Return';
                    const isReturnApproved = item.status === 'Return Approved';
                    if (isPendingReturn) {
                        return (react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", { style: { color: '#ea580c', fontWeight: 600, fontSize: '0.8rem' } }, "Pending Return"));
                    }
                    if (isReturnApproved) {
                        return (react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", { style: { color: '#16a34a', fontWeight: 600, fontSize: '0.8rem' } }, "Approved"));
                    }
                    return (react__WEBPACK_IMPORTED_MODULE_0__.createElement(_fluentui_react_lib_Button__WEBPACK_IMPORTED_MODULE_2__.PrimaryButton, { text: "Return", onClick: () => props.onReturnAsset(item), styles: { root: { height: 26, padding: '4px 8px', fontSize: '0.8rem' } } }));
                }
            }
        ] : [])
    ]; // Reset page when items array changes
    react__WEBPACK_IMPORTED_MODULE_0__.useEffect(() => {
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
    const itemsToProcess = react__WEBPACK_IMPORTED_MODULE_0__.useMemo(() => {
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
    return (react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { style: { marginTop: '10px' } },
        react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { className: _InventoryManagement_module_scss__WEBPACK_IMPORTED_MODULE_1__["default"].tableWrapper },
            react__WEBPACK_IMPORTED_MODULE_0__.createElement(_fluentui_react_lib_DetailsList__WEBPACK_IMPORTED_MODULE_3__.DetailsList, { items: itemsToRender, columns: columns, groups: groups, setKey: "set", layoutMode: _fluentui_react_lib_DetailsList__WEBPACK_IMPORTED_MODULE_4__.DetailsListLayoutMode.justified, selectionMode: _fluentui_react_lib_DetailsList__WEBPACK_IMPORTED_MODULE_5__.SelectionMode.none })),
        props.enablePagination && totalPages > 1 && (react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { className: _InventoryManagement_module_scss__WEBPACK_IMPORTED_MODULE_1__["default"].paginationContainer },
            react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { className: _InventoryManagement_module_scss__WEBPACK_IMPORTED_MODULE_1__["default"].paginationInfo },
                "Showing ",
                react__WEBPACK_IMPORTED_MODULE_0__.createElement("strong", null, startIndex + 1),
                " to ",
                react__WEBPACK_IMPORTED_MODULE_0__.createElement("strong", null, Math.min(startIndex + pageSize, totalItems)),
                " of ",
                react__WEBPACK_IMPORTED_MODULE_0__.createElement("strong", null, totalItems),
                " entries"),
            react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { className: _InventoryManagement_module_scss__WEBPACK_IMPORTED_MODULE_1__["default"].paginationControls },
                react__WEBPACK_IMPORTED_MODULE_0__.createElement("button", { className: _InventoryManagement_module_scss__WEBPACK_IMPORTED_MODULE_1__["default"].paginationButton, disabled: activePage === 1, onClick: () => setCurrentPage(1), title: "First Page" }, "\u00AB"),
                react__WEBPACK_IMPORTED_MODULE_0__.createElement("button", { className: _InventoryManagement_module_scss__WEBPACK_IMPORTED_MODULE_1__["default"].paginationButton, disabled: activePage === 1, onClick: () => setCurrentPage(prev => prev - 1), title: "Previous Page" }, "\u2039"),
                getPageNumbers().map((page, idx) => {
                    if (page === '...') {
                        return react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", { key: `ellipsis-${idx}`, style: { padding: '0 8px', color: 'var(--text-muted)' } }, "...");
                    }
                    return (react__WEBPACK_IMPORTED_MODULE_0__.createElement("button", { key: page, className: `${_InventoryManagement_module_scss__WEBPACK_IMPORTED_MODULE_1__["default"].paginationButton} ${activePage === page ? _InventoryManagement_module_scss__WEBPACK_IMPORTED_MODULE_1__["default"].active : ''}`, onClick: () => setCurrentPage(page) }, page));
                }),
                react__WEBPACK_IMPORTED_MODULE_0__.createElement("button", { className: _InventoryManagement_module_scss__WEBPACK_IMPORTED_MODULE_1__["default"].paginationButton, disabled: activePage === totalPages, onClick: () => setCurrentPage(prev => prev + 1), title: "Next Page" }, "\u203A"),
                react__WEBPACK_IMPORTED_MODULE_0__.createElement("button", { className: _InventoryManagement_module_scss__WEBPACK_IMPORTED_MODULE_1__["default"].paginationButton, disabled: activePage === totalPages, onClick: () => setCurrentPage(totalPages), title: "Last Page" }, "\u00BB"))))));
};


/***/ })

},
/******/ function(__webpack_require__) { // webpackRuntimeModules
/******/ /* webpack/runtime/getFullHash */
/******/ (() => {
/******/ 	__webpack_require__.h = () => ("42b3bde6c09d9697ac7a")
/******/ })();
/******/ 
/******/ }
);
//# sourceMappingURL=inventory-management-web-part.425c82ebbfe736d21933.hot-update.js.map