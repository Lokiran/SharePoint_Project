"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RequestManager = void 0;
var tslib_1 = require("tslib");
var React = tslib_1.__importStar(require("react"));
var react_1 = require("@fluentui/react");
var stackTokens = { childrenGap: 8 };
var RequestManager = function (props) {
    var columns = [
        { key: 'col1', name: 'Date', fieldName: 'requestDate', minWidth: 80, maxWidth: 100 },
        { key: 'col2', name: 'Requester', fieldName: 'requesterName', minWidth: 100, maxWidth: 150 },
        { key: 'col3', name: 'Asset', fieldName: 'assetTitle', minWidth: 100, maxWidth: 150 },
        { key: 'col4', name: 'Type', fieldName: 'type', minWidth: 80, maxWidth: 100 },
        { key: 'col5', name: 'Qty', fieldName: 'quantity', minWidth: 40, maxWidth: 60 },
        { key: 'col6', name: 'Status', fieldName: 'status', minWidth: 80, maxWidth: 100 },
        {
            key: 'col7',
            name: 'Actions',
            minWidth: 150,
            maxWidth: 200,
            onRender: function (item) {
                if (item.status !== 'Pending')
                    return null;
                return (React.createElement(react_1.Stack, { horizontal: true, tokens: stackTokens },
                    React.createElement(react_1.PrimaryButton, { text: "Approve", onClick: function () { return props.onApprove(item.id); }, styles: { root: { height: 24, fontSize: 12 } } }),
                    React.createElement(react_1.DefaultButton, { text: "Decline", onClick: function () { return props.onDecline(item.id); }, styles: { root: { height: 24, fontSize: 12 } } })));
            }
        }
    ];
    var pendingRequests = props.requests.filter(function (r) { return r.status === 'Pending'; });
    var otherRequests = props.requests.filter(function (r) { return r.status !== 'Pending'; });
    return (React.createElement("div", null,
        React.createElement("h4", null,
            "Pending Requests (",
            pendingRequests.length,
            ")"),
        pendingRequests.length > 0 ? (React.createElement(react_1.DetailsList, { items: pendingRequests, columns: columns, layoutMode: react_1.DetailsListLayoutMode.justified, selectionMode: react_1.SelectionMode.none })) : (React.createElement("p", { style: { color: '#666', fontStyle: 'italic' } }, "No pending requests.")),
        otherRequests.length > 0 && (React.createElement(React.Fragment, null,
            React.createElement("h4", { style: { marginTop: 20 } }, "Request History"),
            React.createElement(react_1.DetailsList, { items: otherRequests, columns: columns.filter(function (c) { return c.key !== 'col7'; }), layoutMode: react_1.DetailsListLayoutMode.justified, selectionMode: react_1.SelectionMode.none })))));
};
exports.RequestManager = RequestManager;
//# sourceMappingURL=RequestManager.js.map