import apiService from './apiService';

class QRService {
  async generateQRToken() {
    try {
      const response = await apiService.makeRequest('/auth/qr-token', {
        method: 'POST'
      });
      return response;
    } catch (error) {
      throw new Error(`QR token generation failed: ${error.message}`);
    }
  }

  async validateQRToken(token) {
    try {
      const response = await apiService.makeRequest('/auth/validate-qr', {
        method: 'POST',
        body: JSON.stringify({ token })
      });
      return response;
    } catch (error) {
      throw new Error(`QR token validation failed: ${error.message}`);
    }
  }

  getStoredQRToken() {
    return localStorage.getItem('qrToken');
  }

  clearQRToken() {
    localStorage.removeItem('qrToken');
  }
}

export default new QRService();
