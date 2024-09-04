EduMateK Learn
Project Duration: June 2024 - September 2024
Role: System Design, Analysis, Database Design, and Backend Development

Overview
EduMateK Learn is a comprehensive e-learning platform designed for freelancers, offering both admin and instructor interfaces. As a sole developer, I am responsible for system design, analysis, database design, and backend development. The platform features two main user roles: Super Admin and Instructors, each with specific functionalities.

Features
Super Admin Features
Dashboard: Provides an overview of all activities, including pending instructor requests, active instructors, and course statistics.
Instructor Management: Allows the Super Admin to add instructors directly or approve pending instructor requests. Instructors can submit applications and upload required documents for approval.
Admin Management: The Super Admin can add or manage Admins who have specific permissions to oversee various aspects of the platform.
Course Management: Super Admins can view and manage all courses, including the ability to deactivate instructors who have not paid their fees.
Notifications & Emails: Automated email notifications and FCM alerts are sent for various actions such as approval requests, course updates, and other critical events.
Instructor Features
Course Creation: Instructors can create and manage courses, including defining categories, subcategories, and sections. Courses can include lessons with attachments such as PDFs, images, and links.
Course Enrollment: Instructors can handle enrollment requests from students and manage their course content.
Lesson Management: Each lesson can include video content, supplementary links, PDFs, and images to enhance the learning experience.
Student Interaction: Instructors can communicate with students through the platform and manage their progress and feedback.
Technologies & Tools
Backend: Node.js, Express
Database: MongoDB, Mongoose
Authentication: JWT, Passport.js (for secure user authentication and authorization)
File Handling & Media Management: Multer (for file uploads), Cloudinary (for media storage)
Communication: Nodemailer (for email notifications), FCM (Firebase Cloud Messaging) (for real-time notifications)
Security: BcryptJS (for password hashing and management)
CORS: For handling cross-origin requests
Miscellaneous:
Database Design
The database is designed to support:

Categories: Main categories (e.g., Programming) with subcategories (e.g., C++).
Courses: Courses organized by categories and subcategories, each containing multiple sections and lessons.
Users: Includes roles such as Super Admin, Admin, and Instructors.
Requests: Management of instructor application requests, including document uploads and approval workflows.
Getting Started
Clone the Repository:

bash
Copy code
git clone https://github.com/your-repository-link.git
Install Dependencies:

bash
Copy code
cd your-project-directory
npm install
Configure Environment Variables: Create a .env file in the root directory and add your environment variables, including database connection strings, API keys, and secret tokens.

Run the Application:

bash
Copy code
npm start
Access the Application: Open your browser and navigate to http://localhost:3000.

Demo
Watch the Demo Video (Replace with actual demo link)

Source Code
View the Source Code on GitHub (Replace with actual GitHub link)


