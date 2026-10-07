import * as React from 'react';
import { useState, useEffect } from 'react';
import {
  Stack,
  Icon,
  Dropdown,
  PrimaryButton,
  TextField,
  Panel,
  PanelType,
} from '@fluentui/react';
import { saveNexerReport, formatReportDate, INexerReportSection } from '../../utils/NexerPdfReport';
import styles from './ReplacementHistory.module.scss';
import { IInventoryManagementProps } from '../../models/IInventoryManagementProps';
import { IncidentService } from '../../services/IncidentService';
import { INCIDENT_STATUS_OPTIONS } from '../../constants/DropdownConstants';
import * as strings from 'InventoryManagementWebPartStrings';
import { formatString } from '../../utils/LocalizationUtils';
import { ServiceRecordCards } from '../service/ServiceRecordCards';
import { formatFlexibleDateTime } from '../common/listUi';

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
  /** Who raised it (shown to admins). */
  employeeName?: string;
}

export const ReplacementHistory: React.FC<IInventoryManagementProps & { setIsLoading: (loading: boolean) => void; userRole?: string; }> = (props) => {
  const [replacements, setReplacements] = useState<IReplacementHistoryItem[]>([]);
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

  const handleDownloadReport = (rep: IReplacementHistoryItem) => {
    try {
      const h = strings.IncidentHistory;
      const fields = [
        { label: h.PdfReplacementIdLabel, value: rep.incidentId },
        { label: h.PdfCurrentStatusLabel, value: rep.status || 'Open' },
        { label: h.PdfAssetNameLabel, value: (rep.assetName || '').trim() },
        { label: h.PdfPriorityLabel, value: rep.priority || 'Medium' },
        { label: h.PdfTypeLabel, value: h.ReplacementRequestType },
        { label: h.PdfReportedDateLabel, value: formatReportDate(rep.reportedDate) }
      ];
      if (rep.assignedTo) fields.push({ label: h.PdfAssignedToLabel, value: rep.assignedTo });
      if (rep.resolvedDate) fields.push({ label: h.PdfResolvedDateLabel, value: formatReportDate(rep.resolvedDate) });

      const sections: INexerReportSection[] = [
        { title: h.PdfReplacementReasonTitle, text: rep.issueDescription || h.PdfNoReason }
      ];
      if (rep.resolution) sections.push({ title: h.PdfResolutionSummaryTitle, text: rep.resolution, tone: 'positive' });

      saveNexerReport({
        documentType: h.PdfReplacementReportTitle,
        reference: rep.incidentId || rep.id,
        heading: (rep.assetName || '').trim() || rep.incidentId,
        subheading: [h.ReplacementRequestType, formatReportDate(rep.reportedDate, false)].filter(Boolean).join('  ·  '),
        status: rep.status || 'Open',
        fieldsTitle: h.PdfReplacementSpecs,
        fields,
        sections,
        productName: strings.Hero.Title,
        generatedText: formatString(h.PdfGeneratedOn, formatReportDate(new Date().toISOString()) || ''),
        fileName: `replacement-${rep.incidentId || rep.id}.pdf`
      });
    } catch (error) {
      console.error('Error generating PDF report:', error);
    }
  };

  return (
    <div style={{ marginTop: '20px' }} className={styles.replacementHistory}>
      <ServiceRecordCards
        kind="replacement"
        title={strings.Nav.ReplacementHistory}
        subtitle={strings.RecordLists.SubtitleReplacements}
        records={replacements}
        isAdmin={props.userRole === 'Admin'}
        onView={handleViewDetails}
        onDownload={handleDownloadReport}
      />

      {/* Detail Panel */}
      <Panel
        isOpen={showDetailPanel}
        onDismiss={() => setShowDetailPanel(false)}
        type={PanelType.medium}
        headerText={strings.IncidentHistory.ReplacementDetailsTitle}
        closeButtonAriaLabel={strings.Common.Close}
      >
        {selectedReplacement && (
          <div style={{ marginTop: '10px' }}>
            <p style={{ color: '#6b7280', fontSize: '0.88rem', margin: '0 0 20px 0' }}>
              <strong>{strings.IncidentHistory.ReportedLabel}</strong> {formatFlexibleDateTime(selectedReplacement.reportedDate)}
            </p>

            <div style={{ padding: '12px 15px', backgroundColor: '#f1f5f9', borderRadius: '6px', marginBottom: '20px', borderLeft: '4px solid #64748b' }}>
              <p style={{ margin: 0, fontSize: '0.92rem', color: '#334155', lineHeight: '1.5', whiteSpace: 'pre-wrap' }}>
                {selectedReplacement.issueDescription}
              </p>
            </div>

            <div style={{ backgroundColor: '#ffffff', padding: '16px', borderRadius: '8px', border: '1px solid #e5e7eb', marginBottom: '20px' }}>
              <h4 style={{ margin: '0 0 12px 0', color: '#111827', fontSize: '1rem', borderBottom: '1px solid #f3f4f6', paddingBottom: '8px' }}>
                {strings.IncidentHistory.ReplacementSpecificationsTitle}
              </h4>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '0.88rem', alignItems: 'center' }}>
                <div><span style={{ color: '#6b7280' }}>{strings.IncidentHistory.LabelReplacementId}</span> <strong style={{ color: '#111827' }}>{selectedReplacement.incidentId}</strong></div>
                <div><span style={{ color: '#6b7280' }}>{strings.IncidentHistory.LabelAssetName}</span> <strong style={{ color: '#111827' }}>{selectedReplacement.assetName}</strong></div>
                <div><span style={{ color: '#6b7280' }}>{strings.IncidentHistory.LabelType}</span> <strong style={{ color: '#111827' }}>{strings.IncidentHistory.ReplacementRequestType}</strong></div>

                <div>
                  <span style={{ color: '#6b7280', marginRight: '6px' }}>{strings.IncidentHistory.LabelPriority}</span>
                  <span style={getPriorityBadgeStyle(selectedReplacement.priority)}>
                    {selectedReplacement.priority || 'Medium'}
                  </span>
                </div>

                {props.userRole === 'Admin' ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ color: '#6b7280' }}>{strings.IncidentHistory.LabelStatus}</span>
                    <Dropdown
                      selectedKey={selectedReplacement.status || 'Open'}
                      options={INCIDENT_STATUS_OPTIONS}
                      onChange={(ev, option) => handleStatusChange(selectedReplacement, option?.key as string)}
                      styles={{ root: { width: 120 } }}
                    />
                  </div>
                ) : (
                  <div>
                    <span style={{ color: '#6b7280', marginRight: '6px' }}>{strings.IncidentHistory.LabelStatus}</span>
                    <span style={getStatusBadgeStyle(selectedReplacement.status)}>
                      {selectedReplacement.status || 'Open'}
                    </span>
                  </div>
                )}

                {selectedReplacement.assignedTo && (
                  <div><span style={{ color: '#6b7280' }}>{strings.IncidentHistory.LabelAssignedTo}</span> <strong style={{ color: '#111827' }}>{selectedReplacement.assignedTo}</strong></div>
                )}
              </div>
            </div>

            {props.userRole === 'Admin' && (selectedReplacement.status === 'Resolved' || selectedReplacement.status === 'Closed') ? (
              <div style={{ backgroundColor: '#f8fafc', padding: '16px', borderRadius: '8px', border: '1px solid #e2e8f0', marginBottom: '20px' }}>
                <h4 style={{ margin: '0 0 12px 0', color: '#1e293b', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Icon iconName="CheckMark" style={{ color: '#166534', fontWeight: 'bold' }} /> {strings.IncidentHistory.UpdateResolutionTitle}
                </h4>
                <Stack tokens={{ childrenGap: 10 }}>
                  {selectedReplacement.resolvedDate && (
                    <div style={{ fontSize: '0.88rem' }}>
                      <span style={{ color: '#6b7280' }}>{strings.IncidentHistory.LabelResolvedDate}</span>{' '}
                      <strong style={{ color: '#111827' }}>{new Date(selectedReplacement.resolvedDate).toLocaleString()}</strong>
                    </div>
                  )}
                  <TextField
                    label={strings.IncidentHistory.ResolutionSummaryLabel}
                    multiline
                    rows={3}
                    value={tempResolution}
                    onChange={(ev, newValue) => setTempResolution(newValue || '')}
                    placeholder={strings.IncidentHistory.ResolutionSummaryPlaceholderReplacement}
                  />
                  <PrimaryButton
                    text={strings.IncidentHistory.SaveResolutionButton}
                    onClick={() => handleSaveResolution(selectedReplacement)}
                    styles={{ root: { alignSelf: 'flex-start' } }}
                  />
                </Stack>
              </div>
            ) : (
              selectedReplacement.resolution && (
                <div style={{ backgroundColor: '#f8fafc', padding: '16px', borderRadius: '8px', border: '1px solid #e2e8f0', marginBottom: '20px' }}>
                  <h4 style={{ margin: '0 0 12px 0', color: '#1e293b', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Icon iconName="CheckMark" style={{ color: '#166534', fontWeight: 'bold' }} /> {strings.IncidentHistory.ResolutionDetailsTitle}
                  </h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.88rem' }}>
                    {selectedReplacement.resolvedDate && (
                      <div>
                        <span style={{ color: '#6b7280' }}>{strings.IncidentHistory.LabelResolvedDate}</span>{' '}
                        <strong style={{ color: '#111827' }}>{new Date(selectedReplacement.resolvedDate).toLocaleString()}</strong>
                      </div>
                    )}
                    <div style={{ padding: '10px', backgroundColor: '#f0fdf4', borderRadius: '6px', border: '1px solid #dcfce7', color: '#166534', fontSize: '0.88rem', lineHeight: '1.4', whiteSpace: 'pre-wrap' }}>
                      <strong>{strings.IncidentHistory.ResolutionSummaryPrefix}</strong> {selectedReplacement.resolution}
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
