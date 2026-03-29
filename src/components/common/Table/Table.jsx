import { useState } from 'react';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import './Table.css';

const Table = ({ data }) => {
  const [isExporting, setIsExporting] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const parseToDate = (value) => {
    if (!value) return null;
    if (value instanceof Date) return value;

    if (typeof value === 'object') {
      if (typeof value.toDate === 'function') {
        const asDate = value.toDate();
        return asDate instanceof Date && !Number.isNaN(asDate.getTime()) ? asDate : null;
      }
      if (typeof value.seconds === 'number') {
        const asDate = new Date(value.seconds * 1000);
        return !Number.isNaN(asDate.getTime()) ? asDate : null;
      }
    }

    if (typeof value === 'number') {
      const asDate = new Date(value);
      return !Number.isNaN(asDate.getTime()) ? asDate : null;
    }

    if (typeof value === 'string') {
      const normalized = value.includes('T') ? value : value.replace(' ', 'T');
      const asDate = new Date(normalized);
      if (!Number.isNaN(asDate.getTime())) return asDate;

      const match = value.match(
        /^(\d{4})-(\d{2})-(\d{2})[ T](\d{2}):(\d{2})(?::(\d{2}))?$/
      );
      if (match) {
        const [, y, m, d, hh, mm, ss] = match;
        const localDate = new Date(
          Number(y),
          Number(m) - 1,
          Number(d),
          Number(hh),
          Number(mm),
          Number(ss || 0)
        );
        return !Number.isNaN(localDate.getTime()) ? localDate : null;
      }
    }

    return null;
  };

  const formatNumber = (value, fractionDigits = 2) => {
    if (value === null || value === undefined || value === '') return '—';
    const numericValue = Number(value);
    if (Number.isFinite(numericValue)) {
      return new Intl.NumberFormat('id-ID', {
        minimumFractionDigits: fractionDigits,
        maximumFractionDigits: fractionDigits,
      }).format(numericValue);
    }
    return String(value);
  };

  const formatDateTimeId = (value) => {
    const date = parseToDate(value);
    if (!date) return value ? String(value) : '—';

    return new Intl.DateTimeFormat('id-ID', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    }).format(date);
  };

  // Hitung total halaman
  const totalPages = Math.ceil(data.length / itemsPerPage);

  // Hitung index data untuk halaman saat ini
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentData = data.slice(indexOfFirstItem, indexOfLastItem);

  // Fungsi untuk berpindah halaman
  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handleExportPDF = () => {
    try {
      setIsExporting(true);

      // Validasi data
      if (!data || data.length === 0) {
        alert('Tidak ada data untuk di-export');
        setIsExporting(false);
        return;
      }

      const exportedAt = new Date();
      const doc = new jsPDF({ orientation: 'portrait', unit: 'pt', format: 'a4' });
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const marginX = 40;

      const timestamps = data
        .map((row) => parseToDate(row?.timestamp))
        .filter((d) => d instanceof Date && !Number.isNaN(d.getTime()));
      const minDate = timestamps.length ? new Date(Math.min(...timestamps.map((d) => d.getTime()))) : null;
      const maxDate = timestamps.length ? new Date(Math.max(...timestamps.map((d) => d.getTime()))) : null;
      const periodText = minDate && maxDate ? `${formatDateTimeId(minDate)} – ${formatDateTimeId(maxDate)}` : '—';

      // Header (judul + metadata)
      doc.setTextColor(26, 47, 71);
      doc.setFontSize(16);
      doc.setFont('helvetica', 'bold');
      doc.text('Laporan Riwayat Data Sensor', marginX, 44);

      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(60, 60, 60);
      doc.text(`Periode data: ${periodText}`, marginX, 64);
      doc.text(`Diekspor pada: ${formatDateTimeId(exportedAt)}`, marginX, 80);
      doc.text(`Total data: ${data.length} record`, marginX, 96);

      // Konversi data untuk tabel PDF
      const tableData = data.map((item, index) => [
        index + 1,
        formatNumber(item?.humidity, 2),
        formatNumber(item?.temperature, 2),
        formatNumber(item?.mq135_ratio, 2),
        formatNumber(item?.mq7_ratio, 2),
        formatDateTimeId(item?.timestamp),
      ]);
      
      // Generate tabel dengan autoTable
      autoTable(doc, {
        head: [[
          'No',
          'Humidity (%)',
          'Temperature (°C)',
          'MQ-135 Ratio',
          'MQ-7 Ratio',
          'Tanggal'
        ]],
        body: tableData,
        startY: 112,
        theme: 'grid',
        margin: { left: marginX, right: marginX },
        styles: {
          font: 'helvetica',
          fontSize: 9,
          cellPadding: 6,
          textColor: [30, 30, 30],
          lineColor: [210, 210, 210],
          lineWidth: 0.6,
          valign: 'middle',
        },
        headStyles: {
          fillColor: [26, 47, 71],
          textColor: [255, 255, 255],
          fontStyle: 'bold',
          halign: 'center',
          valign: 'middle',
        },
        alternateRowStyles: {
          fillColor: [245, 248, 251],
        },
        columnStyles: {
          0: { halign: 'center', cellWidth: 28 },
          1: { halign: 'right', cellWidth: 76 },
          2: { halign: 'right', cellWidth: 90 },
          3: { halign: 'right', cellWidth: 74 },
          4: { halign: 'right', cellWidth: 68 },
          5: { halign: 'left', cellWidth: 130 },
        },
        didDrawPage: () => {
          const pageNumber =
            typeof doc.internal.getNumberOfPages === 'function'
              ? doc.internal.getNumberOfPages()
              : typeof doc.getNumberOfPages === 'function'
                ? doc.getNumberOfPages()
                : 1;

          doc.setFont('helvetica', 'normal');
          doc.setFontSize(9);
          doc.setTextColor(120, 120, 120);
          doc.text(`Halaman ${pageNumber}`, pageWidth - marginX, pageHeight - 22, { align: 'right' });
        },
      });
      
      // Simpan PDF dengan nama file yang dinamis
      const datePart = exportedAt.toISOString().split('T')[0];
      const timePart = exportedAt.toTimeString().slice(0, 8).replaceAll(':', '-');
      const fileName = `Laporan_Data_Sensor_${datePart}_${timePart}.pdf`;
      doc.save(fileName);

      setIsExporting(false);
    } catch (error) {
      console.error('Error saat export PDF:', error);
      alert('Gagal export PDF: ' + error.message);
      setIsExporting(false);
    }
  };

  return (
    <div className="table-container">
      <div className="table-wrapper">
        <div className="table-header">
          <h2 className="table-title">Riwayat Data Sensor (Setiap 30 Menit)</h2>
          <button
            className="export-btn"
            onClick={handleExportPDF}
            disabled={isExporting || !data || data.length === 0}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <polyline points="7 10 12 15 17 10"></polyline>
              <line x1="12" y1="15" x2="12" y2="3"></line>
            </svg>
            {isExporting ? 'Exporting...' : 'Export PDF'}
          </button>
        </div>
        <div className="table-scroll">
          <table className="sensor-table">
            <thead>
              <tr>
                <th>No</th>
                <th>Humidity (%)</th>
                <th>Temperature (°C)</th>
                <th>MQ-135 Ratio</th>
                <th>MQ-7 Ratio</th>
                <th>Tanggal</th>
              </tr>
            </thead>
            <tbody>
              {currentData.map((item, index) => (
                <tr key={item.id}>
                  <td>{indexOfFirstItem + index + 1}</td>
                  <td>{item.humidity}</td>
                  <td>{item.temperature}</td>
                  <td>{item.mq135_ratio}</td>
                  <td>{item.mq7_ratio}</td>
                  <td>{item.timestamp}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        {data.length > 0 && (
          <div className="pagination">
            <button
              className="pagination-btn"
              onClick={handlePreviousPage}
              disabled={currentPage === 1}
            >
              Previous
            </button>

            <button
              className="pagination-btn"
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Table;
