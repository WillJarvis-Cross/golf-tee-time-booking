# Golf Tee Time Booking System

A React + TypeScript application for managing golf tee time bookings with AWS Amplify backend.

## Setup Instructions

### Prerequisites
- Node.js 18+ and npm
- AWS CLI configured with appropriate permissions
- Git

### Getting Started

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd golf-tee-time-booking
   ```

2. **Install dependencies**
   ```bash
   cd frontend
   npm install
   ```

3. **Configure AWS Amplify**
   ```bash
   # Deploy the Amplify backend
   npx ampx sandbox
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

The app will be available at `http://localhost:5173`

### Project Structure

```
golf-tee-time-booking/
├── frontend/                 # React frontend application
│   ├── src/
│   │   ├── auth/            # Authentication components
│   │   ├── OrganizationPages/  # Organization management
│   │   ├── UserPages/       # User dashboard
│   │   └── App.tsx          # Main app component
│   ├── amplify/             # AWS Amplify backend configuration
│   └── package.json
└── README.md
```

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Features

- User authentication with AWS Cognito
- Organization management
- Tee time booking system
- Responsive Material-UI design
- Role-based access control (Admin/Member)