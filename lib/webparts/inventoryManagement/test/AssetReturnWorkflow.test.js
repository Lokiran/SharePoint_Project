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
// Mock the configuration context before regular imports to satisfy linter hoisting rules
const mockSP = {
    web: {
        lists: {
            getByTitle: (title) => getMockList(title),
            select: () => () => Promise.resolve([])
        }
    }
};
jest.mock("../pnpjsConfig", () => ({
    getSP: () => mockSP
}));
import { ReturnRequestService } from "../services/ReturnRequestService";
// Mock implementation of list data
let returnRequestsListItems = [
    {
        ID: 1,
        Title: "Return Request for Laptop",
        ReturnRequestID: "RR-101",
        AssetID: "201",
        AssetName: "Dell Latitude 5420",
        AssetType: "IT",
        SerialNumber: "DELL12345",
        RequesterName: "Adele Vance",
        Status: "Pending",
        ReturnReason: "Upgrade",
        ProposedCondition: "Good",
        ManagerComment: "",
        ManagerStatus: "Pending",
        AdminStatus: "Not Started",
        AdminComments: "",
        VerifiedDate: ""
    }
];
let inventoryListItems = [
    {
        ID: 201,
        Title: "Dell Latitude 5420",
        AssetName: "Dell Latitude 5420",
        AssetType: "IT",
        SerialNumber: "DELL12345",
        Status: "Pending Return",
        AssignedTo: "Adele Vance",
        AssignedToId: 12,
        Condition: "Good",
        Note: "Assigned to: Adele Vance"
    }
];
let mappingListItems = [
    {
        ID: 501,
        Title: "Assignment of Dell Latitude 5420",
        SerialNumber: "DELL12345",
        Employe: "Adele Vance",
        EmployeeID: "E2",
        AssetName: "Dell Latitude 5420",
        AssignmentID: "ASG-9999"
    }
];
let eventLogListItems = [];
// Dynamic Field schemas for list.fields.select()
const returnRequestFields = [
    { Title: "Title", InternalName: "Title", TypeAsString: "Text" },
    { Title: "Return Request ID", InternalName: "ReturnRequestID", TypeAsString: "Text" },
    { Title: "Asset ID", InternalName: "AssetID", TypeAsString: "Text" },
    { Title: "Asset Name", InternalName: "AssetName", TypeAsString: "Text" },
    { Title: "Asset Type", InternalName: "AssetType", TypeAsString: "Text" },
    { Title: "Serial Number", InternalName: "SerialNumber", TypeAsString: "Text" },
    { Title: "Requester Name", InternalName: "RequesterName", TypeAsString: "Text" },
    { Title: "Return Reason", InternalName: "ReturnReason", TypeAsString: "Note" },
    { Title: "Proposed Condition", InternalName: "ProposedCondition", TypeAsString: "Text" },
    { Title: "Status", InternalName: "Status", TypeAsString: "Choice" },
    { Title: "Manager Comment", InternalName: "ManagerComment", TypeAsString: "Note" },
    { Title: "Manager Status", InternalName: "ManagerStatus", TypeAsString: "Text" },
    { Title: "Admin Status", InternalName: "AdminStatus", TypeAsString: "Text" },
    { Title: "Admin Comments", InternalName: "AdminComments", TypeAsString: "Text" },
    { Title: "Verified Date", InternalName: "VerifiedDate", TypeAsString: "Text" }
];
const inventoryFields = [
    { Title: "Title", InternalName: "Title", TypeAsString: "Text" },
    { Title: "Asset Name", InternalName: "AssetName", TypeAsString: "Text" },
    { Title: "Asset Type", InternalName: "AssetType", TypeAsString: "Text" },
    { Title: "Serial Number", InternalName: "SerialNumber", TypeAsString: "Text" },
    { Title: "Status", InternalName: "Status", TypeAsString: "Choice" },
    { Title: "Assigned To", InternalName: "AssignedTo", TypeAsString: "User" },
    { Title: "Condition", InternalName: "Condition", TypeAsString: "Choice" },
    { Title: "Note", InternalName: "Note", TypeAsString: "Note" }
];
const mappingFields = [
    { Title: "Title", InternalName: "Title", TypeAsString: "Text" },
    { Title: "Serial Number", InternalName: "SerialNumber", TypeAsString: "Text" },
    { Title: "Employe", InternalName: "Employe", TypeAsString: "Text" },
    { Title: "EmployeeID", InternalName: "EmployeeID", TypeAsString: "Text" },
    { Title: "AssetName", InternalName: "AssetName", TypeAsString: "Text" },
    { Title: "Assignment ID", InternalName: "AssignmentID", TypeAsString: "Text" }
];
const eventLogFields = [
    { Title: "Title", InternalName: "Title", TypeAsString: "Text" },
    { Title: "Action", InternalName: "Action", TypeAsString: "Text" },
    { Title: "EntityType", InternalName: "EntityType", TypeAsString: "Text" },
    { Title: "EntityId", InternalName: "EntityId", TypeAsString: "Text" },
    { Title: "Details", InternalName: "Details", TypeAsString: "Note" },
    { Title: "User", InternalName: "User", TypeAsString: "Text" }
];
// Helper to get mock list references
function getMockList(title) {
    if (title.indexOf("Return") >= 0 || title.indexOf("RR-") >= 0) {
        return {
            fields: {
                select: () => () => Promise.resolve(returnRequestFields)
            },
            items: {
                select: () => {
                    return {
                        orderBy: () => {
                            return () => Promise.resolve(returnRequestsListItems);
                        }
                    };
                },
                filter: (filterStr) => {
                    return {
                        select: () => {
                            return () => {
                                const match = returnRequestsListItems.filter(item => {
                                    if (filterStr.includes("RR-101") || filterStr.includes("#101"))
                                        return item.ReturnRequestID === "RR-101";
                                    return false;
                                });
                                return Promise.resolve(match);
                            };
                        }
                    };
                },
                getById: (id) => ({
                    update: async (payload) => {
                        const item = returnRequestsListItems.find(i => i.ID === id);
                        if (item) {
                            Object.assign(item, payload);
                        }
                        return Promise.resolve();
                    }
                }),
                add: async (payload) => {
                    const newItem = {
                        ID: returnRequestsListItems.length + 1,
                        Title: payload.Title || "",
                        ReturnRequestID: payload.ReturnRequestID || `RR-${Date.now()}`,
                        AssetID: payload.AssetID || "",
                        AssetName: payload.AssetName || "",
                        AssetType: payload.AssetType || "",
                        SerialNumber: payload.SerialNumber || "",
                        RequesterName: payload.RequesterName || "",
                        Status: payload.Status || "Pending Manager Approval",
                        ReturnReason: payload.ReturnReason || "",
                        ProposedCondition: payload.ReturnedAssetCondition || "Good",
                        ManagerComment: payload.ManagerComment || "",
                        ManagerStatus: payload.ManagerStatus || "Pending",
                        AdminStatus: payload.AdminStatus || "Not Started",
                        AdminComments: payload.AdminComments || "",
                        VerifiedDate: payload.VerifiedDate || ""
                    };
                    returnRequestsListItems.push(newItem);
                    return Promise.resolve({ data: newItem });
                }
            },
            select: () => () => Promise.resolve({ Title: title })
        };
    }
    if (title === "InventoryList" || title === "Inventory List") {
        return {
            fields: {
                select: () => () => Promise.resolve(inventoryFields)
            },
            items: {
                getById: (id) => ({
                    update: async (payload) => {
                        const item = inventoryListItems.find(i => i.ID === id);
                        if (item) {
                            Object.assign(item, payload);
                            if (payload.AssignedTo === null) {
                                item.AssignedTo = null;
                            }
                            if (payload.AssignedToId === null) {
                                item.AssignedToId = null;
                            }
                        }
                        return Promise.resolve();
                    }
                })
            },
            select: () => () => Promise.resolve({ Title: title })
        };
    }
    if (title === "Mapping List" || title === "MappingList") {
        return {
            fields: {
                select: () => () => Promise.resolve(mappingFields)
            },
            items: {
                filter: (filterStr) => ({
                    select: () => {
                        return () => {
                            const match = mappingListItems.filter(item => {
                                if (filterStr.includes("DELL12345"))
                                    return item.SerialNumber === "DELL12345";
                                return false;
                            });
                            return Promise.resolve(match);
                        };
                    }
                }),
                getById: (id) => ({
                    delete: async () => {
                        mappingListItems = mappingListItems.filter(i => i.ID !== id);
                        return Promise.resolve();
                    }
                })
            },
            select: () => () => Promise.resolve({ Title: title })
        };
    }
    if (title === "EventLogList" || title === "Event Log List") {
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
describe("Asset Return Two-Level Approval Workflow Verification", () => {
    beforeEach(() => {
        // Reset data
        returnRequestsListItems = [
            {
                ID: 1,
                Title: "Return Request for Laptop",
                ReturnRequestID: "RR-101",
                AssetID: "201",
                AssetName: "Dell Latitude 5420",
                AssetType: "IT",
                SerialNumber: "DELL12345",
                RequesterName: "Adele Vance",
                Status: "Pending",
                ReturnReason: "Upgrade",
                ProposedCondition: "Good",
                ManagerComment: "",
                ManagerStatus: "Pending",
                AdminStatus: "Not Started",
                AdminComments: "",
                VerifiedDate: ""
            }
        ];
        inventoryListItems = [
            {
                ID: 201,
                Title: "Dell Latitude 5420",
                AssetName: "Dell Latitude 5420",
                AssetType: "IT",
                SerialNumber: "DELL12345",
                Status: "Pending Return",
                AssignedTo: "Adele Vance",
                AssignedToId: 12,
                Condition: "Good",
                Note: "Assigned to: Adele Vance"
            }
        ];
        mappingListItems = [
            {
                ID: 501,
                Title: "Assignment of Dell Latitude 5420",
                SerialNumber: "DELL12345",
                Employe: "Adele Vance",
                EmployeeID: "E2",
                AssetName: "Dell Latitude 5420",
                AssignmentID: "ASG-9999"
            }
        ];
        eventLogListItems = [];
    });
    it("should successfully execute two-level return approval workflow", async () => {
        console.log("=== Verification Step 0: Starting simulation ===");
        // Database Status column must store standard SharePoint Choice values
        expect(returnRequestsListItems[0].Status).toBe("Pending");
        // But when fetched via the service, it should be mapped to the logical workflow status
        let requests = await ReturnRequestService.getReturnRequests();
        expect(requests[0].status).toBe("Pending Manager Approval");
        expect(inventoryListItems[0].Status).toBe("Pending Return");
        expect(inventoryListItems[0].AssignedTo).toBe("Adele Vance");
        expect(inventoryListItems[0].AssignedToId).toBe(12);
        expect(mappingListItems.length).toBe(1);
        // Act 1: Manager approves the return request
        await ReturnRequestService.updateReturnRequestStatus("RR-101", "Pending Admin Verification", "Return approved by Manager during test.", "Loka Kiran Reddy", undefined, undefined, "Approved", "Not Started");
        console.log("=== Verification Step 1: Return Request status in database becomes Approved ===");
        expect(returnRequestsListItems[0].Status).toBe("Approved");
        // Check logical mapped status from the service
        requests = await ReturnRequestService.getReturnRequests();
        expect(requests[0].status).toBe("Pending Admin Verification");
        expect(returnRequestsListItems[0].ManagerStatus).toBe("Approved");
        console.log("[PASS] Verification 1: Return Request status is 'Approved' in database and 'Pending Admin Verification' in React app.");
        console.log("=== Verification Step 2: Inventory and mapping remain unchanged ===");
        expect(inventoryListItems[0].Status).toBe("Pending Return");
        expect(mappingListItems.length).toBe(1);
        expect(eventLogListItems.length).toBe(0); // No audit log yet
        console.log("[PASS] Verification 2: Inventory, mapping, and audit logs are untouched during Manager approval.");
        // Act 2: Admin verifies & completes the return request
        await ReturnRequestService.updateReturnRequestStatus("RR-101", "Completed", "Return approved by Manager during test.", "IT Admin User", "Good", "Verified checked in by IT admin.", "Approved", "Completed");
        console.log("=== Verification Step 3: Return Request status in database becomes Returned ===");
        expect(returnRequestsListItems[0].Status).toBe("Returned");
        // Check logical mapped status from the service
        requests = await ReturnRequestService.getReturnRequests();
        expect(requests[0].status).toBe("Completed");
        expect(returnRequestsListItems[0].AdminStatus).toBe("Completed");
        expect(returnRequestsListItems[0].AdminComments).toBe("Verified checked in by IT admin.");
        console.log("[PASS] Verification 3: Return Request status is 'Returned' in database and 'Completed' in React app.");
        console.log("=== Verification Step 4: Inventory Status becomes In Stock ===");
        expect(inventoryListItems[0].Status).toBe("In Stock");
        expect(inventoryListItems[0].Condition).toBe("Good");
        console.log("[PASS] Verification 4: Inventory Status is 'In Stock' and condition is 'Good'.");
        console.log("=== Verification Step 5: AssignedTo is cleared ===");
        expect(inventoryListItems[0].AssignedTo).toBeNull();
        expect(inventoryListItems[0].AssignedToId).toBeNull();
        console.log("[PASS] Verification 5: AssignedTo and AssignedToId are null.");
        console.log("=== Verification Step 6: Asset Assignment mapping record is deleted ===");
        expect(mappingListItems.some(i => i.SerialNumber === "DELL12345")).toBe(false);
        console.log("[PASS] Verification 6: Assignment mapping record deleted.");
        console.log("=== Verification Step 7: Audit Log entry is created ===");
        expect(eventLogListItems.length).toBe(1);
        expect(eventLogListItems[0].Title).toContain("Completed Return & Inactivated: Dell Latitude 5420");
        console.log("[PASS] Verification 7: Audit Log entry created successfully.");
    });
    it("should prevent duplicate active return requests for the same asset", async () => {
        // Act & Assert
        await expect(ReturnRequestService.addReturnRequest({
            title: "Duplicate Request",
            assetId: "201",
            assetName: "Dell Latitude 5420",
            serialNumber: "DELL12345",
            requesterName: "Adele Vance",
            requestDate: new Date().toISOString().split('T')[0],
            returnReason: "Duplicate",
            proposedCondition: "Good"
        }, "Adele Vance")).rejects.toThrow("A return request for this asset is already in progress.");
        console.log("[PASS] Verification: Prevented duplicate return request for asset 201.");
    });
});
//# sourceMappingURL=AssetReturnWorkflow.test.js.map