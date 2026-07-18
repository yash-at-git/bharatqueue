export interface AuthResponse {
  token: string;
  role: string;
  email: string;
  name: string;
}

export interface QueueResponse {
  id: string;
  name: string;
  prefix: string;
  isActive: boolean;
  dailyResetHour: number;
  institutionName: string;
  institutionCity: string;
  waitingCount: number;
}

export interface CounterResponse {
  id: string;
  name: string;
  isActive: boolean;
  queueId: string;
}

export interface TokenResponse {
  id: string;
  tokenNumber: string;
  status: string;
  position: number;
  issuedAt: string;
  queueName: string;
  institutionName: string;
  estimatedWaitMinutes: number;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}