// AUTO-EXTRACTED from InventoryManagement.tsx (structural refactor split).
// CSV and PDF export functions for the Reports tab. No React, no
// component state — operate only on the item arrays passed in.
import { IInventoryItem } from '../models/IInventoryItem';
import * as strings from 'InventoryManagementWebPartStrings';
import { formatString } from './LocalizationUtils';
import { saveNexerTableReport, formatReportDate, NexerTagTone } from './NexerPdfReport';
import { statusBucket, warrantyInfo } from '../components/inventory/inventoryUi';

  /** Downloads a table as CSV (opens in Excel). The file name gets today's date appended. */
  export function exportRowsToCsv(fileBase: string, headers: string[], rows: Array<Array<string | number | undefined>>): void {
    const cell = (value: string | number | undefined): string => `"${String(value === undefined || value === null ? '' : value).replace(/"/g, '""')}"`;
    const csvRows = [headers.map(cell).join(",")].concat(rows.map(row => row.map(cell).join(",")));

    const csvContent = "﻿" + csvRows.join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });

    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `${fileBase}_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  export function exportWarrantyReportToExcel(items: IInventoryItem[]): void {
    const headers = ["Asset Name", "Asset Type", "Status", "Purchase Date", "Warranty Expiry Date"];
    const csvRows = [headers.join(",")];

    items.forEach(item => {
      const name = (item.assetName || item.title || "").replace(/"/g, '""');
      const type = (item.assetType || "").replace(/"/g, '""');
      const status = (item.status || "").replace(/"/g, '""');
      const purchaseDate = (item.purchaseDate || "").replace(/"/g, '""');
      const warrantyExpiry = (item.warrantyExpiry || "N/A").replace(/"/g, '""');

      const row = [
        `"${name}"`,
        `"${type}"`,
        `"${status}"`,
        `"${purchaseDate}"`,
        `"${warrantyExpiry}"`
      ];
      csvRows.push(row.join(","));
    });

    const csvContent = "﻿" + csvRows.join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });

    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `Warranty_Expiry_Report_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  // ---------- Nexer-branded PDF reports ----------

  const nameOf = (item: IInventoryItem): string => (item.assetName || item.title || '').trim();
  const reportDay = (): string => formatReportDate(new Date().toISOString(), false) || '';
  const generatedText = (): string => formatString(strings.IncidentHistory.PdfGeneratedOn, formatReportDate(new Date().toISOString()) || '');
  const fileStamp = (): string => new Date().toISOString().split('T')[0];
  const typeCount = (items: IInventoryItem[]): number => new Set(items.map(i => (i.assetType || '').trim()).filter(Boolean)).size;

  /** Status tag colours, the same meanings as the Inventory page. */
  const statusTag = (item: IInventoryItem): NexerTagTone => {
    switch (statusBucket(item.status)) {
      case 'inStock': return 'green';
      case 'assigned': return 'blue';
      case 'pendingReturn':
      case 'maintenance': return 'amber';
      case 'retired': return 'red';
      default: return 'grey';
    }
  };

  const warrantyTag = (item: IInventoryItem): NexerTagTone => {
    const state = warrantyInfo(item.warrantyExpiry).state;
    return state === 'expired' ? 'red' : state === 'soon' ? 'amber' : state === 'active' ? 'green' : 'grey';
  };

  export function exportWarrantyReportToPDF(items: IInventoryItem[]): void {
    const t = strings.Reports;
    const states = items.map(i => warrantyInfo(i.warrantyExpiry).state);
    const count = (state: string): number => states.filter(s => s === state).length;

    saveNexerTableReport({
      documentType: t.PdfWarrantyReportType,
      reference: reportDay(),
      heading: strings.ReportsPage.WarrantyTitle,
      subheading: formatString(t.PdfAssetSubheading, items.length, typeCount(items)),
      summaryTitle: t.PdfSummary,
      summary: [
        { label: t.KpiTotalAssets, value: items.length },
        { label: strings.ReportsPage.AssetsWithWarrantyLabel, value: items.length - count('none') },
        { label: t.WarrantyExpired, value: count('expired') },
        { label: t.PdfEndingSoon, value: count('soon') }
      ],
      tableTitle: t.PdfAssetList,
      columns: [
        { header: strings.Columns.AssetName, width: 40 },
        { header: strings.Columns.SerialNumber, width: 22 },
        { header: strings.ReportsPage.LabelAssetType, width: 22 },
        { header: strings.Columns.Status, width: 27, tag: (_value, row) => statusTag(items[row]) },
        { header: strings.Columns.PurchaseDate, width: 25 },
        { header: strings.Columns.WarrantyExpiry, width: 42, tag: (_value, row) => warrantyTag(items[row]) }
      ],
      rows: items.map(item => [
        nameOf(item),
        item.serialNumber,
        item.assetType,
        item.status,
        formatReportDate(item.purchaseDate, false) || '',
        warrantyInfo(item.warrantyExpiry).text
      ]),
      emptyText: t.NoData,
      productName: strings.Hero.Title,
      generatedText: generatedText(),
      fileName: `Warranty_Expiry_Report_${fileStamp()}.pdf`
    });
  }

  export function exportDetailedReportToExcel(filteredItems: IInventoryItem[]): void {
    const headers = ["Asset Name", "Asset Type", "Status", "Condition", "Purchase Date", "Assigned To", "Specifications"];
    const csvRows = [headers.join(",")];

    filteredItems.forEach(item => {
      const name = (item.assetName || item.title || "").replace(/"/g, '""');
      const type = (item.assetType || "").replace(/"/g, '""');
      const status = (item.status || "").replace(/"/g, '""');
      const condition = (item.condition || "").replace(/"/g, '""');
      const purchaseDate = (item.purchaseDate || "").replace(/"/g, '""');
      const assignedTo = (item.assignedTo || "N/A").replace(/"/g, '""');
      const specs = (item.specifications || "").replace(/"/g, '""');

      const row = [
        `"${name}"`,
        `"${type}"`,
        `"${status}"`,
        `"${condition}"`,
        `"${purchaseDate}"`,
        `"${assignedTo}"`,
        `"${specs}"`
      ];
      csvRows.push(row.join(","));
    });

    const csvContent = "﻿" + csvRows.join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });

    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `Detailed_Asset_Report_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  export function exportDetailedReportToPDF(filteredItems: IInventoryItem[]): void {
    const t = strings.Reports;
    const buckets = filteredItems.map(i => statusBucket(i.status));
    const inStock = buckets.filter(b => b === 'inStock').length;
    const assigned = buckets.filter(b => b === 'assigned').length;

    saveNexerTableReport({
      documentType: t.PdfAssetReportType,
      reference: reportDay(),
      heading: t.PdfAssetHeading,
      subheading: formatString(t.PdfAssetSubheading, filteredItems.length, typeCount(filteredItems)),
      summaryTitle: t.PdfSummary,
      summary: [
        { label: t.KpiTotalAssets, value: filteredItems.length },
        { label: t.KpiInStock, value: inStock },
        { label: t.KpiAssigned, value: assigned },
        { label: t.SeriesOther, value: filteredItems.length - inStock - assigned }
      ],
      tableTitle: t.PdfAssetList,
      columns: [
        { header: strings.Columns.AssetName, width: 42 },
        { header: strings.Columns.SerialNumber, width: 23 },
        { header: strings.ReportsPage.LabelAssetType, width: 23 },
        { header: strings.Columns.Status, width: 29, tag: (_value, row) => statusTag(filteredItems[row]) },
        { header: strings.Columns.Condition, width: 21 },
        { header: strings.Columns.AssignedTo, width: 40 }
      ],
      rows: filteredItems.map(item => [
        nameOf(item),
        item.serialNumber,
        item.assetType,
        item.status,
        item.condition || '',
        item.assignedTo || ''
      ]),
      emptyText: t.NoData,
      productName: strings.Hero.Title,
      generatedText: generatedText(),
      fileName: `Detailed_Asset_Report_${fileStamp()}.pdf`
    });
  }
