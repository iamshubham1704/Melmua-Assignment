// Inline type definitions to avoid import issues
interface PortfolioImage {
  id: string;
  url: string;
  title: string;
  description?: string;
  category: 'bridal' | 'special-event' | 'editorial' | 'everyday' | 'other';
  createdAt: Date;
}

interface Service {
  id: string;
  name: string;
  description: string;
  duration: number; // in minutes
  price: number;
  category: 'bridal' | 'special-event' | 'editorial' | 'everyday';
  isPopular: boolean;
}

interface Availability {
  id: string;
  date: string; // YYYY-MM-DD format
  timeSlots: TimeSlot[];
}

interface TimeSlot {
  id: string;
  startTime: string; // HH:MM format
  endTime: string; // HH:MM format
  isAvailable: boolean;
  isBooked: boolean;
}

interface MakeupArtist {
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

interface Review {
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

export const mockArtists: MakeupArtist[] = [
  {
    id: '1',
    name: 'Sarah Johnson',
    email: 'sarah@example.com',
    phone: '+1 (555) 123-4567',
    bio: 'Professional makeup artist with 8+ years of experience specializing in bridal and special events. I believe in enhancing natural beauty and creating looks that make you feel confident and beautiful. My passion lies in creating timeless, elegant looks that photograph beautifully and last all day.',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop&crop=face',
    location: 'New York, NY',
    rating: 4.9,
    reviewCount: 127,
    specialties: ['Bridal', 'Special Events', 'Editorial', 'Natural Beauty'],
    portfolio: [
      {
        id: '1',
        url: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400&h=600&fit=crop',
        title: 'Natural Bridal Look',
        description: 'Soft, romantic bridal makeup with a focus on glowing skin and natural beauty enhancement',
        category: 'bridal',
        createdAt: new Date('2024-01-15')
      },
      {
        id: '2',
        url: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&h=600&fit=crop',
        title: 'Evening Glam',
        description: 'Bold, dramatic look perfect for special occasions and red carpet events',
        category: 'special-event',
        createdAt: new Date('2024-01-10')
      },
      {
        id: '3',
        url: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=400&h=600&fit=crop',
        title: 'Editorial Elegance',
        description: 'High-fashion editorial look with bold colors and artistic flair',
        category: 'editorial',
        createdAt: new Date('2024-01-05')
      },
      {
        id: '4',
        url: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=400&h=600&fit=crop',
        title: 'Classic Beauty',
        description: 'Timeless classic look that never goes out of style',
        category: 'bridal',
        createdAt: new Date('2023-12-28')
      }
    ],
    services: [
      {
        id: '1',
        name: 'Bridal Makeup',
        description: 'Complete bridal makeup application for your special day with trial consultation',
        duration: 120,
        price: 250,
        category: 'bridal',
        isPopular: true
      },
      {
        id: '2',
        name: 'Trial Session',
        description: 'Practice session to perfect your wedding day look and ensure satisfaction',
        duration: 90,
        price: 150,
        category: 'bridal',
        isPopular: false
      },
      {
        id: '3',
        name: 'Special Event Makeup',
        description: 'Glamorous makeup for parties, galas, and special occasions',
        duration: 90,
        price: 180,
        category: 'special-event',
        isPopular: true
      },
      {
        id: '4',
        name: 'Editorial Makeup',
        description: 'Creative and artistic makeup for photoshoots and fashion events',
        duration: 150,
        price: 200,
        category: 'editorial',
        isPopular: false
      }
    ],
    availability: [],
    isVerified: true,
    experience: 8,
    languages: ['English', 'Spanish']
  },
  {
    id: '2',
    name: 'Maria Rodriguez',
    email: 'maria@example.com',
    phone: '+1 (555) 234-5678',
    bio: 'Creative makeup artist passionate about editorial and fashion photography. I love experimenting with bold colors and unique techniques. With a background in fine arts, I bring an artistic perspective to every look, creating stunning visuals that tell a story.',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face',
    location: 'Los Angeles, CA',
    rating: 4.8,
    reviewCount: 89,
    specialties: ['Editorial', 'Fashion', 'Photography', 'Creative Artistry'],
    portfolio: [
      {
        id: '3',
        url: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=400&h=600&fit=crop',
        title: 'Editorial Fantasy',
        description: 'Creative editorial look with bold colors and artistic flair for high-fashion photography',
        category: 'editorial',
        createdAt: new Date('2024-01-20')
      },
      {
        id: '4',
        url: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&h=600&fit=crop',
        title: 'Fashion Forward',
        description: 'Cutting-edge fashion makeup for runway and editorial shoots',
        category: 'editorial',
        createdAt: new Date('2024-01-18')
      },
      {
        id: '5',
        url: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=400&h=600&fit=crop',
        title: 'Artistic Expression',
        description: 'Bold and experimental makeup artistry for creative projects',
        category: 'editorial',
        createdAt: new Date('2024-01-12')
      }
    ],
    services: [
      {
        id: '3',
        name: 'Editorial Makeup',
        description: 'Creative makeup for photoshoots and fashion events with artistic direction',
        duration: 180,
        price: 300,
        category: 'editorial',
        isPopular: true
      },
      {
        id: '4',
        name: 'Fashion Photography Makeup',
        description: 'Specialized makeup for fashion shoots and runway shows',
        duration: 120,
        price: 250,
        category: 'editorial',
        isPopular: false
      },
      {
        id: '5',
        name: 'Creative Artistry',
        description: 'Experimental and artistic makeup for creative projects',
        duration: 240,
        price: 400,
        category: 'editorial',
        isPopular: false
      }
    ],
    availability: [],
    isVerified: true,
    experience: 6,
    languages: ['English', 'Spanish', 'French']
  },
  {
    id: '3',
    name: 'Emily Chen',
    email: 'emily@example.com',
    phone: '+1 (555) 345-6789',
    bio: 'Specializing in natural, everyday makeup that enhances your features. Perfect for those who want to look polished without being overdone. I believe in the power of subtle enhancement and helping you feel confident in your own skin.',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop&crop=face',
    location: 'San Francisco, CA',
    rating: 4.7,
    reviewCount: 156,
    specialties: ['Everyday', 'Natural', 'Professional', 'Skincare'],
    portfolio: [
      {
        id: '6',
        url: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=400&h=600&fit=crop',
        title: 'Natural Glow',
        description: 'Fresh, dewy look perfect for everyday wear and professional settings',
        category: 'everyday',
        createdAt: new Date('2024-01-18')
      },
      {
        id: '7',
        url: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400&h=600&fit=crop',
        title: 'Professional Polish',
        description: 'Clean, sophisticated look for business meetings and corporate events',
        category: 'everyday',
        createdAt: new Date('2024-01-14')
      },
      {
        id: '8',
        url: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&h=600&fit=crop',
        title: 'Weekend Casual',
        description: 'Effortless beauty for casual outings and weekend activities',
        category: 'everyday',
        createdAt: new Date('2024-01-08')
      }
    ],
    services: [
      {
        id: '6',
        name: 'Everyday Makeup',
        description: 'Natural, polished look for daily wear with long-lasting formula',
        duration: 60,
        price: 80,
        category: 'everyday',
        isPopular: true
      },
      {
        id: '7',
        name: 'Professional Makeup',
        description: 'Business-appropriate makeup for work and meetings',
        duration: 45,
        price: 65,
        category: 'everyday',
        isPopular: false
      },
      {
        id: '8',
        name: 'Skincare Consultation',
        description: 'Personalized skincare routine and makeup application tips',
        duration: 90,
        price: 120,
        category: 'everyday',
        isPopular: true
      }
    ],
    availability: [],
    isVerified: true,
    experience: 5,
    languages: ['English', 'Mandarin']
  }
];

export const mockServices: Service[] = [
  {
    id: '1',
    name: 'Bridal Makeup',
    description: 'Complete bridal makeup application for your special day',
    duration: 120,
    price: 250,
    category: 'bridal',
    isPopular: true
  },
  {
    id: '2',
    name: 'Trial Session',
    description: 'Practice session to perfect your wedding day look',
    duration: 90,
    price: 150,
    category: 'bridal',
    isPopular: false
  },
  {
    id: '3',
    name: 'Editorial Makeup',
    description: 'Creative makeup for photoshoots and fashion events',
    duration: 180,
    price: 300,
    category: 'editorial',
    isPopular: true
  },
  {
    id: '4',
    name: 'Everyday Makeup',
    description: 'Natural, polished look for daily wear',
    duration: 60,
    price: 80,
    category: 'everyday',
    isPopular: true
  },
  {
    id: '5',
    name: 'Professional Makeup',
    description: 'Business-appropriate makeup for work and meetings',
    duration: 45,
    price: 65,
    category: 'everyday',
    isPopular: false
  }
];

export const mockReviews: Review[] = [
  {
    id: '1',
    userId: 'user1',
    artistId: '1',
    bookingId: 'booking1',
    rating: 5,
    comment: 'Sarah was absolutely amazing! She made me feel so beautiful on my wedding day. Her attention to detail and professionalism was outstanding. The trial session was perfect, and she really listened to what I wanted. My makeup lasted all day and photographed beautifully!',
    createdAt: new Date('2024-01-20'),
    user: {
      name: 'Jessica M.',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face'
    }
  },
  {
    id: '2',
    userId: 'user2',
    artistId: '1',
    bookingId: 'booking2',
    rating: 5,
    comment: 'Perfect bridal makeup! Sarah listened to what I wanted and delivered exactly that. Her expertise in bridal makeup really shows. The trial session helped us perfect the look, and I felt confident and beautiful on my special day. Highly recommend!',
    createdAt: new Date('2024-01-15'),
    user: {
      name: 'Amanda K.',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face'
    }
  },
  {
    id: '3',
    userId: 'user3',
    artistId: '1',
    bookingId: 'booking4',
    rating: 5,
    comment: 'Sarah did my makeup for a special event and I was blown away! She created a stunning evening look that was both glamorous and elegant. Her professionalism and skill are unmatched. Will definitely book again!',
    createdAt: new Date('2024-01-12'),
    user: {
      name: 'Rachel T.',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face'
    }
  },
  {
    id: '4',
    userId: 'user4',
    artistId: '2',
    bookingId: 'booking3',
    rating: 5,
    comment: 'Maria is incredibly talented! The editorial look she created was exactly what I envisioned for my photoshoot. Her artistic vision and technical skills are outstanding. She brought my creative ideas to life perfectly.',
    createdAt: new Date('2024-01-18'),
    user: {
      name: 'Sophie L.',
      avatar: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=100&h=100&fit=crop&crop=face'
    }
  },
  {
    id: '5',
    userId: 'user5',
    artistId: '2',
    bookingId: 'booking5',
    rating: 4,
    comment: 'Maria\'s creative approach to makeup is refreshing! She created a bold, artistic look for my fashion shoot that exceeded expectations. Her attention to detail and artistic flair really shows in her work.',
    createdAt: new Date('2024-01-16'),
    user: {
      name: 'Isabella R.',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face'
    }
  },
  {
    id: '6',
    userId: 'user6',
    artistId: '3',
    bookingId: 'booking6',
    rating: 5,
    comment: 'Emily is fantastic for everyday makeup! She helped me create a natural, polished look that\'s perfect for work. Her skincare consultation was incredibly helpful too. I feel confident every day now!',
    createdAt: new Date('2024-01-19'),
    user: {
      name: 'Michelle C.',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=face'
    }
  },
  {
    id: '7',
    userId: 'user7',
    artistId: '3',
    bookingId: 'booking7',
    rating: 5,
    comment: 'Emily\'s approach to natural beauty is exactly what I needed. She taught me so much about skincare and how to enhance my features without overdoing it. The professional makeup session was perfect for my job interviews!',
    createdAt: new Date('2024-01-17'),
    user: {
      name: 'Jennifer W.',
      avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=100&h=100&fit=crop&crop=face'
    }
  }
];
