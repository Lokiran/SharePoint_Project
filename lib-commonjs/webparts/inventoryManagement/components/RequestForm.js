"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RequestForm = void 0;
const tslib_1 = require("tslib");
const React = tslib_1.__importStar(require("react"));
const react_1 = require("@fluentui/react");
const Styling_1 = require("@fluentui/react/lib/Styling");
const DropdownConstants_1 = require("../constants/DropdownConstants");
const PeopleSearchService_1 = require("../services/PeopleSearchService");
const AppConfig_1 = require("../config/AppConfig");
const LocalizationUtils_1 = require("../utils/LocalizationUtils");
const strings = tslib_1.__importStar(require("InventoryManagementWebPartStrings"));
const pickerCss = (0, Styling_1.mergeStyleSets)({
    suggestion: { display: 'flex', alignItems: 'center', gap: 12, padding: '8px 12px', textAlign: 'left', minWidth: 0 },
    suggestionText: { minWidth: 0, display: 'flex', flexDirection: 'column', lineHeight: '18px' },
    suggestionName: { fontSize: 14, fontWeight: 600, color: '#242424', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' },
    suggestionMeta: { fontSize: 12, color: '#616161', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' },
    card: {
        display: 'flex',
        alignItems: 'flex-start',
        gap: 12,
        marginTop: 8,
        padding: '10px 12px',
        borderRadius: 6,
        border: '1px solid #e0e0e0',
        background: '#fafafa'
    },
    cardLine: { display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#616161', lineHeight: '18px' },
    cardWarn: { display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#8a3707', lineHeight: '18px' },
    error: { color: '#a4262c', fontSize: 12, marginTop: 4 }
});
const detailsLine = (jobTitle, department) => [jobTitle, department].filter(v => !!(v && v.trim())).join(' · ');
const stackTokens = { childrenGap: 15 };
const RequestForm = (props) => {
    const [selectedRequesterId, setSelectedRequesterId] = React.useState(undefined);
    const [employeeId, setEmployeeId] = React.useState('');
    const [manager, setManager] = React.useState(undefined);
    const managerName = manager ? manager.displayName : '';
    const [managersError, setManagersError] = React.useState(undefined);
    const [selectedAssetType, setSelectedAssetType] = React.useState(undefined);
    const [priority, setPriority] = React.useState('Medium');
    const [quantity, setQuantity] = React.useState(1);
    const [reason, setReason] = React.useState('');
    const [requestDate, setRequestDate] = React.useState(new Date().toISOString().split('T')[0]);
    const [reasonTouched, setReasonTouched] = React.useState(false);
    const [managerNameTouched, setManagerNameTouched] = React.useState(false);
    React.useEffect(() => {
        if (props.isOpen) {
            setRequestDate(new Date().toISOString().split('T')[0]);
            setReasonTouched(false);
            setManagerNameTouched(false);
        }
    }, [props.isOpen]);
    const isAdmin = props.currentUserRole === 'Admin';
    const isManager = props.currentUserRole === 'Inventory Manager';
    const isEmployee = props.currentUserRole === 'Inventory Employee';
    const currentUserOption = {
        id: 'current-user',
        name: props.currentUserName,
        email: props.currentUserEmail || '',
        department: 'Your Department',
        jobTitle: props.currentUserRole
    };
    const matchedEmployee = props.employees.find(emp => (props.currentUserEmail && emp.email.toLowerCase() === props.currentUserEmail.toLowerCase()) ||
        emp.name.toLowerCase() === props.currentUserName.toLowerCase());
    const activeEmployee = matchedEmployee || currentUserOption;
    const availableEmployees = [activeEmployee];
    const allEmployees = props.employees.some(e => e.id === activeEmployee.id) ? props.employees : [activeEmployee, ...props.employees];
    const employeeOptions = availableEmployees.map(emp => ({
        key: emp.id,
        text: `${emp.name} (${emp.department})`
    }));
    // Auto-select current user and pre-populate Employee ID
    React.useEffect(() => {
        if (props.isOpen && employeeOptions.length > 0) {
            setSelectedRequesterId(activeEmployee.id);
            setEmployeeId(activeEmployee.id === 'current-user' ? '' : activeEmployee.id);
        }
    }, [props.isOpen, employeeOptions]);
    const uniqueAssetTypes = Array.from(new Set(props.availableAssets.map(a => a.assetType).filter(Boolean)));
    const dynamicAssetTypeOptions = uniqueAssetTypes.map(type => ({ key: type, text: type }));
    const assetTypeOptions = dynamicAssetTypeOptions.length > 0
        ? dynamicAssetTypeOptions
        : DropdownConstants_1.DEFAULT_ASSET_TYPE_OPTIONS;
    // Only approvers can be picked: members of the manager role group (property pane,
    // default MSFT Owners/Members/Visitors -> MSFT Members). The requester is left out,
    // since nobody approves their own request.
    const managerGroup = (0, AppConfig_1.getAppConfig)().roleGroups.manager;
    const toPersona = (p) => ({
        key: p.email.toLowerCase(),
        text: p.displayName,
        secondaryText: detailsLine(p.jobTitle, p.department),
        tertiaryText: p.email,
        data: p
    });
    const loadManagers = async () => {
        const self = (props.currentUserEmail || '').toLowerCase();
        try {
            const members = await PeopleSearchService_1.PeopleSearchService.getGroupMembers(managerGroup);
            setManagersError(undefined);
            return members
                .filter(m => m.email.toLowerCase() !== self)
                .map(m => ({ displayName: m.displayName, email: m.email }))
                .sort((a, b) => a.displayName.localeCompare(b.displayName));
        }
        catch (err) {
            setManagersError(err && err.message ? err.message : String(err));
            return [];
        }
    };
    // Match the text against the manager group, then add job title and department from the directory.
    const resolveManagerSuggestions = async (filter) => {
        const text = filter.trim().toLowerCase();
        const managers = (await loadManagers()).filter(m => m.displayName.toLowerCase().indexOf(text) >= 0 || m.email.toLowerCase().indexOf(text) >= 0);
        if (managers.length === 0)
            return [];
        const directory = await PeopleSearchService_1.PeopleSearchService.search(filter, 20);
        return managers.slice(0, 10).map(m => {
            const match = directory.find(d => (d.email || '').toLowerCase() === m.email.toLowerCase());
            return toPersona(match ? { ...m, jobTitle: match.jobTitle, department: match.department } : m);
        });
    };
    // Clicking into the empty field lists every manager.
    const listAllManagers = async () => (await loadManagers()).slice(0, 25).map(toPersona);
    const renderManagerSuggestion = (persona) => (React.createElement("div", { className: pickerCss.suggestion },
        React.createElement(react_1.Persona, { text: persona.text, size: react_1.PersonaSize.size40, hidePersonaDetails: true }),
        React.createElement("div", { className: pickerCss.suggestionText },
            React.createElement("span", { className: pickerCss.suggestionName }, persona.text),
            persona.secondaryText && React.createElement("span", { className: pickerCss.suggestionMeta }, persona.secondaryText),
            persona.tertiaryText && React.createElement("span", { className: pickerCss.suggestionMeta }, persona.tertiaryText))));
    // A manager counts only when picked from the list, which always carries an email.
    const isFormValid = !!selectedRequesterId && !!employeeId.trim() && !!manager && !!manager.email && !!selectedAssetType && quantity > 0 && !!reason.trim();
    const onSave = () => {
        const employee = activeEmployee;
        // Find a real asset ID to satisfy SharePoint backend lookups
        let matchingAsset = props.availableAssets.find(a => a.assetType === selectedAssetType &&
            (a.status === 'In Stock' || a.status === 'Yes'));
        if (!matchingAsset) {
            matchingAsset = props.availableAssets.find(a => a.assetType === selectedAssetType);
        }
        if (selectedAssetType && employee) {
            props.onSubmitRequest({
                requesterName: employee.name,
                requesterEmail: employee.email,
                employeeId: employeeId,
                managerName: managerName.trim(),
                // Lets the approval email go to the manager picked here instead of a name lookup.
                managerEmail: manager && manager.email ? manager.email : undefined,
                assetId: matchingAsset ? matchingAsset.id : '1',
                assetTitle: selectedAssetType,
                priority: priority,
                quantity,
                reason,
                requestDate
            });
            setSelectedRequesterId(undefined);
            setEmployeeId('');
            setManager(undefined);
            setSelectedAssetType(undefined);
            setPriority('Medium');
            setQuantity(1);
            setReason('');
            setRequestDate(new Date().toISOString().split('T')[0]);
            setReasonTouched(false);
            setManagerNameTouched(false);
            props.onClose();
        }
    };
    return (React.createElement(react_1.Panel, { isOpen: props.isOpen, onDismiss: props.onClose, type: react_1.PanelType.custom, customWidth: "100%", styles: { main: { maxWidth: '450px' } }, headerText: strings.RequestForm.HeaderText, closeButtonAriaLabel: strings.Common.Close },
        React.createElement(react_1.Stack, { tokens: stackTokens },
            React.createElement(react_1.MessageBar, { messageBarType: react_1.MessageBarType.info }, strings.RequestForm.OnBehalfHint),
            React.createElement(react_1.Dropdown, { label: strings.RequestForm.LabelRequester, selectedKey: selectedRequesterId, options: employeeOptions, required: true, disabled: true }),
            React.createElement(react_1.TextField, { label: strings.RequestForm.LabelEmployeeId, value: employeeId, onChange: (_, val) => setEmployeeId(val || ''), required: true, disabled: activeEmployee.id !== 'current-user' }),
            React.createElement("div", null,
                React.createElement(react_1.Label, { required: true }, strings.RequestForm.LabelManagerName),
                React.createElement(react_1.NormalPeoplePicker, { onResolveSuggestions: (filter) => resolveManagerSuggestions(filter), onEmptyResolveSuggestions: () => listAllManagers(), onRenderSuggestionsItem: (persona) => renderManagerSuggestion(persona), selectedItems: manager ? [{ key: manager.email || manager.displayName, text: manager.displayName, secondaryText: manager.email }] : [], onChange: (items) => {
                        const picked = items && items.length > 0 ? items[0].data : undefined;
                        setManager(picked);
                        setManagerNameTouched(true);
                    }, 
                    // Typed text that isn't a picked manager is never accepted.
                    onValidateInput: () => react_1.ValidationState.invalid, onBlur: () => setManagerNameTouched(true), itemLimit: 1, resolveDelay: 300, inputProps: {
                        placeholder: strings.RequestForm.ManagerSearchPlaceholder,
                        'aria-label': strings.RequestForm.LabelManagerName
                    }, pickerSuggestionsProps: {
                        suggestionsHeaderText: (0, LocalizationUtils_1.formatString)(strings.RequestForm.ManagerSuggestionsHeader, managerGroup),
                        noResultsFoundText: (0, LocalizationUtils_1.formatString)(strings.RequestForm.ManagerNoResults, managerGroup),
                        loadingText: strings.RequestForm.ManagerSearching
                    } }),
                manager && (React.createElement("div", { className: pickerCss.card },
                    React.createElement(react_1.Persona, { text: manager.displayName, size: react_1.PersonaSize.size32, hidePersonaDetails: true }),
                    React.createElement("div", { style: { minWidth: 0 } },
                        detailsLine(manager.jobTitle, manager.department) && (React.createElement("div", { className: pickerCss.cardLine },
                            React.createElement(react_1.Icon, { iconName: "Contact" }),
                            " ",
                            detailsLine(manager.jobTitle, manager.department))),
                        React.createElement("div", { className: pickerCss.cardLine },
                            React.createElement(react_1.Icon, { iconName: "Mail" }),
                            " ",
                            manager.email)))),
                managersError && (React.createElement("div", { className: pickerCss.cardWarn, role: "alert", style: { marginTop: 6 } },
                    React.createElement(react_1.Icon, { iconName: "Warning" }),
                    " ",
                    (0, LocalizationUtils_1.formatString)(strings.RequestForm.ManagerGroupUnavailable, managerGroup))),
                managerNameTouched && !managerName.trim() && (React.createElement("div", { className: pickerCss.error, role: "alert" }, strings.RequestForm.ManagerNameRequired))),
            React.createElement(react_1.TextField, { label: strings.RequestForm.LabelRequestedDate, type: "date", value: requestDate, onChange: (_, val) => setRequestDate(val || ''), required: true }),
            React.createElement(react_1.Dropdown, { label: strings.RequestForm.LabelAssetType, selectedKey: selectedAssetType, options: assetTypeOptions, onChange: (_, opt) => {
                    setSelectedAssetType(opt?.key);
                }, required: true }),
            React.createElement(react_1.Dropdown, { label: strings.RequestForm.LabelPriority, selectedKey: priority, options: DropdownConstants_1.ASSET_REQUEST_PRIORITY_OPTIONS, onChange: (_, opt) => setPriority(opt?.key), required: true }),
            React.createElement(react_1.TextField, { label: strings.RequestForm.LabelQuantity, type: "number", value: quantity.toString(), onChange: (_, val) => setQuantity(parseInt(val || '0')), required: true }),
            React.createElement(react_1.TextField, { label: strings.RequestForm.LabelReason, multiline: true, rows: 3, value: reason, onChange: (_, val) => {
                    setReason(val || '');
                    setReasonTouched(true);
                }, onBlur: () => setReasonTouched(true), required: true, errorMessage: reasonTouched && !reason.trim() ? strings.RequestForm.ReasonRequired : undefined }),
            React.createElement(react_1.Stack, { horizontal: true, tokens: stackTokens, style: { marginTop: 20 } },
                React.createElement(react_1.PrimaryButton, { text: strings.RequestForm.SubmitRequest, onClick: onSave, disabled: !isFormValid }),
                React.createElement(react_1.DefaultButton, { text: strings.Common.Cancel, onClick: props.onClose })))));
};
exports.RequestForm = RequestForm;
//# sourceMappingURL=RequestForm.js.map