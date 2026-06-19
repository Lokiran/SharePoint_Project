export interface INotification {
    id: string;
    title: string;
    message: string;
    type: 'info' | 'success' | 'warning' | 'error';
    timestamp: string;
    isRead: boolean;
    actionLink: string;
    category: 'Request' | 'Assignment' | 'Audit';
}
//# sourceMappingURL=INotification.d.ts.map