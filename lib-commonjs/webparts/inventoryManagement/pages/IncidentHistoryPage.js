"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IncidentHistoryPage = void 0;
const tslib_1 = require("tslib");
const React = tslib_1.__importStar(require("react"));
const IncidentHistory_1 = require("../components/IncidentHistory/IncidentHistory");
const InventoryManagement_module_scss_1 = tslib_1.__importDefault(require("../components/InventoryManagement.module.scss"));
const IncidentHistoryPage = (props) => {
    const { state, actions, ...rest } = props;
    return (React.createElement("div", null,
        React.createElement("div", { className: InventoryManagement_module_scss_1.default.cardHeader },
            React.createElement("h3", null, "Incident History")),
        React.createElement(IncidentHistory_1.IncidentHistory, { ...rest, userDisplayName: state.userDisplayName, userEmail: state.userEmail, userRole: state.userRole, setIsLoading: actions.setIsLoading })));
};
exports.IncidentHistoryPage = IncidentHistoryPage;
//# sourceMappingURL=IncidentHistoryPage.js.map