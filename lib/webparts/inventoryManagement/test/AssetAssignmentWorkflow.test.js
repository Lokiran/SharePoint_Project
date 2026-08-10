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
        ensureUser: (name) => Promise.resolve({ Id: 15, data: { Id: 15 } })
    }
};
jest.mock("../pnpjsConfig", () => ({
    getSP: () => mockSP
}));
import { AssetAssignmentService } from "../services/AssetAssignmentService";
let inventoryListItems = [];
let mappingListItems = [];
let requestListItems = [];
let eventLogListItems = [];
const inventoryFields = [
    { Title: "Title", InternalName: "Title", TypeAsString: "Text" },
    { Title: "Asset Name", InternalName: "AssetName", TypeAsString: "Text" },
    { Title: "Serial Number", InternalName: "SerialNumber", TypeAsString: "Text" },
    { Title: "Status", InternalName: "Status", TypeAsString: "Choice" },
    { Title: "Assigned To", InternalName: "AssignedTo", TypeAsString: "User" }
];
const mappingFields = [
    { Title: "Title", InternalName: "Title", TypeAsString: "Text" },
    { Title: "Assignment ID", InternalName: "AssignmentID", TypeAsString: "Text" },
    { Title: "Employe", InternalName: "Employe", TypeAsString: "Text" },
    { Title: "Employee ID", InternalName: "EmployeeID", TypeAsString: "Text" },
    { Title: "Asset Name", InternalName: "AssetName", TypeAsString: "Text" },
    { Title: "Serial Number", InternalName: "SerialNumber", TypeAsString: "Text" }
];
const eventLogFields = [
    { Title: "Title", InternalName: "Title", TypeAsString: "Text" },
    { Title: "Action", InternalName: "Action", TypeAsString: "Text" },
    { Title: "EntityType", InternalName: "EntityType", TypeAsString: "Text" },
    { Title: "Details", InternalName: "Details", TypeAsString: "Note" }
];
function getMockList(title) {
    if (title.indexOf("Inventory") >= 0) {
        return {
            fields: () => Promise.resolve(inventoryFields),
            items: {
                getById: (id) => {
                    const numId = parseInt(id.toString(), 10);
                    const getItem = () => {
                        const item = inventoryListItems.find(i => i.ID === numId);
                        return Promise.resolve(item || null);
                    };
                    getItem.update = async (payload) => {
                        const item = inventoryListItems.find(i => i.ID === numId);
                        if (item) {
                            Object.assign(item, payload);
                        }
                        return Promise.resolve();
                    };
                    return getItem;
                },
                select: () => () => {
                    return {
                        orderBy: () => () => Promise.resolve(inventoryListItems)
                    };
                }
            },
            select: () => () => Promise.resolve({ Title: title })
        };
    }
    if (title.indexOf("Mapping") >= 0) {
        return {
            fields: {
                select: () => () => Promise.resolve(mappingFields),
                addText: () => Promise.resolve(),
                addChoice: () => Promise.resolve()
            },
            items: {
                add: async (payload) => {
                    const newItem = {
                        ID: mappingListItems.length + 1,
                        Title: payload.Title || "",
                        AssignmentID: payload.AssignmentID || `ASG-${mappingListItems.length + 1}`,
                        Employe: payload.Employe || payload.Employee || "",
                        EmployeeID: payload.EmployeeID || payload.EmployeID || "",
                        AssetName: payload.AssetName || "",
                        SerialNumber: payload.SerialNumber || ""
                    };
                    mappingListItems.push(newItem);
                    return Promise.resolve({ data: newItem });
                },
                filter: (filterStr) => ({
                    select: () => () => {
                        const matches = mappingListItems.filter(item => {
                            if (filterStr.includes("DELL12345"))
                                return item.SerialNumber === "DELL12345";
                            return false;
                        });
                        return Promise.resolve(matches);
                    }
                }),
                getById: (id) => {
                    const numId = parseInt(id.toString(), 10);
                    return {
                        delete: async () => {
                            mappingListItems = mappingListItems.filter(i => i.ID !== numId);
                            return Promise.resolve();
                        }
                    };
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
    if (title.indexOf("Request") >= 0) {
        return {
            fields: {
                select: () => () => Promise.resolve([])
            },
            items: {
                filter: () => ({
                    select: () => () => Promise.resolve(requestListItems)
                }),
                getById: (id) => {
                    const numId = parseInt(id.toString(), 10);
                    return {
                        update: async (payload) => {
                            const item = requestListItems.find(i => i.ID === numId);
                            if (item)
                                Object.assign(item, payload);
                            return Promise.resolve();
                        }
                    };
                }
            },
            select: () => () => Promise.resolve({ Title: title })
        };
    }
    throw new Error(`Mock list not found: ${title}`);
}
describe("Asset Assignment Workflow Verification", () => {
    beforeEach(() => {
        inventoryListItems = [
            {
                ID: 101,
                Title: "Dell XPS 15",
                AssetName: "Dell XPS 15",
                SerialNumber: "DELL12345",
                Status: "In Stock",
                AssignedTo: null,
                AssignedToId: null
            }
        ];
        mappingListItems = [];
        requestListItems = [];
        eventLogListItems = [];
    });
    it("should successfully assign an In Stock asset to an employee", async () => {
        await AssetAssignmentService.assignAssetsToEmployee(["101"], "Adele Vance", "adele@contoso.com", "Admin User", "E1001", "Dev laptop assignment");
        // Inventory item should be updated to Assigned
        expect(inventoryListItems[0].Status).toBe("Assigned");
        expect(inventoryListItems[0].AssignedToId).toBe(15);
    });
});
//# sourceMappingURL=AssetAssignmentWorkflow.test.js.map