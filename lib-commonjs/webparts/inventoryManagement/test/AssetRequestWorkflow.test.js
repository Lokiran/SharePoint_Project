"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
if (typeof localStorage === 'undefined') {
    let store = {};
    globalThis.localStorage = {
        getItem: (key) => store[key] || null,
        setItem: (key, value) => { store[key] = value.toString(); },
        removeItem: (key) => { delete store[key]; },
        clear: () => { store = {}; },
        key: (i) => Object.keys(store)[i] || null,
        get length() { return Object.keys(store).length; }
    };
}
const mockSP = {
    web: {
        lists: {
            getByTitle: (title) => getMockList(title),
            select: () => () => Promise.resolve([])
        },
        ensureUser: (name) => Promise.resolve({ Id: 12, data: { Id: 12 } })
    }
};
jest.mock("../pnpjsConfig", () => ({
    getSP: () => mockSP
}));
const RequestService_1 = require("../services/RequestService");
// Mock list data
let requestListItems = [];
let eventLogListItems = [];
const requestFields = [
    { Title: "Title", InternalName: "Title", TypeAsString: "Text" },
    { Title: "Request ID", InternalName: "RequestKey", TypeAsString: "Text" },
    { Title: "Employee", InternalName: "Employee", TypeAsString: "Text" },
    { Title: "Employee ID", InternalName: "EmployeeID", TypeAsString: "Text" },
    { Title: "Asset Type", InternalName: "Assettype", TypeAsString: "Text" },
    { Title: "Quantity", InternalName: "Quantity", TypeAsString: "Number" },
    { Title: "Reason for Request", InternalName: "ReasonforRequest", TypeAsString: "Note" },
    { Title: "Request Status", InternalName: "RequestStatus", TypeAsString: "Choice" },
    { Title: "Priority", InternalName: "Priority", TypeAsString: "Choice" },
    { Title: "Manager Comment", InternalName: "ManagerComment", TypeAsString: "Note" }
];
const eventLogFields = [
    { Title: "Title", InternalName: "Title", TypeAsString: "Text" },
    { Title: "Action", InternalName: "Action", TypeAsString: "Text" },
    { Title: "EntityType", InternalName: "EntityType", TypeAsString: "Text" },
    { Title: "EntityId", InternalName: "EntityId", TypeAsString: "Text" },
    { Title: "Details", InternalName: "Details", TypeAsString: "Note" },
    { Title: "User", InternalName: "User", TypeAsString: "Text" }
];
function getMockList(title) {
    if (title.indexOf("Request") >= 0) {
        return {
            fields: {
                select: () => () => Promise.resolve(requestFields),
                addChoice: () => Promise.resolve(),
                addMultilineText: () => Promise.resolve(),
                addText: () => Promise.resolve()
            },
            items: {
                select: () => () => {
                    return {
                        orderBy: () => () => Promise.resolve(requestListItems)
                    };
                },
                filter: () => ({
                    select: () => () => Promise.resolve(requestListItems)
                }),
                getById: (id) => ({
                    update: async (payload) => {
                        const item = requestListItems.find(i => i.ID === id);
                        if (item) {
                            Object.assign(item, payload);
                        }
                        return Promise.resolve();
                    }
                }),
                add: async (payload) => {
                    const newItem = {
                        ID: requestListItems.length + 1,
                        Title: payload.Title || "",
                        RequestKey: `REQ-00000${requestListItems.length + 1}`,
                        Employee: payload.Employee || payload.EmployeeId || "",
                        EmployeeID: payload.EmployeeID || "",
                        Assettype: payload.Assettype || payload.Asset_x0020_type || "",
                        Quantity: payload.Quantity || 1,
                        ReasonforRequest: payload.ReasonforRequest || payload.Reason_x0020_for_x0020_Request || "",
                        RequestStatus: payload.RequestStatus || "Pending",
                        Priority: payload.Priority || "Medium",
                        ManagerComment: payload.ManagerComment || ""
                    };
                    requestListItems.push(newItem);
                    return Promise.resolve({ data: newItem });
                }
            },
            select: () => () => Promise.resolve({ Title: title })
        };
    }
    if (title.indexOf("Event") >= 0) {
        return {
            fields: {
                select: () => () => Promise.resolve(eventLogFields)
            },
            items: {
                add: async (payload) => {
                    eventLogListItems.push(payload);
                    return Promise.resolve({ data: { Id: eventLogListItems.length } });
                }
            },
            select: () => () => Promise.resolve({ Title: title })
        };
    }
    throw new Error(`Mock list not found: ${title}`);
}
describe("Asset Request Workflow Verification", () => {
    beforeEach(() => {
        requestListItems = [];
        eventLogListItems = [];
    });
    it("should successfully submit a new asset request with Pending status", async () => {
        await RequestService_1.RequestService.addRequest({
            assetTitle: "MacBook Pro 16",
            quantity: 1,
            reason: "Need powerful machine for development",
            requesterName: "Adele Vance",
            requestDate: "2026-08-10",
            assetId: "10"
        }, "Adele Vance");
        expect(requestListItems.length).toBe(1);
        expect(requestListItems[0].Title).toContain("MacBook Pro 16");
        expect(requestListItems[0].RequestStatus).toBe("Pending");
        expect(requestListItems[0].Quantity).toBe(1);
    });
    it("should allow manager to approve a request with comments", async () => {
        // Initial item
        requestListItems.push({
            ID: 1,
            Title: "Request for MacBook Pro 16",
            RequestKey: "REQ-000001",
            Employee: "Adele Vance",
            EmployeeID: "E1001",
            Assettype: "MacBook Pro 16",
            Quantity: 1,
            ReasonforRequest: "Need powerful machine",
            RequestStatus: "Pending",
            Priority: "High",
            ManagerComment: ""
        });
        await RequestService_1.RequestService.updateRequestStatus(1, "Approved", "Manager Approved", "Approved for dev team");
        expect(requestListItems[0].RequestStatus).toBe("Approved");
        expect(requestListItems[0].ManagerComment).toBe("Approved for dev team");
        expect(eventLogListItems.length).toBe(1);
        expect(eventLogListItems[0].Action).toBe("UPDATE");
        expect(eventLogListItems[0].Details).toContain("Status changed to Approved");
    });
    it("should allow manager to reject a request", async () => {
        requestListItems.push({
            ID: 2,
            Title: "Request for Standing Desk",
            RequestKey: "REQ-000002",
            Employee: "Megan Bowen",
            EmployeeID: "E1002",
            Assettype: "Standing Desk",
            Quantity: 1,
            ReasonforRequest: "Ergonomics",
            RequestStatus: "Pending",
            Priority: "Low",
            ManagerComment: ""
        });
        await RequestService_1.RequestService.updateRequestStatus(2, "Declined", "Manager Rejected", "Budget constraints");
        expect(requestListItems[0].RequestStatus).toBe("Rejected");
        expect(requestListItems[0].ManagerComment).toBe("Budget constraints");
    });
});
//# sourceMappingURL=AssetRequestWorkflow.test.js.map