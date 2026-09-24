import * as React from 'react';
import {
  Pivot,
  PivotItem,
  PrimaryButton,
  DetailsList,
  DetailsListLayoutMode,
  SelectionMode,
  Stack,
  Dropdown
} from '@fluentui/react';
import { Pie, Bar, Doughnut } from 'react-chartjs-2';
import { IReportsPageProps } from '../types/Reports.types';
import styles from '../components/InventoryManagement.module.scss';
import * as strings from 'InventoryManagementWebPartStrings';

export const ReportsPage: React.FC<IReportsPageProps> = (props) => {
  const { state, actions } = props;
  const { items, requests } = state;

  return (
    <div>
      <div className={styles.cardHeader} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h3>{strings.ReportsPage.HeaderTitle}</h3>
          <p style={{ color: 'var(--text-muted)', margin: '4px 0 0 0', fontSize: '0.85rem' }}>
            {strings.ReportsPage.HeaderSubtitle}
          </p>
        </div>
      </div>

      <Pivot
        selectedKey={state.reportsSelectedTab}
        onLinkClick={(item) => actions.onTabChange(item ? item.props.itemKey || 'insights' : 'insights')}
        styles={{ root: { marginBottom: '20px', borderBottom: '1px solid rgba(128,128,128,0.1)' } }}
      >
        <PivotItem headerText={strings.ReportsPage.TabVisualInsights} itemKey="insights" />
        <PivotItem headerText={strings.ReportsPage.TabDetailedReports} itemKey="detailed" />
        <PivotItem headerText={strings.ReportsPage.TabWarrantyExpiry} itemKey="expiry" />
      </Pivot>

      {state.reportsSelectedTab === 'insights' && (
        <Stack tokens={{ childrenGap: 24 }}>
          {/* Stats Summary Cards Row */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
            <div style={{ padding: '16px', backgroundColor: 'var(--surface-color, #ffffff)', borderRadius: '8px', border: '1px solid rgba(128, 128, 128, 0.12)', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
              <span style={{ display: 'block', fontSize: '0.82rem', color: '#6b7280', fontWeight: 600, marginBottom: '6px' }}>{strings.ReportsPage.StatTotalAssets}</span>
              <span style={{ fontSize: '1.75rem', fontWeight: 'bold', color: 'var(--text-main, #111827)' }}>{items.length}</span>
            </div>
            <div style={{ padding: '16px', backgroundColor: 'var(--surface-color, #ffffff)', borderRadius: '8px', border: '1px solid rgba(128, 128, 128, 0.12)', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
              <span style={{ display: 'block', fontSize: '0.82rem', color: '#1e40af', fontWeight: 600, marginBottom: '6px' }}>{strings.ReportsPage.StatAssetsAssigned}</span>
              <span style={{ fontSize: '1.75rem', fontWeight: 'bold', color: '#1e3a8a' }}>{items.length - items.filter(i => i.status === 'In Stock' || i.status === 'Yes').length}</span>
            </div>
            <div style={{ padding: '16px', backgroundColor: 'var(--surface-color, #ffffff)', borderRadius: '8px', border: '1px solid rgba(128, 128, 128, 0.12)', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
              <span style={{ display: 'block', fontSize: '0.82rem', color: '#166534', fontWeight: 600, marginBottom: '6px' }}>{strings.ReportsPage.StatUtilizationRate}</span>
              <span style={{ fontSize: '1.75rem', fontWeight: 'bold', color: '#14532d' }}>
                {items.length > 0 ? Math.round(((items.length - items.filter(i => i.status === 'In Stock' || i.status === 'Yes').length) / items.length) * 100) : 0}%
              </span>
            </div>
            <div style={{ padding: '16px', backgroundColor: 'var(--surface-color, #ffffff)', borderRadius: '8px', border: '1px solid rgba(128, 128, 128, 0.12)', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
              <span style={{ display: 'block', fontSize: '0.82rem', color: '#92400e', fontWeight: 600, marginBottom: '6px' }}>{strings.ReportsPage.StatTotalRequests}</span>
              <span style={{ fontSize: '1.75rem', fontWeight: 'bold', color: '#78350f' }}>{requests.length}</span>
            </div>
          </div>

          {/* Charts Grid */}
          <div className={styles.responsiveGridGap20}>
            {/* Chart 1: Status Distribution */}
            <div style={{ backgroundColor: 'var(--surface-color, #ffffff)', padding: '20px', borderRadius: '8px', border: '1px solid rgba(128, 128, 128, 0.12)', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <h4 style={{ margin: '0 0 15px 0', alignSelf: 'flex-start', color: '#374151' }}>{strings.ReportsPage.ChartStatusDistribution}</h4>
              <div style={{ height: '220px', width: '220px', position: 'relative' }}>
                <Pie
                  data={{
                    labels: [strings.ReportsPage.DataLabelInStock, strings.ReportsPage.DataLabelAssigned, strings.ReportsPage.DataLabelPendingReturn, strings.ReportsPage.DataLabelUnderMaintenance],
                    datasets: [{
                      data: [
                        items.filter(i => i.status === 'In Stock' || i.status === 'Yes').length,
                        items.filter(i => i.status === 'Assigned' || i.status === 'Yes (Assigned)').length,
                        items.filter(i => i.status === 'Pending Return').length,
                        items.filter(i => i.status === 'Under Maintenance' || i.status === 'Damaged' || i.status === 'Poor').length,
                      ],
                      backgroundColor: ['#107c41', '#1f77b4', '#ea580c', '#b91c1c']
                    }]
                  }}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: { legend: { display: false } }
                  }}
                />
              </div>
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center', marginTop: '15px', fontSize: '0.78rem', color: '#4b5563' }}>
                <span><span style={{ color: '#107c41', fontSize: '1.25rem', verticalAlign: 'middle', marginRight: '4px' }}>●</span>{strings.ReportsPage.LegendInStock}</span>
                <span><span style={{ color: '#1f77b4', fontSize: '1.25rem', verticalAlign: 'middle', marginRight: '4px' }}>●</span>{strings.ReportsPage.LegendAssigned}</span>
                <span><span style={{ color: '#ea580c', fontSize: '1.25rem', verticalAlign: 'middle', marginRight: '4px' }}>●</span>{strings.ReportsPage.LegendPendingReturn}</span>
                <span><span style={{ color: '#b91c1c', fontSize: '1.25rem', verticalAlign: 'middle', marginRight: '4px' }}>●</span>{strings.ReportsPage.LegendMaintenance}</span>
              </div>
            </div>

            {/* Chart 2: Category Distribution */}
            <div style={{ backgroundColor: 'var(--surface-color, #ffffff)', padding: '20px', borderRadius: '8px', border: '1px solid rgba(128, 128, 128, 0.12)', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
              <h4 style={{ margin: '0 0 15px 0', color: '#374151' }}>{strings.ReportsPage.ChartTypeDistribution}</h4>
              <div style={{ height: '240px' }}>
                {(() => {
                  const typeCounts: { [type: string]: number } = {};
                  items.forEach(i => {
                    const type = i.assetType || "Other";
                    typeCounts[type] = (typeCounts[type] || 0) + 1;
                  });
                  const labels = Object.keys(typeCounts);
                  const data = Object.keys(typeCounts).map(key => typeCounts[key]);

                  return (
                    <Bar
                      data={{
                        labels,
                        datasets: [{
                          label: strings.ReportsPage.ChartDatasetAssetsCount,
                          data,
                          backgroundColor: '#1f77b4',
                          borderRadius: 4
                        }]
                      }}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: { legend: { display: false } },
                        scales: {
                          y: { beginAtZero: true, ticks: { precision: 0 } }
                        }
                      }}
                    />
                  );
                })()}
              </div>
            </div>

            {/* Chart 3: Asset Aging */}
            <div style={{ backgroundColor: 'var(--surface-color, #ffffff)', padding: '20px', borderRadius: '8px', border: '1px solid rgba(128, 128, 128, 0.12)', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <h4 style={{ margin: '0 0 15px 0', alignSelf: 'flex-start', color: '#374151' }}>{strings.ReportsPage.ChartAgingAnalysis}</h4>
              <div style={{ height: '220px', width: '220px', position: 'relative' }}>
                {(() => {
                  const now = new Date();
                  const aging = items.reduce((acc, item) => {
                    if (!item.purchaseDate) {
                      acc.unknown++;
                      return acc;
                    }
                    const pd = new Date(item.purchaseDate);
                    const diffYears = Math.abs(now.getTime() - pd.getTime()) / (1000 * 60 * 60 * 24 * 365);
                    if (diffYears < 1) acc.under1++;
                    else if (diffYears <= 3) acc.between1and3++;
                    else acc.over3++;
                    return acc;
                  }, { under1: 0, between1and3: 0, over3: 0, unknown: 0 });

                  return (
                    <Doughnut
                      data={{
                        labels: [strings.ReportsPage.DataLabelAgingUnder1, strings.ReportsPage.DataLabelAging1to3, strings.ReportsPage.DataLabelAgingOver3, strings.ReportsPage.DataLabelAgingUnknown],
                        datasets: [{
                          data: [aging.under1, aging.between1and3, aging.over3, aging.unknown],
                          backgroundColor: ['#2ca02c', '#ff7f0e', '#d62728', '#9467bd']
                        }]
                      }}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: { legend: { display: false } }
                      }}
                    />
                  );
                })()}
              </div>
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center', marginTop: '15px', fontSize: '0.78rem', color: '#4b5563' }}>
                <span><span style={{ color: '#2ca02c', fontSize: '1.25rem', verticalAlign: 'middle', marginRight: '4px' }}>●</span>{strings.ReportsPage.LegendAgingUnder1}</span>
                <span><span style={{ color: '#ff7f0e', fontSize: '1.25rem', verticalAlign: 'middle', marginRight: '4px' }}>●</span>{strings.ReportsPage.LegendAging1to3}</span>
                <span><span style={{ color: '#d62728', fontSize: '1.25rem', verticalAlign: 'middle', marginRight: '4px' }}>●</span>{strings.ReportsPage.LegendAgingOver3}</span>
                <span><span style={{ color: '#9467bd', fontSize: '1.25rem', verticalAlign: 'middle', marginRight: '4px' }}>●</span>{strings.ReportsPage.LegendAgingUnknown}</span>
              </div>
            </div>

            {/* Chart 4: Request Trends */}
            <div style={{ backgroundColor: 'var(--surface-color, #ffffff)', padding: '20px', borderRadius: '8px', border: '1px solid rgba(128, 128, 128, 0.12)', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
              <h4 style={{ margin: '0 0 15px 0', color: '#374151' }}>{strings.ReportsPage.ChartRequestTrends}</h4>
              <div style={{ height: '240px' }}>
                <Bar
                  data={{
                    labels: [strings.ReportsPage.DataLabelApproved, strings.ReportsPage.DataLabelDeclinedRejected, strings.ReportsPage.DataLabelPending],
                    datasets: [{
                      data: [
                        requests.filter(r => (r.status || '').toLowerCase().includes('approv')).length,
                        requests.filter(r => (r.status || '').toLowerCase().includes('declin') || (r.status || '').toLowerCase().includes('reject')).length,
                        requests.filter(r => (r.status || '').toLowerCase() === 'pending').length
                      ],
                      backgroundColor: ['#2ca02c', '#d62728', '#ff7f0e']
                    }]
                  }}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: { legend: { display: false } },
                    scales: {
                      y: { beginAtZero: true, ticks: { precision: 0 } }
                    }
                  }}
                />
              </div>
            </div>
          </div>
        </Stack>
      )}

      {state.reportsSelectedTab === 'detailed' && (
        <div style={{ backgroundColor: 'var(--surface-color, #ffffff)', padding: '20px', borderRadius: '8px', border: '1px solid rgba(128, 128, 128, 0.12)', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '15px', alignItems: 'center', marginBottom: '20px' }}>
            <h4 style={{ margin: 0 }}>{strings.ReportsPage.DetailedTitle}</h4>
            <Stack horizontal tokens={{ childrenGap: 8 }}>
              <PrimaryButton
                text={strings.ReportsPage.ExportExcel}
                iconProps={{ iconName: 'ExcelDocument' }}
                onClick={() => {
                  const filtered = items.filter(i => {
                    const typeMatch = state.reportsAssetTypeFilter === 'All' || i.assetType === state.reportsAssetTypeFilter;
                    const statusMatch = state.reportsStatusFilter === 'All' || i.status === state.reportsStatusFilter;
                    return typeMatch && statusMatch;
                  });
                  actions.onExportDetailedReportToExcel(filtered);
                }}
                styles={{ root: { backgroundColor: '#107c41', borderColor: '#107c41', color: '#ffffff' } }}
              />
              <PrimaryButton
                text={strings.ReportsPage.ExportPDF}
                iconProps={{ iconName: 'PDF' }}
                onClick={() => {
                  const filtered = items.filter(i => {
                    const typeMatch = state.reportsAssetTypeFilter === 'All' || i.assetType === state.reportsAssetTypeFilter;
                    const statusMatch = state.reportsStatusFilter === 'All' || i.status === state.reportsStatusFilter;
                    return typeMatch && statusMatch;
                  });
                  actions.onExportDetailedReportToPDF(filtered);
                }}
                styles={{ root: { backgroundColor: '#d13438', borderColor: '#d13438', color: '#ffffff' } }}
              />
            </Stack>
          </div>

          {/* Filters Row */}
          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', marginBottom: '20px', padding: '12px', backgroundColor: '#f9fafb', borderRadius: '6px' }}>
            <div style={{ minWidth: '150px' }}>
              <Dropdown
                label={strings.ReportsPage.LabelAssetType}
                selectedKey={state.reportsAssetTypeFilter}
                options={[
                  { key: 'All', text: strings.ReportsPage.FilterAllTypes },
                  ...Array.from(new Set(items.map(i => i.assetType).filter(Boolean))).map(type => ({ key: type, text: type }))
                ]}
                onChange={(_, opt) => actions.onAssetTypeFilterChange(opt ? opt.key as string : 'All')}
              />
            </div>
            <div style={{ minWidth: '150px' }}>
              <Dropdown
                label={strings.ReportsPage.LabelAssetStatus}
                selectedKey={state.reportsStatusFilter}
                options={[
                  { key: 'All', text: strings.ReportsPage.FilterAllStatuses },
                  ...Array.from(new Set(items.map(i => i.status).filter(Boolean))).map(status => ({ key: status, text: status }))
                ]}
                onChange={(_, opt) => actions.onStatusFilterChange(opt ? opt.key as string : 'All')}
              />
            </div>
          </div>

          {(() => {
            const filtered = items.filter(i => {
              const typeMatch = state.reportsAssetTypeFilter === 'All' || i.assetType === state.reportsAssetTypeFilter;
              const statusMatch = state.reportsStatusFilter === 'All' || i.status === state.reportsStatusFilter;
              return typeMatch && statusMatch;
            });

            return (
              <DetailsList
                items={filtered}
                columns={[
                  { key: 'col1', name: strings.Columns.AssetName, fieldName: 'assetName', minWidth: 120, maxWidth: 180, isResizable: true, onRender: (item) => item.assetName || item.title },
                  { key: 'col2', name: strings.ReportsPage.LabelAssetType, fieldName: 'assetType', minWidth: 90, maxWidth: 120, isResizable: true },
                  { key: 'col3', name: strings.Columns.Status, fieldName: 'status', minWidth: 90, maxWidth: 120, isResizable: true },
                  { key: 'col4', name: strings.Columns.Condition, fieldName: 'condition', minWidth: 80, maxWidth: 100, isResizable: true },
                  { key: 'col5', name: strings.Columns.AssignedTo, fieldName: 'assignedTo', minWidth: 100, maxWidth: 140, isResizable: true, onRender: (item) => item.assignedTo || <span style={{ color: '#9ca3af', fontStyle: 'italic' }}>{strings.ReportsPage.ColUnassigned}</span> }
                ]}
                setKey="detailedReportList"
                layoutMode={DetailsListLayoutMode.justified}
                selectionMode={SelectionMode.none}
              />
            );
          })()}
        </div>
      )}

      {state.reportsSelectedTab === 'expiry' && (
        <div style={{ backgroundColor: 'var(--surface-color, #ffffff)', padding: '20px', borderRadius: '8px', border: '1px solid rgba(128, 128, 128, 0.12)', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
            <h4 style={{ margin: 0 }}>{strings.ReportsPage.WarrantyTitle}</h4>
            <Stack horizontal tokens={{ childrenGap: 8 }}>
              <PrimaryButton
                text={strings.ReportsPage.ExportExcel}
                iconProps={{ iconName: 'ExcelDocument' }}
                onClick={actions.onExportWarrantyReportToExcel}
                styles={{ root: { backgroundColor: '#107c41', borderColor: '#107c41', color: '#ffffff' } }}
              />
              <PrimaryButton
                text={strings.ReportsPage.ExportPDF}
                iconProps={{ iconName: 'PDF' }}
                onClick={actions.onExportWarrantyReportToPDF}
                styles={{ root: { backgroundColor: '#d13438', borderColor: '#d13438', color: '#ffffff' } }}
              />
            </Stack>
          </div>
          <div style={{ marginBottom: '15px', display: 'flex', gap: '20px' }}>
            <div style={{ padding: '10px 15px', backgroundColor: '#f3f4f6', borderRadius: '6px' }}>
              <span style={{ display: 'block', fontSize: '0.85rem', color: '#4b5563', marginBottom: '4px' }}>{strings.ReportsPage.TotalAssetsCountLabel}</span>
              <span style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#111827' }}>{items.length}</span>
            </div>
            <div style={{ padding: '10px 15px', backgroundColor: '#f3f4f6', borderRadius: '6px' }}>
              <span style={{ display: 'block', fontSize: '0.85rem', color: '#4b5563', marginBottom: '4px' }}>{strings.ReportsPage.AssetsWithWarrantyLabel}</span>
              <span style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#111827' }}>{items.filter(i => i.warrantyExpiry).length}</span>
            </div>
          </div>
          <DetailsList
            items={items}
            columns={[
              { key: 'col1', name: strings.Columns.AssetName, fieldName: 'assetName', minWidth: 120, maxWidth: 200, isResizable: true, onRender: (item) => item.assetName || item.title },
              { key: 'col2', name: strings.ReportsPage.LabelAssetType, fieldName: 'assetType', minWidth: 100, maxWidth: 150, isResizable: true },
              { key: 'col3', name: strings.Columns.Status, fieldName: 'status', minWidth: 80, maxWidth: 100, isResizable: true },
              { key: 'col4', name: strings.Columns.PurchaseDate, fieldName: 'purchaseDate', minWidth: 100, maxWidth: 120, isResizable: true },
              {
                key: 'col5',
                name: strings.ReportsPage.ColWarrantyExpiryDate,
                fieldName: 'warrantyExpiry',
                minWidth: 140,
                maxWidth: 200,
                isResizable: true,
                onRender: (item) => {
                  const isExpired = item.warrantyExpiry && new Date(item.warrantyExpiry) < new Date();
                  return (
                    <span style={{
                      color: isExpired ? '#ef4444' : '#166534',
                      fontWeight: 600,
                      backgroundColor: isExpired ? '#fee2e2' : '#dcfce7',
                      padding: '2px 8px',
                      borderRadius: '9999px',
                      fontSize: '0.75rem',
                      display: 'inline-block'
                    }}>
                      {item.warrantyExpiry || strings.ReportsPage.WarrantyNotAvailable} {isExpired ? strings.ReportsPage.WarrantyExpiredTag : strings.ReportsPage.WarrantyActiveTag}
                    </span>
                  );
                }
              }
            ]}
            setKey="warrantyReport"
            layoutMode={DetailsListLayoutMode.justified}
            selectionMode={SelectionMode.none}
          />
        </div>
      )}
    </div>
  );
};
