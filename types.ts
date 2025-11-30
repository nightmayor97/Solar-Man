export type UserRole = 'customer' | 'admin';

export interface User {
  id: string;
  role: UserRole;
  fullName: string;
  nicNumber: string;
  contactNumber: string;
  email: string;
  password?: string;
  address: string;
  installedBy: string;
  fileNumber: string;
  system: System;
  documents: Document[];
}

export interface System {
  capacity: number; // in kW
  inverterDetails: string;
  inverterSerialNumber: string;
  commissioningDate: string; // ISO string date
}

export interface Document {
  id: string;
  name: string;
  url: string; // Will store base64 data URL
  uploadedAt: string; // ISO string
}

export interface Tutorial {
  id: string;
  title: string;
  youtubeUrl: string;
  createdAt: string; // ISO string
}

export interface WarrantyItem {
  name: string;
  totalDurationYears: number;
  description?: string;
}

export interface TicketMessage {
  id: string;
  sender: 'customer' | 'admin';
  text: string;
  timestamp: string; // ISO string
}

export interface Ticket {
  id: string;
  customerId: string;
  customerName: string; 
  subject: string;
  status: 'Open' | 'In Progress' | 'Closed';
  createdAt: string; // ISO string
  messages: TicketMessage[];
  complaintType: string;
  photoUrls?: string[];
}

export interface ExpressionOfInterest {
  id: string;
  name: string;
  email: string;
  phone: string;
  submittedAt: string; // ISO string
  status: 'pending' | 'approved' | 'rejected';
}

export interface Notification {
  id: string;
  userId: string;
  message: string;
  type: 'ticket' | 'eoi' | 'document' | 'general';
  relatedId?: string; 
  isRead: boolean;
  createdAt: string; // ISO string
}

export interface Toast extends Pick<Notification, 'message' | 'type'> {
  id: string;
}