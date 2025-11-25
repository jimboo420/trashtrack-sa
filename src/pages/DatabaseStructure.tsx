import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Download, Copy } from "lucide-react";
import { showSuccess } from "@/utils/toast";

const DatabaseStructure = () => {
  const tables = [
    {
      name: "USERS",
      columns: [
        { name: "user_id", type: "INT", description: "Primary key, auto-increment", constraints: "PRIMARY KEY, AUTO_INCREMENT" },
        { name: "first_name", type: "VARCHAR(100)", description: "User's first name", constraints: "NOT NULL" },
        { name: "last_name", type: "VARCHAR(100)", description: "User's last name", constraints: "NOT NULL" },
        { name: "email", type: "VARCHAR(255)", description: "User's email address", constraints: "UNIQUE NOT NULL" },
        { name: "hashed_password", type: "VARCHAR(255)", description: "Hashed password for authentication", constraints: "NOT NULL" },
        { name: "user_role", type: "VARCHAR(50)", description: "User role (e.g., Reporter, Collector, Admin, Author)", constraints: "NOT NULL" },
        { name: "address_line1", type: "VARCHAR(255)", description: "First line of user's address", constraints: "NULL" },
        { name: "city", type: "VARCHAR(100)", description: "User's city", constraints: "NULL" },
      ],
    },
    {
      name: "PICKUP_SCHEDULES",
      columns: [
        { name: "schedule_id", type: "INT", description: "Primary key, auto-increment", constraints: "PRIMARY KEY, AUTO_INCREMENT" },
        { name: "day_of_week", type: "VARCHAR(20)", description: "Day of the week (e.g., Monday, Tuesday)", constraints: "NOT NULL" },
        { name: "time_slot", type: "TIME", description: "Time slot for pickup (e.g., 10:00:00)", constraints: "NOT NULL" },
        { name: "is_active", type: "BOOLEAN", description: "Whether the schedule slot is active", constraints: "DEFAULT TRUE NOT NULL" },
      ],
    },
    {
      name: "EDUCATIONAL_CONTENT",
      columns: [
        { name: "content_id", type: "INT", description: "Primary key, auto-increment", constraints: "PRIMARY KEY, AUTO_INCREMENT" },
        { name: "author_user_id", type: "INT", description: "ID of the user who authored the content", constraints: "NOT NULL, FOREIGN KEY REFERENCES USERS(user_id)" },
        { name: "title", type: "VARCHAR(255)", description: "Title of the educational content", constraints: "NOT NULL" },
        { name: "topic", type: "VARCHAR(100)", description: "Topic category of the content", constraints: "NOT NULL" },
        { name: "content_body", type: "TEXT", description: "Body text of the educational content", constraints: "NOT NULL" },
        { name: "created_at", type: "TIMESTAMP", description: "Timestamp when the content was created", constraints: "DEFAULT CURRENT_TIMESTAMP" },
      ],
    },
    {
      name: "REPORTS",
      columns: [
        { name: "report_id", type: "INT", description: "Primary key, auto-increment", constraints: "PRIMARY KEY, AUTO_INCREMENT" },
        { name: "reporter_user_id", type: "INT", description: "ID of the user who filed the report", constraints: "NOT NULL, FOREIGN KEY REFERENCES USERS(user_id)" },
        { name: "report_type", type: "VARCHAR(50)", description: "Type of report (e.g., Illegal Dumping, Recycle Request)", constraints: "NOT NULL" },
        { name: "location_address", type: "VARCHAR(255)", description: "Address of the reported location", constraints: "NOT NULL" },
        { name: "latitude", type: "DECIMAL(10, 8)", description: "Latitude coordinate of the location", constraints: "NULL" },
        { name: "longitude", type: "DECIMAL(10, 8)", description: "Longitude coordinate of the location", constraints: "NULL" },
        { name: "description", type: "TEXT", description: "Detailed description of the report", constraints: "NULL" },
        { name: "report_date", type: "DATE", description: "Date the report was submitted", constraints: "NOT NULL" },
        { name: "status", type: "VARCHAR(50)", description: "Status of the report (e.g., Pending, Scheduled, Complete)", constraints: "NOT NULL, DEFAULT 'Pending'" },
        { name: "assigned_collector_id", type: "INT", description: "ID of the collector assigned to the report", constraints: "NULL, FOREIGN KEY REFERENCES USERS(user_id)" },
      ],
    },
    {
      name: "REPORT_SCHEDULES",
      columns: [
        { name: "report_schedule_id", type: "INT", description: "Primary key, auto-increment", constraints: "PRIMARY KEY, AUTO_INCREMENT" },
        { name: "report_id", type: "INT", description: "ID of the associated report", constraints: "NOT NULL, FOREIGN KEY REFERENCES REPORTS(report_id) ON DELETE CASCADE" },
        { name: "schedule_id", type: "INT", description: "ID of the associated pickup schedule", constraints: "NOT NULL, FOREIGN KEY REFERENCES PICKUP_SCHEDULES(schedule_id) ON DELETE CASCADE" },
      ],
    },
  ];

  const relationships = [
    {
      from: "EDUCATIONAL_CONTENT.author_user_id",
      to: "USERS.user_id",
      type: "Many-to-One",
      description: "Each piece of educational content is authored by one user. A user can author multiple contents.",
    },
    {
      from: "REPORTS.reporter_user_id",
      to: "USERS.user_id",
      type: "Many-to-One",
      description: "Each report is filed by one reporter user. A user can file multiple reports.",
    },
    {
      from: "REPORTS.assigned_collector_id",
      to: "USERS.user_id",
      type: "Many-to-One",
      description: "Each report can be assigned to one collector user. A user can be assigned to multiple reports.",
    },
    {
      from: "REPORT_SCHEDULES.report_id",
      to: "REPORTS.report_id",
      type: "Many-to-One",
      description: "Each report schedule entry links one report. A report can have multiple schedule entries.",
    },
    {
      from: "REPORT_SCHEDULES.schedule_id",
      to: "PICKUP_SCHEDULES.schedule_id",
      type: "Many-to-One",
      description: "Each report schedule entry links one pickup schedule. A schedule can be linked to multiple report schedules.",
    },
  ];

  const indexes = [
    { table: "USERS", column: "user_role", type: "INDEX", reason: "Faster lookups on common user roles for filtering and queries." },
    { table: "PICKUP_SCHEDULES", column: "(day_of_week, time_slot)", type: "UNIQUE INDEX", reason: "Ensures each combination of day and time slot is unique." },
    { table: "EDUCATIONAL_CONTENT", column: "author_user_id", type: "INDEX", reason: "Optimize queries filtering content by author." },
    { table: "EDUCATIONAL_CONTENT", column: "topic", type: "INDEX", reason: "Faster filtering of content by topic." },
    { table: "REPORTS", column: "reporter_user_id", type: "INDEX", reason: "Optimize queries for reports by reporter." },
    { table: "REPORTS", column: "assigned_collector_id", type: "INDEX", reason: "Optimize queries for reports by assigned collector." },
    { table: "REPORTS", column: "status", type: "INDEX", reason: "Quick filtering of reports by status." },
    { table: "REPORTS", column: "report_date", type: "INDEX", reason: "Efficient date-based queries for reporting." },
    { table: "REPORT_SCHEDULES", column: "(report_id, schedule_id)", type: "UNIQUE INDEX", reason: "Prevents duplicate links between reports and schedules." },
  ];

  const sqlCode = `
CREATE TABLE USERS (
    user_id INT PRIMARY KEY AUTO_INCREMENT,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    hashed_password VARCHAR(255) NOT NULL,
    user_role VARCHAR(50) NOT NULL,
    address_line1 VARCHAR(255),
    city VARCHAR(100),
    INDEX idx_user_role (user_role)
);

CREATE TABLE PICKUP_SCHEDULES (
    schedule_id INT PRIMARY KEY AUTO_INCREMENT,
    day_of_week VARCHAR(20) NOT NULL,
    time_slot TIME NOT NULL,
    is_active BOOLEAN DEFAULT TRUE NOT NULL,
    UNIQUE (day_of_week, time_slot)
);

CREATE TABLE EDUCATIONAL_CONTENT (
    content_id INT PRIMARY KEY AUTO_INCREMENT,
    author_user_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    topic VARCHAR(100) NOT NULL,
    content_body TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (author_user_id) REFERENCES USERS(user_id)
);

CREATE TABLE REPORTS (
    report_id INT PRIMARY KEY AUTO_INCREMENT,
    reporter_user_id INT NOT NULL,
    report_type VARCHAR(50) NOT NULL,
    location_address VARCHAR(255) NOT NULL,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(10, 8),
    description TEXT,
    report_date DATE NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'Pending',
    assigned_collector_id INT,
    FOREIGN KEY (reporter_user_id) REFERENCES USERS(user_id),
    FOREIGN KEY (assigned_collector_id) REFERENCES USERS(user_id)
);

CREATE TABLE REPORT_SCHEDULES (
    report_schedule_id INT PRIMARY KEY AUTO_INCREMENT,
    report_id INT NOT NULL,
    schedule_id INT NOT NULL,
    FOREIGN KEY (report_id) REFERENCES REPORTS(report_id) ON DELETE CASCADE,
    FOREIGN KEY (schedule_id) REFERENCES PICKUP_SCHEDULES(schedule_id) ON DELETE CASCADE,
    UNIQUE (report_id, schedule_id)
);
`;

  const handleExportSQL = () => {
    const blob = new Blob([sqlCode], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'trashtrack_schema.sql';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showSuccess("SQL schema exported successfully!");
  };

  const handleCopySQL = () => {
    navigator.clipboard.writeText(sqlCode);
    showSuccess("SQL code copied to clipboard!");
  };

  return (
    <div className="min-h-screen bg-background p-4 pb-20">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-white">Database Structure & Design</h1>
        <p className="text-gray-300 mb-6">
          This page provides a comprehensive overview of the TrashTrack database design, including schema, relationships, indexes, normalization, and exportable SQL code. Note: This is a simulated structure based on the application's data model.
        </p>

        {/* Database Overview */}
        <Card className="mb-6 bg-black/20 backdrop-blur-lg border border-white/10">
          <CardHeader>
            <CardTitle className="text-white">Database Overview</CardTitle>
            <CardDescription className="text-gray-300">General information about the database design.</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="text-gray-300 space-y-2">
              <li><strong>Database Name:</strong> trashtrack_db</li>
              <li><strong>Engine:</strong> MySQL (or compatible SQL database)</li>
              <li><strong>Character Set:</strong> UTF-8</li>
              <li><strong>Normalization:</strong> Third Normal Form (3NF) to minimize redundancy and ensure data integrity.</li>
              <li><strong>Primary Purpose:</strong> Store user information, waste management reports, and scheduled pickups for a community waste tracking application.</li>
              <li><strong>Assumptions:</strong> Users are identified by email; reports and pickups are linked to users; data is primarily read-heavy with occasional writes.</li>
            </ul>
          </CardContent>
        </Card>

        {/* Database Diagram */}
        <Card className="mb-6 bg-black/20 backdrop-blur-lg border border-white/10">
          <CardHeader>
            <CardTitle className="text-white">Entity-Relationship Diagram</CardTitle>
            <CardDescription className="text-gray-300">Visual representation of the database schema and relationships.</CardDescription>
          </CardHeader>
          <CardContent>
            <img src="/erd.png" alt="Entity-Relationship Diagram" className="max-w-md h-auto rounded mx-auto" />
          </CardContent>
        </Card>

        {/* Merged Relations */}
        <Card className="mb-6 bg-black/20 backdrop-blur-lg border border-white/10">
          <CardHeader>
            <CardTitle className="text-white text-center text-2xl">Database Design Document</CardTitle>
            <CardTitle className="text-white text-center text-xl mt-2">MERGED RELATIONS</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2 text-white">Project Metadata</h3>
              <ul className="text-gray-300 space-y-1">
                <li><strong>Project Name:</strong> TrashTrack</li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-2 text-white">Main Content Section</h3>
              <h4 className="text-md font-medium mb-2 text-white">All Relations</h4>
              <div className="mb-4">
                <h5 className="font-medium text-white">All Tables</h5>
                <div className="bg-gray-800 p-4 rounded-md text-green-400 overflow-x-auto text-sm">
                  <pre>
{`USERS (user_id, first_name, last_name, email, hashed_password, user_role, address_line1, city)
PICKUP_SCHEDULES (schedule_id, day_of_week, time_slot, is_active)
EDUCATIONAL_CONTENT (content_id, author_user_id, title, topic, content_body, created_at)
REPORTS (report_id, reporter_user_id, report_type, location_address, latitude, longitude, description, report_date, status, assigned_collector_id)
REPORT_SCHEDULES (report_schedule_id, report_id, schedule_id)`}
                  </pre>
                </div>
              </div>
              <p className="text-gray-300 mb-4">This document illustrates the final, merged Relational Schema after a process of normalization, ensuring the database structure is efficient, logical, and free of redundant data.</p>

              <h4 className="text-md font-medium mb-2 text-white">Waste Management and Community Engagement System</h4>
              
              <div className="mb-4">
                <h5 className="font-medium text-white">D1: User, Operations, and Scheduling Database</h5>
                <p className="text-gray-300">This database focuses on user accounts, collector assignments, and defining available pickup times.</p>
                <div className="bg-gray-800 p-4 rounded-md text-green-400 overflow-x-auto text-sm">
                  <pre>
            {`USERS (user_id, first_name, last_name, email, hashed_password, user_role, address_line1, city)
            PICKUP_SCHEDULES (schedule_id, day_of_week, time_slot, is_active)
            REPORTS (report_id, reporter_user_id, report_type, location_address, latitude, longitude, description, report_date, status, assigned_collector_id)
            REPORT_SCHEDULES (report_schedule_id, report_id, schedule_id)`}
                  </pre>
                </div>
              </div>
            
              <div className="mb-4">
                <h5 className="font-medium text-white">D2: Community and Educational Content Database</h5>
                <p className="text-gray-300">This database focuses on content created by authorized users.</p>
                <div className="bg-gray-800 p-4 rounded-md text-green-400 overflow-x-auto text-sm">
                  <pre>
            {`USERS (user_id, first_name, last_name, email, hashed_password, user_role, address_line1, city)
            EDUCATIONAL_CONTENT (content_id, author_user_id, title, topic, content_body, created_at)`}
                  </pre>
                </div>
              </div>
            
              <div>
                <h5 className="font-medium text-white">Key Relationships</h5>
                <ul className="text-gray-300 space-y-2">
                  <li>The USERS table is the core shared entity.</li>
                  <li>REPORTS links to USERS in two ways: via reporter_user_id (the person making the report) and assigned_collector_id (the user assigned to handle the report).</li>
                  <li>EDUCATIONAL_CONTENT links to USERS via author_user_id.</li>
                  <li>REPORT_SCHEDULES is a many-to-many junction table that links REPORTS to PICKUP_SCHEDULES.</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* SQL Code */}
        <Card className="mb-6 bg-black/20 backdrop-blur-lg border border-white/10">
          <CardHeader>
            <CardTitle className="text-white">SQL Schema Code</CardTitle>
            <CardDescription className="text-gray-300">Exportable SQL code to create the database tables and indexes.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2 mb-4">
              <Button onClick={handleExportSQL} className="bg-black/20 backdrop-blur-lg border border-white/10 hover:bg-white/10 text-white">
                <Download className="h-4 w-4 mr-2" />
                Export SQL
              </Button>
              <Button onClick={handleCopySQL} variant="outline" className="bg-black/20 backdrop-blur-lg border border-white/10 hover:bg-white/10 text-white">
                <Copy className="h-4 w-4 mr-2" />
                Copy SQL
              </Button>
            </div>
            <pre className="bg-gray-800 p-4 rounded-md text-green-400 overflow-x-auto text-sm">
              {sqlCode}
            </pre>
          </CardContent>
        </Card>
        
        {tables.map((table, index) => (
          <Card key={index} className="mb-6 bg-black/20 backdrop-blur-lg border border-white/10">
            <CardHeader>
              <CardTitle className="text-white">Table: {table.name}</CardTitle>
              <CardDescription className="text-gray-300">Columns, data types, descriptions, and constraints for the {table.name} table.</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-white">Column Name</TableHead>
                    <TableHead className="text-white">Data Type</TableHead>
                    <TableHead className="text-white">Description</TableHead>
                    <TableHead className="text-white">Constraints</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {table.columns.map((column, colIndex) => (
                    <TableRow key={colIndex}>
                      <TableCell className="text-white">{column.name}</TableCell>
                      <TableCell className="text-white">{column.type}</TableCell>
                      <TableCell className="text-white">{column.description}</TableCell>
                      <TableCell className="text-white">{column.constraints}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        ))}

        <Card className="mb-6 bg-black/20 backdrop-blur-lg border border-white/10">
          <CardHeader>
            <CardTitle className="text-white">Table Relationships</CardTitle>
            <CardDescription className="text-gray-300">Foreign key relationships between tables.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-white">From</TableHead>
                  <TableHead className="text-white">To</TableHead>
                  <TableHead className="text-white">Relationship Type</TableHead>
                  <TableHead className="text-white">Description</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {relationships.map((rel, index) => (
                  <TableRow key={index}>
                    <TableCell className="text-white">{rel.from}</TableCell>
                    <TableCell className="text-white">{rel.to}</TableCell>
                    <TableCell className="text-white">{rel.type}</TableCell>
                    <TableCell className="text-white">{rel.description}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card className="mb-6 bg-black/20 backdrop-blur-lg border border-white/10">
          <CardHeader>
            <CardTitle className="text-white">Indexes</CardTitle>
            <CardDescription className="text-gray-300">Indexes defined for performance optimization.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-white">Table</TableHead>
                  <TableHead className="text-white">Column</TableHead>
                  <TableHead className="text-white">Index Type</TableHead>
                  <TableHead className="text-white">Reason</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {indexes.map((idx, index) => (
                  <TableRow key={index}>
                    <TableCell className="text-white">{idx.table}</TableCell>
                    <TableCell className="text-white">{idx.column}</TableCell>
                    <TableCell className="text-white">{idx.type}</TableCell>
                    <TableCell className="text-white">{idx.reason}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DatabaseStructure;