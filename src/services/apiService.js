import { API_CONFIG } from '../config/api';

class ApiService {
  constructor() {
    this.baseURL = API_CONFIG.BASE_URL;
  }

  async makeRequest(endpoint, options = {}) {
    const token = localStorage.getItem('accessToken');
    
    const config = {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
        ...options.headers
      }
    };

    const response = await fetch(`${this.baseURL}${endpoint}`, config);
    
    if (!response.ok) {
      await this.handleError(response);
    }
    
    return await response.json();
  }

  async handleError(response) {
    const errorData = await response.json().catch(() => ({}));
    
    switch (response.status) {
      case 401:
        localStorage.removeItem('accessToken');
        localStorage.removeItem('userProfile');
        window.location.href = '/';
        break;
      case 403:
        throw new Error('You do not have permission to perform this action');
      default:
        throw new Error(errorData.message || 'API request failed');
    }
  }
}

export default new ApiService();
