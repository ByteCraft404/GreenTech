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
  status: 'on' | 'off' | 'unknown' | null;
  time: string | number[] | null; // Allows string (ISO) or number array (LocalDateTime)
}

// This interface now matches what the Spring Boot backend expects
// for the @RequestBody in the control endpoint, including updatedAt.
export interface ActuatorControlRequest {
  device: string;
  // Renamed from 'action' to 'status' to align with the backend's DTO
  status: 'on' | 'off';
  updatedAt?: string; // Added this field to match backend's expectation
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
      if (error instanceof DOMException && error.name === 'AbortError') {
        throw new Error('Request timed out');
      }
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

  // --- START OF UPDATED controlActuator METHOD ---
  async controlActuator(request: ActuatorControlRequest): Promise<boolean> {
    try {
      // Ensure 'device' is capitalized as per backend expectation (e.g., "Fan", "Pump", "Light")
      const formattedDevice = request.device.charAt(0).toUpperCase() + request.device.slice(1);

      // Generate current timestamp in ISO 8601 format (e.g., "2025-07-14T10:33:51")
      // We slice it to get the "yyyy-MM-dd'T'HH:mm:ss" format, without milliseconds or Z for UTC.
      // This matches the format provided in your example: "2025-07-11T09:23:35"
      const now = new Date();
      const formattedUpdatedAt = now.toISOString().slice(0, 19); 

      const response = await this.fetchWithTimeout(`${BASE_URL}/api/actuators/control`, {
        method: 'POST',
        // Now sending 'device', 'status', AND 'updatedAt'
        body: JSON.stringify({
          device: formattedDevice,
          status: request.status,
          updatedAt: formattedUpdatedAt // This is the crucial addition
        }),
      });
      return response.ok;
    } catch (error) {
      console.error('Error controlling actuator:', error);
      return false;
    }
  }
  // --- END OF UPDATED controlActuator METHOD ---

  async getActuatorStatus(device: string): Promise<ActuatorStatusData | null> {
    try {
      const formattedDevice = device.charAt(0).toUpperCase() + device.slice(1);
      
      const response = await this.fetchWithTimeout(`${BASE_URL}/api/actuators/status?device=${formattedDevice}`);
      if (!response.ok) {
        console.error(`Failed to fetch actuator status for ${device}. Status: ${response.status} ${response.statusText}`);
        const errorBody = await response.text().catch(() => 'No response body');
        console.error('Error response body:', errorBody);
        throw new Error('Failed to fetch actuator status');
      }
      
      const data: ActuatorStatusData = await response.json();

      if (data && typeof data.device === 'string' && (typeof data.status === 'string' || data.status === null)) {
        return data;
      }
      
      console.warn(`Malformed status response for ${device}:`, data);
      return null;
      
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