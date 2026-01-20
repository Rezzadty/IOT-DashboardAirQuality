import React, { useState } from 'react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import './Table.css';

const Table = ({ data }) => {
  const [isExporting, setIsExporting] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Hitung total halaman
  const totalPages = Math.ceil(data.length / itemsPerPage);

  // Hitung index data untuk halaman saat ini
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentData = data.slice(indexOfFirstItem, indexOfLastItem);

  // Fungsi untuk berpindah halaman
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

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
      console.log('Memulai export PDF...');
      console.log('Data yang akan di-export:', data);

      // Validasi data
      if (!data || data.length === 0) {
        alert('Tidak ada data untuk di-export');
        setIsExporting(false);
        return;
      }

      const doc = new jsPDF();
      
      // Set judul dokumen
      doc.setFontSize(18);
      doc.text('Riwayat Data Sensor (Setiap 30 Menit)', 14, 22);
      
      // Set informasi tambahan
      doc.setFontSize(11);
      doc.text(`Tanggal Export: ${new Date().toLocaleString('id-ID')}`, 14, 30);
      doc.text(`Total Data: ${data.length} record`, 14, 36);
      
      // Konversi data untuk tabel PDF
      const tableData = data.map((item, index) => [
        index + 1,
        item.humidity,
        item.temperature,
        item.mq135_ratio,
        item.mq7_ratio,
        item.voltage_rms,
        item.timestamp
      ]);
      
      console.log('Table data untuk PDF:', tableData);
      
      // Generate tabel dengan autoTable
      doc.autoTable({
        head: [[
          'No',
          'Humidity (%)',
          'Temperature (°C)',
          'MQ-135 Ratio',
          'MQ-7 Ratio',
          'Voltage RMS (V)',
          'Tanggal'
        ]],
        body: tableData,
        startY: 42,
        theme: 'grid',
        styles: {
          fontSize: 9,
          cellPadding: 3,
        },
        headStyles: {
          fillColor: [0, 180, 216],
          textColor: [255, 255, 255],
          fontStyle: 'bold',
          halign: 'center'
        },
        alternateRowStyles: {
          fillColor: [240, 248, 255]
        },
        columnStyles: {
          0: { halign: 'center', cellWidth: 15 },
          1: { halign: 'center' },
          2: { halign: 'center' },
          3: { halign: 'center' },
          4: { halign: 'center' },
          5: { halign: 'center' },
          6: { halign: 'center' }
        }
      });
      
      // Simpan PDF dengan nama file yang dinamis
      const fileName = `Data_Sensor_${new Date().toISOString().split('T')[0]}.pdf`;
      console.log('Menyimpan PDF dengan nama:', fileName);
      doc.save(fileName);
      
      console.log('PDF berhasil di-export!');
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
        <table className="sensor-table">
          <thead>
            <tr>
              <th>No</th>
              <th>Humidity (%)</th>
              <th>Temperature (°C)</th>
              <th>MQ-135 Ratio</th>
              <th>MQ-7 Ratio</th>
              <th>Voltage RMS (V)</th>
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
                <td>{item.voltage_rms}</td>
                <td>{item.timestamp}</td>
              </tr>
            ))}
          </tbody>
        </table>
        
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
            
            <div className="pagination-numbers">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNumber) => (
                <button
                  key={pageNumber}
                  className={`pagination-number ${currentPage === pageNumber ? 'active' : ''}`}
                  onClick={() => handlePageChange(pageNumber)}
                >
                  {pageNumber}
                </button>
              ))}
            </div>
            
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
