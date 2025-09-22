// Core types for the makeup booking platform

export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  avatar?: string;
  createdAt: Date;
}

export interface MakeupArtist {
  id: string;
  name: string;
  email: string;
  phone: string;
  bio: string;
  avatar: string;
  location: string;
  rating: number;
  reviewCount: number;
  specialties: string[];
  portfolio: PortfolioImage[];
  services: Service[];
  availability: Availability[];
  isVerified: boolean;
  experience: number; // years
  languages: string[];
}

export interface PortfolioImage {
  id: string;
  url: string;
  title: string;
  description?: string;
  category: 'bridal' | 'special-event' | 'editorial' | 'everyday' | 'other';
  createdAt: Date;
}

export interface Service {
  id: string;
  name: string;
  description: string;
  duration: number; // in minutes
  price: number;
  category: 'bridal' | 'special-event' | 'editorial' | 'everyday';
  isPopular: boolean;
}

export interface Availability {
  id: string;
  date: string; // YYYY-MM-DD format
  timeSlots: TimeSlot[];
}

export interface TimeSlot {
  id: string;
  startTime: string; // HH:MM format
  endTime: string; // HH:MM format
  isAvailable: boolean;
  isBooked: boolean;
}

export interface Booking {
  id: string;
  userId: string;
  artistId: string;
  serviceId: string;
  date: string;
  startTime: string;
  endTime: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  totalPrice: number;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Review {
  id: string;
  userId: string;
  artistId: string;
  bookingId: string;
  rating: number; // 1-5
  comment: string;
  createdAt: Date;
  user: {
    name: string;
    avatar?: string;
  };
}

export interface SearchFilters {
  location?: string;
  specialties?: string[];
  priceRange?: {
    min: number;
    max: number;
  };
  rating?: number;
  availability?: string; // date
  services?: string[];
}

export interface BookingFormData {
  serviceId: string;
  date: string;
  timeSlot: string;
  notes?: string;
}

// API Response types - moved to aiTypes.ts for AI-specific functionality

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Re-export AI types
export * from './aiTypes'
