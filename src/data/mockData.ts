import type { Contact, Project, Task, Transaction, TeamMember, CalendarEvent, Notification, UserProfile, ThemeSettings } from '../types';

export const mockContacts: Contact[] = [
  { id: 'c1', name: 'Sarah Johnson', email: 'sarah.j@techcorp.com', phone: '+1 555-0101', company: 'TechCorp Inc.', position: 'CTO', status: 'qualified', source: 'referral', assignedTo: 'Alex Morgan', createdAt: '2024-01-15', notes: 'Interested in enterprise plan' },
  { id: 'c2', name: 'Marcus Chen', email: 'm.chen@innovate.io', phone: '+1 555-0102', company: 'Innovate.io', position: 'CEO', status: 'proposal', source: 'website', assignedTo: 'Alex Morgan', createdAt: '2024-01-20', notes: 'Demo scheduled for next week' },
  { id: 'c3', name: 'Emily Rodriguez', email: 'emily.r@startupx.com', phone: '+1 555-0103', company: 'StartupX', position: 'Product Manager', status: 'contacted', source: 'social', assignedTo: 'Jordan Lee', createdAt: '2024-02-01' },
  { id: 'c4', name: 'David Kim', email: 'd.kim@globaltech.com', phone: '+1 555-0104', company: 'GlobalTech', position: 'VP Engineering', status: 'converted', source: 'event', assignedTo: 'Alex Morgan', createdAt: '2024-01-10' },
  { id: 'c5', name: 'Lisa Thompson', email: 'lisa.t@ventures.com', phone: '+1 555-0105', company: 'Ventures Co.', position: 'Investor', status: 'negotiation', source: 'referral', assignedTo: 'Sam Wilson', createdAt: '2024-02-10' },
  { id: 'c6', name: 'James Park', email: 'j.park@cloudbase.io', phone: '+1 555-0106', company: 'CloudBase', position: 'Director', status: 'new', source: 'cold-call', assignedTo: 'Jordan Lee', createdAt: '2024-02-15' },
  { id: 'c7', name: 'Anna Williams', email: 'anna.w@dataflow.com', phone: '+1 555-0107', company: 'DataFlow', position: 'Data Scientist', status: 'lost', source: 'email', assignedTo: 'Sam Wilson', createdAt: '2024-01-25' },
  { id: 'c8', name: 'Robert Martinez', email: 'r.martinez@nexus.com', phone: '+1 555-0108', company: 'Nexus Corp', position: 'COO', status: 'qualified', source: 'website', assignedTo: 'Alex Morgan', createdAt: '2024-02-20' },
];

export const mockProjects: Project[] = [
  { id: 'p1', name: 'Nuvora Platform v2.0', description: 'Complete redesign of the core platform with new features', status: 'in-progress', priority: 'critical', progress: 68, startDate: '2024-01-01', dueDate: '2024-06-30', budget: 150000, spent: 98000, team: ['tm1', 'tm2', 'tm3'], tags: ['platform', 'redesign'], revenue: 250000, createdAt: '2024-01-01' },
  { id: 'p2', name: 'Mobile App Launch', description: 'iOS and Android app development and launch', status: 'in-progress', priority: 'high', progress: 45, startDate: '2024-02-01', dueDate: '2024-07-15', budget: 80000, spent: 35000, team: ['tm2', 'tm4'], tags: ['mobile', 'ios', 'android'], revenue: 120000, createdAt: '2024-02-01' },
  { id: 'p3', name: 'AI Integration Suite', description: 'Integrate AI capabilities across all modules', status: 'planning', priority: 'high', progress: 15, startDate: '2024-03-01', dueDate: '2024-09-30', budget: 200000, spent: 12000, team: ['tm1', 'tm5'], tags: ['ai', 'ml'], revenue: 400000, createdAt: '2024-03-01' },
  { id: 'p4', name: 'Enterprise Dashboard', description: 'Custom enterprise analytics dashboard', status: 'completed', priority: 'medium', progress: 100, startDate: '2023-10-01', dueDate: '2024-01-31', budget: 60000, spent: 58000, team: ['tm3', 'tm4'], tags: ['enterprise', 'analytics'], revenue: 95000, createdAt: '2023-10-01' },
  { id: 'p5', name: 'Security Audit & Compliance', description: 'SOC2 compliance and security hardening', status: 'on-hold', priority: 'critical', progress: 30, startDate: '2024-02-15', dueDate: '2024-05-31', budget: 45000, spent: 15000, team: ['tm5'], tags: ['security', 'compliance'], createdAt: '2024-02-15' },
  { id: 'p6', name: 'Customer Portal Redesign', description: 'Redesign customer-facing portal with new UX', status: 'in-progress', priority: 'medium', progress: 55, startDate: '2024-01-15', dueDate: '2024-05-15', budget: 35000, spent: 20000, team: ['tm2', 'tm3'], tags: ['ux', 'portal'], revenue: 55000, createdAt: '2024-01-15' },
];

export const mockTasks: Task[] = [
  { id: 't1', title: 'Design new onboarding flow', description: 'Create wireframes and prototypes for the new user onboarding experience', status: 'in-progress', priority: 'high', assignedTo: 'tm2', projectId: 'p1', dueDate: '2024-03-20', createdAt: '2024-03-01', tags: ['design', 'ux'], completed: false },
  { id: 't2', title: 'Implement authentication module', description: 'Build JWT-based auth with refresh tokens', status: 'completed', priority: 'critical', assignedTo: 'tm1', projectId: 'p1', dueDate: '2024-03-10', createdAt: '2024-02-20', tags: ['backend', 'auth'], completed: true },
  { id: 't3', title: 'Write API documentation', description: 'Document all REST endpoints with examples', status: 'todo', priority: 'medium', assignedTo: 'tm3', projectId: 'p1', dueDate: '2024-03-25', createdAt: '2024-03-05', tags: ['docs'], completed: false },
  { id: 't4', title: 'Mobile app UI components', description: 'Build reusable component library for mobile', status: 'in-progress', priority: 'high', assignedTo: 'tm4', projectId: 'p2', dueDate: '2024-03-18', createdAt: '2024-03-01', tags: ['mobile', 'ui'], completed: false },
  { id: 't5', title: 'Performance optimization', description: 'Reduce bundle size and improve load times', status: 'review', priority: 'medium', assignedTo: 'tm1', projectId: 'p1', dueDate: '2024-03-15', createdAt: '2024-03-01', tags: ['performance'], completed: false },
  { id: 't6', title: 'Set up CI/CD pipeline', description: 'Configure GitHub Actions for automated deployment', status: 'completed', priority: 'high', assignedTo: 'tm5', projectId: 'p1', dueDate: '2024-03-05', createdAt: '2024-02-25', tags: ['devops'], completed: true },
  { id: 't7', title: 'User research interviews', description: 'Conduct 10 user interviews for feature validation', status: 'todo', priority: 'medium', assignedTo: 'tm2', dueDate: '2024-03-28', createdAt: '2024-03-08', tags: ['research'], completed: false },
  { id: 't8', title: 'Database schema migration', description: 'Migrate legacy schema to new normalized structure', status: 'todo', priority: 'critical', assignedTo: 'tm1', projectId: 'p3', dueDate: '2024-03-12', createdAt: '2024-03-01', tags: ['database'], completed: false },
];

export const mockTransactions: Transaction[] = [
  { id: 'tr1', name: 'Enterprise License - TechCorp', amount: 24000, type: 'income', category: 'Subscription', date: '2024-03-01', status: 'completed' },
  { id: 'tr2', name: 'AWS Infrastructure', amount: 3200, type: 'expense', category: 'Infrastructure', date: '2024-03-01', status: 'completed' },
  { id: 'tr3', name: 'Pro Plan - Innovate.io', amount: 4800, type: 'income', category: 'Subscription', date: '2024-03-02', status: 'completed' },
  { id: 'tr4', name: 'Contractor Payment - Design', amount: 5500, type: 'expense', category: 'Payroll', date: '2024-03-03', status: 'completed' },
  { id: 'tr5', name: 'Consulting Services', amount: 8500, type: 'income', category: 'Services', date: '2024-03-05', status: 'completed' },
  { id: 'tr6', name: 'Marketing Campaign', amount: 2800, type: 'expense', category: 'Marketing', date: '2024-03-06', status: 'completed' },
  { id: 'tr7', name: 'Starter Plan - 12 users', amount: 1440, type: 'income', category: 'Subscription', date: '2024-03-07', status: 'completed' },
  { id: 'tr8', name: 'Office Supplies', amount: 450, type: 'expense', category: 'Operations', date: '2024-03-08', status: 'completed' },
  { id: 'tr9', name: 'API Integration Fee', amount: 3600, type: 'income', category: 'Services', date: '2024-03-10', status: 'pending' },
  { id: 'tr10', name: 'Software Licenses', amount: 1200, type: 'expense', category: 'Software', date: '2024-03-10', status: 'completed' },
  { id: 'tr11', name: 'Enterprise License - GlobalTech', amount: 36000, type: 'income', category: 'Subscription', date: '2024-03-12', status: 'completed' },
  { id: 'tr12', name: 'Team Training', amount: 2200, type: 'expense', category: 'Training', date: '2024-03-13', status: 'completed' },
  { id: 'tr13', name: 'Custom Development', amount: 12000, type: 'income', category: 'Services', date: '2024-03-15', status: 'pending' },
  { id: 'tr14', name: 'Legal & Compliance', amount: 3500, type: 'expense', category: 'Legal', date: '2024-03-15', status: 'completed' },
  { id: 'tr15', name: 'Referral Commission', amount: 1800, type: 'expense', category: 'Marketing', date: '2024-03-18', status: 'completed' },
];

export const mockTeamMembers: TeamMember[] = [
  { id: 'tm1', name: 'Alex Morgan', email: 'alex.morgan@nuvora.io', phone: '+1 555-1001', role: 'Lead Engineer', department: 'Engineering', status: 'active', joinDate: '2022-03-15', location: 'San Francisco, CA', skills: ['React', 'Node.js', 'TypeScript', 'AWS'], projects: ['p1', 'p3'] },
  { id: 'tm2', name: 'Jordan Lee', email: 'jordan.lee@nuvora.io', phone: '+1 555-1002', role: 'UI/UX Designer', department: 'Design', status: 'active', joinDate: '2022-06-01', location: 'New York, NY', skills: ['Figma', 'React', 'CSS', 'Motion Design'], projects: ['p1', 'p2', 'p6'] },
  { id: 'tm3', name: 'Sam Wilson', email: 'sam.wilson@nuvora.io', phone: '+1 555-1003', role: 'Product Manager', department: 'Product', status: 'active', joinDate: '2022-01-10', location: 'Austin, TX', skills: ['Product Strategy', 'Agile', 'Analytics', 'Roadmapping'], projects: ['p1', 'p4', 'p6'] },
  { id: 'tm4', name: 'Maya Patel', email: 'maya.patel@nuvora.io', phone: '+1 555-1004', role: 'Mobile Developer', department: 'Engineering', status: 'active', joinDate: '2023-02-20', location: 'Seattle, WA', skills: ['React Native', 'Swift', 'Kotlin', 'Firebase'], projects: ['p2', 'p4'] },
  { id: 'tm5', name: 'Chris Anderson', email: 'chris.a@nuvora.io', phone: '+1 555-1005', role: 'DevOps Engineer', department: 'Infrastructure', status: 'away', joinDate: '2022-09-05', location: 'Denver, CO', skills: ['AWS', 'Docker', 'Kubernetes', 'Terraform'], projects: ['p3', 'p5'] },
  { id: 'tm6', name: 'Priya Sharma', email: 'priya.s@nuvora.io', phone: '+1 555-1006', role: 'Data Analyst', department: 'Analytics', status: 'active', joinDate: '2023-05-15', location: 'Chicago, IL', skills: ['Python', 'SQL', 'Tableau', 'ML'], projects: ['p3'] },
];

export const mockCalendarEvents: CalendarEvent[] = [
  { id: 'ev1', title: 'Product Roadmap Review', description: 'Quarterly roadmap planning session', start: '2024-03-18T10:00:00', end: '2024-03-18T11:30:00', category: 'meeting' },
  { id: 'ev2', title: 'Mobile App Deadline', description: 'Phase 1 delivery deadline', start: '2024-03-20T00:00:00', end: '2024-03-20T23:59:00', category: 'deadline', allDay: true },
  { id: 'ev3', title: 'Team Standup', description: 'Daily standup meeting', start: '2024-03-19T09:00:00', end: '2024-03-19T09:30:00', category: 'meeting' },
  { id: 'ev4', title: 'Client Demo - TechCorp', description: 'Product demo for TechCorp enterprise team', start: '2024-03-21T14:00:00', end: '2024-03-21T15:00:00', category: 'meeting' },
  { id: 'ev5', title: 'Security Audit', description: 'External security audit begins', start: '2024-03-25T00:00:00', end: '2024-03-27T23:59:00', category: 'event', allDay: true },
  { id: 'ev6', title: 'Q1 Finance Review', description: 'Quarterly financial review with stakeholders', start: '2024-03-28T13:00:00', end: '2024-03-28T14:30:00', category: 'meeting' },
  { id: 'ev7', title: 'Design Sprint', description: 'UX design sprint for new features', start: '2024-03-22T09:00:00', end: '2024-03-22T17:00:00', category: 'event' },
  { id: 'ev8', title: 'Platform v2 Launch', description: 'Major platform release', start: '2024-06-30T00:00:00', end: '2024-06-30T23:59:00', category: 'deadline', allDay: true },
];

export const mockNotifications: Notification[] = [
  { id: 'n1', title: 'New Contact Added', message: 'Sarah Johnson from TechCorp has been added to CRM', type: 'success', read: false, createdAt: new Date(Date.now() - 5 * 60000).toISOString() },
  { id: 'n2', title: 'Task Overdue', message: 'Database schema migration is past due date', type: 'warning', read: false, createdAt: new Date(Date.now() - 30 * 60000).toISOString() },
  { id: 'n3', title: 'Payment Received', message: 'Enterprise License payment of $24,000 confirmed', type: 'success', read: false, createdAt: new Date(Date.now() - 2 * 3600000).toISOString() },
  { id: 'n4', title: 'Project Milestone', message: 'Nuvora Platform v2.0 reached 68% completion', type: 'info', read: true, createdAt: new Date(Date.now() - 5 * 3600000).toISOString() },
  { id: 'n5', title: 'New Team Member', message: 'Priya Sharma has joined the Analytics team', type: 'info', read: true, createdAt: new Date(Date.now() - 24 * 3600000).toISOString() },
  { id: 'n6', title: 'Security Alert', message: 'Unusual login attempt detected and blocked', type: 'error', read: false, createdAt: new Date(Date.now() - 3 * 3600000).toISOString() },
];

export const defaultUserProfile: UserProfile = {
  id: 'user1',
  name: 'Alex Morgan',
  email: 'alex.morgan@nuvora.io',
  phone: '+1 555-1001',
  jobTitle: 'Lead Engineer',
  timezone: 'America/Los_Angeles',
  bio: 'Building the future of digital workspaces at Nuvora.',
};

export const defaultTheme: ThemeSettings = {
  theme: 'dark',
  accent: '139 92 246',
  accentSecondary: '59 130 246',
  glassBlur: 20,
  borderRadius: 16,
  shadowIntensity: 0.4,
  sidebarStyle: 'glass',
  cardSpacing: 'normal',
};

export const revenueData = {
  '7d': [
    { date: 'Mon', revenue: 4200, expenses: 1800 },
    { date: 'Tue', revenue: 5800, expenses: 2100 },
    { date: 'Wed', revenue: 4900, expenses: 1950 },
    { date: 'Thu', revenue: 6200, expenses: 2300 },
    { date: 'Fri', revenue: 7100, expenses: 2800 },
    { date: 'Sat', revenue: 3200, expenses: 1200 },
    { date: 'Sun', revenue: 2800, expenses: 900 },
  ],
  '30d': [
    { date: 'Week 1', revenue: 28000, expenses: 11000 },
    { date: 'Week 2', revenue: 34000, expenses: 13500 },
    { date: 'Week 3', revenue: 31000, expenses: 12000 },
    { date: 'Week 4', revenue: 42000, expenses: 15000 },
  ],
  '90d': [
    { date: 'Jan', revenue: 98000, expenses: 42000 },
    { date: 'Feb', revenue: 112000, expenses: 48000 },
    { date: 'Mar', revenue: 135000, expenses: 52000 },
  ],
  '1y': [
    { date: 'Jan', revenue: 98000, expenses: 42000 },
    { date: 'Feb', revenue: 112000, expenses: 48000 },
    { date: 'Mar', revenue: 135000, expenses: 52000 },
    { date: 'Apr', revenue: 128000, expenses: 50000 },
    { date: 'May', revenue: 145000, expenses: 55000 },
    { date: 'Jun', revenue: 162000, expenses: 58000 },
    { date: 'Jul', revenue: 158000, expenses: 60000 },
    { date: 'Aug', revenue: 175000, expenses: 62000 },
    { date: 'Sep', revenue: 168000, expenses: 59000 },
    { date: 'Oct', revenue: 192000, expenses: 68000 },
    { date: 'Nov', revenue: 185000, expenses: 65000 },
    { date: 'Dec', revenue: 210000, expenses: 72000 },
  ],
};

export const userGrowthData = [
  { month: 'Jan', users: 1200, newUsers: 180, churn: 45 },
  { month: 'Feb', users: 1380, newUsers: 220, churn: 40 },
  { month: 'Mar', users: 1580, newUsers: 260, churn: 60 },
  { month: 'Apr', users: 1820, newUsers: 300, churn: 60 },
  { month: 'May', users: 2100, newUsers: 340, churn: 60 },
  { month: 'Jun', users: 2420, newUsers: 380, churn: 60 },
  { month: 'Jul', users: 2780, newUsers: 420, churn: 62 },
  { month: 'Aug', users: 3180, newUsers: 460, churn: 60 },
  { month: 'Sep', users: 3620, newUsers: 500, churn: 60 },
  { month: 'Oct', users: 4100, newUsers: 540, churn: 60 },
  { month: 'Nov', users: 4620, newUsers: 580, churn: 60 },
  { month: 'Dec', users: 5200, newUsers: 640, churn: 60 },
];

export const categoryData = [
  { name: 'Subscriptions', value: 62, color: '#8b5cf6' },
  { name: 'Services', value: 24, color: '#3b82f6' },
  { name: 'Consulting', value: 9, color: '#06b6d4' },
  { name: 'Other', value: 5, color: '#10b981' },
];

export const expenseCategoryData = [
  { name: 'Infrastructure', value: 28, color: '#f59e0b' },
  { name: 'Payroll', value: 42, color: '#ef4444' },
  { name: 'Marketing', value: 15, color: '#8b5cf6' },
  { name: 'Operations', value: 10, color: '#3b82f6' },
  { name: 'Software', value: 5, color: '#10b981' },
];

export const trafficData = [
  { month: 'Jan', organic: 4200, paid: 1800, referral: 900, direct: 2100 },
  { month: 'Feb', organic: 4800, paid: 2100, referral: 1100, direct: 2400 },
  { month: 'Mar', organic: 5600, paid: 2400, referral: 1300, direct: 2800 },
  { month: 'Apr', organic: 6200, paid: 2800, referral: 1500, direct: 3100 },
  { month: 'May', organic: 7100, paid: 3200, referral: 1800, direct: 3500 },
  { month: 'Jun', organic: 8200, paid: 3600, referral: 2100, direct: 4000 },
];

export const conversionData = [
  { month: 'Jan', rate: 3.2, leads: 420, conversions: 13 },
  { month: 'Feb', rate: 3.8, leads: 480, conversions: 18 },
  { month: 'Mar', rate: 4.1, leads: 560, conversions: 23 },
  { month: 'Apr', rate: 4.5, leads: 620, conversions: 28 },
  { month: 'May', rate: 4.8, leads: 710, conversions: 34 },
  { month: 'Jun', rate: 5.2, leads: 820, conversions: 43 },
];
