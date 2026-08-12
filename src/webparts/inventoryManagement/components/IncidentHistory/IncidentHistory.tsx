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
import { jsPDF } from 'jspdf';
import { IInventoryManagementProps } from '../../models/IInventoryManagementProps';
import { IncidentService } from '../../services/IncidentService';
import styles from '../InventoryManagement.module.scss';
import { NexerHeader } from '../shared/NexerHeader';
import { generateNexerPdfReport } from '../../utils/NexerTheme';

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
}

export const IncidentHistory: React.FC<IInventoryManagementProps & { setIsLoading: (loading: boolean) => void; userRole?: string; }> = (props) => {
  const [incidents, setIncidents] = useState<IIncidentHistoryItem[]>([]);
  const [filteredIncidents, setFilteredIncidents] = useState<IIncidentHistoryItem[]>([]);
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [selectedIncident, setSelectedIncident] = useState<IIncidentHistoryItem | null>(null);
  const [showDetailPanel, setShowDetailPanel] = useState(false);
  const [tempResolution, setTempResolution] = useState('');
  const [toastNotification, setToastNotification] = useState<{ message: string; title?: string } | null>(null);

  const triggerToast = (message: string, title: string = 'Incident Updated') => {
    setToastNotification({ message, title });
    setTimeout(() => setToastNotification(null), 4000);
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
      triggerToast(`Status for incident ${incident.incidentId || '#' + incident.id} updated to '${newStatus}'.`, 'Status Updated');
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
      triggerToast(`Resolution summary saved for incident ${incident.incidentId || '#' + incident.id}.`, 'Resolution Saved');
    } catch (error) {
      console.error('Error saving resolution:', error);
    } finally {
      props.setIsLoading(false);
    }
  };

  const handleDownloadReport = async (incident: IIncidentHistoryItem) => {
    await generateNexerPdfReport({
      reportTitle: 'INCIDENT REPORT',
      docTitle: 'INCIDENT SPECIFICATIONS',
      idLabel: 'Incident ID:',
      idValue: incident.incidentId,
      assetName: incident.assetName,
      typeLabel: 'Issue Type:',
      typeValue: incident.issueType,
      priority: incident.priority || 'Medium',
      status: incident.status || 'Open',
      reportedDate: incident.reportedDate,
      assignedTo: incident.assignedTo,
      resolvedDate: incident.resolvedDate,
      descriptionTitle: 'ISSUE DESCRIPTION',
      description: incident.issueDescription,
      resolution: incident.resolution,
      fileName: `incident-${incident.incidentId}.pdf`,
    });
  };

  const columns: IColumn[] = [
    {
      key: 'incidentId',
      name: 'Incident ID',
      fieldName: 'incidentId',
      minWidth: 90,
      maxWidth: 120,
      isResizable: true,
      onRender: (item: IIncidentHistoryItem) => <Text>{item.incidentId}</Text>,
    },
    {
      key: 'assetName',
      name: 'Asset',
      fieldName: 'assetName',
      minWidth: 100,
      maxWidth: 150,
      isResizable: true,
      onRender: (item: IIncidentHistoryItem) => <Text>{item.assetName}</Text>,
    },
    {
      key: 'issueType',
      name: 'Issue Type',
      fieldName: 'issueType',
      minWidth: 100,
      maxWidth: 130,
      isResizable: true,
      onRender: (item: IIncidentHistoryItem) => <Text>{item.issueType}</Text>,
    },
    {
      key: 'priority',
      name: 'Priority',
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
      name: 'Status',
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
      name: 'Reported',
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
      name: 'Actions',
      minWidth: 160,
      maxWidth: 220,
      isResizable: true,
      onRender: (item: IIncidentHistoryItem) => (
        <Stack horizontal tokens={{ childrenGap: 8 }}>
          <PrimaryButton
            text="View"
            onClick={() => handleViewDetails(item)}
            styles={{
              root: { padding: '2px 10px', fontSize: '11px', height: '24px' },
            }}
          />
          <PrimaryButton
            text="Download"
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
    { key: '', text: 'All Status' },
    { key: 'Open', text: 'Open' },
    { key: 'In Progress', text: 'In Progress' },
    { key: 'Resolved', text: 'Resolved' },
    { key: 'Closed', text: 'Closed' },
  ];

  return (
    <div style={{ marginTop: '10px' }}>
      <NexerHeader
        title="Incident History"
        subtitle="Track and manage reported hardware & software incidents"
      />
      <Stack tokens={{ childrenGap: 15 }}>
        {/* Filters */}
        <div style={{ display: 'flex', gap: '15px', alignItems: 'center', flexWrap: 'wrap', marginBottom: '5px' }}>
          <SearchBox
            placeholder="Search by incident ID, asset name, or issue type..."
            value={searchText}
            onChange={(ev, newValue) => setSearchText(newValue || '')}
            onClear={() => setSearchText('')}
            styles={{ root: { width: '100%', maxWidth: 400 } }}
          />
          <Dropdown
            placeholder="Filter by status"
            options={statusFilterOptions}
            onChange={(ev, option) => setStatusFilter(option?.key as string | null || null)}
            styles={{ root: { width: 200 } }}
          />
        </div>

        {/* Items Count */}
        <Text variant="small" style={{ color: 'var(--text-muted, #6b7280)', display: 'block' }}>
          Showing {filteredIncidents.length} of {incidents.length} incidents
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
              No incidents found.
            </Text>
          </div>
        )}
      </Stack>

      {/* Detail Panel */}
      <Panel
        isOpen={showDetailPanel}
        onDismiss={() => setShowDetailPanel(false)}
        type={PanelType.medium}
        headerText="Incident Details"
        closeButtonAriaLabel="Close"
      >
        {selectedIncident && (
          <div style={{ marginTop: '0px' }}>
            <NexerHeader
              title={`Incident Details - ${selectedIncident.incidentId}`}
              subtitle={`Reported: ${new Date(selectedIncident.reportedDate).toLocaleString()}`}
              isPanel={true}
            />

            <div style={{ padding: '12px 15px', backgroundColor: '#f1f5f9', borderRadius: '6px', marginBottom: '20px', borderLeft: '4px solid #64748b' }}>
              <p style={{ margin: 0, fontSize: '0.92rem', color: '#334155', lineHeight: '1.5', whiteSpace: 'pre-wrap' }}>
                {selectedIncident.issueDescription}
              </p>
            </div>

            <div style={{ backgroundColor: '#ffffff', padding: '16px', borderRadius: '8px', border: '1px solid #e5e7eb', marginBottom: '20px' }}>
              <h4 style={{ margin: '0 0 12px 0', color: '#111827', fontSize: '1rem', borderBottom: '1px solid #f3f4f6', paddingBottom: '8px' }}>
                Incident Specifications
              </h4>
              <div className={styles.responsiveGridAlignItemsCenter} style={{ fontSize: '0.88rem' }}>
                <div><span style={{ color: '#6b7280' }}>Incident ID:</span> <strong style={{ color: '#111827' }}>{selectedIncident.incidentId}</strong></div>
                <div><span style={{ color: '#6b7280' }}>Asset Name:</span> <strong style={{ color: '#111827' }}>{selectedIncident.assetName}</strong></div>
                <div><span style={{ color: '#6b7280' }}>Issue Type:</span> <strong style={{ color: '#111827' }}>{selectedIncident.issueType}</strong></div>

                <div>
                  <span style={{ color: '#6b7280', marginRight: '6px' }}>Priority:</span>
                  <span style={getPriorityBadgeStyle(selectedIncident.priority)}>
                    {selectedIncident.priority || 'Medium'}
                  </span>
                </div>

                {props.userRole === 'Admin' ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ color: '#6b7280' }}>Status:</span>
                    <Dropdown
                      selectedKey={selectedIncident.status || 'Open'}
                      options={[
                        { key: 'Open', text: 'Open' },
                        { key: 'In Progress', text: 'In Progress' },
                        { key: 'Resolved', text: 'Resolved' },
                        { key: 'Closed', text: 'Closed' }
                      ]}
                      onChange={(ev, option) => handleStatusChange(selectedIncident, option?.key as string)}
                      styles={{ root: { width: 120 } }}
                    />
                  </div>
                ) : (
                  <div>
                    <span style={{ color: '#6b7280', marginRight: '6px' }}>Status:</span>
                    <span style={getStatusBadgeStyle(selectedIncident.status)}>
                      {selectedIncident.status || 'Open'}
                    </span>
                  </div>
                )}

                {selectedIncident.assignedTo && (
                  <div><span style={{ color: '#6b7280' }}>Assigned To:</span> <strong style={{ color: '#111827' }}>{selectedIncident.assignedTo}</strong></div>
                )}
              </div>
            </div>

            {props.userRole === 'Admin' && (selectedIncident.status === 'Resolved' || selectedIncident.status === 'Closed') ? (
              <div style={{ backgroundColor: '#f8fafc', padding: '16px', borderRadius: '8px', border: '1px solid #e2e8f0', marginBottom: '20px' }}>
                <h4 style={{ margin: '0 0 12px 0', color: '#1e293b', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Icon iconName="CheckMark" style={{ color: '#166534', fontWeight: 'bold' }} /> Update Resolution Details
                </h4>
                <Stack tokens={{ childrenGap: 10 }}>
                  {selectedIncident.resolvedDate && (
                    <div style={{ fontSize: '0.88rem' }}>
                      <span style={{ color: '#6b7280' }}>Resolved Date:</span>{' '}
                      <strong style={{ color: '#111827' }}>{new Date(selectedIncident.resolvedDate).toLocaleString()}</strong>
                    </div>
                  )}
                  <TextField
                    label="Resolution Summary"
                    multiline
                    rows={3}
                    value={tempResolution}
                    onChange={(ev, newValue) => setTempResolution(newValue || '')}
                    placeholder="Describe how this issue was resolved..."
                  />
                  <PrimaryButton
                    text="Save Resolution"
                    onClick={() => handleSaveResolution(selectedIncident)}
                    styles={{ root: { alignSelf: 'flex-start' } }}
                  />
                </Stack>
              </div>
            ) : (
              selectedIncident.resolution && (
                <div style={{ backgroundColor: '#f8fafc', padding: '16px', borderRadius: '8px', border: '1px solid #e2e8f0', marginBottom: '20px' }}>
                  <h4 style={{ margin: '0 0 12px 0', color: '#1e293b', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Icon iconName="CheckMark" style={{ color: '#166534', fontWeight: 'bold' }} /> Resolution Details
                  </h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.88rem' }}>
                    {selectedIncident.resolvedDate && (
                      <div>
                        <span style={{ color: '#6b7280' }}>Resolved Date:</span>{' '}
                        <strong style={{ color: '#111827' }}>{new Date(selectedIncident.resolvedDate).toLocaleString()}</strong>
                      </div>
                    )}
                    <div style={{ padding: '10px', backgroundColor: '#f0fdf4', borderRadius: '6px', border: '1px solid #dcfce7', color: '#166534', fontSize: '0.88rem', lineHeight: '1.4', whiteSpace: 'pre-wrap' }}>
                      <strong>Resolution Summary:</strong> {selectedIncident.resolution}
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
          borderLeft: '5px solid #10b981',
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
            backgroundColor: '#dcfce7',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}>
            <Icon iconName="Accept" style={{ color: '#166534', fontSize: '15px', fontWeight: 'bold' }} />
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
