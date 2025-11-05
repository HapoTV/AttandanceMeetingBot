# AL LAB - Meeting & Attendance Bot Management Platform

![AL Lab](https://img.shields.io/badge/Hapo%20AI-Meeting%20Assistant-cyan)
![React](https://img.shields.io/badge/React-18.3.1-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.5.3-blue)
![Vite](https://img.shields.io/badge/Vite-5.4.2-purple)

## 📋 Overview

**Hapo AI Lab** is an AI-powered meeting assistant and workplace management platform that transforms meetings into actionable insights. The application combines meeting recording, transcription, action item extraction with comprehensive leave management, time tracking, and AI-powered workplace automation.

### Key Capabilities

- **Meeting Management**: Schedule, record, and manage virtual meetings with video/audio capabilities
- **AI-Powered Transcription**: Real-time speech-to-text conversion with speaker identification
- **Action Items Extraction**: Automatically extract and track action items from meeting discussions
- **Leave Management**: Natural language leave requests with automated approval workflows
- **Time Tracking**: Simple clock in/out system via chat messages
- **Calendar Integration**: Sync with Google Calendar and Outlook
- **Reminders & Notifications**: AI-powered reminders for breaks, follow-ups, and deadlines

---

## 🎯 Features

### 1. **Agenda Generation**
- Generate meeting agendas from simple prompts or imported materials
- Pre-structured templates for common meeting types
- Includes welcome, icebreakers, and action item reviews

### 2. **Meeting Recording & Transcription**
- Crystal-clear audio recording with noise reduction
- Real-time transcription with speaker labeling
- Full-text search across all meeting transcripts
- Studio-grade audio quality

### 3. **Video Conferencing**
- Multi-participant video calls
- Screen sharing capabilities
- In-meeting chat with file attachments
- Hand raise and reaction features
- Real-time participant status (video/audio on/off)

### 4. **Action Items Management**
- Automatic extraction of tasks from meeting discussions
- Assign tasks to team members with deadlines
- Track completion status
- Automated reminders for pending actions

### 5. **Time Tracking**
- Clock in/out via simple chat messages ("in", "out")
- Break and lunch time logging
- Automatic timesheet generation
- Manager oversight dashboard

### 6. **Leave Management**
- Natural language leave requests (e.g., "sick today", "on leave 25-28 Jan")
- Manager approval workflow
- Automatic calendar synchronization
- Leave balance tracking

### 7. **Calendar Integration**
- Google Calendar sync
- Outlook Calendar sync
- Real-time availability checking
- Automated meeting invites

### 8. **Notifications & Reminders**
- Break time reminders
- Lunch notifications
- Meeting follow-up prompts
- Action item deadline alerts

### 9. **Innovation Tracking**
- Capture new ideas during meetings
- Track emerging trends
- Identify opportunities for team growth

---

## 🏗️ Technology Stack

### Frontend
- **React** - UI framework
- **TypeScript** - Type-safe JavaScript
- **Vite** - Build tool and dev server
- **React Router DOM** - Client-side routing
- **TailwindCSS** - Utility-first CSS framework

### Backend Integration
- **Springboot**
- **Supabase** 

---

## 📁 Project Structure

```
AttandanceMeetingBot/
├── src/
│   ├── api/                    # API configuration
│   │   ├── axiosClient.ts      # Axios instance with auth interceptor
│   │   └── recordings.ts       # Recording-specific API calls
│   ├── assets/                 # Static assets
│   ├── components/             # Reusable UI components
│   │   ├── Header.tsx          # Public site header
│   │   ├── Hero.tsx            # Landing page hero section
│   │   ├── Features.tsx        # Feature showcase
│   │   ├── Integrations.tsx    # Integration showcase
│   │   ├── About.tsx           # About section
│   │   ├── FAQ.tsx             # Frequently asked questions
│   │   ├── CTA.tsx             # Call-to-action section
│   │   ├── Footer.tsx          # Site footer
│   │   ├── LiveDemo.tsx        # Interactive demo
│   │   ├── Navbar.tsx          # Admin navigation
│   │   ├── Sidebar.tsx         # Admin sidebar
│   │   └── ProtectedRoute.tsx  # Route protection wrapper
│   ├── context/                # React Context providers
│   │   └── AuthContext.tsx     # Authentication context
│   ├── layout/                 # Layout components
│   │   └── MainLayout.tsx      # Admin area layout
│   ├── pages/                  # Page components
│   │   ├── Dashboard.tsx       # Main dashboard
│   │   ├── Login.tsx           # Login page
│   │   ├── AuthPassword.tsx    # Password creation
│   │   ├── Meetings.tsx        # Meetings list
│   │   ├── MeetingCall.tsx     # Video call interface
│   │   ├── Recordings.tsx      # Recording management
│   │   ├── ActionItems.tsx     # Action items tracker
│   │   ├── Calendar.tsx        # Calendar view
│   │   ├── Notifications.tsx   # Notifications center
│   │   ├── Reminders.tsx       # Reminders list
│   │   ├── Participants.tsx    # Participant management
│   │   └── Chat.tsx            # Chat interface
│   ├── App.tsx                 # Root component with routing
│   ├── main.tsx                # Application entry point
│   └── index.css               # Global styles
├── public/                     # Public assets
├── index.html                  # HTML template
├── package.json                # Dependencies and scripts
├── vite.config.ts              # Vite configuration
├── tailwind.config.js          # Tailwind CSS configuration
├── tsconfig.json               # TypeScript configuration
└── README.md                   # This file
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v16 or higher)
- **npm** or **yarn** package manager
- **Backend API** running on `http://localhost:8080/api`

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd AttandanceMeetingBot
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   Create a `.env` file in the root directory:
   ```env
   VITE_API_BASE_URL=http://localhost:8080/api
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:5173` (or the port shown in terminal)

---

## 📜 Available Scripts

### Development
```bash
npm run dev
```
Starts the Vite development server with hot module replacement (HMR).

### Build
```bash
npm run build
```
Builds the application for production. Output is in the `dist/` directory.

## 🔐 Authentication

The application uses a custom authentication system with the following flow:

1. **Login** (`/login`) - Users enter credentials
2. **Password Creation** (`/create-password`) - First-time users set password
3. **Protected Routes** - All admin pages require authentication
4. **Token Storage** - JWT tokens stored in localStorage
5. **Auto-logout** - Expired tokens trigger automatic logout

### User Roles
- **Admin** - Full access to all features
- **Manager** - Team oversight, approvals, reports
- **Employee** - Personal dashboard, meetings, time tracking

---

## 🎨 UI/UX Features

### Public Marketing Site
- Modern, responsive design
- Feature showcase with interactive demos
- Integration highlights
- FAQ section
- Call-to-action sections

### Admin Dashboard
- Real-time clock display
- Upcoming meetings overview
- Notifications center
- Reminders widget
- Quick action buttons
- Statistics cards

### Meeting Interface
- Grid view for multiple participants
- Video/audio controls
- Screen sharing
- In-meeting chat
- File sharing
- Hand raise feature
- Emoji reactions
- Agenda sidebar

---

## 🔌 API Integration

The application connects to a backend API at `http://localhost:8080/api` with the following endpoints:

### Meetings
- `GET /meetings` - List all meetings
- `POST /meetings` - Create new meeting
- `GET /meetings/:id` - Get meeting details
- `PUT /meetings/:id` - Update meeting
- `DELETE /meetings/:id` - Delete meeting

### Recordings
- `GET /recordings` - List all recordings
- `POST /recordings` - Upload recording
- `GET /recordings/:id` - Get recording details

### Users
- `GET /users` - List all users
- `POST /users` - Create user
- `GET /users/:id` - Get user details

### Notifications
- `GET /notifications` - List notifications
- `POST /notifications` - Create notification
- `PUT /notifications/:id` - Mark as read

### Reminders
- `GET /reminders` - List reminders
- `POST /reminders` - Create reminder
- `PUT /reminders/:id` - Update reminder

### Action Items
- `GET /action-items` - List action items
- `POST /action-items` - Create action item
- `PUT /action-items/:id` - Update status

---

## 🎯 Key Use Cases

### 1. **Daily Standup Meetings**
- Generate agenda automatically
- Record meeting with transcription
- Extract action items
- Send reminders to team members

### 2. **Leave Request**
- Employee sends "on leave tomorrow"
- Manager receives notification
- Approval/rejection workflow
- Calendar automatically updates

### 3. **Time Tracking**
- Employee messages "in" at start of day
- System logs clock-in time
- Break reminders sent automatically
- Timesheet generated at end of week

### 4. **Project Planning**
- Schedule meeting with stakeholders
- Share agenda beforehand
- Record discussion and decisions
- Extract and assign action items
- Track progress until completion

---

## 🔧 Configuration

### Vite Configuration
The `vite.config.ts` file includes:
- React plugin for JSX/TSX support
- Optimization settings for lucide-react

### Tailwind Configuration
Custom Tailwind setup in `tailwind.config.js` for:
- Custom color schemes
- Responsive breakpoints
- Custom utilities

### TypeScript Configuration
Strict TypeScript settings for:
- Type safety
- Modern ES features
- Path aliases

---

## 🌐 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

---

## 📊 Performance Optimizations

- **Code Splitting** - Lazy loading of routes
- **Tree Shaking** - Unused code elimination
- **Asset Optimization** - Compressed images and fonts
- **Caching** - Service worker for offline support
- **React Query** - Efficient data fetching and caching

---

## 🔒 Security Features

- **JWT Authentication** - Secure token-based auth
- **Protected Routes** - Route-level access control
- **HTTPS Only** - Secure communication (production)
- **Input Validation** - Client-side validation
- **XSS Protection** - Sanitized user inputs

---

## 🐛 Troubleshooting

### Common Issues

**Issue**: Development server won't start
```bash
# Solution: Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

**Issue**: API connection errors
```bash
# Solution: Verify backend is running on port 8080
# Check .env file for correct API URL
```

**Issue**: Build fails
```bash
# Solution: Check TypeScript errors
npm run lint
# Fix any reported issues
```

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 License

This project is proprietary software owned by **Hapo TV**.

---

## 👥 Team

Developed by the Hapo Projects team.

---

## 📞 Support

For support and questions:
- **Email**: support@hapo.tv
---

## 🗺️ Roadmap

### Upcoming Features
- [ ] Mobile app (React Native)
- [ ] AI-powered meeting summaries
- [ ] Advanced analytics dashboard
- [ ] Slack/Teams integration
- [ ] Multi-language support
- [ ] Voice commands
- [ ] Meeting templates library
- [ ] Export to PDF/Word
- [ ] Advanced reporting

---

## 📚 Additional Resources

- [React Documentation](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Vite Guide](https://vitejs.dev/guide/)
- [TailwindCSS Docs](https://tailwindcss.com/docs)
- [Supabase Documentation](https://supabase.com/docs)

---

**Built with ❤️ by the Hapo Projects Team**
