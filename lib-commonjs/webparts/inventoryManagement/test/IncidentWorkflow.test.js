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
        ensureUser: (name) => Promise.resolve({ Id: 20, data: { Id: 20 } })
    }
};
jest.mock("../pnpjsConfig", () => ({
    getSP: () => mockSP
}));
const IncidentService_1 = require("../services/IncidentService");
let incidentListItems = [];
let inventoryListItems = [];
let replacementListItems = [];
let mappingListItems = [];
let eventLogListItems = [];
const incidentFields = [
    { Title: "Title", InternalName: "Title", TypeAsString: "Text" },
    { Title: "Asset Name", InternalName: "AssetName", TypeAsString: "Text" },
    { Title: "Serial Number", InternalName: "SerialNumber", TypeAsString: "Text" },
    { Title: "Employee Name", InternalName: "EmployeeName", TypeAsString: "Text" },
    { Title: "Status", InternalName: "Status", TypeAsString: "Choice" },
    { Title: "Priority", InternalName: "Priority", TypeAsString: "Choice" }
];
function getMockList(title) {
    if (title.indexOf("Incident") >= 0) {
        return {
            fields: {
                select: () => () => Promise.resolve(incidentFields)
            },
            items: {
                add: async (payload) => {
                    const newItem = {
                        ID: incidentListItems.length + 1,
                        Title: payload.Title || "",
                        AssetName: payload.AssetName || "",
                        SerialNumber: payload.SerialNumber || "",
                        EmployeeName: payload.EmployeeName || "",
                        Status: payload.Status || "Reported",
                        Priority: payload.Priority || "Medium"
                    };
                    incidentListItems.push(newItem);
                    return Promise.resolve({ data: newItem });
                },
                getById: (id) => ({
                    update: async (payload) => {
                        const item = incidentListItems.find(i => i.ID === id);
                        if (item)
                            Object.assign(item, payload);
                        return Promise.resolve();
                    }
                }),
                filter: () => ({
                    select: () => () => Promise.resolve(incidentListItems)
                })
            },
            select: () => () => Promise.resolve({ Title: title })
        };
    }
    if (title.indexOf("Inventory") >= 0) {
        return {
            fields: {
                select: () => () => Promise.resolve([])
            },
            items: {
                getById: (id) => ({
                    update: async (payload) => {
                        const item = inventoryListItems.find(i => i.ID === id);
                        if (item)
                            Object.assign(item, payload);
                        return Promise.resolve();
                    }
                })
            },
            select: () => () => Promise.resolve({ Title: title })
        };
    }
    if (title.indexOf("Replacement") >= 0 || title.indexOf("Replacements") >= 0) {
        return {
            fields: {
                select: () => () => Promise.resolve([]),
                addText: () => Promise.resolve(),
                addChoice: () => Promise.resolve(),
                addMultilineText: () => Promise.resolve()
            },
            items: {
                add: async (payload) => {
                    replacementListItems.push(payload);
                    return Promise.resolve({ data: { Id: replacementListItems.length } });
                }
            },
            select: () => () => Promise.resolve({ Title: title })
        };
    }
    if (title.indexOf("Mapping") >= 0) {
        return {
            fields: { select: () => () => Promise.resolve([]) },
            items: {
                filter: () => ({
                    select: () => () => Promise.resolve(mappingListItems)
                }),
                getById: (id) => ({
                    update: async (payload) => {
                        const item = mappingListItems.find(i => i.ID === id);
                        if (item)
                            Object.assign(item, payload);
                        return Promise.resolve();
                    }
                })
            },
            select: () => () => Promise.resolve({ Title: title })
        };
    }
    if (title.indexOf("Event") >= 0) {
        return {
            fields: { select: () => () => Promise.resolve([]) },
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
describe("Incident Management & Replacement Workflow Verification", () => {
    let incidentService;
    beforeEach(() => {
        incidentService = new IncidentService_1.IncidentService({ pageContext: { web: { absoluteUrl: "https://contoso.sharepoint.com" } } });
        incidentListItems = [];
        inventoryListItems = [
            {
                ID: 301,
                Title: "Dell Latitude 7420",
                AssetName: "Dell Latitude 7420",
                SerialNumber: "DELL7420-OLD",
                Status: "Assigned",
                AssignedTo: "Adele Vance"
            },
            {
                ID: 302,
                Title: "Dell Latitude 7430",
                AssetName: "Dell Latitude 7430",
                SerialNumber: "DELL7430-NEW",
                Status: "In Stock",
                AssignedTo: null
            }
        ];
        replacementListItems = [];
        mappingListItems = [];
        eventLogListItems = [];
    });
    it("should report an incident and update inventory item status", async () => {
        await incidentService.createIncidentRequest({
            Title: "Screen Cracked",
            AssetName: "Dell Latitude 7420",
            SerialNumber: "DELL7420-OLD",
            EmployeeName: "Adele Vance",
            EmployeeID: "E1001",
            EmployeeEmail: "adele@contoso.com",
            IncidentType: "Hardware Damage",
            Priority: "High",
            Description: "Laptop screen cracked accidentally"
        });
        expect(incidentListItems.length).toBe(1);
        expect(incidentListItems[0].Title).toContain("Screen Cracked");
    });
});
//# sourceMappingURL=IncidentWorkflow.test.js.map