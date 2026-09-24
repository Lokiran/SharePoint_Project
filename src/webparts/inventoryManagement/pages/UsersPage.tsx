import * as React from 'react';
import { PrimaryButton, DetailsList, DetailsListLayoutMode, SelectionMode, DetailsRow } from '@fluentui/react';
import * as strings from 'InventoryManagementWebPartStrings';
import { InventoryList } from '../components/InventoryList';
import { AssetTracking } from '../components/AssetTracking';
import styles from '../components/InventoryManagement.module.scss';
import { IUsersPageProps } from '../types/Users.types';

export const UsersPage: React.FC<IUsersPageProps> = (props) => {
  const { state, actions } = props;
  const { employees, items, activeUserDisplayName, effectiveRole, activeUserEmail, expandedUserEmail } = state;

  return (
    <div>
      <div className={styles.cardHeader}>
        <h3>{strings.UsersPage.Title}</h3>
      </div>
      <p style={{ color: 'var(--text-muted)', marginBottom: '20px' }}>
        {strings.UsersPage.Description}
      </p>
      <div style={{ marginBottom: '20px', padding: '15px', backgroundColor: '#f0f6ff', borderRadius: '8px', borderLeft: '4px solid #0078d4' }}>
        <h4 style={{ marginTop: 0, marginBottom: '10px', color: '#0078d4' }}>{strings.UsersPage.GroupManagementTitle}</h4>
        <p style={{ margin: 0, fontSize: '0.9rem', color: '#323130', marginBottom: '15px' }}>
          {strings.UsersPage.GroupManagementDesc}
        </p>
        <PrimaryButton
          text={strings.UsersPage.ManageSitePermissionsButton}
          iconProps={{ iconName: 'Permissions' }}
          onClick={() => {
            const siteUrl = window.location.pathname.substring(0, window.location.pathname.toLowerCase().indexOf('/sitepages'));
            window.open(`${window.location.origin}${siteUrl}/_layouts/15/user.aspx`, '_blank');
          }}
        />
      </div>

      <h4 style={{ marginBottom: '15px' }}>{strings.UsersPage.DirectoryTitle}</h4>
      <div style={{ backgroundColor: 'var(--surface-color, #ffffff)', padding: '15px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
        <DetailsList
          items={employees.map(emp => {
            const realName = emp.jobTitle === 'Admin' ? (activeUserDisplayName || emp.name) : emp.name;
            const assignedItems = items.filter(i => actions.isAssetAssignedToCurrentUser(i, realName));
            const assetTypes = Array.from(new Set(assignedItems.map(a => a.assetType))).filter(t => t).join(', ');
            return {
              ...emp,
              assignedAssets: assignedItems.length,
              assignedItems: assignedItems,
              assetTypes: assetTypes || strings.UsersPage.AssetTypesNone
            };
          })}
          columns={[
            { key: 'col1', name: strings.UsersPage.ColName, fieldName: 'name', minWidth: 100, maxWidth: 150, isResizable: true },
            { key: 'col2', name: strings.UsersPage.ColEmail, fieldName: 'email', minWidth: 150, maxWidth: 200, isResizable: true },
            { key: 'col3', name: strings.UsersPage.ColDepartment, fieldName: 'department', minWidth: 100, maxWidth: 120, isResizable: true },
            { key: 'col4', name: strings.UsersPage.ColJobTitle, fieldName: 'jobTitle', minWidth: 120, maxWidth: 150, isResizable: true },
            {
              key: 'col5',
              name: strings.UsersPage.ColAssignedAssets,
              fieldName: 'assignedAssets',
              minWidth: 100,
              maxWidth: 120,
              isResizable: true,
              onRender: (item) => (
                <span style={{
                  backgroundColor: item.assignedAssets > 0 ? '#dbeafe' : '#f3f4f6',
                  color: item.assignedAssets > 0 ? '#1e40af' : '#4b5563',
                  padding: '4px 10px',
                  borderRadius: '9999px',
                  fontWeight: 'bold'
                }}>
                  {item.assignedAssets}
                </span>
              )
            },
            { key: 'col6', name: strings.UsersPage.ColAssetTypes, fieldName: 'assetTypes', minWidth: 120, maxWidth: 250, isResizable: true }
          ]}
          setKey="usersList"
          layoutMode={DetailsListLayoutMode.justified}
          selectionMode={SelectionMode.none}
          onRenderRow={(rowProps) => {
            if (!rowProps) return null;
            const isExpanded = expandedUserEmail === rowProps.item.email;

            return (
              <div>
                <div
                  onClick={() => actions.onToggleExpandUser(isExpanded ? undefined : rowProps.item.email)}
                  style={{ cursor: 'pointer', '&:hover': { backgroundColor: '#f3f2f1' } } as any}
                >
                  <DetailsRow {...rowProps} />
                </div>
                {isExpanded && (
                  <div style={{ padding: '20px 40px', backgroundColor: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
                    <h4 style={{ marginTop: 0, marginBottom: '15px', color: '#111827' }}>{strings.UsersPage.AssetsAssignedToPrefix} {rowProps.item.name}</h4>
                    {rowProps.item.assignedItems.length > 0 ? (
                      <InventoryList items={rowProps.item.assignedItems} isAdmin={false} />
                    ) : (
                      <p style={{ color: '#6b7280', fontSize: '0.9rem', margin: 0 }}>{strings.UsersPage.NoAssetsAssignedToUser}</p>
                    )}
                  </div>
                )}
              </div>
            );
          }}
        />
      </div>

      <div style={{ marginTop: '30px', borderTop: '1px solid rgba(128, 128, 128, 0.15)', paddingTop: '24px' }}>
        <div className={styles.cardHeader}>
          <h3>{strings.UsersPage.EmployeeTrackingTitle}</h3>
        </div>
        <p style={{ color: 'var(--text-muted)', marginBottom: '20px' }}>
          {strings.UsersPage.EmployeeTrackingDesc}
        </p>
        <AssetTracking
          items={items}
          employees={employees}
          currentUserRole={effectiveRole}
          currentUserName={activeUserDisplayName}
          currentUserEmail={activeUserEmail}
        />
      </div>
    </div>
  );
};
