import QRCode from 'qrcode';

export const generateQRCode = async (text: string): Promise<string> => {
  try {
    const qrCodeDataUrl = await QRCode.toDataURL(text, {
      width: 300,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      }
    });
    return qrCodeDataUrl;
  } catch (error) {
    console.error('Error generating QR code:', error);
    throw error;
  }
};

export const downloadQRCode = (dataUrl: string, filename: string) => {
  const link = document.createElement('a');
  link.download = filename;
  link.href = dataUrl;
  link.click();
};