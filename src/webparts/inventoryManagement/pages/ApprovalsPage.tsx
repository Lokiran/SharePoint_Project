import * as React from 'react';
import { TextField } from '@fluentui/react';
import { Pie } from 'react-chartjs-2';
import * as strings from 'InventoryManagementWebPartStrings';
import { RequestList } from '../components/RequestList';
import styles from '../components/InventoryManagement.module.scss';
import { IApprovalsPageProps } from '../types/Approvals.types';

export const ApprovalsPage: React.FC<IApprovalsPageProps> = (props) => {
  const { state, actions } = props;

  const statusCounts = state.managerQueueRequests.reduce((acc, req) => {
    const status = req.status || 'Pending';
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  const statusKeys = Object.keys(statusCounts);

  return (
    <div>
      <div className={styles.cardHeader}>
        <h3>{strings.ApprovalsPage.Title}</h3>
      </div>
      <p style={{ color: 'var(--text-muted)', marginBottom: '20px' }}>
        {strings.ApprovalsPage.Description}
      </p>
      <TextField
        label={strings.ApprovalsPage.SearchLabel}
        placeholder={strings.ApprovalsPage.SearchPlaceholder}
        value={state.requestSearchId}
        onChange={(_, value) => actions.onSearchChange(value || '')}
        styles={{ root: { marginBottom: '12px', maxWidth: 320 } }}
      />
      <div style={{ marginBottom: '20px', padding: '15px', backgroundColor: 'var(--surface-color, #ffffff)', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
        <h4 style={{ marginBottom: '10px' }}>{strings.ApprovalsPage.ChartTitle}</h4>
        <div style={{ height: '250px', position: 'relative' }}>
          <Pie
            data={{
              labels: statusKeys.length ? statusKeys : [strings.ApprovalsPage.NoDataLabel],
              datasets: [
                {
                  label: strings.ApprovalsPage.ChartDatasetLabel,
                  data: statusKeys.length ? statusKeys.map(k => statusCounts[k]) : [1],
                  backgroundColor: [
                    'rgba(255, 206, 86, 0.6)',
                    'rgba(75, 192, 192, 0.6)',
                    'rgba(255, 99, 132, 0.6)',
                    'rgba(153, 102, 255, 0.6)',
                    'rgba(54, 162, 235, 0.6)',
                  ],
                  borderColor: [
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(255, 99, 132, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(54, 162, 235, 1)',
                  ],
                  borderWidth: 1,
                },
              ],
            }}
            options={{ maintainAspectRatio: false }}
          />
        </div>
      </div>
      <RequestList
        items={state.visibleManagerRequests}
        inventoryItems={state.items}
        canApproveReject={true}
        canApproveAsset={false}
        hideStatusColumn={false}
        showResponseColumns={false}
        onApproveRequest={actions.onApproveRequest}
        onRejectRequest={actions.onRejectRequest}
        actionInProgressId={state.requestActionInProgressId}
      />
    </div>
  );
};
