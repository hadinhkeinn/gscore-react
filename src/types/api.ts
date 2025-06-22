// API Response Types
export interface ApiResponse<T> {
  data?: T
  error?: string
  status: number
}

// Request data type for API calls
export type RequestData = Record<string, unknown> | FormData | string | null

// Error response from API
export interface ApiErrorResponse {
  message?: string
  error?: string
  details?: string
  code?: string
}

// Health check response
export interface HealthCheckResponse {
  status: 'ok' | 'error'
  timestamp: string
  version?: string
}