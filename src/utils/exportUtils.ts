/**
 * Export and Print utilities for SIMPANDADU Desa Adimulya
 */

export function exportToCSV(filename: string, rows: Record<string, any>[], columnTitles?: Record<string, string>) {
  if (!rows || rows.length === 0) {
    alert('Tidak ada data untuk diekspor.');
    return;
  }

  const keys = Object.keys(columnTitles || rows[0]);
  const headers = keys.map((k) => (columnTitles ? columnTitles[k] || k : k));

  const csvRows: string[] = [];
  // Add header row
  csvRows.push(headers.map((h) => `"${h.replace(/"/g, '""')}"`).join(','));

  // Add data rows
  for (const row of rows) {
    const values = keys.map((key) => {
      const val = row[key];
      if (val === null || val === undefined) return '""';
      const strVal = String(val).replace(/"/g, '""');
      return `"${strVal}"`;
    });
    csvRows.push(values.join(','));
  }

  // Prepend BOM for UTF-8 Excel support
  const csvContent = '\uFEFF' + csvRows.join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function printOfficialDocument(
  title: string,
  category: string,
  contentHtml: string,
  signerName: string = 'Drs. H. Sukirman, M.Si.',
  signerTitle: string = 'Kepala Desa Adimulya'
) {
  const printWindow = window.open('', '_blank', 'width=900,height=700');
  if (!printWindow) {
    alert('Pop-up terblokir oleh peramban. Izinkan pop-up untuk mencetak dokumen.');
    return;
  }

  const today = new Date().toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const fullHtml = `
<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <title>${title} - Desa Adimulya</title>
  <style>
    @page { size: A4; margin: 20mm; }
    body {
      font-family: 'Times New Roman', Times, serif;
      color: #111;
      line-height: 1.5;
      padding: 10px;
    }
    .header-kop {
      text-align: center;
      border-bottom: 3px double #000;
      padding-bottom: 12px;
      margin-bottom: 24px;
      position: relative;
    }
    .header-kop h3 {
      font-size: 15pt;
      margin: 0;
      text-transform: uppercase;
      letter-spacing: 1px;
      font-weight: bold;
    }
    .header-kop h2 {
      font-size: 17pt;
      margin: 2px 0;
      text-transform: uppercase;
      letter-spacing: 1.5px;
      font-weight: 800;
    }
    .header-kop p {
      margin: 2px 0;
      font-size: 10pt;
      font-style: italic;
    }
    .doc-title {
      text-align: center;
      margin-bottom: 20px;
    }
    .doc-title h4 {
      margin: 0;
      font-size: 14pt;
      text-transform: uppercase;
      text-decoration: underline;
    }
    .doc-title p {
      margin: 4px 0 0 0;
      font-size: 10.5pt;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 15px;
      font-size: 10pt;
    }
    table, th, td {
      border: 1px solid #333;
    }
    th {
      background-color: #f2f2f2;
      padding: 8px;
      text-align: left;
    }
    td {
      padding: 6px 8px;
    }
    .signature-section {
      margin-top: 40px;
      display: flex;
      justify-content: flex-end;
    }
    .signature-box {
      width: 250px;
      text-align: center;
    }
    .signature-space {
      height: 70px;
    }
    .stamp-text {
      font-size: 9pt;
      color: #444;
      font-style: italic;
    }
    @media print {
      body { -webkit-print-color-adjust: exact; }
    }
  </style>
</head>
<body>
  <div class="header-kop">
    <h3>PEMERINTAH KABUPATEN CILACAP</h3>
    <h3>KECAMATAN WANAREJA</h3>
    <h2>PEMERINTAH DESA ADIMULYA</h2>
    <p>Jl. Merdeka No. 01, Dusun Cilatar, Desa Adimulya, Kec. Wanareja, Kab. Cilacap 53265</p>
    <p>Email: pemdes@adimulya.desa.id | Laman Resmi: adimulya.desa.id</p>
  </div>

  <div class="doc-title">
    <h4>${title}</h4>
    <p>Kategori: <strong>${category}</strong> | Tanggal Cetak: ${today}</p>
  </div>

  <div class="content-body">
    ${contentHtml}
  </div>

  <div class="signature-section">
    <div class="signature-box">
      <p>Adimulya, ${today}</p>
      <p><strong>${signerTitle}</strong></p>
      <div class="signature-space"></div>
      <p><strong><u>${signerName}</u></strong></p>
      <p class="stamp-text">NIP. 19680512 199303 1 004</p>
    </div>
  </div>

  <script>
    window.onload = function() {
      setTimeout(function() {
        window.print();
      }, 500);
    };
  </script>
</body>
</html>
  `;

  printWindow.document.open();
  printWindow.document.write(fullHtml);
  printWindow.document.close();
}
