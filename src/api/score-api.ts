import {ScoreData, ScoreReportData, TopStudentResponse, DashboardSummaryData} from "@/types/score-data.ts";
import {apiClient, ApiError} from "@/lib/api.ts";

export const scoreApi = {
    // Get score by registration number
    async getScore(registrationNumber: string): Promise<ScoreData> {
        try {
            const response = await apiClient.get<ScoreData>(`/scores/${registrationNumber}`, true)

            if (!response.data) {
                throw new ApiError('No data received from server', response.status)
            }

            return response.data
        } catch (error) {
            if (error instanceof ApiError) {
                // Re-throw API errors with user-friendly messages
                if (error.status === 404) {
                    throw new ApiError('No data found for this registration number', 404)
                } else if (error.status >= 500) {
                    throw new ApiError('Server error. Please try again later.', error.status)
                } else if (error.status === 0) {
                    throw new ApiError('Network error. Please check your connection and try again.', 0)
                } else {
                    throw new ApiError('Failed to fetch score data. Please check your registration number.', error.status)
                }
            }

            throw error
        }
    },

    // Get score report data
    async getScoreReport(): Promise<ScoreReportData> {
        try {
            const response = await apiClient.get<{success: boolean, data: ScoreReportData}>('/score-report', true)

            if (!response.data) {
                throw new ApiError('No report data received from server', response.status)
            }

            // Extract the nested data from the backend response
            if (!response.data.success || !response.data.data) {
                throw new ApiError('Invalid response format from server', response.status)
            }

            return response.data.data
        } catch (error) {
            if (error instanceof ApiError) {
                // Re-throw API errors with user-friendly messages
                if (error.status === 404) {
                    throw new ApiError('Report data not found', 404)
                } else if (error.status >= 500) {
                    throw new ApiError('Server error. Please try again later.', error.status)
                } else if (error.status === 0) {
                    throw new ApiError('Network error. Please check your connection and try again.', 0)
                } else {
                    throw new ApiError('Failed to fetch report data. Please try again.', error.status)
                }
            }

            throw error
        }
    },

    async getTopStudents(): Promise<TopStudentResponse> {
        try {
            const response = await apiClient.get<{success: boolean, data: TopStudentResponse}>('/top-students/group-a', true)

            if (!response.data) {
                throw new ApiError('No report data received from server', response.status)
            }

            // Extract the nested data from the backend response
            if (!response.data.success || !response.data.data) {
                throw new ApiError('Invalid response format from server', response.status)
            }

            return response.data.data
        } catch (error) {
            if (error instanceof ApiError) {
                // Re-throw API errors with user-friendly messages
                if (error.status === 404) {
                    throw new ApiError('Report data not found', 404)
                } else if (error.status >= 500) {
                    throw new ApiError('Server error. Please try again later.', error.status)
                } else if (error.status === 0) {
                    throw new ApiError('Network error. Please check your connection and try again.', 0)
                } else {
                    throw new ApiError('Failed to fetch report data. Please try again.', error.status)
                }
            }

            throw error
        }
    },

    // Get dashboard summary data
    async getDashboardSummary(): Promise<DashboardSummaryData> {
        try {
            const response = await apiClient.get<{success: boolean, data: DashboardSummaryData}>('/dashboard/summary', true)

            if (!response.data) {
                throw new ApiError('No dashboard data received from server', response.status)
            }

            // Extract the nested data from the backend response
            if (!response.data.success || !response.data.data) {
                throw new ApiError('Invalid response format from server', response.status)
            }

            return response.data.data
        } catch (error) {
            if (error instanceof ApiError) {
                // Re-throw API errors with user-friendly messages
                if (error.status === 404) {
                    throw new ApiError('Dashboard data not found', 404)
                } else if (error.status >= 500) {
                    throw new ApiError('Server error. Please try again later.', error.status)
                } else if (error.status === 0) {
                    throw new ApiError('Network error. Please check your connection and try again.', 0)
                } else {
                    throw new ApiError('Failed to fetch dashboard data. Please try again.', error.status)
                }
            }

            throw error
        }
    },
}
