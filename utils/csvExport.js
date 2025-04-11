/**
 * Utility functions for exporting data to CSV format
 */

/**
 * Convert array of objects to CSV string
 * @param {Array} data - Array of objects to convert
 * @param {Array} headers - Array of header names
 * @param {Array} keys - Array of keys corresponding to headers
 * @returns {string} CSV formatted string
 */
export function convertToCSV(data, headers, keys) {
  // Add headers
  let csvContent = headers.join(',') + '\n';
  
  // Add rows
  data.forEach(item => {
    const row = keys.map(key => {
      // Handle special cases (nested objects, etc.)
      let value = item[key] || '';
      
      // Escape quotes and wrap in quotes if contains comma
      if (typeof value === 'string') {
        if (value.includes(',') || value.includes('"') || value.includes('\n')) {
          value = '"' + value.replace(/"/g, '""') + '"';
        }
      }
      
      return value;
    });
    
    csvContent += row.join(',') + '\n';
  });
  
  return csvContent;
}

/**
 * Download CSV file
 * @param {string} csvContent - CSV formatted string
 * @param {string} filename - Name of the file to download
 */
export function downloadCSV(csvContent, filename) {
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Export registrations data to CSV
 * @param {Array} registrations - Array of registration objects
 */
export function exportRegistrationsToCSV(registrations) {
  const headers = [
    'Name', 
    'Email', 
    'Registration Type', 
    'Registration Status', 
    'Payment Status', 
    'Registration Code', 
    'Registration Date'
  ];
  
  const keys = [
    'name', 
    'email', 
    'registrationType', 
    'registrationStatus', 
    'paymentStatus', 
    'registrationCode', 
    'createdAt'
  ];
  
  const formattedData = registrations.map(reg => ({
    ...reg,
    createdAt: new Date(reg.createdAt).toLocaleDateString()
  }));
  
  const csvContent = convertToCSV(formattedData, headers, keys);
  downloadCSV(csvContent, `registrations-${new Date().toISOString().split('T')[0]}.csv`);
}

/**
 * Export filtered registrations data to CSV
 * @param {Array} registrations - Array of registration objects
 * @param {Object} filters - Filter criteria
 */
export function exportFilteredRegistrationsToCSV(registrations, filters) {
  const { searchTerm, statusFilter, paymentFilter, typeFilter } = filters;
  
  // Apply the same filters as in the UI
  const filteredData = registrations.filter((reg) => {
    const matchesSearch = !searchTerm || 
      reg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reg.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reg.registrationCode.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === "all" ||
      reg.registrationStatus.toLowerCase() === statusFilter;

    const matchesPayment = paymentFilter === "all" ||
      reg.paymentStatus.toLowerCase() === paymentFilter;

    const matchesType = typeFilter === "all" ||
      reg.registrationType.toLowerCase().includes(typeFilter.toLowerCase());

    return matchesSearch && matchesStatus && matchesPayment && matchesType;
  });
  
  exportRegistrationsToCSV(filteredData);
}
