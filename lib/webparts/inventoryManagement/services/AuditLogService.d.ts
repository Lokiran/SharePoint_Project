import { IEventLog } from "../models/IEventLog";
export declare class AuditLogService {
    static addAuditLog(log: Omit<IEventLog, 'id' | 'timestamp'>): Promise<void>;
    static getAuditLogs(): Promise<IEventLog[]>;
}
//# sourceMappingURL=AuditLogService.d.ts.map