// ==================== web/src/utils/helpers.js ====================
import { format } from 'date-fns';
import { id } from 'date-fns/locale';

// Format date
export const formatDate = (date, formatStr = 'dd MMMM yyyy') => {
  if (!date) return '-';
  return format(new Date(date), formatStr, { locale: id });
};

// Format datetime
export const formatDateTime = (date) => {
  if (!date) return '-';
  return format(new Date(date), 'dd MMM yyyy HH:mm', { locale: id });
};

// Calculate grade from score
export const calculateGrade = (score) => {
  if (score >= 95) return 'A+';
  if (score >= 90) return 'A';
  if (score >= 85) return 'B+';
  if (score >= 80) return 'B';
  if (score >= 75) return 'C+';
  if (score >= 70) return 'C';
  if (score >= 60) return 'D';
  return 'E';
};

// Get grade color
export const getGradeColor = (grade) => {
  const colors = {
    'A+': 'text-green-600 bg-green-100',
    'A': 'text-green-600 bg-green-100',
    'B+': 'text-blue-600 bg-blue-100',
    'B': 'text-blue-600 bg-blue-100',
    'C+': 'text-yellow-600 bg-yellow-100',
    'C': 'text-yellow-600 bg-yellow-100',
    'D': 'text-orange-600 bg-orange-100',
    'E': 'text-red-600 bg-red-100',
  };
  return colors[grade] || 'text-gray-600 bg-gray-100';
};

// Get status badge variant
export const getStatusVariant = (status) => {
  const variants = {
    draft: 'warning',
    submitted: 'primary',
    reviewed: 'success',
    pending: 'default',
  };
  return variants[status] || 'default';
};

// Get status label
export const getStatusLabel = (status) => {
  const labels = {
    draft: 'Draft',
    submitted: 'Submitted',
    reviewed: 'Reviewed',
    pending: 'Pending',
  };
  return labels[status] || status;
};

// Format periode
export const formatPeriode = (periode) => {
  if (!periode) return '-';
  
  if (periode.includes('Q')) {
    const [year, quarter] = periode.split('-');
    return `${quarter} ${year}`;
  }
  
  if (periode.length === 4) {
    return periode; // Year only
  }
  
  const [year, month] = periode.split('-');
  const months = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ];
  return `${months[parseInt(month) - 1]} ${year}`;
};

// Format number
export const formatNumber = (num, decimals = 0) => {
  if (num === null || num === undefined) return '-';
  return new Intl.NumberFormat('id-ID', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(num);
};

// Truncate text
export const truncate = (text, maxLength = 100) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

// Debounce function
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

// Download file
export const downloadFile = (data, filename, type = 'text/csv') => {
  const blob = new Blob([data], { type });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
};

// Validate email
export const isValidEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

// Class names utility
export const cn = (...classes) => {
  return classes.filter(Boolean).join(' ');
};
