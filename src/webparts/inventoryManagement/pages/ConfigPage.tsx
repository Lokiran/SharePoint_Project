import * as React from 'react';
import {
  Pivot,
  PivotItem,
  PrimaryButton,
  DefaultButton,
  MessageBar,
  Stack,
  Icon
} from '@fluentui/react';
import { IConfigPageProps } from '../types/Config.types';
import styles from '../components/InventoryManagement.module.scss';

export const ConfigPage: React.FC<IConfigPageProps> = (props) => {
  const { state, actions } = props;

  return (
    <div>
      <div className={styles.cardHeader}>
        <h3>Configuration & List Management</h3>
        <p style={{ color: 'var(--text-muted)', margin: '4px 0 0 0', fontSize: '0.85rem' }}>
          Admin-only control center for list syncing, database connection tests, role diagnostics, and list schemas.
        </p>
      </div>

      <Pivot
        selectedKey={state.configSelectedTab}
        onLinkClick={(item) => actions.onTabChange(item ? (item.props.itemKey as any) || 'operations' : 'operations')}
        styles={{ root: { marginBottom: '20px', borderBottom: '1px solid rgba(128,128,128,0.1)' } }}
      >
        <PivotItem headerText="Sync Operations" itemKey="operations" />
        <PivotItem headerText="List Connections" itemKey="connections" />
        <PivotItem headerText="RBAC Site Groups" itemKey="rbac" />
        <PivotItem headerText="Required Schema Guides" itemKey="schema" />
      </Pivot>

      {state.configSelectedTab === 'operations' && (
        <div style={{ backgroundColor: 'var(--surface-color, #ffffff)', padding: '20px', borderRadius: '8px', border: '1px solid rgba(128, 128, 128, 0.12)', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
          <h4 style={{ marginBottom: '10px', color: '#111827', marginTop: 0 }}>Mapping List Management & Sync</h4>
          <p style={{ fontSize: '0.88rem', color: '#4b5563', margin: '0 0 15px 0' }}>
            Ensure all assets currently assigned to active employees are properly mapped to the SharePoint <strong>Mapping List</strong>.
            Use the buttons below to perform a manual synchronization check or diagnose the list&apos;s database schema.
          </p>

          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '15px' }}>
            <PrimaryButton
              text={state.syncInProgress ? "Processing..." : "Sync Assigned Assets"}
              iconProps={{ iconName: 'Sync' }}
              onClick={actions.onSyncAssignedAssets}
              disabled={state.syncInProgress}
            />
            <PrimaryButton
              text={state.syncInProgress ? "Checking Schema..." : "Run Schema Diagnostics"}
              iconProps={{ iconName: 'Database' }}
              onClick={actions.onRunDiagnostics}
              disabled={state.syncInProgress}
              styles={{
                root: { backgroundColor: '#5c2d91', borderColor: '#5c2d91' },
                rootHovered: { backgroundColor: '#4b2278', borderColor: '#4b2278' }
              }}
            />
          </div>

          {state.syncMessage && (
            <MessageBar
              messageBarType={state.syncMessageType}
              onDismiss={actions.onDismissSyncMessage}
              styles={{ root: { marginBottom: '15px', borderRadius: '6px' } }}
            >
              {state.syncMessage}
            </MessageBar>
          )}

          {state.diagnosticInfo && (
            <div style={{ marginTop: '15px' }}>
              <span style={{ display: 'block', fontSize: '0.85rem', fontWeight: 'bold', color: '#323130', marginBottom: '6px' }}>Diagnostic Log Output:</span>
              <textarea
                readOnly
                value={state.diagnosticInfo}
                rows={10}
                style={{
                  width: '100%',
                  fontFamily: 'monospace',
                  fontSize: '0.82rem',
                  padding: '10px',
                  backgroundColor: '#f3f2f1',
                  border: '1px solid #e1dfdd',
                  borderRadius: '4px',
                  resize: 'vertical',
                  color: '#323130'
                }}
              />
            </div>
          )}
        </div>
      )}

      {state.configSelectedTab === 'connections' && (
        <div style={{ backgroundColor: 'var(--surface-color, #ffffff)', padding: '20px', borderRadius: '8px', border: '1px solid rgba(128, 128, 128, 0.12)', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
          <h4 style={{ marginBottom: '15px', color: '#111827', marginTop: 0 }}>SharePoint List Connections</h4>
          <p style={{ fontSize: '0.85rem', color: '#6b7280', marginBottom: '20px' }}>
            Verify the read/write database connection status of the required SharePoint storage lists.
          </p>
          
          <Stack tokens={{ childrenGap: 16 }}>
            {[
              { title: 'Inventory List', internal: 'InventoryList', desc: 'Stores the master catalog of all physical assets and hardware.' },
              { title: 'Request List', internal: 'RequestList', desc: 'Manages employee request tickets, workflow histories, and assignment queues.' },
              { title: 'Asset Return Request List', internal: 'Asset Return Request List', desc: 'Handles asset return forms, check-in inspections, and manager validations.' },
              { title: 'Mapping List', internal: 'Mapping List', desc: 'Maintains live active assignment mapping for automated clearing checks.' },
              { title: 'System Audit Log', internal: 'AuditLogList', desc: 'Tracks historical change logs, lifecycle states, and admin operations.' }
            ].map(list => {
              const connectionStatus = state.connectionStatuses[list.title];
              const errorMsg = state.connectionErrorMessages[list.title];
              
              return (
                <div key={list.title} style={{ padding: '16px', borderRadius: '8px', border: '1px solid rgba(128, 128, 128, 0.15)', backgroundColor: 'var(--surface-color, #ffffff)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
                  <div style={{ flex: '1 1 300px' }}>
                    <h5 style={{ margin: '0 0 4px 0', fontSize: '0.95rem', fontWeight: 600, color: '#111827' }}>
                      {list.title} <span style={{ fontWeight: 'normal', color: '#6b7280', fontSize: '0.8rem' }}>({list.internal})</span>
                    </h5>
                    <span style={{ fontSize: '0.82rem', color: '#4b5563' }}>{list.desc}</span>
                    {errorMsg && (
                      <div style={{ marginTop: '8px', color: '#d13438', fontSize: '0.78rem', backgroundColor: '#fde7e9', padding: '6px 10px', borderRadius: '4px' }}>
                        <strong>Error:</strong> {errorMsg}
                      </div>
                    )}
                  </div>
                  
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    {connectionStatus === 'testing' && (
                      <span style={{ fontSize: '0.8rem', color: '#0078d4', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Icon iconName="ProgressLoopOuter" style={{ animation: 'spin 1.5s linear infinite' }} /> Verifying...
                      </span>
                    )}
                    {connectionStatus === 'connected' && (
                      <span style={{
                        color: '#166534',
                        backgroundColor: '#dcfce7',
                        padding: '4px 12px',
                        borderRadius: '9999px',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}>
                        <Icon iconName="Completed" /> Connected
                      </span>
                    )}
                    {connectionStatus === 'error' && (
                      <span style={{
                        color: '#b91c1c',
                        backgroundColor: '#fee2e2',
                        padding: '4px 12px',
                        borderRadius: '9999px',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}>
                        <Icon iconName="ErrorBadge" /> Failed
                      </span>
                    )}
                    {!connectionStatus && (
                      <span style={{
                        color: '#4b5563',
                        backgroundColor: '#f3f4f6',
                        padding: '4px 12px',
                        borderRadius: '9999px',
                        fontSize: '0.75rem',
                        fontWeight: 500
                      }}>
                        Not Verified
                      </span>
                    )}
                    
                    <DefaultButton
                      text="Test Live"
                      iconProps={{ iconName: 'PlugConnected' }}
                      onClick={() => actions.onTestListConnection(list.title, list.internal)}
                      disabled={connectionStatus === 'testing'}
                    />
                  </div>
                </div>
              );
            })}
          </Stack>
        </div>
      )}

      {state.configSelectedTab === 'rbac' && (
        <div style={{ backgroundColor: 'var(--surface-color, #ffffff)', padding: '20px', borderRadius: '8px', border: '1px solid rgba(128, 128, 128, 0.12)', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
          <h4 style={{ marginBottom: '15px', color: '#111827', marginTop: 0 }}>Role Based Access Control (RBAC)</h4>
          <p style={{ fontSize: '0.85rem', color: '#6b7280', marginBottom: '20px' }}>
            Inspect user groups resolved from SharePoint for permission level verification.
          </p>
          
          <Stack tokens={{ childrenGap: 16 }}>
            {[
              { group: 'MSFT Owners', role: 'Admin', desc: 'Full administrative rights to modify assets, approve returns, and manage database connection setups.' },
              { group: 'MSFT Members', role: 'Inventory Manager', desc: 'Write access to create items, process returns, assign assets, and view reports.' },
              { group: 'MSFT Visitors', role: 'Inventory Employee', desc: 'Read-only access to available stocks and permission to request return tickets.' }
            ].map(item => {
              const isLoading = state.loadingGroupUsers[item.group];
              const members = state.groupUsersList[item.group];
              
              return (
                <div key={item.group} style={{ padding: '16px', borderRadius: '8px', border: '1px solid rgba(128, 128, 128, 0.15)', backgroundColor: 'var(--surface-color, #ffffff)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                    <div>
                      <h5 style={{ margin: 0, fontSize: '1rem', fontWeight: 600, color: '#111827' }}>
                        {item.group} <span style={{ color: '#0078d4', fontSize: '0.8rem', backgroundColor: '#deecf9', padding: '2px 8px', borderRadius: '4px', marginLeft: '6px', fontWeight: 600 }}>{item.role}</span>
                      </h5>
                      <span style={{ fontSize: '0.8rem', color: '#4b5563', display: 'block', marginTop: '4px' }}>{item.desc}</span>
                    </div>
                    
                    <DefaultButton
                      text={isLoading ? "Loading..." : "View Members"}
                      iconProps={{ iconName: 'People' }}
                      onClick={() => actions.onLoadGroupUsers(item.group)}
                      disabled={isLoading}
                    />
                  </div>
                  
                  {members && (
                    <div style={{ marginTop: '12px', padding: '12px', backgroundColor: '#f9fafb', borderRadius: '6px', border: '1px solid rgba(128,128,128,0.1)' }}>
                      <span style={{ fontSize: '0.78rem', fontWeight: 600, color: '#374151', display: 'block', marginBottom: '6px' }}>Group Members ({members.length}):</span>
                      {members.length === 0 ? (
                        <span style={{ fontSize: '0.8rem', color: '#6b7280', fontStyle: 'italic' }}>No members found in this group</span>
                      ) : (
                        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                          {members.map((m, idx) => (
                            <span key={idx} style={{ backgroundColor: '#ffffff', border: '1px solid rgba(128,128,128,0.15)', padding: '4px 10px', borderRadius: '4px', fontSize: '0.78rem', color: '#111827', fontWeight: 500 }}>
                              {m}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </Stack>
        </div>
      )}

      {state.configSelectedTab === 'schema' && (
        <div style={{ backgroundColor: 'var(--surface-color, #ffffff)', padding: '20px', borderRadius: '8px', border: '1px solid rgba(128, 128, 128, 0.12)', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
          <h4 style={{ marginBottom: '5px', color: '#111827', marginTop: 0 }}>Required List Schema (Developer Reference)</h4>
          <p style={{ fontSize: '0.85rem', color: '#6b7280', marginBottom: '20px', marginTop: 0 }}>Ensure your SharePoint lists contain the following columns exactly as written to prevent validation errors.</p>

          <h5 style={{ marginTop: '15px', marginBottom: '8px', color: '#374151' }}>InventoryList <span style={{ fontWeight: 'normal', color: '#9ca3af' }}>(Asset Database)</span></h5>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '25px' }}>
            {['Title', 'AssetName', 'AssetType', 'SerialNumber', 'PurchaseDate', 'Status', 'Specifications', 'AssignedTo (Person/Group)'].map(col => (
              <span key={col} style={{ backgroundColor: '#f3f4f6', padding: '4px 10px', borderRadius: '4px', fontSize: '0.75rem', color: '#374151', border: '1px solid #e5e7eb' }}>{col}</span>
            ))}
          </div>

          <h5 style={{ marginBottom: '8px', color: '#374151' }}>RequestList <span style={{ fontWeight: 'normal', color: '#9ca3af' }}>(Approval Workflows)</span></h5>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '25px' }}>
            {['Title', 'Employee', 'AssetType', 'Quantity', 'ReasonforRequest', 'RequestStatus', 'RequestKey', 'AssetStatus'].map(col => (
              <span key={col} style={{ backgroundColor: '#f3f4f6', padding: '4px 10px', borderRadius: '4px', fontSize: '0.75rem', color: '#374151', border: '1px solid #e5e7eb' }}>{col}</span>
            ))}
          </div>

          <h5 style={{ marginBottom: '8px', color: '#374151' }}>Asset Return Request List <span style={{ fontWeight: 'normal', color: '#9ca3af' }}>(Returns Handling)</span></h5>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '25px' }}>
            {['Title', 'AssetID', 'AssetName', 'SerialNumber', 'Employee', 'ReasonforReturn', 'ProposedCondition', 'RequestStatus', 'ManagerComments'].map(col => (
              <span key={col} style={{ backgroundColor: '#f3f4f6', padding: '4px 10px', borderRadius: '4px', fontSize: '0.75rem', color: '#374151', border: '1px solid #e5e7eb' }}>{col}</span>
            ))}
          </div>

          <h5 style={{ marginBottom: '8px', color: '#374151' }}>Mapping List <span style={{ fontWeight: 'normal', color: '#9ca3af' }}>(Custody Tracking)</span></h5>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {['Title', 'SerialNumber', 'Employe', 'EmployeeID', 'AssetName', 'AssignmentID'].map(col => (
              <span key={col} style={{ backgroundColor: '#f3f4f6', padding: '4px 10px', borderRadius: '4px', fontSize: '0.75rem', color: '#374151', border: '1px solid #e5e7eb' }}>{col}</span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
