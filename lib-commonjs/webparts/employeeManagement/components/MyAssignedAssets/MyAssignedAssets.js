"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MyAssignedAssets = void 0;
const tslib_1 = require("tslib");
const React = tslib_1.__importStar(require("react"));
const react_1 = require("react");
const react_2 = require("@fluentui/react");
const react_cards_1 = require("@uifabric/react-cards");
const InventoryService_1 = require("../../services/InventoryService");
const cardTokens = { childrenMargin: 12 };
const MyAssignedAssets = (props) => {
    const [assets, setAssets] = (0, react_1.useState)([]);
    const [filteredAssets, setFilteredAssets] = (0, react_1.useState)([]);
    const [searchText, setSearchText] = (0, react_1.useState)('');
    const [selectedAsset, setSelectedAsset] = (0, react_1.useState)(null);
    const [showDetailDialog, setShowDetailDialog] = (0, react_1.useState)(false);
    (0, react_1.useEffect)(() => {
        loadAssets();
    }, [props.userEmail]);
    (0, react_1.useEffect)(() => {
        filterAssets();
    }, [searchText, assets]);
    const loadAssets = async () => {
        try {
            props.setIsLoading(true);
            const service = new InventoryService_1.InventoryService(props.spContext);
            const data = await service.getEmployeeAssignedAssets(props.userEmail);
            setAssets(data);
        }
        catch (error) {
            console.error('Error loading assigned assets:', error);
        }
        finally {
            props.setIsLoading(false);
        }
    };
    const filterAssets = () => {
        let filtered = [...assets];
        if (searchText) {
            filtered = filtered.filter((asset) => asset.assetName.toLowerCase().includes(searchText.toLowerCase()) ||
                asset.serialNumber.toLowerCase().includes(searchText.toLowerCase()) ||
                asset.assetType.toLowerCase().includes(searchText.toLowerCase()));
        }
        setFilteredAssets(filtered);
    };
    const handleViewDetails = (item) => {
        setSelectedAsset(item);
        setShowDetailDialog(true);
    };
    const handleDownloadAssetInfo = (asset) => {
        const assetInfo = `
Asset Information Report
==========================
Asset Type: ${asset.assetType}
Asset Name: ${asset.assetName}
Serial Number: ${asset.serialNumber}
Assignment Date: ${new Date(asset.assignmentDate).toLocaleDateString()}
Status: ${asset.status}
Condition: ${asset.condition}
Location: ${asset.location}
Generated: ${new Date().toLocaleString()}
    `;
        const element = document.createElement('a');
        element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(assetInfo));
        element.setAttribute('download', `asset-${asset.serialNumber}.txt`);
        element.style.display = 'none';
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
    };
    const columns = [
        {
            key: 'assetType',
            name: 'Type',
            minWidth: 100,
            onRender: (item) => React.createElement(react_2.Text, null, item.assetType),
        },
        {
            key: 'assetName',
            name: 'Asset Name',
            minWidth: 150,
            onRender: (item) => React.createElement(react_2.Text, null, item.assetName),
        },
        {
            key: 'serialNumber',
            name: 'Serial Number',
            minWidth: 120,
            onRender: (item) => React.createElement(react_2.Text, null, item.serialNumber),
        },
        {
            key: 'condition',
            name: 'Condition',
            minWidth: 100,
            onRender: (item) => (React.createElement(react_2.Text, { style: { color: item.condition === 'Good' ? '#27ae60' : item.condition === 'Fair' ? '#f39c12' : '#e74c3c' } }, item.condition)),
        },
        {
            key: 'assignmentDate',
            name: 'Assigned Date',
            minWidth: 120,
            onRender: (item) => (React.createElement(react_2.Text, null, new Date(item.assignmentDate).toLocaleDateString())),
        },
        {
            key: 'actions',
            name: 'Actions',
            minWidth: 150,
            onRender: (item) => (React.createElement(react_2.Stack, { horizontal: true, tokens: { childrenGap: 10 } },
                React.createElement(react_2.PrimaryButton, { text: "View", onClick: () => handleViewDetails(item), styles: {
                        root: { padding: '4px 12px', fontSize: '12px', height: '24px' },
                    } }),
                React.createElement(react_2.PrimaryButton, { text: "Download", onClick: () => handleDownloadAssetInfo(item), styles: {
                        root: { padding: '4px 12px', fontSize: '12px', height: '24px' },
                    } }))),
        },
    ];
    return (React.createElement(react_2.Stack, { tokens: { childrenGap: 20 } },
        React.createElement(react_2.Text, { variant: "xLarge", block: true, style: { fontWeight: 600 } }, "My Assigned Assets"),
        React.createElement(react_cards_1.Card, null,
            React.createElement(react_cards_1.Card.Section, { tokens: cardTokens },
                React.createElement(react_2.Stack, { tokens: { childrenGap: 15 } },
                    React.createElement(react_2.SearchBox, { placeholder: "Search by asset name, type, or serial number...", value: searchText, onChange: (ev, newValue) => setSearchText(newValue || '') }),
                    React.createElement(react_2.Text, { variant: "small", style: { color: '#666' } },
                        "You have ",
                        filteredAssets.length,
                        " assigned asset(s)"),
                    filteredAssets.length > 0 ? (React.createElement(react_2.DetailsList, { items: filteredAssets, columns: columns, setKey: "set-items", layoutMode: react_2.DetailsListLayoutMode.justified, selectionMode: react_2.SelectionMode.none })) : (React.createElement(react_2.Stack, { horizontalAlign: "center", verticalAlign: "center", style: { minHeight: '300px' } },
                        React.createElement(react_2.Icon, { iconName: "BackToWindow", style: { fontSize: '48px', color: '#ccc', marginBottom: '10px' } }),
                        React.createElement(react_2.Text, { variant: "large", style: { color: '#666' } }, "No assigned assets found.")))))),
        React.createElement(react_2.Dialog, { hidden: !showDetailDialog, onDismiss: () => setShowDetailDialog(false), dialogContentProps: {
                type: react_2.DialogType.normal,
                title: 'Asset Details',
                closeButtonAriaLabel: 'Close',
            } },
            selectedAsset && (React.createElement(react_2.Stack, { tokens: { childrenGap: 15 } },
                React.createElement(react_2.TextField, { label: "Asset Type", value: selectedAsset.assetType, disabled: true }),
                React.createElement(react_2.TextField, { label: "Asset Name", value: selectedAsset.assetName, disabled: true }),
                React.createElement(react_2.TextField, { label: "Serial Number", value: selectedAsset.serialNumber, disabled: true }),
                React.createElement(react_2.TextField, { label: "Condition", value: selectedAsset.condition, disabled: true }),
                React.createElement(react_2.TextField, { label: "Location", value: selectedAsset.location, disabled: true }),
                React.createElement(react_2.TextField, { label: "Assigned Date", value: new Date(selectedAsset.assignmentDate).toLocaleDateString(), disabled: true }),
                React.createElement(react_2.TextField, { label: "Status", value: selectedAsset.status, disabled: true }))),
            React.createElement(react_2.DialogFooter, null,
                React.createElement(react_2.PrimaryButton, { text: "Close", onClick: () => setShowDetailDialog(false) })))));
};
exports.MyAssignedAssets = MyAssignedAssets;
//# sourceMappingURL=MyAssignedAssets.js.map