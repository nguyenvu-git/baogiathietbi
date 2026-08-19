// Utility function to convert numbers into Vietnamese currency words

const defaultNumbers = ['không', 'một', 'hai', 'ba', 'bốn', 'năm', 'sáu', 'bảy', 'tám', 'chín'];

function readGroup(number) {
  let read = '';
  const hundred = Math.floor(number / 100);
  const ten = Math.floor((number % 100) / 10);
  const unit = number % 10;

  if (hundred === 0 && ten === 0 && unit === 0) return '';

  if (hundred !== 0) {
    read += defaultNumbers[hundred] + ' trăm';
    if (ten === 0 && unit !== 0) read += ' lẻ';
  }

  if (ten !== 0 && ten !== 1) {
    read += ' ' + defaultNumbers[ten] + ' mươi';
    if (ten === 0 && unit !== 0) read += ' lẻ';
  }

  if (ten === 1) read += ' mười';

  switch (unit) {
    case 1:
      if (ten !== 0 && ten !== 1) read += ' mốt';
      else read += ' ' + defaultNumbers[unit];
      break;
    case 5:
      if (ten === 0) read += ' ' + defaultNumbers[unit];
      else read += ' lăm';
      break;
    default:
      if (unit !== 0) read += ' ' + defaultNumbers[unit];
      break;
  }

  return read;
}

export function numberToWordsVN(number) {
  if (number === 0) return 'Không đồng';
  if (!number || isNaN(number)) return '';

  let num = Math.abs(Math.round(number));
  let str = '';
  const units = ['', 'ngàn', 'triệu', 'tỷ', 'ngàn tỷ', 'triệu tỷ'];
  let i = 0;

  while (num > 0) {
    const group = num % 1000;
    if (group > 0) {
      const groupText = readGroup(group);
      str = groupText + ' ' + units[i] + ' ' + str;
    }
    num = Math.floor(num / 1000);
    i++;
  }

  str = str.trim();
  if (str) {
    str = str.charAt(0).toUpperCase() + str.slice(1) + ' đồng';
  }
  return str;
}
