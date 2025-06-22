import type { ApiResponse, RequestData, ApiErrorResponse } from '@/types/api'

// Re-export types for convenience
export type { ApiResponse, RequestData, ApiErrorResponse } from '@/types/api'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1'

// API Error Class
export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public response?: Response
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

// Base API Client
class ApiClient {
  private baseUrl: string

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseUrl}${endpoint}`
    
    // Don't set Content-Type for FormData, let the browser set it
    const isFormData = options.body instanceof FormData
    const headers: HeadersInit = {
      ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
      ...options.headers,
    }
    
    try {
      const response = await fetch(url, {
        headers,
        ...options,
      })

      const status = response.status

      if (!response.ok) {
        let errorMessage = 'An error occurred'
        
        try {
          const errorData: ApiErrorResponse = await response.json()
          errorMessage = errorData.message || errorData.error || errorData.details || `HTTP ${status} Error`
        } catch {
          // If response is not JSON, use status text
          errorMessage = response.statusText || `HTTP ${status} Error`
        }

        throw new ApiError(errorMessage, status, response)
      }

      const data = await response.json()
      return { data, status }
    } catch (error) {
      if (error instanceof ApiError) {
        throw error
      }
      
      // Network or other errors
      throw new ApiError(
        error instanceof Error ? error.message : 'Network error occurred',
        0
      )
    }
  }

  // GET request
  async get<T>(endpoint: string, cache?: boolean): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'GET', cache: cache? 'force-cache' : 'no-cache' })
  }

  // POST request
  async post<T>(endpoint: string, data?: RequestData): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? (data instanceof FormData ? data : JSON.stringify(data)) : undefined,
    })
  }

  // PUT request
  async put<T>(endpoint: string, data?: RequestData): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? (data instanceof FormData ? data : JSON.stringify(data)) : undefined,
    })
  }

  // DELETE request
  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'DELETE' })
  }
}

// Create API client instance
const apiClient = new ApiClient(API_BASE_URL)

// Export the API client for other services
export { apiClient }

// Utility function to check if API is available
export const checkApiHealth = async (): Promise<boolean> => {
  try {
    const response = await fetch(`${API_BASE_URL}/health`, { method: 'GET' })
    return response.ok
  } catch {
    return false
  }
}
