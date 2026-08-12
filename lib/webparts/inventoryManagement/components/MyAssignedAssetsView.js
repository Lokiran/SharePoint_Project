import * as React from 'react';
import { useState, useMemo } from 'react';
import { Stack, Text, TextField, Dropdown, Icon, PrimaryButton, DefaultButton, Panel, PanelType, MessageBar, MessageBarType } from '@fluentui/react';
import styles from './InventoryManagement.module.scss';
import { ASSET_CONDITION_OPTIONS, WARRANTY_STATUS_OPTIONS } from '../constants/DropdownConstants';
import { getWarrantyColorInfo, getAssetLifecycleInfo } from '../utils/WarrantyUtils';
export const MyAssignedAssetsView = (props) => {
    const { items, onReturnAsset, onRaiseIncident, onAssetReplacement } = props;
    // Search and Filter States
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedType, setSelectedType] = useState('All');
    const [selectedCondition, setSelectedCondition] = useState('All');
    const [selectedWarranty, setSelectedWarranty] = useState('All');
    // Detail Panel State
    const [selectedAsset, setSelectedAsset] = useState(null);
    const [isPanelOpen, setIsPanelOpen] = useState(false);
    // Helper: Get Asset Age in Months
    const getAgeInMonths = (purchaseDateStr) => {
        if (!purchaseDateStr)
            return null;
        const purchaseDate = new Date(purchaseDateStr);
        if (isNaN(purchaseDate.getTime()))
            return null;
        const now = new Date();
        const diffTime = Math.abs(now.getTime() - purchaseDate.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return Math.round(diffDays / 30.4375); // average days in a month
    };
    // Helper: Evaluate Warranty Coverage
    const evaluateWarranty = (expiryStr) => {
        if (!expiryStr)
            return { status: 'Unknown', isExpired: false, isExpiringSoon: false, isLessThan1Year: false, text: 'No warranty registered', colorInfo: getWarrantyColorInfo(undefined) };
        const info = getWarrantyColorInfo(expiryStr);
        return {
            status: info.isExpired ? 'Expired' : info.isLessThan6Months ? 'Expiring Soon' : info.isLessThan1Year ? 'Expiring (<1 Yr)' : 'Active',
            isExpired: info.isExpired,
            isExpiringSoon: info.isLessThan6Months,
            isLessThan1Year: info.isLessThan1Year,
            text: info.isExpired ? 'Expired' : info.isLessThan6Months ? 'Expiring soon (< 6 months)' : info.isLessThan1Year ? 'Expiring in < 1 year' : 'Active',
            colorInfo: info
        };
    };
    // Helper: Get Type Icon Name
    const getTypeIcon = (type) => {
        const t = (type || '').toLowerCase();
        if (t.includes('laptop') || t.includes('macbook'))
            return 'LaptopSelected';
        if (t.includes('monitor') || t.includes('screen') || t.includes('display'))
            return 'System';
        if (t.includes('phone') || t.includes('mobile'))
            return 'CellPhone';
        if (t.includes('tablet') || t.includes('ipad'))
            return 'Tablet';
        if (t.includes('headset') || t.includes('headphone'))
            return 'Headset';
        if (t.includes('keyboard'))
            return 'KeyboardClassic';
        if (t.includes('mouse'))
            return 'Mouse';
        return 'Devices2';
    };
    // Dynamic Metrics derived from all items
    const metrics = useMemo(() => {
        let activeWarranties = 0;
        let expiredOrExpiringWarranties = 0;
        let actionNeeded = 0;
        items.forEach(item => {
            const w = evaluateWarranty(item.warrantyExpiry);
            if (w.status === 'Active')
                activeWarranties++;
            if (w.status === 'Expired' || w.status === 'Expiring Soon')
                expiredOrExpiringWarranties++;
            const cond = (item.condition || '').toLowerCase();
            if (cond === 'poor' || cond === 'damaged')
                actionNeeded++;
        });
        return {
            total: items.length,
            activeWarranties,
            expiredOrExpiringWarranties,
            actionNeeded
        };
    }, [items]);
    // Unique Asset Types for filter dropdown
    const typeOptions = useMemo(() => {
        const types = new Set();
        items.forEach(item => {
            if (item.assetType)
                types.add(item.assetType);
        });
        const options = [
            { key: 'All', text: 'All Types' }
        ];
        types.forEach(t => {
            options.push({ key: t, text: t });
        });
        return options;
    }, [items]);
    // Filtering Logic (New to Old)
    const filteredItems = useMemo(() => {
        const filtered = items.filter(item => {
            // 1. Search filter
            const normQuery = searchQuery.toLowerCase().trim();
            const matchesSearch = !normQuery ||
                (item.assetName || '').toLowerCase().includes(normQuery) ||
                (item.title || '').toLowerCase().includes(normQuery) ||
                (item.serialNumber || '').toLowerCase().includes(normQuery) ||
                (item.assetType || '').toLowerCase().includes(normQuery) ||
                (item.vendor || '').toLowerCase().includes(normQuery) ||
                (item.specifications || '').toLowerCase().includes(normQuery);
            // 2. Type filter
            const matchesType = selectedType === 'All' || item.assetType === selectedType;
            // 3. Condition filter
            const matchesCondition = selectedCondition === 'All' || item.condition === selectedCondition;
            // 4. Warranty filter
            const w = evaluateWarranty(item.warrantyExpiry);
            const matchesWarranty = selectedWarranty === 'All' || w.status === selectedWarranty;
            return matchesSearch && matchesType && matchesCondition && matchesWarranty;
        });
        return filtered.sort((a, b) => {
            const dateA = a.assignedDate || a.purchaseDate || '';
            const dateB = b.assignedDate || b.purchaseDate || '';
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
    }, [items, searchQuery, selectedType, selectedCondition, selectedWarranty]);
    // Detailed Age, EOL Date, and Warranty Coverage rendering for the side panel
    const renderLifecycleAnalysis = (asset) => {
        const lifecycle = getAssetLifecycleInfo(asset.purchaseDate);
        const warranty = getWarrantyColorInfo(asset.warrantyExpiry);
        const condition = asset.condition || 'Good';
        const isCritical = condition === 'Poor' || condition === 'Damaged';
        let conditionColor = '#166534';
        let healthRating = 'Excellent';
        let healthIcon = 'Heart';
        if (condition === 'Fair') {
            conditionColor = '#d97706';
            healthRating = 'Satisfactory';
            healthIcon = 'HeartBroken';
        }
        else if (condition === 'Poor') {
            conditionColor = '#ea580c';
            healthRating = 'Degraded';
            healthIcon = 'ShieldAlert';
        }
        else if (condition === 'Damaged') {
            conditionColor = '#dc2626';
            healthRating = 'Unusable / Broken';
            healthIcon = 'Warning';
        }
        return (React.createElement(Stack, { tokens: { childrenGap: 16 }, style: { marginTop: '20px' } },
            React.createElement("h4", { style: { margin: '0 0 5px 0', borderBottom: '1px solid #e2e8f0', paddingBottom: '8px', color: '#1e293b' } }, "Lifecycle & Warranty Coverage Report"),
            React.createElement("div", { style: { backgroundColor: '#f8fafc', padding: '14px 16px', borderRadius: '8px', border: '1px solid #e2e8f0' } },
                React.createElement("div", { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' } },
                    React.createElement("span", { style: { fontSize: '0.88rem', color: '#1e293b', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' } },
                        React.createElement(Icon, { iconName: "History", style: { color: '#0284c7' } }),
                        " Asset Lifecycle & EOL Date"),
                    lifecycle.usedPercentage !== null && (React.createElement("span", { style: { fontSize: '0.75rem', fontWeight: 600, padding: '2px 8px', borderRadius: '9999px', backgroundColor: lifecycle.isLifecycleExpired ? '#fee2e2' : '#e0f2fe', color: lifecycle.isLifecycleExpired ? '#b91c1c' : '#0369a1' } },
                        lifecycle.usedPercentage,
                        "% Lifecycle Used"))),
                React.createElement("div", { style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '10px', fontSize: '0.82rem', marginBottom: '10px' } },
                    React.createElement("div", null,
                        React.createElement("span", { style: { color: '#64748b', display: 'block', fontSize: '0.75rem' } }, "Purchase Date:"),
                        React.createElement("strong", { style: { color: '#0f172a' } }, lifecycle.purchaseDateFormatted)),
                    React.createElement("div", null,
                        React.createElement("span", { style: { color: '#64748b', display: 'block', fontSize: '0.75rem' } }, "Current Asset Age:"),
                        React.createElement("strong", { style: { color: '#0f172a' } }, lifecycle.ageInMonths !== null ? `${lifecycle.ageInMonths} mo (${lifecycle.ageInYears} yrs)` : 'N/A')),
                    React.createElement("div", null,
                        React.createElement("span", { style: { color: '#64748b', display: 'block', fontSize: '0.75rem' } }, "Enterprise EOL Expiry Date:"),
                        React.createElement("strong", { style: { color: lifecycle.isLifecycleExpired ? '#b91c1c' : '#0f172a' } }, lifecycle.eolDateFormatted || 'N/A'))),
                lifecycle.eolDateFormatted ? (lifecycle.isLifecycleExpired ? (React.createElement(MessageBar, { messageBarType: MessageBarType.warning, styles: { root: { borderRadius: '6px' } } },
                    React.createElement("strong", null, "Lifecycle Expired:"),
                    " Passed standard 36-month enterprise usage limit on ",
                    React.createElement("strong", null, lifecycle.eolDateFormatted),
                    ". Eligible for hardware refresh.")) : (React.createElement("div", { style: { backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0', padding: '8px 12px', borderRadius: '6px', fontSize: '0.8rem', color: '#166534' } },
                    React.createElement("strong", null, "Active Lifecycle:"),
                    " Within standard 36-month usage limit. ",
                    React.createElement("strong", null, lifecycle.remainingText),
                    "."))) : (React.createElement("span", { style: { fontSize: '0.8rem', color: '#64748b' } }, "Purchase date is missing. Asset lifecycle age cannot be calculated."))),
            React.createElement("div", { style: { backgroundColor: '#f8fafc', padding: '14px 16px', borderRadius: '8px', border: '1px solid #e2e8f0' } },
                React.createElement("div", { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' } },
                    React.createElement("span", { style: { fontSize: '0.88rem', color: '#1e293b', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' } },
                        React.createElement(Icon, { iconName: "ShieldAlert", style: { color: warranty.textColor } }),
                        " Warranty Coverage Details"),
                    React.createElement("span", { style: { fontSize: '0.75rem', fontWeight: 600, padding: '2px 8px', borderRadius: '9999px', backgroundColor: warranty.bgColor, color: warranty.textColor, border: `1px solid ${warranty.borderColor}` } }, warranty.color === 'red' ? (warranty.isExpired ? 'Expired' : 'Expiring < 6 Mos') : warranty.color === 'yellow' ? 'Expiring < 1 Yr' : 'Active Coverage')),
                React.createElement("div", { style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '10px', fontSize: '0.82rem', marginBottom: '10px' } },
                    React.createElement("div", null,
                        React.createElement("span", { style: { color: '#64748b', display: 'block', fontSize: '0.75rem' } }, "Warranty Expiry Date:"),
                        React.createElement("strong", { style: { color: warranty.textColor } }, warranty.formattedDate)),
                    React.createElement("div", { style: { gridColumn: 'span 2' } },
                        React.createElement("span", { style: { color: '#64748b', display: 'block', fontSize: '0.75rem' } }, "Warranty Time Remaining:"),
                        React.createElement("strong", { style: { color: warranty.textColor } }, warranty.remainingText))),
                asset.warrantyExpiry ? (warranty.isExpired ? (React.createElement(MessageBar, { messageBarType: MessageBarType.error, styles: { root: { borderRadius: '6px' } } },
                    React.createElement("strong", null, "Warranty Expired:"),
                    " Coverage ended on ",
                    React.createElement("strong", null, warranty.formattedDate),
                    " (",
                    warranty.remainingText,
                    "). Future repairs will be billed to departmental cost center.")) : warranty.isLessThan6Months ? (React.createElement(MessageBar, { messageBarType: MessageBarType.error, styles: { root: { borderRadius: '6px' } } },
                    React.createElement("strong", null, "Warranty Expiring Soon (< 6 Months):"),
                    " Protection expires on ",
                    React.createElement("strong", null, warranty.formattedDate),
                    ". High priority: schedule hardware inspection or extension.")) : warranty.isLessThan1Year ? (React.createElement(MessageBar, { messageBarType: MessageBarType.warning, styles: { root: { borderRadius: '6px' } } },
                    React.createElement("strong", null, "Warranty Expiring (< 1 Year):"),
                    " Protection expires on ",
                    React.createElement("strong", null, warranty.formattedDate),
                    ". Plan for upcoming warranty renewal or equipment refresh.")) : (React.createElement(MessageBar, { messageBarType: MessageBarType.success, styles: { root: { borderRadius: '6px' } } },
                    React.createElement("strong", null, "Warranty Active (> 1 Year):"),
                    " Fully protected under manufacturer coverage until ",
                    React.createElement("strong", null, warranty.formattedDate),
                    "."))) : (React.createElement(MessageBar, { messageBarType: MessageBarType.info, styles: { root: { borderRadius: '6px' } } },
                    React.createElement("strong", null, "Warranty Unknown:"),
                    " No warranty expiration record exists for this item."))),
            React.createElement("div", { style: { backgroundColor: '#f8fafc', padding: '12px 15px', borderRadius: '8px', border: '1px solid #e2e8f0' } },
                React.createElement("span", { style: { display: 'block', fontSize: '0.85rem', color: '#64748b', marginBottom: '6px', fontWeight: 600 } }, "Physical Condition & Health"),
                React.createElement("div", { style: { display: 'flex', alignItems: 'center', gap: '8px', color: '#334155' } },
                    React.createElement(Icon, { iconName: healthIcon, style: { fontSize: '18px', color: conditionColor } }),
                    React.createElement("span", null,
                        "Health Rating: ",
                        React.createElement("strong", { style: { color: conditionColor } },
                            healthRating,
                            " (",
                            condition,
                            ")"))),
                isCritical && (React.createElement("div", { style: { marginTop: '10px', padding: '8px', backgroundColor: '#fef2f2', borderRadius: '4px', borderLeft: '3px solid #dc2626' } },
                    React.createElement("span", { style: { fontSize: '0.82rem', color: '#991b1b', fontWeight: 'bold', display: 'block' } }, "Recommendation: RETIRE / REPLACE ASSET"),
                    React.createElement("span", { style: { fontSize: '0.8rem', color: '#991b1b' } },
                        "Since this asset is in ",
                        condition.toLowerCase(),
                        " condition, it is recommended to return the asset and raise a replacement request.")))),
            asset.specifications && (React.createElement("div", { style: { backgroundColor: '#f8fafc', padding: '12px 15px', borderRadius: '8px', border: '1px solid #e2e8f0' } },
                React.createElement("span", { style: { display: 'block', fontSize: '0.85rem', color: '#64748b', marginBottom: '6px', fontWeight: 600 } }, "System Specifications"),
                React.createElement("pre", { style: { margin: 0, whiteSpace: 'pre-wrap', fontFamily: 'monospace', fontSize: '0.82rem', color: '#334155' } }, asset.specifications)))));
    };
    return (React.createElement("div", { style: { display: 'flex', flexDirection: 'column', gap: '15px' } },
        React.createElement("div", { className: styles.metricsRow },
            React.createElement("div", { className: styles.metricItem },
                React.createElement("span", { style: { display: 'block', fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '2px' } }, "Assigned Assets"),
                React.createElement("span", { style: { fontSize: '1.4rem', fontWeight: 600, color: 'var(--text-main)' } }, metrics.total)),
            React.createElement("div", { className: styles.metricDivider }),
            React.createElement("div", { className: styles.metricItem },
                React.createElement("span", { style: { display: 'block', fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '2px' } }, "Under Warranty"),
                React.createElement("span", { style: { fontSize: '1.4rem', fontWeight: 600, color: '#16a34a' } }, metrics.activeWarranties)),
            React.createElement("div", { className: styles.metricDivider }),
            React.createElement("div", { className: styles.metricItem },
                React.createElement("span", { style: { display: 'block', fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '2px' } }, "Warranty Action"),
                React.createElement("span", { style: { fontSize: '1.4rem', fontWeight: 600, color: metrics.expiredOrExpiringWarranties > 0 ? '#d97706' : 'var(--text-muted)' } }, metrics.expiredOrExpiringWarranties)),
            React.createElement("div", { className: styles.metricDivider }),
            React.createElement("div", { className: styles.metricItem },
                React.createElement("span", { style: { display: 'block', fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '2px' } }, "Critical Alerts"),
                React.createElement("span", { style: { fontSize: '1.4rem', fontWeight: 600, color: metrics.actionNeeded > 0 ? '#dc2626' : 'var(--text-muted)' } }, metrics.actionNeeded))),
        React.createElement("div", { className: styles.filtersRow },
            React.createElement("div", { className: styles.searchField },
                React.createElement(TextField, { placeholder: "Search by asset name, type, serial number...", value: searchQuery, onChange: (e, val) => setSearchQuery(val || ''), iconProps: { iconName: 'Search' }, underlined: true })),
            React.createElement("div", { className: styles.filterDropdown },
                React.createElement(Dropdown, { options: typeOptions, selectedKey: selectedType, onChange: (e, option) => setSelectedType(option ? option.key : 'All'), styles: { root: { selectors: { '.ms-Dropdown-title': { border: 'none', borderBottom: '1px solid #a1a1a1', background: 'transparent', paddingLeft: 0 } } } } })),
            React.createElement("div", { className: styles.filterDropdown },
                React.createElement(Dropdown, { options: [
                        { key: 'All', text: 'All Conditions' },
                        ...ASSET_CONDITION_OPTIONS
                    ], selectedKey: selectedCondition, onChange: (e, option) => setSelectedCondition(option ? option.key : 'All'), styles: { root: { selectors: { '.ms-Dropdown-title': { border: 'none', borderBottom: '1px solid #a1a1a1', background: 'transparent', paddingLeft: 0 } } } } })),
            React.createElement("div", { className: styles.filterDropdown },
                React.createElement(Dropdown, { options: [
                        { key: 'All', text: 'All Coverage' },
                        ...WARRANTY_STATUS_OPTIONS
                    ], selectedKey: selectedWarranty, onChange: (e, option) => setSelectedWarranty(option ? option.key : 'All'), styles: { root: { selectors: { '.ms-Dropdown-title': { border: 'none', borderBottom: '1px solid #a1a1a1', background: 'transparent', paddingLeft: 0 } } } } })),
            React.createElement("div", null,
                React.createElement(DefaultButton, { text: "Reset", iconProps: { iconName: 'ClearFilter' }, onClick: () => {
                        setSearchQuery('');
                        setSelectedType('All');
                        setSelectedCondition('All');
                        setSelectedWarranty('All');
                    }, style: { height: '30px', border: 'none', background: 'transparent' } }))),
        filteredItems.length > 0 ? (React.createElement("div", { style: {
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
                gap: '16px',
                marginTop: '10px'
            } }, filteredItems.map(item => {
            const w = evaluateWarranty(item.warrantyExpiry);
            const condition = item.condition || 'Good';
            const age = getAgeInMonths(item.purchaseDate);
            // Condition badge styling
            let conditionBg = '#e6f4ea';
            let conditionText = '#137333';
            if (condition === 'Fair') {
                conditionBg = '#fef7e0';
                conditionText = '#b06000';
            }
            else if (condition === 'Poor') {
                conditionBg = '#ffe8d6';
                conditionText = '#a63e00';
            }
            else if (condition === 'Damaged') {
                conditionBg = '#fce8e6';
                conditionText = '#c5221f';
            }
            // Return action states
            const isPendingReturn = item.status === 'Pending Return';
            const isReturnApproved = item.status === 'Return Approved';
            return (React.createElement("div", { key: item.id, style: {
                    backgroundColor: 'var(--surface-bg)',
                    borderRadius: '6px',
                    border: '1px solid rgba(0, 0, 0, 0.08)',
                    display: 'flex',
                    flexDirection: 'column',
                    transition: 'all 0.2s ease',
                    overflow: 'hidden'
                }, className: styles.assetCardHover },
                React.createElement("div", { style: {
                        padding: '14px 14px 6px 14px',
                        display: 'flex',
                        alignItems: 'flex-start',
                        justifyContent: 'space-between'
                    } },
                    React.createElement("div", { style: { display: 'flex', gap: '8px', alignItems: 'center' } },
                        React.createElement(Icon, { iconName: getTypeIcon(item.assetType), style: { fontSize: '14px', color: 'var(--text-muted)' } }),
                        React.createElement("div", null,
                            React.createElement("h4", { style: { margin: 0, fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-main)' } }, item.assetName || item.title),
                            React.createElement("span", { style: { fontSize: '0.72rem', color: 'var(--text-muted)' } },
                                item.vendor || 'Brand Unknown',
                                " \u2022 ",
                                item.assetType))),
                    React.createElement("span", { style: {
                            backgroundColor: conditionBg,
                            color: conditionText,
                            padding: '2px 8px',
                            borderRadius: '4px',
                            fontSize: '0.68rem',
                            fontWeight: 600
                        } }, condition)),
                React.createElement("div", { style: { padding: '4px 14px 12px 14px', flexGrow: 1, display: 'flex', flexDirection: 'column', gap: '8px' } },
                    item.specifications && (React.createElement("p", { style: {
                            margin: '0 0 2px 0',
                            fontSize: '0.78rem',
                            color: 'var(--text-muted)',
                            lineHeight: '1.4',
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                            height: '32px'
                        } }, item.specifications)),
                    React.createElement("div", { style: {
                            display: 'flex',
                            justifyContent: 'space-between',
                            fontSize: '0.75rem',
                            borderTop: '1px solid rgba(0, 0, 0, 0.04)',
                            paddingTop: '6px',
                            color: 'var(--text-main)'
                        } },
                        React.createElement("span", null,
                            "S/N: ",
                            React.createElement("strong", null, item.serialNumber || 'N/A')),
                        React.createElement("span", null,
                            "Purchased: ",
                            React.createElement("strong", null, item.purchaseDate ? new Date(item.purchaseDate).toLocaleDateString() : 'N/A'))),
                    age !== null && (React.createElement("span", { style: { fontSize: '0.72rem', color: 'var(--text-muted)' } },
                        "Age: ",
                        React.createElement("strong", null, age),
                        " month(s) ",
                        age >= 36 && React.createElement("span", { style: { color: '#d97706', fontWeight: 500 } }, "(Refresh Eligible \u26A0\uFE0F)"))),
                    item.warrantyExpiry && (React.createElement("div", { style: {
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                            backgroundColor: w.colorInfo.bgColor,
                            border: `1px solid ${w.colorInfo.borderColor}`,
                            padding: '4px 6px',
                            borderRadius: '4px',
                            fontSize: '0.7rem',
                            color: w.colorInfo.textColor,
                            marginTop: 'auto'
                        } },
                        React.createElement(Icon, { iconName: w.isExpired ? "ShieldAlert" : w.isExpiringSoon ? "Warning" : "VerifiedBrand", style: { fontSize: '10px' } }),
                        React.createElement("span", null,
                            React.createElement("strong", null,
                                "Warranty ",
                                w.isExpired ? 'Expired' : 'Expiry',
                                ":"),
                            " ",
                            item.warrantyExpiry,
                            " ",
                            w.colorInfo.statusText)))),
                React.createElement("div", { style: {
                        padding: '8px 14px 10px 14px',
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: '6px',
                        borderTop: '1px solid rgba(0, 0, 0, 0.04)',
                        alignItems: 'center'
                    } },
                    React.createElement(DefaultButton, { text: "Details", onClick: () => {
                            setSelectedAsset(item);
                            setIsPanelOpen(true);
                        }, style: { height: '24px', padding: '0 6px', fontSize: '0.72rem', borderRadius: '4px', border: '1px solid #e0e0e0', minWidth: 'auto' } }),
                    React.createElement(DefaultButton, { text: "Report Issue", onClick: () => onRaiseIncident(item), style: { height: '24px', padding: '0 6px', fontSize: '0.72rem', borderRadius: '4px', border: '1px solid #e0e0e0', minWidth: 'auto' } }),
                    onAssetReplacement && (React.createElement(DefaultButton, { text: "Asset Replacement", iconProps: { iconName: 'Sync' }, onClick: () => onAssetReplacement(item), style: { height: '24px', padding: '0 6px', fontSize: '0.72rem', borderRadius: '4px', border: '1px solid #e0e0e0', minWidth: 'auto' } })),
                    isPendingReturn ? (React.createElement("span", { style: {
                            backgroundColor: '#ffe8d6',
                            color: '#a63e00',
                            fontSize: '0.7rem',
                            fontWeight: 'bold',
                            padding: '2px 6px',
                            borderRadius: '4px',
                            marginLeft: 'auto'
                        } }, "Pending Return")) : isReturnApproved ? (React.createElement("span", { style: {
                            backgroundColor: '#e6f4ea',
                            color: '#137333',
                            fontSize: '0.7rem',
                            fontWeight: 'bold',
                            padding: '2px 6px',
                            borderRadius: '4px',
                            marginLeft: 'auto'
                        } }, "Approved")) : (React.createElement(DefaultButton, { text: "Return", onClick: () => onReturnAsset(item), style: {
                            height: '24px',
                            padding: '0 6px',
                            fontSize: '0.72rem',
                            borderRadius: '4px',
                            border: '1px solid #e0e0e0',
                            marginLeft: 'auto',
                            minWidth: 'auto'
                        } })))));
        }))) : (React.createElement("div", { style: {
                textAlign: 'center',
                padding: '30px 10px',
                backgroundColor: 'var(--surface-bg)',
                borderRadius: '6px',
                border: '1px solid rgba(0, 0, 0, 0.08)'
            } },
            React.createElement(Icon, { iconName: "DatabaseNoData", style: { fontSize: '32px', color: 'var(--text-muted)', marginBottom: '8px' } }),
            React.createElement(Text, { variant: "medium", block: true, style: { fontWeight: 600, color: 'var(--text-main)', marginBottom: '4px' } }, "No Assigned Assets Found"),
            React.createElement(Text, { variant: "small", style: { color: 'var(--text-muted)' } }, "Try adjusting your search query or filters."))),
        selectedAsset && (React.createElement(Panel, { isOpen: isPanelOpen, onDismiss: () => {
                setIsPanelOpen(false);
                setSelectedAsset(null);
            }, type: PanelType.medium, headerText: `Asset Details: ${selectedAsset.assetName || selectedAsset.title}`, closeButtonAriaLabel: "Close" },
            React.createElement("div", { style: { marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '15px' } },
                React.createElement("div", { className: styles.responsiveGrid, style: {
                        backgroundColor: '#f1f5f9',
                        padding: '15px',
                        borderRadius: '8px',
                        fontSize: '0.88rem'
                    } },
                    React.createElement("div", null,
                        React.createElement("span", { style: { color: '#64748b', display: 'block' } }, "Asset Type:"),
                        " ",
                        React.createElement("strong", null, selectedAsset.assetType)),
                    React.createElement("div", null,
                        React.createElement("span", { style: { color: '#64748b', display: 'block' } }, "Vendor/Brand:"),
                        " ",
                        React.createElement("strong", null, selectedAsset.vendor || 'Unknown')),
                    React.createElement("div", null,
                        React.createElement("span", { style: { color: '#64748b', display: 'block' } }, "Serial Number:"),
                        " ",
                        React.createElement("strong", null, selectedAsset.serialNumber || 'N/A')),
                    React.createElement("div", null,
                        React.createElement("span", { style: { color: '#64748b', display: 'block' } }, "Asset Status:"),
                        " ",
                        React.createElement("strong", null, selectedAsset.status)),
                    React.createElement("div", { style: { gridColumn: 'span 2' } },
                        React.createElement("span", { style: { color: '#64748b', display: 'block' } }, "Title Description:"),
                        " ",
                        React.createElement("strong", null, selectedAsset.title))),
                renderLifecycleAnalysis(selectedAsset),
                React.createElement(Stack, { horizontal: true, tokens: { childrenGap: 10 }, style: { marginTop: '25px', borderTop: '1px solid #e2e8f0', paddingTop: '15px' } },
                    React.createElement(PrimaryButton, { text: "Report Incident", onClick: () => {
                            setIsPanelOpen(false);
                            onRaiseIncident(selectedAsset);
                            setSelectedAsset(null);
                        }, iconProps: { iconName: 'AlertSolid' } }),
                    selectedAsset.status !== 'Pending Return' && selectedAsset.status !== 'Return Approved' && onAssetReplacement && (React.createElement(DefaultButton, { text: "Asset Replacement", onClick: () => {
                            setIsPanelOpen(false);
                            onAssetReplacement(selectedAsset);
                            setSelectedAsset(null);
                        }, iconProps: { iconName: 'Sync' } })),
                    selectedAsset.status !== 'Pending Return' && selectedAsset.status !== 'Return Approved' && (React.createElement(DefaultButton, { text: "Request Return", onClick: () => {
                            setIsPanelOpen(false);
                            onReturnAsset(selectedAsset);
                            setSelectedAsset(null);
                        }, iconProps: { iconName: 'ReturnToSession' } })),
                    React.createElement(DefaultButton, { text: "Close", onClick: () => {
                            setIsPanelOpen(false);
                            setSelectedAsset(null);
                        } })))))));
};
//# sourceMappingURL=MyAssignedAssetsView.js.map