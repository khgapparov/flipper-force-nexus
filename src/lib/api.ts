// FlipperForce API Client
const API_BASE_URL = 'http://89.207.254.9:9000'

// Types
export interface User {
  id: string
  username: string
  email: string
  role: 'Investor' | 'Project Manager' | 'Contractor'
  createdAt: string
}

export interface AuthResponse {
  accessToken: string
  refreshToken: string
  userId: string
}

export interface Address {
  street: string
  city: string
  state: string
  zipCode: string
}

export interface Property {
  id: string
  address: Address
  squareFootage?: number
  bedrooms?: number
  bathrooms?: number
  lotSize?: number
  yearBuilt?: number
  propertyType?: string
  createdAt: string
  updatedAt: string
}

export interface Project {
  id: string
  name: string
  address: string
  status: "Lead" | "Active" | "Sold" | "Cancelled"
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

export interface CreatePropertyRequest {
  address: Address
  squareFootage?: number
  bedrooms?: number
  bathrooms?: number
  lotSize?: number
  yearBuilt?: number
  propertyType?: string
}

export interface CreateProjectRequest {
  propertyId: string;
  projectName?: string;
  budget?: number;
}

export interface ProgressNote {
  id: string;
  projectId: string;
  note: string;
  author: string;
  createdAt: string;
}

export interface ProjectPhoto {
  id: string;
  projectId: string;
  url: string;
  description: string;
  uploadedBy: string;
  createdAt: string;
}

export interface ProjectExpense {
  id: string;
  projectId: string;
  amount: number;
  vendor: string;
  description: string;
  receiptUrl?: string;
  createdBy: string;
  createdAt: string;
}

export interface CreateProgressNoteRequest {
  note: string;
}

export interface CreatePhotoRequest {
  description: string;
  // File will be handled separately in FormData
}

export interface CreateExpenseRequest {
  amount: number;
  vendor: string;
  description: string;
  // Receipt file will be handled separately in FormData
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

const getAuthHeaders = (isJson = true): HeadersInit => {
  const token = getAuthToken()
  const headers: HeadersInit = {
    ...(token && { 'Authorization': `Bearer ${token}` })
  }
  if (isJson) {
    headers['Content-Type'] = 'application/json'
  }
  return headers
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

async function apiFetch(url: string, options: RequestInit = {}, isJson = true) {
  const headers = {
    ...getAuthHeaders(isJson),
    ...options.headers,
  }

  const response = await fetch(url, { ...options, headers })

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new ApiError(
      errorData.message || `API request failed with status ${response.status}`,
      response.status,
      errorData
    )
  }

  return response.json()
}

// API Functions
export const authApi = {
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    const data = await apiFetch(`${API_BASE_URL}/api/auth/login`, {
      method: 'POST',
      body: JSON.stringify(credentials)
    });
    setAuthToken(data.accessToken);
    return data;
  },

  async register(userData: RegisterRequest): Promise<AuthResponse> {
    const data = await apiFetch(`${API_BASE_URL}/api/auth/register`, {
      method: 'POST',
      body: JSON.stringify(userData)
    });
    setAuthToken(data.accessToken);
    return data;
  },

  logout(): void {
    removeAuthToken()
  }
}

export const projectsApi = {
  async getAll(): Promise<Project[]> {
    const data = await apiFetch(`${API_BASE_URL}/api/projects`);
    // Handle both formats: direct array or { projects: array }
    const projectsArray = Array.isArray(data) ? data : data.projects || [];
    
    // Map backend field names to frontend expected field names
    return projectsArray.map(project => ({
      id: project.projectId || project.id,
      name: project.projectName || project.name,
      address: project.address || '',
      status: project.status === 'LEAD' ? 'Lead' : project.status,
      budget: project.budget || 0,
      currentSpend: project.currentSpend || 0,
      estimatedCompletion: project.estimatedCompletion || '',
      createdAt: project.createdAt || new Date().toISOString()
    }));
  },

  async getById(id: string): Promise<Project> {
    const data = await apiFetch(`${API_BASE_URL}/api/projects/${id}`);
    const project = data.project || data;
    
    return {
      id: project.projectId || project.id,
      name: project.projectName || project.name,
      address: project.address || '',
      status: project.status === 'LEAD' ? 'Lead' : project.status,
      budget: project.budget || 0,
      currentSpend: project.currentSpend || 0,
      estimatedCompletion: project.estimatedCompletion || '',
      createdAt: project.createdAt || new Date().toISOString()
    };
  },

  async create(projectData: CreateProjectRequest): Promise<Project> {
    const data = await apiFetch(`${API_BASE_URL}/api/projects`, {
      method: 'POST',
      body: JSON.stringify(projectData)
    });
    const project = data.project || data;
    
    return {
      id: project.projectId || project.id,
      name: project.projectName || project.name,
      address: project.address || '',
      status: project.status === 'LEAD' ? 'Lead' : project.status,
      budget: project.budget || 0,
      currentSpend: project.currentSpend || 0,
      estimatedCompletion: project.estimatedCompletion || '',
      createdAt: project.createdAt || new Date().toISOString()
    };
  }
};

export const propertiesApi = {
  async getAll(): Promise<Property[]> {
    const data = await apiFetch(`${API_BASE_URL}/api/properties`);
    // Handle both formats: direct array or { properties: array }
    const propertiesArray = Array.isArray(data) ? data : data.properties || [];
    
    // Map backend field names to frontend expected field names
    return propertiesArray.map(property => ({
      id: property.propertyId || property.id,
      address: property.address,
      squareFootage: property.squareFootage,
      bedrooms: property.bedrooms,
      bathrooms: property.bathrooms,
      lotSize: property.lotSize,
      yearBuilt: property.yearBuilt,
      propertyType: property.propertyType,
      createdAt: property.createdAt || new Date().toISOString(),
      updatedAt: property.updatedAt || new Date().toISOString()
    }));
  },

  async getById(id: string): Promise<Property> {
    const data = await apiFetch(`${API_BASE_URL}/api/properties/${id}`);
    const property = data.property || data;
    
    return {
      id: property.propertyId || property.id,
      address: property.address,
      squareFootage: property.squareFootage,
      bedrooms: property.bedrooms,
      bathrooms: property.bathrooms,
      lotSize: property.lotSize,
      yearBuilt: property.yearBuilt,
      propertyType: property.propertyType,
      createdAt: property.createdAt,
      updatedAt: property.updatedAt
    };
  },

  async create(propertyData: CreatePropertyRequest): Promise<Property> {
    const data = await apiFetch(`${API_BASE_URL}/api/properties`, {
      method: 'POST',
      body: JSON.stringify(propertyData)
    });
    const property = data.property || data;
    
    return {
      id: property.propertyId || property.id,
      address: property.address,
      squareFootage: property.squareFootage,
      bedrooms: property.bedrooms,
      bathrooms: property.bathrooms,
      lotSize: property.lotSize,
      yearBuilt: property.yearBuilt,
      propertyType: property.propertyType,
      createdAt: property.createdAt,
      updatedAt: property.updatedAt
    };
  },

  async update(id: string, propertyData: Partial<CreatePropertyRequest>): Promise<Property> {
    const data = await apiFetch(`${API_BASE_URL}/api/properties/${id}`, {
      method: 'PUT',
      body: JSON.stringify(propertyData)
    });
    const property = data.property || data;
    
    return {
      id: property.propertyId || property.id,
      address: property.address,
      squareFootage: property.squareFootage,
      bedrooms: property.bedrooms,
      bathrooms: property.bathrooms,
      lotSize: property.lotSize,
      yearBuilt: property.yearBuilt,
      propertyType: property.propertyType,
      createdAt: property.createdAt,
      updatedAt: property.updatedAt
    };
  }
};

export const galleryApi = {
  async uploadImage(propertyId: string, category: string, description: string, image: File): Promise<any> {
    const formData = new FormData();
    formData.append("propertyId", propertyId);
    formData.append("category", category);
    formData.append("description", description);
    formData.append("filename", image.name);
    formData.append("image", image);

    return apiFetch(`${API_BASE_URL}/api/gallery/images`, {
      method: 'POST',
      body: formData
    }, false);
  }
};

export const dashboardApi = {
  async getDashboardStats(): Promise<{
    totalInvestment: number;
    totalValue: number;
    averageROI: number;
    activeProjects: number;
    recentProjects: Project[];
  }> {
    // For now, we'll fetch all projects and calculate stats on the frontend
    // In a real implementation, this would be a dedicated dashboard endpoint
    const projects = await projectsApi.getAll();
    
    const totalInvestment = projects.reduce((sum, project) => sum + (project.budget || 0), 0);
    const totalValue = projects.reduce((sum, project) => sum + (project.currentSpend || 0), 0);
    const averageROI = totalInvestment > 0 ? ((totalValue - totalInvestment) / totalInvestment * 100) : 0;
    const activeProjects = projects.filter(p => p.status === 'Active').length;
    
    // Get recent projects (last 3)
    const recentProjects = projects
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 3);

    return {
      totalInvestment,
      totalValue,
      averageROI,
      activeProjects,
      recentProjects
    };
  }
}

export const projectUpdatesApi = {
  // Progress Notes
  async getProgressNotes(projectId: string): Promise<ProgressNote[]> {
    const data = await apiFetch(`${API_BASE_URL}/api/projects/${projectId}/progress-notes`);
    const notesArray = Array.isArray(data) ? data : data.notes || [];
    
    return notesArray.map((note: any) => ({
      id: note.id,
      projectId: note.projectId,
      note: note.note,
      author: note.author || "Unknown",
      createdAt: note.createdAt || new Date().toISOString()
    }));
  },

  async createProgressNote(projectId: string, noteData: CreateProgressNoteRequest): Promise<ProgressNote> {
    const data = await apiFetch(`${API_BASE_URL}/api/projects/${projectId}/progress-notes`, {
      method: 'POST',
      body: JSON.stringify(noteData)
    });
    
    return {
      id: data.id,
      projectId: data.projectId,
      note: data.note,
      author: data.author || "Current User",
      createdAt: data.createdAt || new Date().toISOString()
    };
  },

  // Photos
  async getProjectPhotos(projectId: string): Promise<ProjectPhoto[]> {
    const data = await apiFetch(`${API_BASE_URL}/api/projects/${projectId}/photos`);
    const photosArray = Array.isArray(data) ? data : data.photos || [];
    
    return photosArray.map((photo: any) => ({
      id: photo.id,
      projectId: photo.projectId,
      url: photo.url || "/placeholder.svg",
      description: photo.description,
      uploadedBy: photo.uploadedBy || "Unknown",
      createdAt: photo.createdAt || new Date().toISOString()
    }));
  },

  async uploadProjectPhoto(projectId: string, description: string, photo: File): Promise<ProjectPhoto> {
    const formData = new FormData();
    formData.append("description", description);
    formData.append("filename", photo.name);
    formData.append("image", photo);

    const data = await apiFetch(`${API_BASE_URL}/api/projects/${projectId}/photos`, {
      method: 'POST',
      body: formData
    }, false);
    
    return {
      id: data.id,
      projectId: data.projectId,
      url: data.url || "/placeholder.svg",
      description: data.description,
      uploadedBy: data.uploadedBy || "Current User",
      createdAt: data.createdAt || new Date().toISOString()
    };
  },

  // Expenses
  async getProjectExpenses(projectId: string): Promise<ProjectExpense[]> {
    const data = await apiFetch(`${API_BASE_URL}/api/projects/${projectId}/expenses`);
    const expensesArray = Array.isArray(data) ? data : data.expenses || [];
    
    return expensesArray.map((expense: any) => ({
      id: expense.id,
      projectId: expense.projectId,
      amount: expense.amount || 0,
      vendor: expense.vendor,
      description: expense.description,
      receiptUrl: expense.receiptUrl,
      createdBy: expense.createdBy || "Unknown",
      createdAt: expense.createdAt || new Date().toISOString()
    }));
  },

  async createProjectExpense(projectId: string, expenseData: CreateExpenseRequest, receipt?: File): Promise<ProjectExpense> {
    let data;
    
    if (receipt) {
      const formData = new FormData();
      formData.append("amount", expenseData.amount.toString());
      formData.append("vendor", expenseData.vendor);
      formData.append("description", expenseData.description);
      formData.append("filename", receipt.name);
      formData.append("receipt", receipt);

      data = await apiFetch(`${API_BASE_URL}/api/projects/${projectId}/expenses`, {
        method: 'POST',
        body: formData
      }, false);
    } else {
      data = await apiFetch(`${API_BASE_URL}/api/projects/${projectId}/expenses`, {
        method: 'POST',
        body: JSON.stringify(expenseData)
      });
    }
    
    return {
      id: data.id,
      projectId: data.projectId,
      amount: data.amount || 0,
      vendor: data.vendor,
      description: data.description,
      receiptUrl: data.receiptUrl,
      createdBy: data.createdBy || "Current User",
      createdAt: data.createdAt || new Date().toISOString()
    };
  }
};
