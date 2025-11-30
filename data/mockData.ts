import type { User, Tutorial, WarrantyItem, Ticket, ExpressionOfInterest } from '../types';

// A simple, small, valid base64 encoded PDF for demonstration purposes.
const MOCK_PDF_DATA_URL = "data:application/pdf;base64,JVBERi0xLjEKJSAxIDAgb2JqDTw8IC9UeXBlIC9DYXRhbG9nIC9QYWdlcyAyIDAgUiA+PgplbmRvYmoKMiAwIG9iagw8PCAvVHlwZSAvUGFnZXMgL0tpZHMgWyAzIDAgUiBdIC9Db3VudCAxID4+CmVuZG9iagozIDAgb2JqDTw8IC9UeXBlIC9QYWdlIC9QYXJlbnQgMiAwIFIgL1Jlc291cmNlcyA8PCAvRm9udCA8PCAvRjEgOCAwIFIgPj4gPj4gL01lZGlhQm94IFswIDAgNjEyIDc5Ml0gL0NvbnRlbnRzIDQgMCBSID4+CmVuZG9iago4IDAgb2JqDTw8IC9UeXBlIC9Gb250IC9TdWJ0eXBlIC9UeXBlMSAgL0Jhc2VGb250IC9IZWx2ZXRpY2EgPj4KZW5kb2JqCjQgMCBvYmoNPDwgL0xlbmd0aCA1OSBERi0xLjEKJSAxIDAgb2JqDTw8IC9UeXBlIC9DYXRhbG9nIC9QYWdlcyAyIDAgUiA+PgplbmRvYmoKMiAwIG9iagw8PCAvVHlwZSAvUGFnZXMgL0tpZHMgWyAzIDAgUiBdIC9Db3VudCAxID4+CmVuZG9iagozIDAgb2JqDTw8IC9UeXBlIC9QYWdlIC9QYXJlbnQgMiAwIFIgL1Jlc291cmNlcyA8PCAvRm9udCA8PCAvRjEgOCAwIFIgPj4gPj4gL01lZGlhQm94IFswIDAgNjEyIDc5Ml0gL0NvbnRlbnRzIDQgMCBSID4+CmVuZG9iago4IDAgb2JqDTw8IC9UeXBlIC9Gb250IC9TdWJ0eXBlIC9UeXBlMSAgL0Jhc2VGb250IC9IZWx2ZXRpY2EgPj4KZW5kb2JqCjQgMCBvYmoNPDwgL0xlbmd0aCA1OSBERi0xLjEKJSAxIDAgb2JqDTw8IC9UeXBlIC9DYXRhbG9nIC9QYWdlcyAyIDAgUiA+PgplbmRvYmoKMiAwIG9iagw8PCAvVHlwZSAvUGFnZXMgL0tpZHMgWyAzIDAgUiBdIC9Db3VudCAxID4+CmVuZG9iagozIDAgb2JqDTw8IC9UeXBlIC9QYWdlIC9QYXJlbnQgMiAwIFIgL1Jlc291cmNlcyA8PCAvRm9udCA8PCAvRjEgOCAwIFIgPj4gPj4gL01lZGlhQm94IFswIDAgNjEyIDc5Ml0gL0NvbnRlbnRzIDQgMCBSID4+CmVuZG9iago4IDAgb2JqDTw8IC9UeXBlIC9Gb250IC9TdWJ0eXBlIC9UeXBlMSAgL0Jhc2VGb250IC9IZWx2ZXRpY2EgPj4KZW5kb2JqCjQgMCBvYmoNPDwgL0xlbmd0aCA1OSBERi0xLjEKJSAxIDAgb2JqDTw8IC9UeXBlIC9DYXRhbG9nIC9QYWdlcyAyIDAgUiA+PgplbmRvYmoKMiAwIG9iagw8PCAvVHlwZSAvUGFnZXMgL0tpZHMgWyAzIDAgUiBdIC9Db3VudCAxID4+CmVuZG9iagozIDAgb2JqDTw8IC9UeXBlIC9QYWdlIC9QYXJlbnQgMiAwIFIgL1Jlc291cmNlcyA8PCAvRm9udCA8PCAvRjEgOCAwIFIgPj4gPj4gL01lZGlhQm94IFswIDAgNjEyIDc5Ml0gL0NvbnRlbnRzIDQgMCBSID4+CmVuZG9iago4IDAgb2JqDTw8IC9UeXBlIC9Gb250IC9TdWJ0eXBlIC9UeXBlMSAgL0Jhc2VGb250IC9IZWx2ZXRpY2EgPj4KZW5kb2JqCjQgMCBvYmoNPDwgL0xlbmd0aCA1OSA+PiBzdHJlYW0KQkQgL0YxIDE4IFRmIChIZWxsbywgV29ybGQhKSBUaiBFVAppZGQgZT5lbnRzIDQgMCBSID4+CmVuZG9iago4IDAgb2JqDTw8IC9UeXBlIC9Gb250IC9TdWJ0eXBlIC9UeXBlMSAgL0Jhc2VGb250IC9IZWx2ZXRpY2EgPj4KZW5kb2JqCjQgMCBvYmoNPDwgL0xlbmd0aCA1OSBERi0xLjEKJSAxIDAgb2JqDTw8IC9UeXBlIC9DYXRhbG9nIC9QYWdlcyAyIDAgUiA+PgplbmRvYmoKMiAwIG9iagw8PCAvVHlwZSAvUGFnZXMgL0tpZHMgWyAzIDAgUiBdIC9Db3VudCAxID4+CmVuZG9iagozIDAgb2JqDTw8IC9UeXBlIC9QYWdlIC9QYXJlbnQgMiAwIFIgL1Jlc291cmNlcyA8PCAvRm9udCA8PCAvRjEgOCAwIFIgPj4gPj4gL01lZGlhQm94IFswIDAgNjEyIDc5Ml0gL0NvbnRlbnRzIDQgMCBSID4+CmVuZG9iago4IDAgb2JqDTw8IC9UeXBlIC9Gb250IC9TdWJ0eXBlIC9UeXBlMSAgL0Jhc2VGb250IC9IZWx2ZXRpY2EgPj4KZW5kb2JqCjQgMCBvYmoNPDwgL0xlbmd0aCA1OSA+PiBzdHJlYW0KQkQgL0YxIDE4IFRmIChIZWxsbywgV29ybGQhKSBUaiBFVAplbmRzdHJlYW0KZW5kb2JqCnhyZWYKMCA1CjAwMDAwMDAwMDAgNjU1MzUgZiAKMDAwMDAwMDAxMSAwMDAwMCBuIAowMDAwMDAwMDYyIDAwMDAwIG4gCjAwMDAwMDAxMTIgMDAwMDAgbiAKMDAwMDAwMDMxMyAwMDAwMCBuIAp0cmFpbGVyDTw8IC9Sb290IDEgMCBSIC9TaXplIDUgPj4Kc3RhcnR4cmVmCjM5MgolJUVPRgo=";
// A simple, small, valid base64 encoded image for demonstration purposes.
const MOCK_IMAGE_DATA_URL = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAHBJREFUOE+tkgsKgEAMA23+P+3CI6ZBC5s07gUe9kNe2QhrK+CwoA0M2oG92gDbYAC2sAW2sAXG1gJt4QpGsAF2sAXGdgJtYQmGYAPbYCVbYAG2sAU2cAXGdgJtYQpGYAPbYCVbYAG2sAU2cAXGdgJtYQpGYAPbYCVbYOgH9/gBb9Qo2U8AAAAASUVORK5CYII=";


export const MOCK_USERS: User[] = [
  {
    id: 'customer1',
    role: 'customer',
    fullName: 'John Doe',
    nicNumber: '123456789V',
    contactNumber: '+94 77 123 4567',
    email: 'john.doe@example.com',
    password: 'password',
    address: 'Colombo, Sri Lanka',
    installedBy: 'Archnix Solar Tech',
    fileNumber: 'FN-001',
    system: {
      capacity: 5.5,
      inverterDetails: 'Solis S5-GR1P5K',
      inverterSerialNumber: 'INV-SN-98765',
      commissioningDate: '2023-05-15T00:00:00.000Z',
    },
    documents: [
      { id: 'doc1', name: 'Signed Agreement.pdf', url: MOCK_PDF_DATA_URL, uploadedAt: '2023-05-10T00:00:00.000Z' },
      { id: 'doc2', name: 'Warranty Card.pdf', url: MOCK_PDF_DATA_URL, uploadedAt: '2023-05-15T00:00:00.000Z' },
    ],
  },
    {
    id: 'customer2',
    role: 'customer',
    fullName: 'Jane Smith',
    nicNumber: '987654321V',
    contactNumber: '+94 71 987 6543',
    email: 'jane.smith@example.com',
    password: 'password',
    address: 'Kandy, Sri Lanka',
    installedBy: 'Archnix Solar Tech',
    fileNumber: 'FN-002',
    system: {
      capacity: 8.0,
      inverterDetails: 'Huawei SUN2000',
      inverterSerialNumber: 'INV-SN-11223',
      commissioningDate: '2022-11-20T00:00:00.000Z',
    },
    documents: [
      { id: 'doc3', name: 'Customer Agreement.pdf', url: MOCK_PDF_DATA_URL, uploadedAt: '2022-11-15T00:00:00.000Z' },
    ],
  },
  {
    id: 'admin1',
    role: 'admin',
    fullName: 'Admin User',
    nicNumber: '',
    contactNumber: '',
    email: 'admin@archnix.com',
    address: '',
    installedBy: '',
    fileNumber: '',
    system: {
        capacity: 0,
        inverterDetails: '',
        inverterSerialNumber: '',
        commissioningDate: '',
    },
    documents: [],
  }
];

export const MOCK_TUTORIALS: Tutorial[] = [
  { id: 'tut1', title: 'How to Read Your Solar Invoice', youtubeUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString() },
  { id: 'tut2', title: 'Basic Solar Panel Maintenance', youtubeUrl: 'https://www.youtube.com/embed/o-YBDTqX_ZU', createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString() },
  { id: 'tut3', title: 'Understanding Your Inverter Lights', youtubeUrl: 'https://www.youtube.com/embed/fC7oUOUEEi4', createdAt: new Date().toISOString() },
];

export const MOCK_WARRANTY_ITEMS: WarrantyItem[] = [
    { name: 'Inverter', totalDurationYears: 10 },
    { name: 'System Warranty', totalDurationYears: 10 },
    { name: 'Workmanship & Service', totalDurationYears: 10 },
    { name: 'Solar Panels', totalDurationYears: 12 },
    { name: 'Power Output', totalDurationYears: 30, description: 'Performance: 12 Years + Balance: 18 Years' },
];

export const MOCK_TICKETS: Ticket[] = [
    {
        id: 'ticket1',
        customerId: 'customer1',
        customerName: 'John Doe',
        subject: 'Inverter is showing a red light',
        status: 'Open',
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        complaintType: 'System Not Working',
        photoUrls: [MOCK_IMAGE_DATA_URL],
        messages: [
            { id: 'msg1', sender: 'customer', text: 'My inverter has a constant red light and I am not seeing any production. Can you please advise?', timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString() }
        ]
    },
    {
        id: 'ticket2',
        customerId: 'customer1',
        customerName: 'John Doe',
        subject: 'Question about my last bill',
        status: 'Closed',
        createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
        complaintType: 'Billing Inquiry',
        photoUrls: [],
        messages: [
            { id: 'msg2', sender: 'customer', text: 'I had a question regarding the breakdown of charges on my last electricity bill.', timestamp: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString() },
            { id: 'msg3', sender: 'admin', text: 'Hi John, thanks for reaching out. We have reviewed your bill and will send you a detailed explanation via email.', timestamp: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000).toISOString() },
            { id: 'msg4', sender: 'customer', text: 'Thank you!', timestamp: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000).toISOString() }
        ]
    },
     {
        id: 'ticket3',
        customerId: 'customer2',
        customerName: 'Jane Smith',
        subject: 'Schedule annual maintenance',
        status: 'In Progress',
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        complaintType: 'General Question',
        photoUrls: [],
        messages: [
            { id: 'msg5', sender: 'customer', text: "I'd like to schedule my annual system check-up.", timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString() },
            { id: 'msg6', sender: 'admin', text: "Hi Jane, our scheduling team will contact you within 24 hours to arrange a suitable time. ", timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString() }
        ]
    }
];

export const MOCK_EXPRESSIONS_OF_INTEREST: ExpressionOfInterest[] = [
    {
        id: 'eoi1',
        name: 'Prospective Client A',
        email: 'client.a@example.com',
        phone: '+94 77 555 1234',
        submittedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'pending',
    },
    {
        id: 'eoi2',
        name: 'Prospective Client B',
        email: 'client.b@example.com',
        phone: '+94 71 555 5678',
        submittedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'pending',
    }
];


export const ADMIN_ANALYTICS_DATA = {
    customerRegistration: [
        { name: 'Jan', customers: 4 },
        { name: 'Feb', customers: 3 },
        { name: 'Mar', customers: 5 },
        { name: 'Apr', customers: 7 },
        { name: 'May', customers: 6 },
        { name: 'Jun', customers: 10 },
    ],
    installedUnits: [
        { name: 'Q1', units: 12 },
        { name: 'Q2', units: 18 },
        { name: 'Q3', units: 25 },
        { name: 'Q4', units: 22 },
    ]
};