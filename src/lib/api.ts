// FlipperForce API Client
const API_BASE_URL = 'http://localhost:9000/api'

// Types
export interface User {
  id: string
  username: string
  email: string
  role: 'Investor' | 'Project Manager' | 'Contractor'
  createdAt: string
}

export interface AuthResponse {
  token: string
  user: User
}

export interface Project {
  id: string
  name: string
  address: string
  status: 'Lead' | 'Active' | 'Sold' | 'Cancelled'
  budget: number
  currentSpend: number
  estimatedCompletion: string
  createdAt: string
}

export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  username: string
  email: string
  password: string
  role: 'Investor' | 'Project Manager' | 'Contractor'
}

// Utility functions
const getAuthToken = (): string | null => {
  return localStorage.getItem('flipper_token')
}

const setAuthToken = (token: string): void => {
  localStorage.setItem('flipper_token', token)
}

const removeAuthToken = (): void => {
  localStorage.removeItem('flipper_token')
}

const getAuthHeaders = (): HeadersInit => {
  const token = getAuthToken()
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` })
  }
}

// API Functions
export const authApi = {
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(credentials)
    })
    
    if (!response.ok) {
      throw new Error('Login failed')
    }
    
    const data = await response.json()
    setAuthToken(data.token)
    return data
  },

  async register(userData: RegisterRequest): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(userData)
    })
    
    if (!response.ok) {
      throw new Error('Registration failed')
    }
    
    const data = await response.json()
    setAuthToken(data.token)
    return data
  },

  logout(): void {
    removeAuthToken()
  }
}

export const projectsApi = {
  async getAll(): Promise<Project[]> {
    const response = await fetch(`${API_BASE_URL}/projects`, {
      headers: getAuthHeaders()
    })
    
    if (!response.ok) {
      throw new Error('Failed to fetch projects')
    }
    
    return response.json()
  },

  async getById(id: string): Promise<Project> {
    const response = await fetch(`${API_BASE_URL}/projects/${id}`, {
      headers: getAuthHeaders()
    })
    
    if (!response.ok) {
      throw new Error('Failed to fetch project')
    }
    
    return response.json()
  },

  async create(project: Partial<Project>): Promise<Project> {
    const response = await fetch(`${API_BASE_URL}/projects`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(project)
    })
    
    if (!response.ok) {
      throw new Error('Failed to create project')
    }
    
    return response.json()
  }
}

// Error handling utility
export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public data?: any
  ) {
    super(message)
    this.name = 'ApiError'
  }
}