import * as React from 'react';
import {
  Dropdown,
  IDropdownOption,
  DetailsList,
  DetailsListLayoutMode,
  SelectionMode,
  Stack,
  IStackTokens,
  MessageBar,
  MessageBarType
} from '@fluentui/react';
import { IInventoryItem } from '../models/IInventoryItem';
import { IEmployee } from '../models/IEmployee';
import { RoleUtils, UserRole } from '../utils/RoleUtils';
import styles from './InventoryManagement.module.scss';

export interface IAssetTrackingProps {
  items: IInventoryItem[];
  employees: IEmployee[];
  currentUserRole: UserRole;
  currentUserName?: string;
  currentUserEmail?: string;
  onAssignAssets?: (employeeName: string, employeeEmail: string, assetIds: string[]) => Promise<void>;
  isActionInProgress?: boolean;
}

export const AssetTracking: React.FC<IAssetTrackingProps> = (props) => {
  const [selectedEmployeeId, setSelectedEmployeeId] = React.useState<string | undefined>();

  const stackTokens: IStackTokens = { childrenGap: 20 };

  if (!RoleUtils.canAssignAssets(props.currentUserRole)) {
    return (
      <MessageBar messageBarType={MessageBarType.error}>
        You do not have permission to access the Asset Tracking section. Only Admins and Managers can assign assets.
      </MessageBar>
    );
  }

  // Patch the Admin employee with the REAL user's email and name so that SharePoint's ensureUser works correctly
  const patchedEmployees = props.employees.map(emp => {
    if (emp.jobTitle === 'Admin') {
      return {
        ...emp,
        name: props.currentUserName || emp.name,
        email: props.currentUserEmail || emp.email
      };
    }
    return emp;
  });

  const employeeOptions: IDropdownOption[] = patchedEmployees.map(emp => ({
    key: emp.id,
    text: `${emp.name} (${emp.department})`
  }));

  const selectedEmployee = patchedEmployees.find(e => e.id === selectedEmployeeId);
  const normalize = (val: string | undefined) => (val || '').toLowerCase().replace(/[^a-z0-9]/g, '');
  const employeeAssignedAssets = props.items.filter(i => {
    if (!selectedEmployee) return false;
    const nameNorm = normalize(selectedEmployee.name);
    const assignedNorm = normalize(i.assignedTo);
    const isAssigned = assignedNorm && (assignedNorm === nameNorm || assignedNorm.includes(nameNorm) || nameNorm.includes(assignedNorm));
    const isNoted = (i.note || '').toLowerCase().includes('assigned to:') && normalize(i.note).includes(nameNorm);
    const isStatus = (i.status || '').toLowerCase().includes('assigned to:') && normalize(i.status).includes(nameNorm);
    return isAssigned || isNoted || isStatus;
  });

  return (
    <div style={{ marginTop: '20px' }}>
      <div style={{ backgroundColor: 'var(--surface-color, #ffffff)', padding: '20px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', marginBottom: '20px' }}>
        <h4 style={{ marginTop: 0, marginBottom: '15px', color: '#111827' }}>Select Employee</h4>
        <Dropdown
          placeholder="Select an employee to view assets"
          options={employeeOptions}
          selectedKey={selectedEmployeeId}
          onChange={(_, option) => setSelectedEmployeeId(option?.key as string)}
          styles={{ dropdown: { width: '100%', maxWidth: 400 } }}
        />
      </div>

      {selectedEmployee && (
        <Stack tokens={stackTokens}>
          {/* Currently Assigned Assets Section */}
          <div style={{ backgroundColor: 'var(--surface-color, #ffffff)', padding: '20px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <h4 style={{ marginTop: 0, marginBottom: '15px', color: '#111827' }}>Currently Assigned to {selectedEmployee.name}</h4>
            {employeeAssignedAssets.length > 0 ? (
              <div className={styles.tableWrapper}>
                <DetailsList
                  items={employeeAssignedAssets}
                  columns={[
                    { key: 'col1', name: 'Asset Name', fieldName: 'assetName', minWidth: 150, maxWidth: 200, isResizable: true, onRender: item => item.assetName || item.title },
                    { key: 'col2', name: 'Type', fieldName: 'assetType', minWidth: 100, maxWidth: 150, isResizable: true },
                    { key: 'col3', name: 'Serial Number', fieldName: 'serialNumber', minWidth: 120, maxWidth: 180, isResizable: true },
                    { key: 'col4', name: 'Status', fieldName: 'status', minWidth: 100, maxWidth: 120, isResizable: true },
                    { 
                      key: 'col5', 
                      name: 'Assigned Date', 
                      fieldName: 'assignedDate', 
                      minWidth: 120, 
                      maxWidth: 150, 
                      isResizable: true,
                      onRender: item => {
                        if (!item.assignedDate) return 'N/A';
                        try {
                          return new Date(item.assignedDate).toLocaleString();
                        } catch {
                          return item.assignedDate;
                        }
                      }
                    }
                  ]}
                  selectionMode={SelectionMode.none}
                  layoutMode={DetailsListLayoutMode.justified}
                />
              </div>
            ) : (
              <p style={{ color: '#6b7280', fontSize: '0.9rem' }}>This employee has no assets currently assigned.</p>
            )}
          </div>
        </Stack>
      )}
    </div>
  );
};
