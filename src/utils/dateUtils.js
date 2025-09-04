// src/utils/dateUtils.js
export const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  return isNaN(date) ? 'Invalid Date' : date.toLocaleDateString('en-GB');
};