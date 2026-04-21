# Healthcare Management System - Frontend

## Installation

```bash
npm install
```

## Development

```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## Build for Production

```bash
npm run build
```

## Preview Production Build

```bash
npm run preview
```

## Features

### Authentication

- Login page with form validation
- Registration page with role selection
- Protected routes based on user role
- Automatic token management
- Session persistence

### Admin Dashboard

- System statistics overview
- User management
- Appointment monitoring
- Revenue tracking

### Doctor Dashboard

- Appointment management
- Patient list
- Medical record creation
- Status updates (confirm/complete/cancel)

### Patient Dashboard

- Doctor browsing and filtering
- Appointment booking
- Appointment history
- Medical records access
- Payment history

## Project Structure

```
src/
├── components/
│   ├── Navbar.jsx          # Top navigation bar
│   ├── Sidebar.jsx         # Role-based sidebar navigation
│   ├── StatCard.jsx        # Dashboard statistics card
│   └── ProtectedRoute.jsx  # Route protection wrapper
├── context/
│   └── AuthContext.jsx     # Authentication state management
├── pages/
│   ├── Login.jsx
│   ├── Register.jsx
│   ├── admin/
│   │   ├── AdminDashboard.jsx
│   │   └── UserManagement.jsx
│   ├── doctor/
│   │   ├── DoctorDashboard.jsx
│   │   └── Appointments.jsx
│   └── patient/
│       ├── PatientDashboard.jsx
│       ├── BookAppointment.jsx
│       └── MyAppointments.jsx
├── utils/
│   └── api.js              # Axios configuration
├── App.jsx                 # Main app component with routing
├── main.jsx               # Application entry point
└── index.css              # Global styles and Tailwind
```

## Styling

The application uses Tailwind CSS with a custom design system:

### Color Palette

- Primary: `#2563EB` (Blue)
- Secondary: `#0F172A` (Dark Navy)
- Accent: `#22C55E` (Green)
- Danger: `#EF4444` (Red)
- Background: `#F8FAFC` (Light Gray)

### Custom Classes

- `.btn-primary` - Primary button style
- `.btn-secondary` - Secondary button style
- `.card` - Card container
- `.input-field` - Form input style
- `.badge` - Status badge
- `.badge-pending` - Yellow badge
- `.badge-confirmed` - Blue badge
- `.badge-completed` - Green badge
- `.badge-cancelled` - Red badge

## API Integration

The frontend communicates with the backend API through Axios. The base configuration is in `src/utils/api.js`.

### API Base URL

Development: `http://localhost:5000/api` (proxied through Vite)

### Authentication

JWT tokens are stored in localStorage and automatically attached to requests via Axios interceptors.

## Environment Variables

Create a `.env` file if needed:

```env
VITE_API_URL=http://localhost:5000
```

## Routing

The application uses React Router v6 with role-based access control:

- `/login` - Login page
- `/register` - Registration page
- `/admin/*` - Admin routes (admin only)
- `/doctor/*` - Doctor routes (doctor only)
- `/patient/*` - Patient routes (patient only)

## State Management

- **AuthContext** - Global authentication state
- **Local State** - Component-level state with useState
- **API State** - Data fetching and caching

## Icons

The application uses Lucide React for icons. Common icons:

- Home, Users, Calendar, FileText, CreditCard
- Settings, LogOut, Bell, User
- Check, X, Trash2, ToggleLeft, ToggleRight

## Notifications

Toast notifications are implemented using `react-hot-toast`:

- Success messages (green)
- Error messages (red)
- Info messages (blue)

## Responsive Design

The application is fully responsive with breakpoints:

- Mobile: < 768px
- Tablet: 768px - 1024px
- Desktop: > 1024px

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
