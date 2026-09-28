import { WebPartContext } from '@microsoft/sp-webpart-base';
import '@pnp/sp/webs';
import '@pnp/sp/lists';
import '@pnp/sp/items';
import '@pnp/sp/fields';
export declare class IncidentService {
    private sp;
    private get incidentListName();
    private get employeeListName();
    private get mappingListName();
    private get replacementListName();
    private static _replacementListFieldsEnsured;
    getReplacementList(): Promise<any>;
    private _ensureReplacementListFields;
    constructor(spContext: WebPartContext);
    private _migrateLocalReplacements;
    private getMappedPayload;
    private getLocalItems;
    private saveLocalItems;
    private getEmployeeNameFromEmail;
    private filterByUser;
    private getMappedItems;
    private getMappedAssignedAssets;
    getEmployeeIncidentHistory(userEmail: string, isAdmin?: boolean): Promise<any[]>;
    getEmployeeReplacementHistory(userEmail: string, isAdmin?: boolean): Promise<any[]>;
    updateIncidentStatus(id: string, status: string, resolution?: string): Promise<any>;
    getEmployeeAssignedAssets(userEmail: string): Promise<any[]>;
    createIncidentRequest(incidentData: any, file?: File): Promise<any>;
    getEmployeeDetailsByName(employeeName: string): Promise<any>;
    private formatError;
}
//# sourceMappingURL=IncidentService.d.ts.map