export interface User {
  user_id: number;
  first_name: string;
  last_name: string;
  email: string;
  hashed_password: string; // In real app, this would be hashed
  user_role: string; // 'Reporter', 'Collector', 'Admin', 'Author'
  address_line1?: string;
  city?: string;
}

export interface PickupSchedule {
  schedule_id: number;
  day_of_week: string;
  time_slot: string; // HH:MM:SS format
  is_active: boolean;
}

export interface EducationalContent {
  content_id: number;
  author_user_id: number;
  title: string;
  topic: string;
  content_body: string;
  created_at: string; // ISO string
}

export interface Report {
  report_id: number;
  reporter_user_id: number;
  report_type: string;
  location_address: string;
  latitude?: string;
  longitude?: string;
  description?: string;
  report_date: string; // ISO 8601 format
  status: string; // 'Pending', 'Resolved', 'In Progress'
  assigned_collector_id?: number;
}

export interface ReportSchedule {
  report_schedule_id: number;
  report_id: number;
  schedule_id: number;
}

// Dummy data for initialization
export const dummyUsers: User[] = [
  {
    user_id: 1,
    first_name: "Admin",
    last_name: "User",
    email: "user@user.com",
    hashed_password: "password123", // Plain for demo
    user_role: "Admin",
    address_line1: "123 Admin St",
    city: "Admin City"
  },
  {
    user_id: 2,
    first_name: "Regular",
    last_name: "User",
    email: "regular@user.com",
    hashed_password: "password123",
    user_role: "Reporter",
    address_line1: "456 User Ave",
    city: "User Town"
  },
  {
    user_id: 3,
    first_name: "Collector",
    last_name: "One",
    email: "collector@user.com",
    hashed_password: "password123",
    user_role: "Collector",
    address_line1: "789 Collector Rd",
    city: "Collector City"
  },
  {
    user_id: 4,
    first_name: "Author",
    last_name: "Content",
    email: "author@user.com",
    hashed_password: "password123",
    user_role: "Author",
    address_line1: "101 Author Ln",
    city: "Author Town"
  }
];

export const dummyPickupSchedules: PickupSchedule[] = [
  { schedule_id: 1, day_of_week: "Monday", time_slot: "08:00:00", is_active: true },
  { schedule_id: 2, day_of_week: "Tuesday", time_slot: "08:00:00", is_active: true },
  { schedule_id: 3, day_of_week: "Wednesday", time_slot: "08:00:00", is_active: true },
  { schedule_id: 4, day_of_week: "Thursday", time_slot: "08:00:00", is_active: true },
  { schedule_id: 5, day_of_week: "Friday", time_slot: "08:00:00", is_active: true },
  { schedule_id: 6, day_of_week: "Saturday", time_slot: "10:00:00", is_active: true },
  { schedule_id: 7, day_of_week: "Sunday", time_slot: "10:00:00", is_active: false }
];
export const dummyEducationalContent: EducationalContent[] = [
  {
    content_id: 1,
    author_user_id: 4,
    title: "Recycling Basics",
    topic: "Recycling",
    content_body: "Recycling is the process of converting waste materials into new materials and objects. It helps reduce the consumption of fresh raw materials, reduce energy usage, reduce air pollution and water pollution by reducing the need for conventional waste disposal. Start by sorting your waste into categories like paper, plastic, glass, and metal. Remember to rinse containers before recycling to avoid contamination.",
    created_at: "2023-10-01T10:00:00Z"
  },
  {
    content_id: 2,
    author_user_id: 4,
    title: "Composting at Home",
    topic: "Organic",
    content_body: "Composting is a natural process that turns organic waste into a valuable soil amendment. You can compost at home using kitchen scraps like vegetable peels, coffee grounds, and eggshells, along with yard waste such as leaves and grass clippings. Avoid adding meat, dairy, or oily foods to prevent attracting pests. Turn your compost pile regularly to aerate it and speed up decomposition.",
    created_at: "2023-10-02T10:00:00Z"
  },
  {
    content_id: 3,
    author_user_id: 4,
    title: "Reducing Waste",
    topic: "General",
    content_body: "Reducing waste starts with mindful consumption. Buy products with minimal packaging, choose reusable items over disposables, and repair instead of replacing. Plan meals to avoid food waste, and donate or repurpose items you no longer need. Small changes like using cloth bags for shopping and reusable water bottles can make a big impact on reducing landfill contributions.",
    created_at: "2023-10-03T10:00:00Z"
  }
];


export const dummyReports: Report[] = [
  {
    report_id: 1,
    reporter_user_id: 1,
    report_type: "Illegal Dumping",
    location_address: "123 Main St",
    latitude: "40.71280000",
    longitude: "-74.00600000",
    description: "Large pile of trash dumped illegally near the park.",
    report_date: "2023-10-01T06:00:00.000Z",
    status: "Pending",
    assigned_collector_id: undefined
  },
  {
    report_id: 2,
    reporter_user_id: 1,
    report_type: "Missed Pickup",
    location_address: "456 Elm St",
    latitude: "40.71290000",
    longitude: "-74.00610000",
    description: "Garbage was not collected on scheduled day.",
    report_date: "2023-09-28T06:00:00.000Z",
    status: "Resolved",
    assigned_collector_id: 3
  },
  {
    report_id: 3,
    reporter_user_id: 2,
    report_type: "Overflowing Bin",
    location_address: "789 Oak St",
    latitude: "40.71300000",
    longitude: "-74.00620000",
    description: "Public bin is overflowing and needs immediate attention.",
    report_date: "2023-10-02T06:00:00.000Z",
    status: "In Progress",
    assigned_collector_id: 3
  },
  {
    report_id: 4,
    reporter_user_id: 2,
    report_type: "Other",
    location_address: "321 Pine St",
    latitude: "40.71310000",
    longitude: "-74.00630000",
    description: "Broken recycling bin that needs repair.",
    report_date: "2023-10-03T06:00:00.000Z",
    status: "Pending",
    assigned_collector_id: undefined
  },
  {
    report_id: 5,
    reporter_user_id: 2,
    report_type: "Illegal Dumping",
    location_address: "654 Maple Ave",
    latitude: "40.71320000",
    longitude: "-74.00640000",
    description: "Construction debris left on sidewalk.",
    report_date: "2023-09-30T06:00:00.000Z",
    status: "Resolved",
    assigned_collector_id: 3
  },
  {
    report_id: 6,
    reporter_user_id: 1,
    report_type: "Illegal Dumping",
    location_address: "100 Admin Blvd",
    latitude: "40.71330000",
    longitude: "-74.00650000",
    description: "Hazardous waste improperly disposed of in residential area.",
    report_date: "2023-10-05T06:00:00.000Z",
    status: "In Progress",
    assigned_collector_id: 3
  },
  {
    report_id: 7,
    reporter_user_id: 1,
    report_type: "Missed Pickup",
    location_address: "200 Admin Plaza",
    latitude: "40.71340000",
    longitude: "-74.00660000",
    description: "Commercial waste pickup missed for the third consecutive week.",
    report_date: "2023-10-04T06:00:00.000Z",
    status: "Resolved",
    assigned_collector_id: 3
  },
  {
    report_id: 8,
    reporter_user_id: 3,
    report_type: "Overflowing Bin",
    location_address: "300 Collector Way",
    latitude: "40.71350000",
    longitude: "-74.00670000",
    description: "Multiple bins overflowing at the shopping center.",
    report_date: "2023-10-06T06:00:00.000Z",
    status: "Pending",
    assigned_collector_id: undefined
  },
  {
    report_id: 9,
    reporter_user_id: 3,
    report_type: "Other",
    location_address: "400 Collector Lane",
    latitude: "40.71360000",
    longitude: "-74.00680000",
    description: "Damaged collection truck needs maintenance.",
    report_date: "2023-10-07T06:00:00.000Z",
    status: "Resolved",
    assigned_collector_id: 3
  },
  {
    report_id: 10,
    reporter_user_id: 4,
    report_type: "Illegal Dumping",
    location_address: "500 Author Street",
    latitude: "40.71370000",
    longitude: "-74.00690000",
    description: "Electronic waste dumped in public park.",
    report_date: "2023-10-08T06:00:00.000Z",
    status: "In Progress",
    assigned_collector_id: 3
  },
  {
    report_id: 11,
    reporter_user_id: 4,
    report_type: "Missed Pickup",
    location_address: "600 Author Ave",
    latitude: "40.71380000",
    longitude: "-74.00700000",
    description: "Recycling pickup missed at community center.",
    report_date: "2023-10-09T06:00:00.000Z",
    status: "Pending",
    assigned_collector_id: undefined
  },
  {
    report_id: 12,
    reporter_user_id: 2,
    report_type: "Illegal Dumping",
    location_address: "700 User Blvd",
    latitude: "40.71390000",
    longitude: "-74.00710000",
    description: "Tires illegally dumped behind abandoned building.",
    report_date: "2023-10-10T06:00:00.000Z",
    status: "Resolved",
    assigned_collector_id: 3
  },
  {
    report_id: 13,
    reporter_user_id: 1,
    report_type: "Overflowing Bin",
    location_address: "800 Admin Circle",
    latitude: "40.71400000",
    longitude: "-74.00720000",
    description: "City center bins overflowing during festival weekend.",
    report_date: "2023-10-11T06:00:00.000Z",
    status: "In Progress",
    assigned_collector_id: 3
  },
  {
    report_id: 14,
    reporter_user_id: 3,
    report_type: "Other",
    location_address: "900 Collector Square",
    latitude: "40.71410000",
    longitude: "-74.00730000",
    description: "New collection route causing traffic congestion.",
    report_date: "2023-10-12T06:00:00.000Z",
    status: "Pending",
    assigned_collector_id: undefined
  },
  {
    report_id: 15,
    reporter_user_id: 4,
    report_type: "Illegal Dumping",
    location_address: "1000 Author Plaza",
    latitude: "40.71420000",
    longitude: "-74.00740000",
    description: "Medical waste improperly disposed of in regular trash.",
    report_date: "2023-10-13T06:00:00.000Z",
    status: "Resolved",
    assigned_collector_id: 3
  }
];

export const dummyReportSchedules: ReportSchedule[] = [
  { report_schedule_id: 1, report_id: 1, schedule_id: 1 },
  { report_schedule_id: 2, report_id: 2, schedule_id: 2 },
  { report_schedule_id: 3, report_id: 3, schedule_id: 3 }
];

// Utility functions for localStorage management
export const getUsers = (): User[] => {
  const stored = localStorage.getItem('users');
  return stored ? JSON.parse(stored) : dummyUsers;
};

export const saveUsers = (users: User[]) => {
  localStorage.setItem('users', JSON.stringify(users));
};

export const getPickupSchedules = (): PickupSchedule[] => {
  const stored = localStorage.getItem('pickup_schedules');
  return stored ? JSON.parse(stored) : dummyPickupSchedules;
};

export const savePickupSchedules = (schedules: PickupSchedule[]) => {
  localStorage.setItem('pickup_schedules', JSON.stringify(schedules));
};

export const getEducationalContent = (): EducationalContent[] => {
  const stored = localStorage.getItem('educational_content');
  return stored ? JSON.parse(stored) : dummyEducationalContent;
};

export const saveEducationalContent = (content: EducationalContent[]) => {
  localStorage.setItem('educational_content', JSON.stringify(content));
};

export const getReports = (): Report[] => {
  const stored = localStorage.getItem('reports');
  return stored ? JSON.parse(stored) : dummyReports;
};

export const saveReports = (reports: Report[]) => {
  localStorage.setItem('reports', JSON.stringify(reports));
};

export const getReportSchedules = (): ReportSchedule[] => {
  const stored = localStorage.getItem('report_schedules');
  return stored ? JSON.parse(stored) : dummyReportSchedules;
};

export const saveReportSchedules = (schedules: ReportSchedule[]) => {
  localStorage.setItem('report_schedules', JSON.stringify(schedules));
};

// Initialize data if not present
if (!localStorage.getItem('users')) saveUsers(dummyUsers);
if (!localStorage.getItem('pickup_schedules')) savePickupSchedules(dummyPickupSchedules);
if (!localStorage.getItem('educational_content')) saveEducationalContent(dummyEducationalContent);
if (!localStorage.getItem('reports')) saveReports(dummyReports);
if (!localStorage.getItem('report_schedules')) saveReportSchedules(dummyReportSchedules);