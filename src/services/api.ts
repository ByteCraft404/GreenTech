const BASE_URL = import.meta.env.VITE_BACKEND_URL || 'https://smartfarm-ua4d.onrender.com';

export interface SensorData {
  id: number;
  temperature: number;
  humidity: number;
  lightIntensity: number;
  soilMoisture: number;
  timestamp: string;
}

export interface ActuatorStatusData {
  device: string;
  status: string;
  timestamp: string;
}

export interface ActuatorControlRequest {
  device: string;
  action: string;
}

class ApiService {
  private async fetchWithTimeout(url: string, options: RequestInit = {}, timeout = 10000) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
      });
      clearTimeout(timeoutId);
      return response;
    } catch (error) {
      clearTimeout(timeoutId);
      throw error;
    }
  }

  async getLatestSensorData(): Promise<SensorData | null> {
    try {
      const response = await this.fetchWithTimeout(`${BASE_URL}/api/sensors/latest`);
      if (!response.ok) throw new Error('Failed to fetch sensor data');
      return await response.json();
    } catch (error) {
      console.error('Error fetching latest sensor data:', error);
      return null;
    }
  }

  async getAllSensorData(): Promise<SensorData[]> {
    try {
      const response = await this.fetchWithTimeout(`${BASE_URL}/api/sensors/all`);
      if (!response.ok) throw new Error('Failed to fetch all sensor data');
      return await response.json();
    } catch (error) {
      console.error('Error fetching all sensor data:', error);
      return [];
    }
  }

  async controlActuator(request: ActuatorControlRequest): Promise<boolean> {
    try {
      const response = await this.fetchWithTimeout(`${BASE_URL}/api/actuators/control`, {
        method: 'POST',
        body: JSON.stringify(request),
      });
      return response.ok;
    } catch (error) {
      console.error('Error controlling actuator:', error);
      return false;
    }
  }

  async getActuatorStatus(device: string): Promise<ActuatorStatusData | null> {
    try {
      const response = await this.fetchWithTimeout(`${BASE_URL}/api/actuators/status?device=${device}`);
      if (!response.ok) throw new Error('Failed to fetch actuator status');
      return await response.json();
    } catch (error) {
      console.error('Error fetching actuator status:', error);
      return null;
    }
  }

  async submitSensorData(data: Omit<SensorData, 'id' | 'timestamp'>): Promise<boolean> {
    try {
      const response = await this.fetchWithTimeout(`${BASE_URL}/api/sensors/submit`, {
        method: 'POST',
        body: JSON.stringify(data),
      });
      return response.ok;
    } catch (error) {
      console.error('Error submitting sensor data:', error);
      return false;
    }
  }
}

export const apiService = new ApiService();