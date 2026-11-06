import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Contact, Project, Task, Transaction, TeamMember, CalendarEvent, Notification, UserProfile, ThemeSettings } from '../types';
import { mockContacts, mockProjects, mockTasks, mockTransactions, mockTeamMembers, mockCalendarEvents, mockNotifications, defaultUserProfile, defaultTheme } from '../data/mockData';

interface AppState {
  contacts: Contact[];
  projects: Project[];
  tasks: Task[];
  transactions: Transaction[];
  teamMembers: TeamMember[];
  events: CalendarEvent[];
  notifications: Notification[];
  userProfile: UserProfile;
  theme: ThemeSettings;
  sidebarCollapsed: boolean;

  setContacts: (c: Contact[]) => void;
  addContact: (c: Contact) => void;
  updateContact: (c: Contact) => void;
  deleteContact: (id: string) => void;

  setProjects: (p: Project[]) => void;
  addProject: (p: Project) => void;
  updateProject: (p: Project) => void;
  deleteProject: (id: string) => void;

  setTasks: (t: Task[]) => void;
  addTask: (t: Task) => void;
  updateTask: (t: Task) => void;
  deleteTask: (id: string) => void;

  setTransactions: (t: Transaction[]) => void;
  addTransaction: (t: Transaction) => void;
  updateTransaction: (t: Transaction) => void;
  deleteTransaction: (id: string) => void;

  setTeamMembers: (m: TeamMember[]) => void;
  addTeamMember: (m: TeamMember) => void;
  updateTeamMember: (m: TeamMember) => void;
  deleteTeamMember: (id: string) => void;

  setEvents: (e: CalendarEvent[]) => void;
  addEvent: (e: CalendarEvent) => void;
  updateEvent: (e: CalendarEvent) => void;
  deleteEvent: (id: string) => void;

  addNotification: (n: Notification) => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  deleteNotification: (id: string) => void;

  updateUserProfile: (p: Partial<UserProfile>) => void;
  updateTheme: (t: Partial<ThemeSettings>) => void;
  setSidebarCollapsed: (v: boolean) => void;
  resetDemoData: () => void;
}

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      contacts: mockContacts,
      projects: mockProjects,
      tasks: mockTasks,
      transactions: mockTransactions,
      teamMembers: mockTeamMembers,
      events: mockCalendarEvents,
      notifications: mockNotifications,
      userProfile: defaultUserProfile,
      theme: defaultTheme,
      sidebarCollapsed: false,

      setContacts: (contacts) => set({ contacts }),
      addContact: (c) => set((s) => ({ contacts: [c, ...s.contacts] })),
      updateContact: (c) => set((s) => ({ contacts: s.contacts.map((x) => (x.id === c.id ? c : x)) })),
      deleteContact: (id) => set((s) => ({ contacts: s.contacts.filter((x) => x.id !== id) })),

      setProjects: (projects) => set({ projects }),
      addProject: (p) => set((s) => ({ projects: [p, ...s.projects] })),
      updateProject: (p) => set((s) => ({ projects: s.projects.map((x) => (x.id === p.id ? p : x)) })),
      deleteProject: (id) => set((s) => ({ projects: s.projects.filter((x) => x.id !== id) })),

      setTasks: (tasks) => set({ tasks }),
      addTask: (t) => set((s) => ({ tasks: [t, ...s.tasks] })),
      updateTask: (t) => set((s) => ({ tasks: s.tasks.map((x) => (x.id === t.id ? t : x)) })),
      deleteTask: (id) => set((s) => ({ tasks: s.tasks.filter((x) => x.id !== id) })),

      setTransactions: (transactions) => set({ transactions }),
      addTransaction: (t) => set((s) => ({ transactions: [t, ...s.transactions] })),
      updateTransaction: (t) => set((s) => ({ transactions: s.transactions.map((x) => (x.id === t.id ? t : x)) })),
      deleteTransaction: (id) => set((s) => ({ transactions: s.transactions.filter((x) => x.id !== id) })),

      setTeamMembers: (teamMembers) => set({ teamMembers }),
      addTeamMember: (m) => set((s) => ({ teamMembers: [m, ...s.teamMembers] })),
      updateTeamMember: (m) => set((s) => ({ teamMembers: s.teamMembers.map((x) => (x.id === m.id ? m : x)) })),
      deleteTeamMember: (id) => set((s) => ({ teamMembers: s.teamMembers.filter((x) => x.id !== id) })),

      setEvents: (events) => set({ events }),
      addEvent: (e) => set((s) => ({ events: [e, ...s.events] })),
      updateEvent: (e) => set((s) => ({ events: s.events.map((x) => (x.id === e.id ? e : x)) })),
      deleteEvent: (id) => set((s) => ({ events: s.events.filter((x) => x.id !== id) })),

      addNotification: (n) => set((s) => ({ notifications: [n, ...s.notifications] })),
      markNotificationRead: (id) => set((s) => ({ notifications: s.notifications.map((x) => (x.id === id ? { ...x, read: true } : x)) })),
      markAllNotificationsRead: () => set((s) => ({ notifications: s.notifications.map((x) => ({ ...x, read: true })) })),
      deleteNotification: (id) => set((s) => ({ notifications: s.notifications.filter((x) => x.id !== id) })),

      updateUserProfile: (p) => set((s) => ({ userProfile: { ...s.userProfile, ...p } })),
      updateTheme: (t) => set((s) => ({ theme: { ...s.theme, ...t } })),
      setSidebarCollapsed: (v) => set({ sidebarCollapsed: v }),
      resetDemoData: () => set({
        contacts: mockContacts,
        projects: mockProjects,
        tasks: mockTasks,
        transactions: mockTransactions,
        teamMembers: mockTeamMembers,
        events: mockCalendarEvents,
        notifications: mockNotifications,
        userProfile: defaultUserProfile,
        theme: defaultTheme,
      }),
    }),
    { name: 'nuvora-store' }
  )
);
