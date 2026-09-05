import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Transaction, DashboardMetrics } from '../types';
import { formatINR } from '../data/mockData';

export function exportTransactionsPDF(
  transactions: Transaction[],
  metrics: DashboardMetrics,
  userName: string = 'Priya Sharma',
  period: string = 'September 2026'
) {
  const doc = new jsPDF();

  // Primary brand header banner
  doc.setFillColor(16, 185, 129); // emerald-500
  doc.rect(0, 0, 210, 24, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('Smart Budget Tracker', 14, 15);

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text('FinTech Statement & Transaction Ledger', 14, 20);

  doc.text(`Generated: ${new Date().toLocaleDateString('en-IN')}`, 196, 15, { align: 'right' });

  // Metadata block
  doc.setTextColor(30, 41, 59);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('Account Statement', 14, 34);

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 116, 139);
  doc.text(`Account Holder: ${userName}`, 14, 40);
  doc.text(`Billing Cycle: ${period}`, 14, 45);
  doc.text(`Currency: Indian Rupee (INR)`, 14, 50);

  // Summary box
  doc.setDrawColor(226, 232, 240);
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(14, 55, 182, 22, 2, 2, 'FD');

  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139);
  doc.text('TOTAL BALANCE', 20, 62);
  doc.text('TOTAL CREDITS (INCOME)', 66, 62);
  doc.text('TOTAL DEBITS (EXPENSES)', 118, 62);
  doc.text('NET SAVINGS', 165, 62);

  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(16, 185, 129);
  doc.text(formatINR(metrics.totalBalance).replace('₹', 'Rs. '), 20, 70);

  doc.setTextColor(15, 23, 42);
  doc.text(formatINR(metrics.totalMonthlyIncome).replace('₹', 'Rs. '), 66, 70);

  doc.setTextColor(225, 29, 72);
  doc.text(formatINR(metrics.totalMonthlyExpenses).replace('₹', 'Rs. '), 118, 70);

  doc.setTextColor(79, 70, 229);
  doc.text(formatINR(metrics.netSavings).replace('₹', 'Rs. '), 165, 70);

  // Transactions Table
  const tableRows = transactions.map((t, index) => [
    index + 1,
    t.transactionDate,
    t.type.toUpperCase(),
    t.category,
    t.description || '—',
    t.paymentMethod,
    `${t.type === 'income' ? '+ ' : '- '}${formatINR(t.amount).replace('₹', 'Rs. ')}`,
  ]);

  autoTable(doc, {
    startY: 84,
    head: [['#', 'Date', 'Type', 'Category', 'Description', 'Method', 'Amount']],
    body: tableRows,
    theme: 'striped',
    headStyles: {
      fillColor: [15, 23, 42],
      textColor: [255, 255, 255],
      fontSize: 8,
      fontStyle: 'bold',
      halign: 'left',
    },
    bodyStyles: {
      fontSize: 8,
      textColor: [51, 65, 85],
    },
    columnStyles: {
      0: { cellWidth: 10 },
      1: { cellWidth: 22 },
      2: { cellWidth: 18 },
      3: { cellWidth: 32 },
      4: { cellWidth: 50 },
      5: { cellWidth: 22 },
      6: { cellWidth: 28, halign: 'right', fontStyle: 'bold' },
    },
    alternateRowStyles: {
      fillColor: [248, 250, 252],
    },
    didParseCell: function (data) {
      if (data.section === 'body' && data.column.index === 6) {
        const text = String(data.cell.raw);
        if (text.startsWith('+')) {
          data.cell.styles.textColor = [16, 185, 129];
        } else {
          data.cell.styles.textColor = [225, 29, 72];
        }
      }
    },
  });

  // Footer note
  const pageCount = (doc as any).internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(148, 163, 184);
    doc.text(
      `Smart Budget Tracker v1.0 • InfinityFree & Core PHP Stack Ready • Page ${i} of ${pageCount}`,
      105,
      290,
      { align: 'center' }
    );
  }

  doc.save(`SmartBudget_Statement_${period.replace(' ', '_')}.pdf`);
}
