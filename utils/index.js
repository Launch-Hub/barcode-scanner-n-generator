export const formatCurency = num => {
  if (!num) return '';
  const formatter = new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    // These options can be used to round to whole numbers.
    trailingZeroDisplay: 'stripIfInteger', // This is probably what most people
  });
  return formatter.format(num);
};
export const formatNumber = num => {
  if (!num) return '';
  let numericValue = num.replace(/[^0-9.]/g, '');
  // Convert to a number and back to a string with thousand separators
  let formattedValue = numericValue ? parseFloat(numericValue).toLocaleString('en-US') : '';
  return formattedValue;
};
export const revertRawNumber = text => {
  if (!text) return '';

  return text.replace(/[^0-9.]/g, '');
};
