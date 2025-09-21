# Hospital BNS Mobile App

A React Native mobile application for the Hospital Bed Notification System (BNS), built with Expo and React Navigation.

## Features

- 🔐 **Authentication**: Login, Register, OTP verification, Password reset
- 🛏️ **Bed Management**: View and manage hospital beds across departments
- 🔔 **Notifications**: Real-time notifications for bed assignments
- 👤 **User Profiles**: Manage user information and assignments
- 👨‍💼 **Admin Panel**: Administrative controls for system management
- 📱 **Mobile-First**: Optimized for mobile devices with native navigation

## Tech Stack

- **Frontend**: React Native with Expo
- **Navigation**: React Navigation (Stack & Bottom Tabs)
- **State Management**: React Context API
- **HTTP Client**: Axios
- **Storage**: Expo SecureStore & AsyncStorage
- **Notifications**: Expo Notifications
- **Icons**: Expo Vector Icons
- **Backend**: Node.js + Express + MongoDB (existing)

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd MobileBNS
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

4. **Run on device/simulator**
   - iOS: `npm run ios`
   - Android: `npm run android`
   - Web: `npm run web`

## Project Structure

```
MobileBNS/
├── src/
│   ├── context/           # React Context providers
│   ├── navigation/        # Navigation configuration
│   ├── screens/          # Screen components
│   │   ├── auth/         # Authentication screens
│   │   └── main/         # Main app screens
│   └── services/         # API service functions
├── App.js                # Main app component
└── package.json          # Dependencies and scripts
```

## Key Features

### Authentication Flow
- User registration with role selection
- Email OTP verification
- Secure login with JWT tokens
- Password reset functionality
- Payment integration for subscriptions

### Main App Features
- **Dashboard**: Overview of user assignments and quick actions
- **Bed Management**: Browse departments, wards, and beds
- **Notifications**: View admission/discharge notifications
- **Assignments**: Create and manage bed assignments
- **Profile**: User information and subscription details
- **Admin Panel**: System administration (admin users only)

### Navigation Structure
- **Auth Navigator**: Handles authentication flow
- **Main Navigator**: Bottom tab navigation for authenticated users
- **Stack Navigators**: Nested navigation within each tab

## Backend Integration

The app connects to the existing Node.js/Express/MongoDB backend:
- Base URL: `https://bns-ao5j.vercel.app/api`
- Authentication: JWT tokens stored in Expo SecureStore
- API services for all CRUD operations

## Development

### Adding New Screens
1. Create screen component in appropriate directory
2. Add to navigation configuration
3. Update context providers if needed

### State Management
- Uses React Context API for global state
- Separate contexts for Auth, Beds, Assignments, and Admin
- Automatic token management and API integration

### Styling
- Uses React Native StyleSheet
- Consistent color scheme and typography
- Responsive design for different screen sizes

## Building for Production

### iOS
```bash
expo build:ios
```

### Android
```bash
expo build:android
```

## Environment Configuration

The app uses the existing backend API. No additional environment configuration needed for development.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test on both iOS and Android
5. Submit a pull request

## License

MIT License - see LICENSE file for details