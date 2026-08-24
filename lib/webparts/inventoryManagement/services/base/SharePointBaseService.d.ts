export interface IFieldMetadata {
    displayName: string;
    internalName: string;
    fieldType: string;
    required: boolean;
    choices?: string[];
}
export declare class SharePointBaseService {
    static readonly LIST_NAME = "InventoryList";
    static readonly EVENT_LOG_LIST = "EventLogList";
    static readonly REQUEST_LIST_NAME = "RequestList";
    static readonly RETURN_REQUEST_LIST_NAME = "Asset Return Request List";
    static readonly REQUEST_STATUS_INTERNAL_NAME = "RequestStatus";
    static readonly REQUEST_COMMENT_INTERNAL_NAME = "ManagerComment";
    static readonly REQUEST_KEY_INTERNAL_NAME = "RequestKey";
    static readonly ASSET_STATUS_INTERNAL_NAME = "AssetStatus";
    static readonly MAPPING_LIST_NAME = "Mapping List";
    static getSafeListFields(list: any): Promise<any[]>;
    static getListFieldsMetadata(list: any): Promise<IFieldMetadata[]>;
    static formatToSharePointDate(dateStr: any): string | null;
    static _coerceAndValidatePayload(logicalPayload: {
        [logicalKey: string]: any;
    }, schema: IFieldMetadata[], resolvedMapping: {
        [logicalKey: string]: string;
    }, requiredKeys: string[]): Promise<any>;
    static translateSharePointError(error: any, payload: any, mapping: any): Error;
    static _resolveFieldInternalName(fields: IFieldMetadata[], aliases: string[], excludeFields?: Set<string>): string | null;
    static _fetchItemsWithExpandedUsers(list: any, filterStr?: string): Promise<any[]>;
    static _isBusinessStatusKey(key: string): boolean;
}
//# sourceMappingURL=SharePointBaseService.d.ts.map