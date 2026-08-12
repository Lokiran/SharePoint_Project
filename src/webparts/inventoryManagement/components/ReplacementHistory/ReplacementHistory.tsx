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
import styles from './ReplacementHistory.module.scss';
import { IInventoryManagementProps } from '../../models/IInventoryManagementProps';
import { IncidentService } from '../../services/IncidentService';
import { NexerHeader } from '../shared/NexerHeader';
import { generateNexerPdfReport } from '../../utils/NexerTheme';

interface IReplacementHistoryItem {
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

export const ReplacementHistory: React.FC<IInventoryManagementProps & { setIsLoading: (loading: boolean) => void; userRole?: string; }> = (props) => {
  const [replacements, setReplacements] = useState<IReplacementHistoryItem[]>([]);
  const [filteredReplacements, setFilteredReplacements] = useState<IReplacementHistoryItem[]>([]);
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [selectedReplacement, setSelectedReplacement] = useState<IReplacementHistoryItem | null>(null);
  const [showDetailPanel, setShowDetailPanel] = useState(false);
  const [tempResolution, setTempResolution] = useState('');

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
    loadReplacements();
  }, [props.userEmail]);

  useEffect(() => {
    filterReplacements();
  }, [searchText, statusFilter, replacements]);

  const loadReplacements = async () => {
    try {
      props.setIsLoading(true);
      const service = new IncidentService(props.spContext);
      const isAdmin = props.userRole === 'Admin';
      const data = await service.getEmployeeReplacementHistory(props.userEmail, isAdmin);
      setReplacements(data);
    } catch (error) {
      console.error('Error loading replacement history:', error);
    } finally {
      props.setIsLoading(false);
    }
  };

  const filterReplacements = () => {
    let filtered = [...replacements];

    if (searchText) {
      filtered = filtered.filter(
        (rep) =>
          (rep.assetName || '').toLowerCase().includes(searchText.toLowerCase()) ||
          (rep.incidentId || '').toLowerCase().includes(searchText.toLowerCase())
      );
    }

    if (statusFilter) {
      filtered = filtered.filter((rep) => rep.status === statusFilter);
    }

    setFilteredReplacements(filtered);
  };

  const handleViewDetails = (item: IReplacementHistoryItem) => {
    setSelectedReplacement(item);
    setTempResolution(item.resolution || '');
    setShowDetailPanel(true);
  };

  const handleStatusChange = async (rep: IReplacementHistoryItem, newStatus: string) => {
    try {
      props.setIsLoading(true);
      const service = new IncidentService(props.spContext);
      await service.updateIncidentStatus(rep.id, newStatus, rep.resolution);
      
      const updated = {
        ...rep,
        status: newStatus,
        resolvedDate: newStatus === 'Resolved' || newStatus === 'Closed' ? new Date().toISOString() : rep.resolvedDate
      };
      setSelectedReplacement(updated);
      await loadReplacements();
    } catch (error) {
      console.error('Error updating status:', error);
    } finally {
      props.setIsLoading(false);
    }
  };

  const handleSaveResolution = async (rep: IReplacementHistoryItem) => {
    try {
      props.setIsLoading(true);
      const service = new IncidentService(props.spContext);
      await service.updateIncidentStatus(rep.id, rep.status, tempResolution);
      
      const updated = {
        ...rep,
        resolution: tempResolution
      };
      setSelectedReplacement(updated);
      await loadReplacements();
    } catch (error) {
      console.error('Error saving resolution:', error);
    } finally {
      props.setIsLoading(false);
    }
  };

  const handleDownloadReport = async (rep: IReplacementHistoryItem) => {
    await generateNexerPdfReport({
      reportTitle: 'ASSET REPLACEMENT REPORT',
      docTitle: 'REPLACEMENT SPECIFICATIONS',
      idLabel: 'Replacement ID:',
      idValue: rep.incidentId,
      assetName: rep.assetName,
      typeLabel: 'Type:',
      typeValue: 'Replacement Request',
      priority: rep.priority || 'Medium',
      status: rep.status || 'Open',
      reportedDate: rep.reportedDate,
      assignedTo: rep.assignedTo,
      resolvedDate: rep.resolvedDate,
      descriptionTitle: 'REPLACEMENT REASON & DETAILS',
      description: rep.issueDescription,
      resolution: rep.resolution,
      fileName: `replacement-${rep.incidentId}.pdf`,
    });
  };

  const columns: IColumn[] = [
    {
      key: 'replacementId',
      name: 'Replacement ID',
      fieldName: 'incidentId',
      minWidth: 100,
      maxWidth: 130,
      isResizable: true,
      onRender: (item: IReplacementHistoryItem) => <Text>{item.incidentId}</Text>,
    },
    {
      key: 'assetName',
      name: 'Asset',
      fieldName: 'assetName',
      minWidth: 120,
      maxWidth: 180,
      isResizable: true,
      onRender: (item: IReplacementHistoryItem) => <Text>{item.assetName}</Text>,
    },
    {
      key: 'issueType',
      name: 'Type',
      fieldName: 'issueType',
      minWidth: 120,
      maxWidth: 150,
      isResizable: true,
      onRender: () => <Text>Replacement Request</Text>,
    },
    {
      key: 'priority',
      name: 'Priority',
      fieldName: 'priority',
      minWidth: 80,
      maxWidth: 100,
      isResizable: true,
      onRender: (item: IReplacementHistoryItem) => {
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
      onRender: (item: IReplacementHistoryItem) => {
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
      minWidth: 100,
      maxWidth: 130,
      isResizable: true,
      onRender: (item: IReplacementHistoryItem) => {
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
      onRender: (item: IReplacementHistoryItem) => (
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
    <div style={{ marginTop: '10px' }} className={styles.replacementHistory}>
      <NexerHeader
        title="Replacement History"
        subtitle="Track and manage asset replacement requests"
      />
      <Stack tokens={{ childrenGap: 15 }}>
        {/* Filters */}
        <div style={{ display: 'flex', gap: '15px', alignItems: 'center', flexWrap: 'wrap', marginBottom: '5px' }}>
          <SearchBox
            placeholder="Search by replacement ID, asset name..."
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
          Showing {filteredReplacements.length} of {replacements.length} replacement requests
        </Text>

        {/* Details List */}
        {filteredReplacements.length > 0 ? (
          <DetailsList
            items={filteredReplacements}
            columns={columns}
            setKey="replacement-list"
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
              No replacement requests found.
            </Text>
          </div>
        )}
      </Stack>

      {/* Detail Panel */}
      <Panel
        isOpen={showDetailPanel}
        onDismiss={() => setShowDetailPanel(false)}
        type={PanelType.medium}
        headerText="Replacement Request Details"
        closeButtonAriaLabel="Close"
      >
        {selectedReplacement && (
          <div style={{ marginTop: '0px' }}>
            <NexerHeader
              title={`Replacement Details - ${selectedReplacement.incidentId}`}
              subtitle={`Reported: ${new Date(selectedReplacement.reportedDate).toLocaleString()}`}
              isPanel={true}
            />

            <div style={{ padding: '12px 15px', backgroundColor: '#f1f5f9', borderRadius: '6px', marginBottom: '20px', borderLeft: '4px solid #64748b' }}>
              <p style={{ margin: 0, fontSize: '0.92rem', color: '#334155', lineHeight: '1.5', whiteSpace: 'pre-wrap' }}>
                {selectedReplacement.issueDescription}
              </p>
            </div>

            <div style={{ backgroundColor: '#ffffff', padding: '16px', borderRadius: '8px', border: '1px solid #e5e7eb', marginBottom: '20px' }}>
              <h4 style={{ margin: '0 0 12px 0', color: '#111827', fontSize: '1rem', borderBottom: '1px solid #f3f4f6', paddingBottom: '8px' }}>
                Replacement Specifications
              </h4>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '0.88rem', alignItems: 'center' }}>
                <div><span style={{ color: '#6b7280' }}>Replacement ID:</span> <strong style={{ color: '#111827' }}>{selectedReplacement.incidentId}</strong></div>
                <div><span style={{ color: '#6b7280' }}>Asset Name:</span> <strong style={{ color: '#111827' }}>{selectedReplacement.assetName}</strong></div>
                <div><span style={{ color: '#6b7280' }}>Type:</span> <strong style={{ color: '#111827' }}>Replacement Request</strong></div>
                
                <div>
                  <span style={{ color: '#6b7280', marginRight: '6px' }}>Priority:</span>
                  <span style={getPriorityBadgeStyle(selectedReplacement.priority)}>
                    {selectedReplacement.priority || 'Medium'}
                  </span>
                </div>
                
                {props.userRole === 'Admin' ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ color: '#6b7280' }}>Status:</span>
                    <Dropdown
                      selectedKey={selectedReplacement.status || 'Open'}
                      options={[
                        { key: 'Open', text: 'Open' },
                        { key: 'In Progress', text: 'In Progress' },
                        { key: 'Resolved', text: 'Resolved' },
                        { key: 'Closed', text: 'Closed' }
                      ]}
                      onChange={(ev, option) => handleStatusChange(selectedReplacement, option?.key as string)}
                      styles={{ root: { width: 120 } }}
                    />
                  </div>
                ) : (
                  <div>
                    <span style={{ color: '#6b7280', marginRight: '6px' }}>Status:</span>
                    <span style={getStatusBadgeStyle(selectedReplacement.status)}>
                      {selectedReplacement.status || 'Open'}
                    </span>
                  </div>
                )}

                {selectedReplacement.assignedTo && (
                  <div><span style={{ color: '#6b7280' }}>Assigned To:</span> <strong style={{ color: '#111827' }}>{selectedReplacement.assignedTo}</strong></div>
                )}
              </div>
            </div>

            {props.userRole === 'Admin' && (selectedReplacement.status === 'Resolved' || selectedReplacement.status === 'Closed') ? (
              <div style={{ backgroundColor: '#f8fafc', padding: '16px', borderRadius: '8px', border: '1px solid #e2e8f0', marginBottom: '20px' }}>
                <h4 style={{ margin: '0 0 12px 0', color: '#1e293b', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Icon iconName="CheckMark" style={{ color: '#166534', fontWeight: 'bold' }} /> Update Resolution Details
                </h4>
                <Stack tokens={{ childrenGap: 10 }}>
                  {selectedReplacement.resolvedDate && (
                    <div style={{ fontSize: '0.88rem' }}>
                      <span style={{ color: '#6b7280' }}>Resolved Date:</span>{' '}
                      <strong style={{ color: '#111827' }}>{new Date(selectedReplacement.resolvedDate).toLocaleString()}</strong>
                    </div>
                  )}
                  <TextField
                    label="Resolution Summary"
                    multiline
                    rows={3}
                    value={tempResolution}
                    onChange={(ev, newValue) => setTempResolution(newValue || '')}
                    placeholder="Describe how this replacement was completed..."
                  />
                  <PrimaryButton
                    text="Save Resolution"
                    onClick={() => handleSaveResolution(selectedReplacement)}
                    styles={{ root: { alignSelf: 'flex-start' } }}
                  />
                </Stack>
              </div>
            ) : (
              selectedReplacement.resolution && (
                <div style={{ backgroundColor: '#f8fafc', padding: '16px', borderRadius: '8px', border: '1px solid #e2e8f0', marginBottom: '20px' }}>
                  <h4 style={{ margin: '0 0 12px 0', color: '#1e293b', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Icon iconName="CheckMark" style={{ color: '#166534', fontWeight: 'bold' }} /> Resolution Details
                  </h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.88rem' }}>
                    {selectedReplacement.resolvedDate && (
                      <div>
                        <span style={{ color: '#6b7280' }}>Resolved Date:</span>{' '}
                        <strong style={{ color: '#111827' }}>{new Date(selectedReplacement.resolvedDate).toLocaleString()}</strong>
                      </div>
                    )}
                    <div style={{ padding: '10px', backgroundColor: '#f0fdf4', borderRadius: '6px', border: '1px solid #dcfce7', color: '#166534', fontSize: '0.88rem', lineHeight: '1.4', whiteSpace: 'pre-wrap' }}>
                      <strong>Resolution Summary:</strong> {selectedReplacement.resolution}
                    </div>
                  </div>
                </div>
              )
            )}
          </div>
        )}
      </Panel>
    </div>
  );
};
