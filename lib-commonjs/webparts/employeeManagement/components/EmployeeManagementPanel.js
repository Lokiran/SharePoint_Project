"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmployeeManagementPanel = void 0;
const tslib_1 = require("tslib");
const React = tslib_1.__importStar(require("react"));
const react_1 = require("react");
const react_2 = require("@fluentui/react");
const EmployeeManagementPanel_module_scss_1 = tslib_1.__importDefault(require("./EmployeeManagementPanel.module.scss"));
const Dashboard_1 = require("./Dashboard/Dashboard");
const AssetRequestModule_1 = require("./AssetRequest/AssetRequestModule");
const IncidentRequestModule_1 = require("./IncidentRequest/IncidentRequestModule");
const MyRequests_1 = require("./MyRequests/MyRequests");
const MyAssignedAssets_1 = require("./MyAssignedAssets/MyAssignedAssets");
const IncidentHistory_1 = require("./IncidentHistory/IncidentHistory");
const AdminApprovals_1 = require("./AdminApprovals/AdminApprovals");
const InventoryService_1 = require("../services/InventoryService");
const EmployeeManagementPanel = (props) => {
    const [selectedKey, setSelectedKey] = (0, react_1.useState)('home');
    const [isLoading, setIsLoading] = (0, react_1.useState)(false);
    const [employee, setEmployee] = (0, react_1.useState)({
        employeeId: props.userEmail || '',
        employeeName: props.userName || '',
        email: props.userEmail || '',
        department: 'General'
    });
    const [searchEmpName, setSearchEmpName] = (0, react_1.useState)('');
    // Check sessionStorage for logged-in employee details
    (0, react_1.useEffect)(() => {
        const cachedSession = sessionStorage.getItem('loggedInEmployee');
        if (cachedSession) {
            try {
                const parsed = JSON.parse(cachedSession);
                setEmployee(parsed);
                setSearchEmpName(parsed.employeeName);
            }
            catch (e) {
                console.error('Failed to parse employee session from sessionStorage', e);
            }
        }
        else {
            setSearchEmpName(props.userName || '');
        }
    }, []);
    const handleEmployeeLookup = async (name) => {
        if (!name.trim())
            return;
        try {
            setIsLoading(true);
            const service = new InventoryService_1.InventoryService(props.spContext);
            const details = await service.getEmployeeDetailsByName(name);
            sessionStorage.setItem('loggedInEmployee', JSON.stringify(details));
            setEmployee(details);
        }
        catch (e) {
            console.error('Failed to look up employee details', e);
        }
        finally {
            setIsLoading(false);
        }
    };
    const handleResetToSelf = () => {
        const selfDetails = {
            employeeId: props.userEmail || '',
            employeeName: props.userName || '',
            email: props.userEmail || '',
            department: 'General'
        };
        sessionStorage.setItem('loggedInEmployee', JSON.stringify(selfDetails));
        setEmployee(selfDetails);
        setSearchEmpName(props.userName || '');
    };
    // Override standard SharePoint context props with the custom employee details
    const customProps = {
        ...props,
        userName: employee.employeeName,
        userEmail: employee.email,
        employeeId: employee.employeeId,
        department: employee.department
    };
    return (React.createElement("div", { className: EmployeeManagementPanel_module_scss_1.default.employeePanel },
        React.createElement("div", { className: EmployeeManagementPanel_module_scss_1.default.mainContent },
            React.createElement(react_2.Stack, { horizontal: true, wrap: true, horizontalAlign: "space-between", verticalAlign: "center", tokens: { childrenGap: 15 }, style: { borderBottom: '1px solid #e2e8f0', paddingBottom: '15px' } },
                React.createElement(react_2.Persona, { text: employee.employeeName, secondaryText: `ID: ${employee.employeeId} | ${employee.department}`, size: react_2.PersonaSize.size40 }),
                React.createElement(react_2.Stack, { horizontal: true, verticalAlign: "center", tokens: { childrenGap: 10 }, wrap: true },
                    React.createElement(react_2.TextField, { placeholder: "Enter Employee Name...", styles: { root: { width: '220px' } }, iconProps: { iconName: 'Search' }, value: searchEmpName, onChange: (e, val) => setSearchEmpName(val || ''), onKeyDown: (e) => {
                            if (e.key === 'Enter') {
                                handleEmployeeLookup(searchEmpName);
                            }
                        } }),
                    React.createElement(react_2.PrimaryButton, { text: "Load Assets", onClick: () => handleEmployeeLookup(searchEmpName), styles: {
                            root: {
                                borderRadius: '8px',
                                height: '32px'
                            }
                        } }),
                    ((employee.email || '').toLowerCase() !== (props.userEmail || '').toLowerCase() ||
                        (employee.employeeName || '').toLowerCase() !== (props.userName || '').toLowerCase()) && (React.createElement(react_2.DefaultButton, { text: "Reset to Me", iconProps: { iconName: 'Refresh' }, onClick: handleResetToSelf, styles: {
                            root: {
                                borderRadius: '8px',
                                height: '32px'
                            }
                        } })))),
            React.createElement("div", { className: EmployeeManagementPanel_module_scss_1.default.heroSection },
                React.createElement("div", { className: EmployeeManagementPanel_module_scss_1.default.heroText },
                    React.createElement("h2", null, "Employee Management"),
                    React.createElement("p", null,
                        "Welcome back, ",
                        customProps.userName,
                        "!"),
                    React.createElement("span", { className: EmployeeManagementPanel_module_scss_1.default.smallText }, "Manage your requests and incidents from here."))),
            React.createElement("div", { className: EmployeeManagementPanel_module_scss_1.default.actionGrid },
                React.createElement("div", { className: EmployeeManagementPanel_module_scss_1.default.actionButtonContainer },
                    React.createElement(react_2.PrimaryButton, { text: "Request Asset", onClick: () => setSelectedKey('request-asset'), iconProps: { iconName: 'ShoppingCart' } })),
                React.createElement("div", { className: EmployeeManagementPanel_module_scss_1.default.actionButtonContainer },
                    React.createElement(react_2.PrimaryButton, { text: "Raise Incident", onClick: () => setSelectedKey('raise-incident'), iconProps: { iconName: 'AlertSolid' } }))),
            React.createElement("div", { className: EmployeeManagementPanel_module_scss_1.default.card },
                React.createElement(react_2.Pivot, { "aria-label": "Employee Management Views", selectedKey: selectedKey, onLinkClick: (item) => {
                        if (item && item.props.itemKey) {
                            setSelectedKey(item.props.itemKey);
                        }
                    } },
                    React.createElement(react_2.PivotItem, { headerText: "Dashboard", itemIcon: "BarChart4", itemKey: "home" },
                        React.createElement("div", { style: { marginTop: '20px' } },
                            React.createElement(Dashboard_1.Dashboard, { ...customProps, setIsLoading: setIsLoading }))),
                    React.createElement(react_2.PivotItem, { headerText: "Request Asset", itemIcon: "ShoppingCart", itemKey: "request-asset" },
                        React.createElement("div", { style: { marginTop: '20px' } },
                            React.createElement(AssetRequestModule_1.AssetRequestModule, { ...customProps, setIsLoading: setIsLoading }))),
                    React.createElement(react_2.PivotItem, { headerText: "Raise Incident", itemIcon: "AlertSolid", itemKey: "raise-incident" },
                        React.createElement("div", { style: { marginTop: '20px' } },
                            React.createElement(IncidentRequestModule_1.IncidentRequestModule, { ...customProps, setIsLoading: setIsLoading }))),
                    React.createElement(react_2.PivotItem, { headerText: "My Requests", itemIcon: "ReviewSolid", itemKey: "my-requests" },
                        React.createElement("div", { style: { marginTop: '20px' } },
                            React.createElement(MyRequests_1.MyRequests, { ...customProps, setIsLoading: setIsLoading }))),
                    React.createElement(react_2.PivotItem, { headerText: "My Assigned Assets", itemIcon: "CheckMark", itemKey: "my-assets" },
                        React.createElement("div", { style: { marginTop: '20px' } },
                            React.createElement(MyAssignedAssets_1.MyAssignedAssets, { ...customProps, setIsLoading: setIsLoading }))),
                    React.createElement(react_2.PivotItem, { headerText: "Incident History", itemIcon: "History", itemKey: "incident-history" },
                        React.createElement("div", { style: { marginTop: '20px' } },
                            React.createElement(IncidentHistory_1.IncidentHistory, { ...customProps, setIsLoading: setIsLoading }))),
                    React.createElement(react_2.PivotItem, { headerText: "Admin Approvals", itemIcon: "EntitlementPolicy", itemKey: "admin-approvals" },
                        React.createElement("div", { style: { marginTop: '20px' } },
                            React.createElement(AdminApprovals_1.AdminApprovals, { ...customProps, setIsLoading: setIsLoading })))),
                isLoading && (React.createElement(react_2.Stack, { horizontalAlign: "center", verticalAlign: "center", style: { minHeight: '100px', marginTop: '20px' } },
                    React.createElement(react_2.Spinner, { size: react_2.SpinnerSize.large, label: "Loading..." })))))));
};
exports.EmployeeManagementPanel = EmployeeManagementPanel;
//# sourceMappingURL=EmployeeManagementPanel.js.map