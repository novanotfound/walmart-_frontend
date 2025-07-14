class NotificationService {
  constructor() {
    this.ws = null;
    this.listeners = new Map();
  }

  connect(userId) {
    if (this.ws) {
      this.ws.close();
    }

    this.ws = new WebSocket(`ws://127.0.0.1:8000/ws/notifications/${userId}`);
    
    this.ws.onopen = () => {
      console.log('WebSocket connected');
    };
    
    this.ws.onmessage = (event) => {
      const notification = JSON.parse(event.data);
      this.handleNotification(notification);
    };
    
    this.ws.onclose = () => {
      console.log('WebSocket disconnected');
    };
  }

  handleNotification(notification) {
    this.listeners.forEach((callback) => {
      callback(notification);
    });
  }

  addListener(id, callback) {
    this.listeners.set(id, callback);
  }

  removeListener(id) {
    this.listeners.delete(id);
  }

  disconnect() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }
}

export default new NotificationService();
