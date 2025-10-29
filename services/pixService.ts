
import { PixSettings } from '../types';

const formatValue = (id: string, value: string): string => {
  const length = value.length.toString().padStart(2, '0');
  return `${id}${length}${value}`;
};

const crc16 = (payload: string): string => {
  let crc = 0xFFFF;
  for (let i = 0; i < payload.length; i++) {
    crc ^= payload.charCodeAt(i) << 8;
    for (let j = 0; j < 8; j++) {
      if ((crc & 0x8000) !== 0) {
        crc = (crc << 1) ^ 0x1021;
      } else {
        crc <<= 1;
      }
    }
  }
  return ('0000' + (crc & 0xFFFF).toString(16).toUpperCase()).slice(-4);
};

export const generateBRCode = (settings: PixSettings, amount: string): string => {
  const { pixKey, recipientName, city } = settings;

  const payloadFormatIndicator = '000201';
  
  const merchantAccountInformation = [
    formatValue('00', 'BR.GOV.BCB.PIX'),
    formatValue('01', pixKey)
  ].join('');
  const formattedMerchantAccountInformation = formatValue('26', merchantAccountInformation);

  const merchantCategoryCode = '52040000';
  const transactionCurrency = '5303986';
  
  const formattedAmount = formatValue('54', amount);

  const countryCode = '5802BR';

  const formattedRecipientName = formatValue('59', recipientName.normalize("NFD").replace(/[\u0300-\u036f]/g, "").substring(0, 25));

  const formattedCity = formatValue('60', city.normalize("NFD").replace(/[\u0300-\u036f]/g, ""));

  const additionalDataField = formatValue('05', '***');
  const formattedAdditionalDataField = formatValue('62', additionalDataField);

  const payload = [
    payloadFormatIndicator,
    formattedMerchantAccountInformation,
    merchantCategoryCode,
    transactionCurrency,
    formattedAmount,
    countryCode,
    formattedRecipientName,
    formattedCity,
    formattedAdditionalDataField,
    '6304'
  ].join('');

  const checksum = crc16(payload);

  return `${payload}${checksum}`;
};
