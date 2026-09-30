import * as React from 'react';
import { useState, useEffect } from 'react';
import {
  Stack,
  Text,
  DetailsList,
  DetailsListLayoutMode,
  SelectionMode,
  IColumn,
  Icon,
  SearchBox,
  Dropdown,
  IDropdownOption,
  PrimaryButton,
  TextField,
  Panel,
  PanelType,
} from '@fluentui/react';
import { saveNexerReport, formatReportDate, INexerReportSection } from '../../utils/NexerPdfReport';
import { IInventoryManagementProps } from '../../models/IInventoryManagementProps';
import { IncidentService } from '../../services/IncidentService';
import { INCIDENT_STATUS_OPTIONS } from '../../constants/DropdownConstants';
import styles from '../InventoryManagement.module.scss';
import * as strings from 'InventoryManagementWebPartStrings';
import { formatString } from '../../utils/LocalizationUtils';

interface IIncidentHistoryItem {
  id: string;
  incidentId: string;
  assetId: string;
  assetName: string;
  issueType: string;
  issueDescription: string;
  priority: string;
  status: string;
  reportedDate: string;
  resolvedDate?: string;
  assignedTo?: string;
  resolution?: string;
  /** Saved only in this browser because the SharePoint write failed. */
  isLocalOnly?: boolean;
}

export const IncidentHistory: React.FC<IInventoryManagementProps & { setIsLoading: (loading: boolean) => void; userRole?: string; }> = (props) => {
  const [incidents, setIncidents] = useState<IIncidentHistoryItem[]>([]);
  const [filteredIncidents, setFilteredIncidents] = useState<IIncidentHistoryItem[]>([]);
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [selectedIncident, setSelectedIncident] = useState<IIncidentHistoryItem | null>(null);
  const [showDetailPanel, setShowDetailPanel] = useState(false);
  const [tempResolution, setTempResolution] = useState('');
  const [toastNotification, setToastNotification] = useState<{ message: string; title?: string; isError?: boolean } | null>(null);

  const triggerToast = (message: string, title: string = strings.IncidentHistory.ToastIncidentUpdatedTitle, isError: boolean = false) => {
    setToastNotification({ message, title, isError });
    setTimeout(() => setToastNotification(null), isError ? 8000 : 4000);
  };

  const getPriorityBadgeStyle = (priority?: string) => {
    const p = priority || 'Medium';
    let backgroundColor = '#f3f4f6';
    let color = '#4b5563';
    if (p === 'High' || p === 'Critical') {
      backgroundColor = '#fee2e2';
      color = '#b91c1c';
    } else if (p === 'Low') {
      backgroundColor = '#dbeafe';
      color = '#1e3a8a';
    }
    return {
      backgroundColor,
      color,
      padding: '4px 10px',
      borderRadius: '9999px',
      fontSize: '0.75rem',
      fontWeight: 600 as const,
      display: 'inline-block'
    };
  };

  const getStatusBadgeStyle = (status?: string) => {
    const s = status || 'Open';
    let backgroundColor = '#fee2e2';
    let color = '#991b1b';
    if (s === 'In Progress') {
      backgroundColor = '#fef3c7';
      color = '#92400e';
    } else if (s === 'Resolved') {
      backgroundColor = '#dcfce7';
      color = '#166534';
    } else if (s === 'Closed') {
      backgroundColor = '#f3f4f6';
      color = '#4b5563';
    }
    return {
      backgroundColor,
      color,
      padding: '4px 12px',
      borderRadius: '9999px',
      fontSize: '0.75rem',
      fontWeight: 600 as const,
      display: 'inline-block',
      textAlign: 'center' as const
    };
  };

  useEffect(() => {
    loadIncidents();
  }, [props.userEmail]);

  useEffect(() => {
    filterIncidents();
  }, [searchText, statusFilter, incidents]);

  const loadIncidents = async () => {
    try {
      props.setIsLoading(true);
      const service = new IncidentService(props.spContext);
      const isAdmin = props.userRole === 'Admin';
      const data = await service.getEmployeeIncidentHistory(props.userEmail, isAdmin);
      setIncidents(data);
    } catch (error) {
      console.error('Error loading incident history:', error);
    } finally {
      props.setIsLoading(false);
    }
  };

  const filterIncidents = () => {
    let filtered = [...incidents];

    if (searchText) {
      filtered = filtered.filter(
        (incident) =>
          (incident.assetName || '').toLowerCase().includes(searchText.toLowerCase()) ||
          (incident.issueType || '').toLowerCase().includes(searchText.toLowerCase()) ||
          (incident.incidentId || '').toLowerCase().includes(searchText.toLowerCase())
      );
    }

    if (statusFilter) {
      filtered = filtered.filter((incident) => incident.status === statusFilter);
    }

    setFilteredIncidents(filtered);
  };

  const handleViewDetails = (item: IIncidentHistoryItem) => {
    setSelectedIncident(item);
    setTempResolution(item.resolution || '');
    setShowDetailPanel(true);
  };

  const handleStatusChange = async (incident: IIncidentHistoryItem, newStatus: string) => {
    try {
      props.setIsLoading(true);
      const service = new IncidentService(props.spContext);
      await service.updateIncidentStatus(incident.id, newStatus, incident.resolution);

      const updatedIncident = {
        ...incident,
        status: newStatus,
        resolvedDate: newStatus === 'Resolved' || newStatus === 'Closed' ? new Date().toISOString() : incident.resolvedDate
      };
      setSelectedIncident(updatedIncident);
      await loadIncidents();
      triggerToast(formatString(strings.IncidentHistory.ToastStatusMessage, incident.incidentId || '#' + incident.id, newStatus), strings.IncidentHistory.ToastStatusUpdatedTitle);
    } catch (error) {
      console.error('Error updating status:', error);
    } finally {
      props.setIsLoading(false);
    }
  };

  const handleSaveResolution = async (incident: IIncidentHistoryItem) => {
    try {
      props.setIsLoading(true);
      const service = new IncidentService(props.spContext);
      await service.updateIncidentStatus(incident.id, incident.status, tempResolution);

      const updatedIncident = {
        ...incident,
        resolution: tempResolution
      };
      setSelectedIncident(updatedIncident);
      await loadIncidents();
      triggerToast(formatString(strings.IncidentHistory.ToastResolutionMessage, incident.incidentId || '#' + incident.id), strings.IncidentHistory.ToastResolutionSavedTitle);
    } catch (error) {
      console.error('Error saving resolution:', error);
    } finally {
      props.setIsLoading(false);
    }
  };

  const handleDownloadReport = (incident: IIncidentHistoryItem) => {
    try {
      const h = strings.IncidentHistory;
      const fields = [
        { label: h.PdfIncidentIdLabel, value: incident.incidentId },
        { label: h.PdfCurrentStatusLabel, value: incident.status || 'Open' },
        { label: h.PdfAssetNameLabel, value: (incident.assetName || '').trim() },
        { label: h.PdfPriorityLabel, value: incident.priority || 'Medium' },
        { label: h.PdfIssueTypeLabel, value: incident.issueType },
        { label: h.PdfReportedDateLabel, value: formatReportDate(incident.reportedDate) }
      ];
      if (incident.assignedTo) fields.push({ label: h.PdfAssignedToLabel, value: incident.assignedTo });
      if (incident.resolvedDate) fields.push({ label: h.PdfResolvedDateLabel, value: formatReportDate(incident.resolvedDate) });

      const sections: INexerReportSection[] = [
        { title: h.PdfIssueDescriptionTitle, text: incident.issueDescription || h.PdfNoDescription }
      ];
      if (incident.resolution) sections.push({ title: h.PdfResolutionSummaryTitle, text: incident.resolution, tone: 'positive' });

      saveNexerReport({
        documentType: h.PdfIncidentReportTitle,
        reference: incident.incidentId || incident.id,
        heading: (incident.assetName || '').trim() || incident.incidentId,
        subheading: [incident.issueType, formatReportDate(incident.reportedDate, false)].filter(Boolean).join('  ·  '),
        status: incident.status || 'Open',
        fieldsTitle: h.PdfIncidentSpecs,
        fields,
        sections,
        productName: strings.Hero.Title,
        generatedText: formatString(h.PdfGeneratedOn, formatReportDate(new Date().toISOString()) || ''),
        fileName: `incident-${incident.incidentId || incident.id}.pdf`
      });
    } catch (error) {
      console.error('Error generating PDF report:', error);
      triggerToast(formatString(strings.IncidentHistory.PdfDownloadFailed, incident.incidentId || incident.id), strings.IncidentHistory.PdfDownloadFailedTitle, true);
    }
  };

  const columns: IColumn[] = [
    {
      key: 'incidentId',
      name: strings.IncidentHistory.ColIncidentId,
      fieldName: 'incidentId',
      minWidth: 90,
      maxWidth: 120,
      isResizable: true,
      onRender: (item: IIncidentHistoryItem) => (
        <div>
          <Text>{item.incidentId}</Text>
          {item.isLocalOnly && (
            <span
              title={strings.IncidentHistory.LocalOnlyTooltip}
              aria-label={strings.IncidentHistory.LocalOnlyTooltip}
              style={{ display: 'inline-block', marginTop: 2, padding: '0 6px', borderRadius: 999, fontSize: 11, fontWeight: 600, lineHeight: '18px', color: '#8a3707', background: '#fff4ce' }}
            >
              {strings.IncidentHistory.LocalOnlyTag}
            </span>
          )}
        </div>
      ),
    },
    {
      key: 'assetName',
      name: strings.IncidentHistory.ColAsset,
      fieldName: 'assetName',
      minWidth: 100,
      maxWidth: 150,
      isResizable: true,
      onRender: (item: IIncidentHistoryItem) => <Text>{item.assetName}</Text>,
    },
    {
      key: 'issueType',
      name: strings.IncidentHistory.ColIssueType,
      fieldName: 'issueType',
      minWidth: 100,
      maxWidth: 130,
      isResizable: true,
      onRender: (item: IIncidentHistoryItem) => <Text>{item.issueType}</Text>,
    },
    {
      key: 'priority',
      name: strings.IncidentHistory.ColPriority,
      fieldName: 'priority',
      minWidth: 80,
      maxWidth: 100,
      isResizable: true,
      onRender: (item: IIncidentHistoryItem) => {
        return (
          <span style={getPriorityBadgeStyle(item.priority)}>
            {item.priority || 'Medium'}
          </span>
        );
      },
    },
    {
      key: 'status',
      name: strings.IncidentHistory.ColStatus,
      fieldName: 'status',
      minWidth: 90,
      maxWidth: 120,
      isResizable: true,
      onRender: (item: IIncidentHistoryItem) => {
        return (
          <span style={getStatusBadgeStyle(item.status)}>
            {item.status || 'Open'}
          </span>
        );
      },
    },
    {
      key: 'reportedDate',
      name: strings.IncidentHistory.ColReported,
      fieldName: 'reportedDate',
      minWidth: 90,
      maxWidth: 120,
      isResizable: true,
      onRender: (item: IIncidentHistoryItem) => {
        if (!item.reportedDate) return <Text>-</Text>;
        try {
          return <Text>{new Date(item.reportedDate).toLocaleDateString()}</Text>;
        } catch {
          return <Text>{item.reportedDate}</Text>;
        }
      },
    },
    {
      key: 'actions',
      name: strings.IncidentHistory.ColActions,
      minWidth: 160,
      maxWidth: 220,
      isResizable: true,
      onRender: (item: IIncidentHistoryItem) => (
        <Stack horizontal tokens={{ childrenGap: 8 }}>
          <PrimaryButton
            text={strings.IncidentHistory.ButtonView}
            onClick={() => handleViewDetails(item)}
            styles={{
              root: { padding: '2px 10px', fontSize: '11px', height: '24px' },
            }}
          />
          <PrimaryButton
            text={strings.IncidentHistory.ButtonDownload}
            onClick={() => handleDownloadReport(item)}
            styles={{
              root: { padding: '2px 10px', fontSize: '11px', height: '24px' },
            }}
          />
        </Stack>
      ),
    },
  ];

  const statusFilterOptions: IDropdownOption[] = [
    { key: '', text: strings.IncidentHistory.AllStatusOption },
    ...INCIDENT_STATUS_OPTIONS
  ];

  return (
    <div style={{ marginTop: '20px' }}>
      <Stack tokens={{ childrenGap: 15 }}>
        {/* Filters */}
        <div style={{ display: 'flex', gap: '15px', alignItems: 'center', flexWrap: 'wrap', marginBottom: '5px' }}>
          <SearchBox
            placeholder={strings.IncidentHistory.SearchIncidentsPlaceholder}
            value={searchText}
            onChange={(ev, newValue) => setSearchText(newValue || '')}
            onClear={() => setSearchText('')}
            styles={{ root: { width: '100%', maxWidth: 400 } }}
          />
          <Dropdown
            placeholder={strings.IncidentHistory.FilterByStatusPlaceholder}
            options={statusFilterOptions}
            onChange={(ev, option) => setStatusFilter(option?.key as string | null || null)}
            styles={{ root: { width: 200 } }}
          />
        </div>

        {/* Items Count */}
        <Text variant="small" style={{ color: 'var(--text-muted, #6b7280)', display: 'block' }}>
          {formatString(strings.IncidentHistory.ShowingIncidents, filteredIncidents.length, incidents.length)}
        </Text>

        {/* Details List */}
        {filteredIncidents.length > 0 ? (
          <DetailsList
            items={filteredIncidents}
            columns={columns}
            setKey="incident-list"
            layoutMode={DetailsListLayoutMode.justified}
            selectionMode={SelectionMode.none}
          />
        ) : (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '250px',
            border: '1px dashed #e5e7eb',
            borderRadius: '8px',
            padding: '30px'
          }}>
            <Icon iconName="ClearFilter" style={{ fontSize: '36px', color: '#9ca3af', marginBottom: '10px' }} />
            <Text variant="medium" style={{ color: '#6b7280' }}>
              {strings.IncidentHistory.NoIncidentsFound}
            </Text>
          </div>
        )}
      </Stack>

      {/* Detail Panel */}
      <Panel
        isOpen={showDetailPanel}
        onDismiss={() => setShowDetailPanel(false)}
        type={PanelType.medium}
        headerText={strings.IncidentHistory.IncidentDetailsTitle}
        closeButtonAriaLabel={strings.Common.Close}
      >
        {selectedIncident && (
          <div style={{ marginTop: '10px' }}>
            <p style={{ color: '#6b7280', fontSize: '0.88rem', margin: '0 0 20px 0' }}>
              <strong>{strings.IncidentHistory.ReportedLabel}</strong> {new Date(selectedIncident.reportedDate).toLocaleString()}
            </p>

            <div style={{ padding: '12px 15px', backgroundColor: '#f1f5f9', borderRadius: '6px', marginBottom: '20px', borderLeft: '4px solid #64748b' }}>
              <p style={{ margin: 0, fontSize: '0.92rem', color: '#334155', lineHeight: '1.5', whiteSpace: 'pre-wrap' }}>
                {selectedIncident.issueDescription}
              </p>
            </div>

            <div style={{ backgroundColor: '#ffffff', padding: '16px', borderRadius: '8px', border: '1px solid #e5e7eb', marginBottom: '20px' }}>
              <h4 style={{ margin: '0 0 12px 0', color: '#111827', fontSize: '1rem', borderBottom: '1px solid #f3f4f6', paddingBottom: '8px' }}>
                {strings.IncidentHistory.IncidentSpecificationsTitle}
              </h4>
              <div className={styles.responsiveGridAlignItemsCenter} style={{ fontSize: '0.88rem' }}>
                <div><span style={{ color: '#6b7280' }}>{strings.IncidentHistory.LabelIncidentId}</span> <strong style={{ color: '#111827' }}>{selectedIncident.incidentId}</strong></div>
                <div><span style={{ color: '#6b7280' }}>{strings.IncidentHistory.LabelAssetName}</span> <strong style={{ color: '#111827' }}>{selectedIncident.assetName}</strong></div>
                <div><span style={{ color: '#6b7280' }}>{strings.IncidentHistory.LabelIssueType}</span> <strong style={{ color: '#111827' }}>{selectedIncident.issueType}</strong></div>

                <div>
                  <span style={{ color: '#6b7280', marginRight: '6px' }}>{strings.IncidentHistory.LabelPriority}</span>
                  <span style={getPriorityBadgeStyle(selectedIncident.priority)}>
                    {selectedIncident.priority || 'Medium'}
                  </span>
                </div>

                {props.userRole === 'Admin' ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ color: '#6b7280' }}>{strings.IncidentHistory.LabelStatus}</span>
                    <Dropdown
                      selectedKey={selectedIncident.status || 'Open'}
                      options={INCIDENT_STATUS_OPTIONS}
                      onChange={(ev, option) => handleStatusChange(selectedIncident, option?.key as string)}
                      styles={{ root: { width: 120 } }}
                    />
                  </div>
                ) : (
                  <div>
                    <span style={{ color: '#6b7280', marginRight: '6px' }}>{strings.IncidentHistory.LabelStatus}</span>
                    <span style={getStatusBadgeStyle(selectedIncident.status)}>
                      {selectedIncident.status || 'Open'}
                    </span>
                  </div>
                )}

                {selectedIncident.assignedTo && (
                  <div><span style={{ color: '#6b7280' }}>{strings.IncidentHistory.LabelAssignedTo}</span> <strong style={{ color: '#111827' }}>{selectedIncident.assignedTo}</strong></div>
                )}
              </div>
            </div>

            {props.userRole === 'Admin' && (selectedIncident.status === 'Resolved' || selectedIncident.status === 'Closed') ? (
              <div style={{ backgroundColor: '#f8fafc', padding: '16px', borderRadius: '8px', border: '1px solid #e2e8f0', marginBottom: '20px' }}>
                <h4 style={{ margin: '0 0 12px 0', color: '#1e293b', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Icon iconName="CheckMark" style={{ color: '#166534', fontWeight: 'bold' }} /> {strings.IncidentHistory.UpdateResolutionTitle}
                </h4>
                <Stack tokens={{ childrenGap: 10 }}>
                  {selectedIncident.resolvedDate && (
                    <div style={{ fontSize: '0.88rem' }}>
                      <span style={{ color: '#6b7280' }}>{strings.IncidentHistory.LabelResolvedDate}</span>{' '}
                      <strong style={{ color: '#111827' }}>{new Date(selectedIncident.resolvedDate).toLocaleString()}</strong>
                    </div>
                  )}
                  <TextField
                    label={strings.IncidentHistory.ResolutionSummaryLabel}
                    multiline
                    rows={3}
                    value={tempResolution}
                    onChange={(ev, newValue) => setTempResolution(newValue || '')}
                    placeholder={strings.IncidentHistory.ResolutionSummaryPlaceholderIncident}
                  />
                  <PrimaryButton
                    text={strings.IncidentHistory.SaveResolutionButton}
                    onClick={() => handleSaveResolution(selectedIncident)}
                    styles={{ root: { alignSelf: 'flex-start' } }}
                  />
                </Stack>
              </div>
            ) : (
              selectedIncident.resolution && (
                <div style={{ backgroundColor: '#f8fafc', padding: '16px', borderRadius: '8px', border: '1px solid #e2e8f0', marginBottom: '20px' }}>
                  <h4 style={{ margin: '0 0 12px 0', color: '#1e293b', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Icon iconName="CheckMark" style={{ color: '#166534', fontWeight: 'bold' }} /> {strings.IncidentHistory.ResolutionDetailsTitle}
                  </h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.88rem' }}>
                    {selectedIncident.resolvedDate && (
                      <div>
                        <span style={{ color: '#6b7280' }}>{strings.IncidentHistory.LabelResolvedDate}</span>{' '}
                        <strong style={{ color: '#111827' }}>{new Date(selectedIncident.resolvedDate).toLocaleString()}</strong>
                      </div>
                    )}
                    <div style={{ padding: '10px', backgroundColor: '#f0fdf4', borderRadius: '6px', border: '1px solid #dcfce7', color: '#166534', fontSize: '0.88rem', lineHeight: '1.4', whiteSpace: 'pre-wrap' }}>
                      <strong>{strings.IncidentHistory.ResolutionSummaryPrefix}</strong> {selectedIncident.resolution}
                    </div>
                  </div>
                </div>
              )
            )}
          </div>
        )}
      </Panel>

      {/* Bottom-Right Corner Toast Notification */}
      {toastNotification && (
        <div style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          zIndex: 100000,
          backgroundColor: '#ffffff',
          color: '#0f172a',
          padding: '14px 18px',
          borderRadius: '12px',
          boxShadow: '0 20px 30px -10px rgba(0, 0, 0, 0.18), 0 0 0 1px rgba(0, 0, 0, 0.06)',
          borderLeft: `5px solid ${toastNotification.isError ? '#c50f1f' : '#10b981'}`,
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          maxWidth: '380px',
          fontFamily: '"Segoe UI", -apple-system, BlinkMacSystemFont, Roboto, sans-serif'
        }}>
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            backgroundColor: toastNotification.isError ? '#fde7e9' : '#dcfce7',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}>
            <Icon
              iconName={toastNotification.isError ? 'ErrorBadge' : 'Accept'}
              style={{ color: toastNotification.isError ? '#c50f1f' : '#166534', fontSize: '15px', fontWeight: 'bold' }}
            />
          </div>
          <div style={{ flex: 1 }}>
            <strong style={{ display: 'block', fontSize: '0.86rem', color: '#0f172a', marginBottom: '2px' }}>
              {toastNotification.title || 'Success'}
            </strong>
            <span style={{ fontSize: '0.8rem', color: '#475569', lineHeight: 1.3, display: 'block' }}>
              {toastNotification.message}
            </span>
          </div>
          <Icon
            iconName="Cancel"
            style={{ cursor: 'pointer', color: '#94a3b8', fontSize: '12px', marginLeft: '6px' }}
            onClick={() => setToastNotification(null)}
          />
        </div>
      )}
    </div>
  );
};
