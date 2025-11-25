const db = require('./db');
require('dotenv').config();

async function seedDatabase() {
  try {
    console.log('🌱 Starting database seeding...');

    // Clear existing data in reverse order due to foreign key constraints
    console.log('Clearing existing data...');
    await db.execute('DELETE FROM REPORT_SCHEDULES');
    await db.execute('DELETE FROM REPORTS');
    await db.execute('DELETE FROM EDUCATIONAL_CONTENT');
    await db.execute('DELETE FROM PICKUP_SCHEDULES');
    await db.execute('DELETE FROM USERS');
    console.log('✅ Existing data cleared');

    // Seed users and capture their IDs
    console.log('Seeding users...');
    const users = [
      { first_name: "Admin", last_name: "User", email: "user@user.com", hashed_password: "password123", user_role: "Admin", address_line1: "123 Admin St", city: "Admin City" },
      { first_name: "Regular", last_name: "User", email: "regular@user.com", hashed_password: "password123", user_role: "Reporter", address_line1: "456 User Ave", city: "User Town" },
      { first_name: "Collector", last_name: "One", email: "collector@user.com", hashed_password: "password123", user_role: "Collector", address_line1: "789 Collector Rd", city: "Collector City" },
      { first_name: "Author", last_name: "Content", email: "author@user.com", hashed_password: "password123", user_role: "Author", address_line1: "101 Author Ln", city: "Author Town" }
    ];

    let userIds = [];
    for (const user of users) {
      const [result] = await db.execute(
        'INSERT INTO USERS (first_name, last_name, email, hashed_password, user_role, address_line1, city) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [user.first_name, user.last_name, user.email, user.hashed_password, user.user_role, user.address_line1, user.city]
      );
      userIds.push(result.insertId);
    }
    console.log(`✅ ${users.length} users seeded with IDs: ${userIds.join(', ')}`);

    // Seed pickup schedules
    console.log('Seeding pickup schedules...');
    const schedules = [
      { day_of_week: "Monday", time_slot: "08:00:00", is_active: true },
      { day_of_week: "Tuesday", time_slot: "08:00:00", is_active: true },
      { day_of_week: "Wednesday", time_slot: "08:00:00", is_active: true },
      { day_of_week: "Thursday", time_slot: "08:00:00", is_active: true },
      { day_of_week: "Friday", time_slot: "08:00:00", is_active: true },
      { day_of_week: "Saturday", time_slot: "10:00:00", is_active: true },
      { day_of_week: "Sunday", time_slot: "10:00:00", is_active: false }
    ];

    let scheduleIds = [];
    for (const schedule of schedules) {
      const [result] = await db.execute(
        'INSERT INTO PICKUP_SCHEDULES (day_of_week, time_slot, is_active) VALUES (?, ?, ?)',
        [schedule.day_of_week, schedule.time_slot, schedule.is_active]
      );
      scheduleIds.push(result.insertId);
    }
    console.log(`✅ ${schedules.length} pickup schedules seeded with IDs: ${scheduleIds.join(', ')}`);

    // Seed educational content (using author user ID - index 3)
    console.log('Seeding educational content...');
    const educationalContent = [
      {
        author_user_id: userIds[3], // Author user
        title: "Recycling Basics",
        topic: "Recycling",
        content_body: "Recycling is the process of converting waste materials into new materials and objects. It helps reduce the consumption of fresh raw materials, reduce energy usage, reduce air pollution and water pollution by reducing the need for conventional waste disposal. Start by sorting your waste into categories like paper, plastic, glass, and metal. Remember to rinse containers before recycling to avoid contamination.",
        created_at: "2023-10-01 10:00:00"
      },
      {
        author_user_id: userIds[3], // Author user
        title: "Composting at Home",
        topic: "Organic",
        content_body: "Composting is a natural process that turns organic waste into a valuable soil amendment. You can compost at home using kitchen scraps like vegetable peels, coffee grounds, and eggshells, along with yard waste such as leaves and grass clippings. Avoid adding meat, dairy, or oily foods to prevent attracting pests. Turn your compost pile regularly to aerate it and speed up decomposition.",
        created_at: "2023-10-02 10:00:00"
      },
      {
        author_user_id: userIds[3], // Author user
        title: "Reducing Waste",
        topic: "General",
        content_body: "Reducing waste starts with mindful consumption. Buy products with minimal packaging, choose reusable items over disposables, and repair instead of replacing. Plan meals to avoid food waste, and donate or repurpose items you no longer need. Small changes like using cloth bags for shopping and reusable water bottles can make a big impact on reducing landfill contributions.",
        created_at: "2023-10-03 10:00:00"
      }
    ];

    for (const content of educationalContent) {
      await db.execute(
        'INSERT INTO EDUCATIONAL_CONTENT (author_user_id, title, topic, content_body, created_at) VALUES (?, ?, ?, ?, ?)',
        [content.author_user_id, content.title, content.topic, content.content_body, content.created_at]
      );
    }
    console.log(`✅ ${educationalContent.length} educational content items seeded`);

    // Seed reports (using different user IDs for variety)
    console.log('Seeding reports...');
    const reports = [
      { reporter_user_id: userIds[0], report_type: "Illegal Dumping", location_address: "123 Main St", latitude: 40.7128, longitude: -74.0060, description: "Large pile of trash dumped illegally near the park.", report_date: "2023-10-01", status: "Pending", assigned_collector_id: userIds[2] },
      { reporter_user_id: userIds[0], report_type: "Missed Pickup", location_address: "456 Elm St", latitude: 40.7129, longitude: -74.0061, description: "Garbage was not collected on scheduled day.", report_date: "2023-09-28", status: "Resolved", assigned_collector_id: userIds[2] },
      { reporter_user_id: userIds[1], report_type: "Overflowing Bin", location_address: "789 Oak St", latitude: 40.7130, longitude: -74.0062, description: "Public bin is overflowing and needs immediate attention.", report_date: "2023-10-02", status: "In Progress", assigned_collector_id: userIds[2] },
      { reporter_user_id: userIds[1], report_type: "Other", location_address: "321 Pine St", latitude: 40.7131, longitude: -74.0063, description: "Broken recycling bin that needs repair.", report_date: "2023-10-03", status: "Pending", assigned_collector_id: null },
      { reporter_user_id: userIds[1], report_type: "Illegal Dumping", location_address: "654 Maple Ave", latitude: 40.7132, longitude: -74.0064, description: "Construction debris left on sidewalk.", report_date: "2023-09-30", status: "Resolved", assigned_collector_id: userIds[2] },
      { reporter_user_id: userIds[0], report_type: "Illegal Dumping", location_address: "100 Admin Blvd", latitude: 40.7133, longitude: -74.0065, description: "Hazardous waste improperly disposed of in residential area.", report_date: "2023-10-05", status: "In Progress", assigned_collector_id: userIds[2] },
      { reporter_user_id: userIds[0], report_type: "Missed Pickup", location_address: "200 Admin Plaza", latitude: 40.7134, longitude: -74.0066, description: "Commercial waste pickup missed for the third consecutive week.", report_date: "2023-10-04", status: "Resolved", assigned_collector_id: userIds[2] },
      { reporter_user_id: userIds[2], report_type: "Overflowing Bin", location_address: "300 Collector Way", latitude: 40.7135, longitude: -74.0067, description: "Multiple bins overflowing at the shopping center.", report_date: "2023-10-06", status: "Pending", assigned_collector_id: null },
      { reporter_user_id: userIds[2], report_type: "Other", location_address: "400 Collector Lane", latitude: 40.7136, longitude: -74.0068, description: "Damaged collection truck needs maintenance.", report_date: "2023-10-07", status: "Resolved", assigned_collector_id: userIds[2] },
      { reporter_user_id: userIds[3], report_type: "Illegal Dumping", location_address: "500 Author Street", latitude: 40.7137, longitude: -74.0069, description: "Electronic waste dumped in public park.", report_date: "2023-10-08", status: "In Progress", assigned_collector_id: userIds[2] },
      { reporter_user_id: userIds[3], report_type: "Missed Pickup", location_address: "600 Author Ave", latitude: 40.7138, longitude: -74.0070, description: "Recycling pickup missed at community center.", report_date: "2023-10-09", status: "Pending", assigned_collector_id: null },
      { reporter_user_id: userIds[1], report_type: "Illegal Dumping", location_address: "700 User Blvd", latitude: 40.7139, longitude: -74.0071, description: "Tires illegally dumped behind abandoned building.", report_date: "2023-10-10", status: "Resolved", assigned_collector_id: userIds[2] },
      { reporter_user_id: userIds[0], report_type: "Overflowing Bin", location_address: "800 Admin Circle", latitude: 40.7140, longitude: -74.0072, description: "City center bins overflowing during festival weekend.", report_date: "2023-10-11", status: "In Progress", assigned_collector_id: userIds[2] },
      { reporter_user_id: userIds[2], report_type: "Other", location_address: "900 Collector Square", latitude: 40.7141, longitude: -74.0073, description: "New collection route causing traffic congestion.", report_date: "2023-10-12", status: "Pending", assigned_collector_id: null },
      { reporter_user_id: userIds[3], report_type: "Illegal Dumping", location_address: "1000 Author Plaza", latitude: 40.7142, longitude: -74.0074, description: "Medical waste improperly disposed of in regular trash.", report_date: "2023-10-13", status: "Resolved", assigned_collector_id: userIds[2] }
    ];

    let reportIds = [];
    for (const report of reports) {
      const [result] = await db.execute(
        'INSERT INTO REPORTS (reporter_user_id, report_type, location_address, latitude, longitude, description, report_date, status, assigned_collector_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [report.reporter_user_id, report.report_type, report.location_address, report.latitude, report.longitude, report.description, report.report_date, report.status, report.assigned_collector_id]
      );
      reportIds.push(result.insertId);
    }
    console.log(`✅ ${reports.length} reports seeded with IDs: ${reportIds.join(', ')}`);

    // Seed report schedules (using the actual generated IDs)
    console.log('Seeding report schedules...');
    const reportSchedules = [
      { report_id: reportIds[0], schedule_id: scheduleIds[0] },
      { report_id: reportIds[1], schedule_id: scheduleIds[1] },
      { report_id: reportIds[2], schedule_id: scheduleIds[2] }
    ];

    for (const reportSchedule of reportSchedules) {
      await db.execute(
        'INSERT INTO REPORT_SCHEDULES (report_id, schedule_id) VALUES (?, ?)',
        [reportSchedule.report_id, reportSchedule.schedule_id]
      );
    }
    console.log(`✅ ${reportSchedules.length} report schedules seeded`);

    console.log('🎉 Database seeding completed successfully!');
    console.log('');
    console.log('Sample login credentials:');
    console.log(`Admin: user@user.com / password123`);
    console.log(`User: regular@user.com / password123`);
    console.log(`Collector: collector@user.com / password123`);
    console.log(`Author: author@user.com / password123`);

  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  }
}

// Run the seed function
if (require.main === module) {
  seedDatabase()
    .then(() => {
      console.log('Seeding process finished.');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Seeding process failed:', error);
      process.exit(1);
    });
}

module.exports = { seedDatabase };