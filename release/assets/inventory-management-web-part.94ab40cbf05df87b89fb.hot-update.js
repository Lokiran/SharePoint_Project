"use strict";
self["webpackHotUpdate_56f8f2dc_8391_46cb_b74c_2806d6953063_0_0_1"]("inventory-management-web-part",{

/***/ 235:
/*!**********************************************************************!*\
  !*** ./lib/webparts/inventoryManagement/components/WorkflowPopup.js ***!
  \**********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   WorkflowPopup: () => (/* binding */ WorkflowPopup)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ 85959);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _fluentui_react_lib_Dialog__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @fluentui/react/lib/Dialog */ 4312);
/* harmony import */ var _fluentui_react_lib_Dialog__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @fluentui/react/lib/Dialog */ 10548);
/* harmony import */ var _fluentui_react_lib_Dialog__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @fluentui/react/lib/Dialog */ 87295);
/* harmony import */ var _fluentui_react_lib_Button__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @fluentui/react/lib/Button */ 29425);
/* harmony import */ var _fluentui_react_lib_Icon__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @fluentui/react/lib/Icon */ 52394);




const WorkflowPopup = (props) => {
    const { isOpen, title, stage, type, message, details, onDismiss } = props;
    if (!isOpen)
        return null;
    let iconName = 'CheckMark';
    let iconColor = '#15803d';
    let badgeBg = '#dcfce7';
    let badgeTextColor = '#166534';
    let borderColor = '#22c55e';
    let iconBg = '#f0fdf4';
    if (type === 'error' || (details?.status || '').toLowerCase().includes('reject') || (details?.status || '').toLowerCase().includes('declin')) {
        iconName = 'ErrorBadge';
        iconColor = '#b91c1c';
        badgeBg = '#fee2e2';
        badgeTextColor = '#991b1b';
        borderColor = '#ef4444';
        iconBg = '#fef2f2';
    }
    else if (type === 'warning' || (details?.status || '').toLowerCase().includes('pending')) {
        iconName = 'Clock';
        iconColor = '#b45309';
        badgeBg = '#fef3c7';
        badgeTextColor = '#92400e';
        borderColor = '#f59e0b';
        iconBg = '#fffbeb';
    }
    else if (type === 'info') {
        iconName = 'Info';
        iconColor = '#1d4ed8';
        badgeBg = '#dbeafe';
        badgeTextColor = '#1e40af';
        borderColor = '#3b82f6';
        iconBg = '#eff6ff';
    }
    return (react__WEBPACK_IMPORTED_MODULE_0__.createElement(_fluentui_react_lib_Dialog__WEBPACK_IMPORTED_MODULE_1__.Dialog, { hidden: !isOpen, onDismiss: onDismiss, dialogContentProps: {
            type: _fluentui_react_lib_Dialog__WEBPACK_IMPORTED_MODULE_2__.DialogType.normal,
            title: '',
        }, modalProps: {
            isBlocking: true,
            styles: {
                main: {
                    maxWidth: '520px',
                    minWidth: '340px',
                    borderRadius: '16px',
                    padding: '24px 28px',
                    borderTop: `5px solid ${borderColor}`,
                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(0, 0, 0, 0.05)',
                    backgroundColor: '#ffffff'
                }
            }
        } },
        react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { style: { display: 'flex', flexDirection: 'column', gap: '18px', fontFamily: '"Segoe UI", -apple-system, BlinkMacSystemFont, Roboto, sans-serif' } },
            react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { style: { display: 'flex', alignItems: 'flex-start', gap: '14px' } },
                react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { style: {
                        width: '46px',
                        height: '46px',
                        borderRadius: '12px',
                        backgroundColor: iconBg,
                        border: `1px solid ${borderColor}33`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                        boxShadow: `0 4px 12px ${borderColor}22`
                    } },
                    react__WEBPACK_IMPORTED_MODULE_0__.createElement(_fluentui_react_lib_Icon__WEBPACK_IMPORTED_MODULE_3__.Icon, { iconName: iconName, style: { fontSize: '22px', color: iconColor, fontWeight: 'bold' } })),
                react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { style: { flex: 1 } },
                    react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { style: { display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' } },
                        react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", { style: {
                                display: 'inline-block',
                                backgroundColor: badgeBg,
                                color: badgeTextColor,
                                padding: '3px 10px',
                                borderRadius: '9999px',
                                fontSize: '0.7rem',
                                fontWeight: 700,
                                textTransform: 'uppercase',
                                letterSpacing: '0.06em'
                            } }, stage)),
                    react__WEBPACK_IMPORTED_MODULE_0__.createElement("h3", { style: { margin: 0, fontSize: '1.15rem', fontWeight: 600, color: '#0f172a', lineHeight: 1.3 } }, title))),
            react__WEBPACK_IMPORTED_MODULE_0__.createElement("p", { style: { margin: 0, fontSize: '0.88rem', color: '#475569', lineHeight: 1.55 } }, message),
            details && (react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { style: {
                    backgroundColor: '#f8fafc',
                    borderRadius: '12px',
                    padding: '16px',
                    border: '1px solid #e2e8f0',
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                    gap: '12px',
                    fontSize: '0.82rem'
                } },
                details.requestId && (react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", null,
                    react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", { style: { color: '#64748b', display: 'block', fontSize: '0.75rem', fontWeight: 500, marginBottom: '2px' } }, "Request ID"),
                    react__WEBPACK_IMPORTED_MODULE_0__.createElement("strong", { style: { color: '#0f172a', fontSize: '0.88rem' } }, details.requestId))),
                details.assetTitle && (react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", null,
                    react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", { style: { color: '#64748b', display: 'block', fontSize: '0.75rem', fontWeight: 500, marginBottom: '2px' } }, "Asset"),
                    react__WEBPACK_IMPORTED_MODULE_0__.createElement("strong", { style: { color: '#0f172a', fontSize: '0.88rem' } },
                        details.assetTitle,
                        " ",
                        details.quantity ? `(Qty: ${details.quantity})` : ''))),
                details.requesterName && (react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", null,
                    react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", { style: { color: '#64748b', display: 'block', fontSize: '0.75rem', fontWeight: 500, marginBottom: '2px' } }, "Requester"),
                    react__WEBPACK_IMPORTED_MODULE_0__.createElement("strong", { style: { color: '#0f172a', fontSize: '0.88rem' } }, details.requesterName))),
                details.managerName && (react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", null,
                    react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", { style: { color: '#64748b', display: 'block', fontSize: '0.75rem', fontWeight: 500, marginBottom: '2px' } }, "Manager's Name"),
                    react__WEBPACK_IMPORTED_MODULE_0__.createElement("strong", { style: { color: '#0f172a', fontSize: '0.88rem' } }, details.managerName))),
                details.status && (react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", null,
                    react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", { style: { color: '#64748b', display: 'block', fontSize: '0.75rem', fontWeight: 500, marginBottom: '2px' } }, "Workflow Status"),
                    react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", { style: {
                            backgroundColor: badgeBg,
                            color: badgeTextColor,
                            padding: '3px 9px',
                            borderRadius: '6px',
                            fontWeight: 600,
                            fontSize: '0.75rem',
                            display: 'inline-block'
                        } }, details.status))),
                details.date && (react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", null,
                    react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", { style: { color: '#64748b', display: 'block', fontSize: '0.75rem', fontWeight: 500, marginBottom: '2px' } }, "Date"),
                    react__WEBPACK_IMPORTED_MODULE_0__.createElement("strong", { style: { color: '#0f172a', fontSize: '0.88rem' } }, details.date))),
                details.condition && (react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", null,
                    react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", { style: { color: '#64748b', display: 'block', fontSize: '0.75rem', fontWeight: 500, marginBottom: '2px' } }, "Condition"),
                    react__WEBPACK_IMPORTED_MODULE_0__.createElement("strong", { style: { color: '#0f172a', fontSize: '0.88rem' } }, details.condition))),
                details.comment && (react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { style: { gridColumn: '1 / -1', marginTop: '4px' } },
                    react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", { style: { color: '#64748b', display: 'block', fontSize: '0.75rem', fontWeight: 500, marginBottom: '4px' } }, "Manager / Admin Notes"),
                    react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { style: {
                            backgroundColor: '#ffffff',
                            padding: '10px 12px',
                            borderRadius: '8px',
                            border: '1px solid #cbd5e1',
                            color: '#334155',
                            fontStyle: 'italic',
                            lineHeight: 1.4
                        } },
                        "\u201C",
                        details.comment,
                        "\u201D")))))),
        react__WEBPACK_IMPORTED_MODULE_0__.createElement(_fluentui_react_lib_Dialog__WEBPACK_IMPORTED_MODULE_4__.DialogFooter, { styles: { actionsRight: { marginTop: '20px' } } },
            react__WEBPACK_IMPORTED_MODULE_0__.createElement(_fluentui_react_lib_Button__WEBPACK_IMPORTED_MODULE_5__.PrimaryButton, { text: "Got it", onClick: onDismiss, iconProps: { iconName: 'Accept' }, styles: {
                    root: {
                        borderRadius: '8px',
                        padding: '0 20px',
                        height: '36px',
                        backgroundColor: '#005a9e',
                        border: 'none'
                    },
                    rootHovered: {
                        backgroundColor: '#004578'
                    }
                } }))));
};


/***/ })

},
/******/ function(__webpack_require__) { // webpackRuntimeModules
/******/ /* webpack/runtime/getFullHash */
/******/ (() => {
/******/ 	__webpack_require__.h = () => ("1a0b999dab58d60f4ea8")
/******/ })();
/******/ 
/******/ }
);
//# sourceMappingURL=inventory-management-web-part.94ab40cbf05df87b89fb.hot-update.js.map