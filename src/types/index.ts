export interface Contact {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  position: string;
  status: 'new' | 'contacted' | 'qualified' | 'proposal' | 'negotiation' | 'converted' | 'lost';
  source: 'website' | 'referral' | 'social' | 'email' | 'cold-call' | 'event';
  assignedTo: string;
  createdAt: string;
  avatar?: string;
  notes?: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  status: 'planning' | 'in-progress' | 'on-hold' | 'completed';
  priority: 'low' | 'medium' | 'high' | 'critical';
  progress: number;
  startDate: string;
  dueDate: string;
  budget: number;
  spent: number;
  team: string[];
  tags: string[];
  revenue?: number;
  createdAt: string;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: 'todo' | 'in-progress' | 'review' | 'completed';
  priority: 'low' | 'medium' | 'high' | 'critical';
  assignedTo: string;
  projectId?: string;
  dueDate: string;
  createdAt: string;
  tags: string[];
  completed: boolean;
}

export interface Transaction {
  id: string;
  name: string;
  amount: number;
  type: 'income' | 'expense';
  category: string;
  date: string;
  status: 'completed' | 'pending' | 'failed';
  description?: string;
}

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  department: string;
  avatar?: string;
  status: 'active' | 'inactive' | 'away';
  joinDate: string;
  location: string;
  skills: string[];
  projects: string[];
}

export interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  start: string;
  end: string;
  category: 'meeting' | 'deadline' | 'reminder' | 'event' | 'holiday';
  color?: string;
  allDay?: boolean;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  createdAt: string;
  link?: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  jobTitle: string;
  timezone: string;
  avatar?: string;
  bio?: string;
}

export interface ThemeSettings {
  theme: 'dark' | 'light' | 'liquid';
  accent: string;
  accentSecondary: string;
  glassBlur: number;
  borderRadius: number;
  shadowIntensity: number;
  sidebarStyle: 'glass' | 'solid' | 'minimal';
  cardSpacing: 'compact' | 'normal' | 'relaxed';
}

export type ViewMode = 'grid' | 'list' | 'kanban' | 'table';
export type DateRange = '7d' | '30d' | '90d' | '1y';
