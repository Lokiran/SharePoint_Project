"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Dashboard = void 0;
const tslib_1 = require("tslib");
const React = tslib_1.__importStar(require("react"));
const react_1 = require("react");
const react_2 = require("@fluentui/react");
const react_cards_1 = require("@uifabric/react-cards");
const chart_js_1 = require("chart.js");
const react_chartjs_2_1 = require("react-chartjs-2");
const InventoryService_1 = require("../../services/InventoryService");
chart_js_1.Chart.register(chart_js_1.ArcElement, chart_js_1.Tooltip, chart_js_1.Legend, chart_js_1.CategoryScale, chart_js_1.LinearScale, chart_js_1.PointElement, chart_js_1.LineElement);
const cardTokens = { childrenMargin: 12 };
const Dashboard = (props) => {
    const [stats, setStats] = (0, react_1.useState)({
        totalRequests: 0,
        pendingRequests: 0,
        approvedRequests: 0,
        resolvedIncidents: 0,
        openIncidents: 0,
    });
    (0, react_1.useEffect)(() => {
        loadDashboardStats();
    }, [props.userEmail]);
    const loadDashboardStats = async () => {
        try {
            props.setIsLoading(true);
            const service = new InventoryService_1.InventoryService(props.spContext);
            const dashboardData = await service.getDashboardStats(props.userEmail);
            setStats(dashboardData);
        }
        catch (error) {
            console.error('Error loading dashboard stats:', error);
        }
        finally {
            props.setIsLoading(false);
        }
    };
    const quickActionCards = [
        {
            title: 'Request Asset',
            icon: 'ShoppingCart',
            color: '#0078d4',
            description: 'Submit a new asset request',
        },
        {
            title: 'Raise Incident',
            icon: 'AlertSolid',
            color: '#e74c3c',
            description: 'Report an issue or damage',
        },
        {
            title: 'My Requests',
            icon: 'ReviewSolid',
            color: '#27ae60',
            description: `${stats.totalRequests} active requests`,
        },
        {
            title: 'My Assets',
            icon: 'CheckMark',
            color: '#f39c12',
            description: 'View assigned assets',
        },
    ];
    const pieChartData = {
        labels: ['Pending', 'Approved', 'Rejected'],
        datasets: [
            {
                label: 'Request Status',
                data: [stats.pendingRequests, stats.approvedRequests, stats.totalRequests - stats.pendingRequests - stats.approvedRequests],
                backgroundColor: ['#ffb81c', '#107c10', '#d13438'],
                borderColor: ['#fff', '#fff', '#fff'],
                borderWidth: 2,
            },
        ],
    };
    const lineChartData = {
        labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
        datasets: [
            {
                label: 'Resolved Incidents',
                data: [2, 5, 3, 8],
                borderColor: '#0078d4',
                backgroundColor: 'rgba(0, 120, 212, 0.1)',
                tension: 0.4,
            },
        ],
    };
    return (React.createElement(react_2.Stack, { tokens: { childrenGap: 20 } },
        React.createElement(react_cards_1.Card, null,
            React.createElement(react_cards_1.Card.Section, { tokens: cardTokens },
                React.createElement(react_2.Stack, { horizontal: true, verticalAlign: "center", tokens: { childrenGap: 15 } },
                    React.createElement(react_2.Persona, { imageUrl: "", text: props.userName, secondaryText: props.userEmail, size: react_2.PersonaSize.size72 }),
                    React.createElement(react_2.Stack, { tokens: { childrenGap: 5 } },
                        React.createElement(react_2.Text, { variant: "xLarge", block: true, style: { fontWeight: 600 } },
                            "Welcome, ",
                            props.userName,
                            "!"),
                        React.createElement(react_2.Text, { variant: "medium", block: true, style: { color: '#666' } }, "Manage your assets and incidents from here."))))),
        React.createElement("div", null,
            React.createElement(react_2.Text, { variant: "large", block: true, style: { fontWeight: 600, marginBottom: '15px' } }, "Quick Actions"),
            React.createElement(react_2.Stack, { horizontal: true, wrap: true, tokens: { childrenGap: 15 } }, quickActionCards.map((action, index) => (React.createElement(react_cards_1.Card, { key: index, style: { flex: '1 1 calc(25% - 12px)', minWidth: '200px', cursor: 'pointer' } },
                React.createElement(react_cards_1.Card.Section, { tokens: cardTokens },
                    React.createElement(react_2.Stack, { tokens: { childrenGap: 10 } },
                        React.createElement(react_2.Icon, { iconName: action.icon, style: { fontSize: '32px', color: action.color } }),
                        React.createElement(react_2.Text, { variant: "large", style: { fontWeight: 600, color: action.color } }, action.title),
                        React.createElement(react_2.Text, { variant: "small", style: { color: '#666' } }, action.description)))))))),
        React.createElement("div", null,
            React.createElement(react_2.Text, { variant: "large", block: true, style: { fontWeight: 600, marginBottom: '15px' } }, "Statistics"),
            React.createElement(react_2.Stack, { horizontal: true, wrap: true, tokens: { childrenGap: 15 } },
                React.createElement(react_cards_1.Card, { style: { flex: '1 1 calc(25% - 12px)', minWidth: '150px' } },
                    React.createElement(react_cards_1.Card.Section, { tokens: cardTokens },
                        React.createElement(react_2.Stack, { tokens: { childrenGap: 5 } },
                            React.createElement(react_2.Text, { variant: "small", style: { color: '#666' } }, "Total Requests"),
                            React.createElement(react_2.Text, { variant: "xxLarge", style: { fontWeight: 700, color: '#0078d4' } }, stats.totalRequests)))),
                React.createElement(react_cards_1.Card, { style: { flex: '1 1 calc(25% - 12px)', minWidth: '150px' } },
                    React.createElement(react_cards_1.Card.Section, { tokens: cardTokens },
                        React.createElement(react_2.Stack, { tokens: { childrenGap: 5 } },
                            React.createElement(react_2.Text, { variant: "small", style: { color: '#666' } }, "Pending"),
                            React.createElement(react_2.Text, { variant: "xxLarge", style: { fontWeight: 700, color: '#ffb81c' } }, stats.pendingRequests)))),
                React.createElement(react_cards_1.Card, { style: { flex: '1 1 calc(25% - 12px)', minWidth: '150px' } },
                    React.createElement(react_cards_1.Card.Section, { tokens: cardTokens },
                        React.createElement(react_2.Stack, { tokens: { childrenGap: 5 } },
                            React.createElement(react_2.Text, { variant: "small", style: { color: '#666' } }, "Open Incidents"),
                            React.createElement(react_2.Text, { variant: "xxLarge", style: { fontWeight: 700, color: '#e74c3c' } }, stats.openIncidents)))),
                React.createElement(react_cards_1.Card, { style: { flex: '1 1 calc(25% - 12px)', minWidth: '150px' } },
                    React.createElement(react_cards_1.Card.Section, { tokens: cardTokens },
                        React.createElement(react_2.Stack, { tokens: { childrenGap: 5 } },
                            React.createElement(react_2.Text, { variant: "small", style: { color: '#666' } }, "Resolved"),
                            React.createElement(react_2.Text, { variant: "xxLarge", style: { fontWeight: 700, color: '#27ae60' } }, stats.resolvedIncidents)))))),
        React.createElement(react_2.Stack, { horizontal: true, tokens: { childrenGap: 20 } },
            React.createElement(react_cards_1.Card, { style: { flex: 1 } },
                React.createElement(react_cards_1.Card.Section, { tokens: cardTokens },
                    React.createElement(react_2.Text, { variant: "large", style: { fontWeight: 600, marginBottom: '15px' }, block: true }, "Request Status Distribution"),
                    React.createElement("div", { style: { maxHeight: '300px', display: 'flex', justifyContent: 'center' } },
                        React.createElement(react_chartjs_2_1.Pie, { data: pieChartData, options: { maintainAspectRatio: false } })))),
            React.createElement(react_cards_1.Card, { style: { flex: 1 } },
                React.createElement(react_cards_1.Card.Section, { tokens: cardTokens },
                    React.createElement(react_2.Text, { variant: "large", style: { fontWeight: 600, marginBottom: '15px' }, block: true }, "Incident Resolution Trend"),
                    React.createElement("div", { style: { height: '300px' } },
                        React.createElement(react_chartjs_2_1.Line, { data: lineChartData, options: { maintainAspectRatio: false } })))))));
};
exports.Dashboard = Dashboard;
//# sourceMappingURL=Dashboard.js.map