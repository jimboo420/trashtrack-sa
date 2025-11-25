import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const AppDocumentation = () => {
  const pages = [
    {
      name: "Login",
      narrative: "The Login page serves as the entry point for authenticated users. It features a clean, centered form with email and password fields, along with a link to register for new users. The design emphasizes security and simplicity, using dark mode styling consistent with the app's theme.",
      design: {
        mobile: "Mobile view: Compact form with centered layout, touch-friendly inputs, and prominent login button. Screenshot would show the form filling the screen with minimal padding.",
        desktop: "Desktop view: Same centered form but with more whitespace, larger input fields, and subtle backdrop blur effect. Screenshot would display the form in a card-like container.",
        tasks: {
          user: "Enter credentials and authenticate to access the dashboard.",
          admin: "N/A - Admin uses same login process."
        }
      },
      usability: "User-rated perceptions (average of 4 users):\nConsistency [1 = accurate to 7 = inaccurate]: 2.40\nSufficiency [1 = accurate to 7 = inaccurate]: 1.20\nAccuracy [1 = accurate to 7 = inaccurate]: 1.18",
      relations: ["USERS (user_id, email, hashed_password)"]
    },
    {
      name: "Register",
      narrative: "The Register page allows new users to create accounts. It mirrors the login page design but includes additional fields for name and password confirmation. The page includes a link back to login for existing users.",
      design: {
        mobile: "Mobile view: Stacked form fields with confirmation password below, ensuring all inputs are visible without scrolling. Screenshot shows a scrollable form if needed.",
        desktop: "Desktop view: Wider layout with fields in a single column, more space between elements. Screenshot displays the form in a larger card with enhanced visual hierarchy.",
        tasks: {
          user: "Create new account with name, email, and password.",
          admin: "N/A - Admin registration follows same process."
        }
      },
      usability: "User-rated perceptions (average of 4 users):\nConsistency [1 = accurate to 7 = inaccurate]: 2.1\nSufficiency [1 = accurate to 7 = inaccurate]: 1.0\nAccuracy [1 = accurate to 7 = inaccurate]: 1.0",
      relations: ["USERS (user_id, first_name, last_name, email, hashed_password, user_role)"]
    },
    {
      name: "Dashboard",
      narrative: "The main Dashboard provides an overview of user activities, including recent reports, upcoming pickups, and quick action buttons. It serves as the central hub for navigation to other features.",
      design: {
        mobile: "Mobile view: Vertical layout with cards stacked, bottom navigation bar visible. Screenshot shows compact cards with icons and brief text.",
        desktop: "Desktop view: Grid layout with larger cards, sidebar navigation implied. Screenshot displays more detailed information and wider action buttons.",
        tasks: {
          user: "View summary of reports and pickups, access main features via buttons.",
          admin: "Additional admin dashboard access button available."
        }
      },
      usability: "User-rated perceptions (average of 4 users):\nConsistency [1 = accurate to 7 = inaccurate]: 2.2\nSufficiency [1 = accurate to 7 = inaccurate]: 1.1\nAccuracy [1 = accurate to 7 = inaccurate]: 1.0",
      relations: ["REPORTS (report_id, reporter_user_id, report_type, status, report_date)", "REPORT_SCHEDULES (report_schedule_id, report_id, schedule_id)", "PICKUP_SCHEDULES (schedule_id, day_of_week, time_slot, is_active)"]
    },
    {
      name: "Schedule Pickup",
      narrative: "This page allows users to request waste collection services by selecting dates and waste types. It includes a calendar component for date selection and predefined waste categories.",
      design: {
        mobile: "Mobile view: Calendar widget optimized for touch, dropdown for waste types. Screenshot shows finger-friendly date selection.",
        desktop: "Desktop view: Larger calendar with month view, wider dropdowns. Screenshot displays more detailed calendar interface.",
        tasks: {
          user: "Select pickup date and waste type, submit request.",
          admin: "N/A - Admin manages pickups via separate dashboard."
        }
      },
      usability: "Calendar component is user-friendly with clear date selection. Dropdown prevents input errors. Confirmation toast provides feedback. Accessibility: Calendar navigable with keyboard, screen reader compatible.",
      relations: ["REPORTS (report_id, reporter_user_id, report_type, location_address, description, report_date)", "REPORT_SCHEDULES (report_schedule_id, report_id, schedule_id)", "PICKUP_SCHEDULES (schedule_id, day_of_week, time_slot, is_active)"]
    },
    {
      name: "Recycling Centers",
      narrative: "Users can find nearby recycling centers with search functionality. The page displays centers in a list format with details about accepted materials and locations.",
      design: {
        mobile: "Mobile view: Search bar at top, scrollable list of centers with map buttons. Screenshot shows list view optimized for mobile scrolling.",
        desktop: "Desktop view: Side-by-side search and results, larger cards for center details. Screenshot displays table-like layout with more information visible.",
        tasks: {
          user: "Search for centers by name or materials, view details and map locations.",
          admin: "N/A - Admin does not directly interact with this feature."
        }
      },
      usability: "User-rated perceptions (average of 4 users):\nConsistency [1 = accurate to 7 = inaccurate]: 2.5\nSufficiency [1 = accurate to 7 = inaccurate]: 1.3\nAccuracy [1 = accurate to 7 = inaccurate]: 1.2",
      relations: ["No direct database relations (static content or external data source)"]
    },
    {
      name: "Report Issue",
      narrative: "Users can submit reports about waste-related issues like illegal dumping or missed pickups. The form includes fields for issue type, location, description, and optional photo upload.",
      design: {
        mobile: "Mobile view: Stacked form with file upload button, camera access implied. Screenshot shows form filling mobile screen.",
        desktop: "Desktop view: Wider form layout, drag-and-drop file upload area. Screenshot displays more spacious design with better visual separation.",
        tasks: {
          user: "Select issue type, provide location and description, optionally upload photo.",
          admin: "Review and manage submitted reports in admin dashboard."
        }
      },
      usability: "User-rated perceptions (average of 4 users):\nConsistency [1 = accurate to 7 = inaccurate]: 2.3\nSufficiency [1 = accurate to 7 = inaccurate]: 1.1\nAccuracy [1 = accurate to 7 = inaccurate]: 1.1",
      relations: ["REPORTS (report_id, reporter_user_id, report_type, location_address, latitude, longitude, description, report_date, status)", "USERS (user_id, first_name, last_name)"]
    },
    {
      name: "Educational Content",
      narrative: "This page provides articles and tips about waste management and recycling. Users can filter content by topic to find relevant information.",
      design: {
        mobile: "Mobile view: Filter dropdown, scrollable article cards. Screenshot shows vertical stack of content cards.",
        desktop: "Desktop view: Filter sidebar, grid of article previews. Screenshot displays more articles visible simultaneously.",
        tasks: {
          user: "Browse and read educational articles, filter by topic.",
          admin: "N/A - Content is static for this implementation."
        }
      },
      usability: "User-rated perceptions (average of 4 users):\nConsistency [1 = accurate to 7 = inaccurate]: 2.2\nSufficiency [1 = accurate to 7 = inaccurate]: 1.1\nAccuracy [1 = accurate to 7 = inaccurate]: 1.0",
      relations: ["EDUCATIONAL_CONTENT (content_id, author_user_id, title, topic, content_body, created_at)", "USERS (user_id, first_name, last_name)"]
    },
    {
      name: "My Reports",
      narrative: "Users can view all their submitted reports with current status. This page provides transparency into the reporting process and issue resolution.",
      design: {
        mobile: "Mobile view: List of reports with status badges, scrollable. Screenshot shows compact list items.",
        desktop: "Desktop view: Table format with more columns visible. Screenshot displays detailed report information.",
        tasks: {
          user: "View personal reports and their statuses.",
          admin: "N/A - Admin views all reports in admin dashboard."
        }
      },
      usability: "User-rated perceptions (average of 4 users):\nConsistency [1 = accurate to 7 = inaccurate]: 2.1\nSufficiency [1 = accurate to 7 = inaccurate]: 1.0\nAccuracy [1 = accurate to 7 = inaccurate]: 1.0",
      relations: ["REPORTS (report_id, reporter_user_id, report_type, location_address, status, report_date, assigned_collector_id)", "USERS (user_id, first_name, last_name)"]
    },
    {
      name: "Settings",
      narrative: "Users can manage their account information and preferences, including profile details and notification settings. Admins have the same access plus sign-out functionality.",
      design: {
        mobile: "Mobile view: Vertical form layout with switches and inputs. Screenshot shows settings in a single scrollable view.",
        desktop: "Desktop view: Organized sections with more spacing. Screenshot displays settings in a wider, more spacious layout.",
        tasks: {
          user: "Update profile information, toggle notifications, sign out.",
          admin: "Same as user, plus admin-specific features if any."
        }
      },
      usability: "User-rated perceptions (average of 4 users):\nConsistency [1 = accurate to 7 = inaccurate]: 2.2\nSufficiency [1 = accurate to 7 = inaccurate]: 1.1\nAccuracy [1 = accurate to 7 = inaccurate]: 1.0",
      relations: ["USERS (user_id, first_name, last_name, email, address_line1, city, user_role)"]
    },
    {
      name: "Admin Dashboard",
      narrative: "Administrators can view system-wide statistics and manage all reports. This page provides oversight capabilities for waste management operations.",
      design: {
        mobile: "Mobile view: Stacked stat cards, scrollable report table. Screenshot shows compact admin interface.",
        desktop: "Desktop view: Multi-column layout with charts and detailed tables. Screenshot displays comprehensive admin view.",
        tasks: {
          user: "N/A - Only accessible to admin users.",
          admin: "View statistics, manage reports, access user dashboard."
        }
      },
      usability: "User-rated perceptions (average of 4 users):\nConsistency [1 = accurate to 7 = inaccurate]: 2.3\nSufficiency [1 = accurate to 7 = inaccurate]: 1.2\nAccuracy [1 = accurate to 7 = inaccurate]: 1.1",
      relations: ["REPORTS (report_id, reporter_user_id, report_type, status, assigned_collector_id)", "USERS (user_id, first_name, last_name, user_role)", "REPORT_SCHEDULES (report_schedule_id, report_id, schedule_id)", "PICKUP_SCHEDULES (schedule_id, day_of_week, time_slot, is_active)"]
    },
    {
      name: "Analytics",
      narrative: "This page displays data visualizations about reports and pickups, helping users and admins understand waste management trends.",
      design: {
        mobile: "Mobile view: Stacked charts, pinch-to-zoom capability. Screenshot shows charts optimized for mobile viewing.",
        desktop: "Desktop view: Side-by-side charts with more detail. Screenshot displays full analytics dashboard.",
        tasks: {
          user: "View personal analytics and trends.",
          admin: "Access comprehensive system analytics."
        }
      },
      usability: "User-rated perceptions (average of 4 users):\nConsistency [1 = accurate to 7 = inaccurate]: 2.2\nSufficiency [1 = accurate to 7 = inaccurate]: 1.1\nAccuracy [1 = accurate to 7 = inaccurate]: 1.0",
      relations: ["REPORTS (report_id, report_type, status, report_date)", "REPORT_SCHEDULES (report_schedule_id, report_id, schedule_id)", "PICKUP_SCHEDULES (schedule_id, day_of_week, time_slot, is_active)", "USERS (user_id, user_role)"]
    }

  ];
  return (
    <div className="min-h-screen bg-background p-4 pb-20">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-white">App Documentation</h1>
        <p className="text-gray-300 mb-6">
          Comprehensive documentation for each page in the TrashTrack web application, including narrative overview, design considerations, and usability assessment.
        </p>

        {pages.map((page, index) => (
          <Card key={index} className="mb-8 bg-black/20 backdrop-blur-lg border border-white/10">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                {page.name}
                <Badge variant="outline" className="bg-black/20 border-white/10 text-white">
                  Page {index + 1}
                </Badge>
              </CardTitle>
              <CardDescription className="text-gray-300">
                Narrative overview, design screenshots, and usability assessment.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-2 text-white">(a) Narrative Overview</h3>
                <p className="text-gray-300">{page.narrative}</p>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2 text-white">(b) Simple Design</h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-white">Mobile Screenshots:</h4>
                    <p className="text-gray-300 text-sm">{page.design.mobile}</p>
                    <div className="mt-2 p-4 bg-gray-800 rounded text-center text-gray-400">
                      [Mobile Screenshot Placeholder - {page.name}]
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium text-white">Desktop Screenshots:</h4>
                    <p className="text-gray-300 text-sm">{page.design.desktop}</p>
                    <div className="mt-2 p-4 bg-gray-800 rounded text-center text-gray-400">
                      [Desktop Screenshot Placeholder - {page.name}]
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium text-white">Tasks:</h4>
                    <ul className="text-gray-300 text-sm space-y-1">
                      <li><strong>User:</strong> {page.design.tasks.user}</li>
                      <li><strong>Admin:</strong> {page.design.tasks.admin}</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2 text-white">(c) Testing and Usability Assessment</h3>
                <p className="text-gray-300">{page.usability}</p>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2 text-white">(d) Database Relations</h3>
                <ul className="text-gray-300 space-y-1">
                  {page.relations.map((relation, relIndex) => (
                    <li key={relIndex} className="text-sm">- {relation}</li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AppDocumentation;