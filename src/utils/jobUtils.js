import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

// Format date consistently
export const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  return isNaN(date) ? 'Invalid Date' : date.toLocaleDateString('en-GB');
};

// Export jobs to PDF
export const exportJobsToPDF = (jobs, title) => {
  if (jobs.length === 0) {
    alert('No jobs to export');
    return;
  }
  
  const doc = new jsPDF();
  doc.setFontSize(18);
  doc.text(title, 105, 15, null, null, 'center');
  doc.setFontSize(10);
  doc.text(`Generated on: ${new Date().toLocaleDateString('en-GB')}`, 105, 22, null, null, 'center');
  
  const tableData = jobs.map((job, idx) => [
    idx + 1,
    job.title,
    job.company,
    job.location,
    `${job.minSalary} - ${job.maxSalary}`,
    job.openings,
    formatDate(job.lastDate),
  ]);

  autoTable(doc, {
    startY: 25,
    head: [['#', 'Title', 'Company', 'Location', 'Salary', 'Openings', 'Last Date']],
    body: tableData,
    theme: 'grid',
    styles: { fontSize: 9 },
    headStyles: { fillColor: [59, 130, 246] },
    alternateRowStyles: { fillColor: [243, 244, 246] },
  });

  doc.save(`my-jobs-${new Date().toISOString().slice(0, 10)}.pdf`);
};

// Export applicants to PDF
export const exportApplicantsToPDF = (applicants, jobTitle) => {
  if (applicants.length === 0) {
    alert('No applicants to export');
    return;
  }
  
  const doc = new jsPDF();
  doc.setFontSize(18);
  doc.text(`Applicants for ${jobTitle}`, 105, 15, null, null, 'center');
  doc.setFontSize(10);
  doc.text(`Generated on: ${new Date().toLocaleDateString('en-GB')}`, 105, 22, null, null, 'center');
  
  const tableData = applicants.map((applicant, idx) => [
    idx + 1,
    applicant.name,
    applicant.email,
    applicant.mobile,
    applicant.qualification,
    applicant.gender,
    applicant.score || 'N/A',
    applicant.status || 'Applied'
  ]);

  autoTable(doc, {
    startY: 25,
    head: [['#', 'Name', 'Email', 'Mobile', 'Qualification', 'Gender', 'Score', 'Status']],
    body: tableData,
    theme: 'grid',
    styles: { fontSize: 9 },
    headStyles: { fillColor: [79, 70, 229] },
    alternateRowStyles: { fillColor: [243, 244, 246] },
  });

  doc.save(`applicants-${jobTitle}-${new Date().toISOString().slice(0, 10)}.pdf`);
};