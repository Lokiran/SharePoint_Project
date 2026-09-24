// AUTO-EXTRACTED from InventoryManagement.tsx (structural refactor split).
// Pure CSV/jsPDF export functions for the Reports tab. No React, no
// component state — operate only on the item arrays passed in.
import { jsPDF } from 'jspdf';
import { IInventoryItem } from '../models/IInventoryItem';

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

    const csvContent = "\uFEFF" + csvRows.join("\n");
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

  export function exportWarrantyReportToPDF(items: IInventoryItem[]): void {
    const doc = new jsPDF();

    // Header
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.text("Asset Warranty Expiry Report", 14, 20);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 28);
    doc.text(`Total Assets: ${items.length} | Assets with Warranty: ${items.filter(i => i.warrantyExpiry).length}`, 14, 34);

    // Table Headers
    doc.setFont("helvetica", "bold");
    doc.setFillColor(240, 240, 240);
    doc.rect(14, 42, 182, 8, "F");
    doc.text("Asset Name", 16, 47);
    doc.text("Asset Type", 70, 47);
    doc.text("Status", 110, 47);
    doc.text("Purchase Date", 140, 47);
    doc.text("Warranty Expiry", 170, 47);

    doc.setDrawColor(200, 200, 200);
    doc.line(14, 50, 196, 50);

    // Rows
    doc.setFont("helvetica", "normal");
    let y = 56;
    items.forEach((item) => {
      if (y > 275) {
        doc.addPage();
        y = 20;
        doc.setFont("helvetica", "bold");
        doc.setFillColor(240, 240, 240);
        doc.rect(14, y - 6, 182, 8, "F");
        doc.text("Asset Name", 16, y - 1);
        doc.text("Asset Type", 70, y - 1);
        doc.text("Status", 110, y - 1);
        doc.text("Purchase Date", 140, y - 1);
        doc.text("Warranty Expiry", 170, y - 1);
        doc.line(14, y + 2, 196, y + 2);
        doc.setFont("helvetica", "normal");
        y += 8;
      }

      const name = (item.assetName || item.title || "").substring(0, 25);
      const type = (item.assetType || "").substring(0, 18);
      const status = (item.status || "").substring(0, 15);
      const purchaseDate = item.purchaseDate || "N/A";
      const warrantyExpiry = item.warrantyExpiry || "N/A";

      doc.text(name, 16, y);
      doc.text(type, 70, y);
      doc.text(status, 110, y);
      doc.text(purchaseDate, 140, y);
      doc.text(warrantyExpiry, 170, y);

      doc.line(14, y + 2, 196, y + 2);
      y += 8;
    });

    doc.save(`Warranty_Expiry_Report_${new Date().toISOString().split('T')[0]}.pdf`);
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

    const csvContent = "\uFEFF" + csvRows.join("\n");
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
    const doc = new jsPDF();

    // Header
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.text("Detailed Inventory Asset Report", 14, 20);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 28);
    doc.text(`Total Assets Displayed: ${filteredItems.length}`, 14, 34);

    // Table Headers
    doc.setFont("helvetica", "bold");
    doc.setFillColor(240, 240, 240);
    doc.rect(14, 42, 182, 8, "F");
    doc.text("Asset Name", 16, 47);
    doc.text("Asset Type", 65, 47);
    doc.text("Status", 100, 47);
    doc.text("Condition", 130, 47);
    doc.text("Assigned To", 160, 47);

    doc.setDrawColor(200, 200, 200);
    doc.line(14, 50, 196, 50);

    // Rows
    doc.setFont("helvetica", "normal");
    let y = 56;
    filteredItems.forEach((item) => {
      if (y > 275) {
        doc.addPage();
        y = 20;
        doc.setFont("helvetica", "bold");
        doc.setFillColor(240, 240, 240);
        doc.rect(14, y - 6, 182, 8, "F");
        doc.text("Asset Name", 16, y - 1);
        doc.text("Asset Type", 65, y - 1);
        doc.text("Status", 100, y - 1);
        doc.text("Condition", 130, y - 1);
        doc.text("Assigned To", 160, y - 1);
        doc.line(14, y + 2, 196, y + 2);
        doc.setFont("helvetica", "normal");
        y += 8;
      }

      const name = (item.assetName || item.title || "").substring(0, 23);
      const type = (item.assetType || "").substring(0, 15);
      const status = (item.status || "").substring(0, 14);
      const condition = (item.condition || "N/A").substring(0, 14);
      const assignedTo = (item.assignedTo || "N/A").substring(0, 18);

      doc.text(name, 16, y);
      doc.text(type, 65, y);
      doc.text(status, 100, y);
      doc.text(condition, 130, y);
      doc.text(assignedTo, 160, y);

      doc.line(14, y + 2, 196, y + 2);
      y += 8;
    });

    doc.save(`Detailed_Asset_Report_${new Date().toISOString().split('T')[0]}.pdf`);
  }
