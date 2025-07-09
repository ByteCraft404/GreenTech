# GreenTechHaven - Smart Greenhouse Automation System

A comprehensive IoT smart greenhouse automation system with real-time monitoring, device control, and multi-farm management capabilities.

## 🌱 Features

### Web Dashboard (React + TypeScript)
- **Multi-Farm Management**: Select from multiple farms and greenhouses across Kenya
- **Real-Time Monitoring**: Live sensor data with 15-second refresh intervals
- **Device Control**: Remote control of fans, pumps, and grow lights
- **Historical Data**: Interactive charts showing sensor trends over time
- **Dark Theme**: Professional dark interface with glowing neon accents
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile
- **Graceful Fallbacks**: Handles offline scenarios with appropriate placeholders

### Android Application (Java + XML)
- **Native Android Experience**: Material Design components with dark theme
- **Real-Time Data**: Live sensor readings and device status updates
- **Device Control**: Touch-friendly controls for all greenhouse devices
- **Multi-Farm Support**: Farm and greenhouse selection with visual cards
- **Offline Handling**: Graceful degradation when backend is unavailable
- **Modern UI**: Following Android design guidelines with custom theming

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm/yarn
- Android Studio (for Android development)
- Modern web browser with ES6+ support

### Web Dashboard Setup

1. **Clone and Install**:
   ```bash
   git clone <repository-url>
   cd greentechhaven
   npm install
   ```

2. **Environment Configuration**:
   Create `.env` file with:
   ```
   VITE_BACKEND_URL=https://smartfarm-ua4d.onrender.com
   ```

3. **Start Development Server**:
   ```bash
   npm run dev
   ```

4. **Build for Production**:
   ```bash
   npm run build
   ```

### Android Application Setup

1. **Open in Android Studio**:
   - Open the `android-assets` folder in Android Studio
   - Wait for Gradle sync to complete

2. **Build Configuration**:
   - Ensure minimum SDK version is 21 (Android 5.0)
   - Target SDK version is 34 (Android 14)

3. **Run the Application**:
   - Connect an Android device or start an emulator
   - Click "Run" in Android Studio

## 📱 Application Structure

### Web Dashboard Routes
- `/` - Farm and greenhouse selection (landing page)
- `/dashboard` - Main dashboard with live data
- `/control` - Device control panel
- `/history` - Historical sensor data and charts
- `/alerts` - System alerts and notifications (placeholder)
- `/thresholds` - Sensor threshold configuration (placeholder)
- `/diagnostics` - System diagnostics (placeholder)
- `/about` - System information (placeholder)
- `/profile` - User profile management (placeholder)
- `/settings` - Application settings (placeholder)

### Android Application Flow
1. **Farm Selection**: Choose from available farms
2. **Greenhouse Selection**: Select specific greenhouse within farm
3. **Dashboard**: Monitor live sensor data and control devices
4. **Auto-Refresh**: Data updates every 15 seconds automatically

## 🔧 API Integration

### Backend Endpoints
The application integrates with a Spring Boot backend at `https://smartfarm-ua4d.onrender.com`:

- `GET /api/sensors/latest` - Latest sensor readings
- `GET /api/sensors/all` - Historical sensor data
- `POST /api/actuators/control` - Control devices
- `GET /api/actuators/status` - Device status
- `POST /api/sensors/submit` - Submit sensor data

### Data Flow
1. **Sensor Data**: Fetched every 15 seconds from backend
2. **Device Control**: Real-time commands sent to backend
3. **Status Updates**: Device status confirmed after control actions
4. **Graceful Fallbacks**: UI remains functional when backend is unavailable

## 🏭 Multi-Farm Configuration

### Current Setup (Client-Side)
The application currently uses client-side mock data for farm/greenhouse selection:

**Available Farms**:
- Kiambu Green Valley (Kiambu County) - 3 greenhouses
- Eldoret Agri-Hub (Uasin Gishu County) - 2 greenhouses
- Nakuru Valley Farms (Nakuru County) - 4 greenhouses
- Meru Highlands Estate (Meru County) - 2 greenhouses
- Kisumu Organic Farms (Kisumu County) - 1 greenhouse
- Nyeri Tech Gardens (Nyeri County) - 3 greenhouses

### Future Backend Integration
See `API_README.md` for detailed instructions on extending the backend to support multi-farm functionality.

## 🎨 Design System

### Color Palette
- **Primary**: Green (#10B981) - Success, active states
- **Secondary**: Blue (#3B82F6) - Information, sensors
- **Accent**: Orange (#F97316) - Warnings, highlights
- **Background**: Dark charcoal (#111827) - Main background
- **Surface**: Dark gray (#1F2937) - Cards, panels
- **Text**: White (#FFFFFF) - Primary text
- **Muted**: Gray (#9CA3AF) - Secondary text

### Typography
- **Headings**: Bold, high contrast
- **Body**: Regular weight, optimal line spacing
- **Monospace**: Used for data values and timestamps
- **Responsive**: Scales appropriately across devices

## 🔐 Authentication (Dormant)

### Current Status
- Login and signup pages exist but are dormant
- Accessible only via direct URLs (`/login`, `/signup`)
- No authentication logic implemented

### Activation Instructions
See `API_README.md` for detailed steps to activate authentication system.

## 📊 Monitoring Features

### Sensor Types
- **Temperature**: Celsius readings with trend analysis
- **Humidity**: Percentage readings with optimal range indicators
- **Light Intensity**: Lux measurements for photosynthesis optimization
- **Soil Moisture**: Percentage readings for irrigation management

### Device Controls
- **Ventilation Fan**: On/off control with status feedback
- **Water Pump**: Automated irrigation control
- **Grow Light**: Supplemental lighting control

### Data Visualization
- **Real-time Charts**: Live updating line charts
- **Historical Trends**: Time-series data analysis
- **Status Indicators**: Visual health monitoring
- **Alert System**: Threshold-based notifications (placeholder)

## 🛠️ Development

### Web Technologies
- **React 18**: Modern React with hooks
- **TypeScript**: Type safety and better developer experience
- **Tailwind CSS**: Utility-first CSS framework
- **Framer Motion**: Smooth animations and transitions
- **React Router**: Client-side routing
- **Recharts**: Interactive data visualization
- **Vite**: Fast build tool and development server

### Android Technologies
- **Java**: Primary programming language
- **XML**: Layout definitions
- **Material Design**: UI components and theming
- **Retrofit**: HTTP client for API calls
- **RecyclerView**: Efficient list rendering
- **Fragment Navigation**: Modern Android navigation

### Code Quality
- **ESLint**: JavaScript/TypeScript linting
- **Prettier**: Code formatting
- **TypeScript**: Static type checking
- **Responsive Design**: Mobile-first approach
- **Error Boundaries**: Graceful error handling

## 🚀 Deployment

### Web Dashboard
- Build with `npm run build`
- Deploy to any static hosting service (Vercel, Netlify, etc.)
- Configure environment variables for production

### Android Application
- Generate APK from Android Studio
- Sign with release keystore for production
- Upload to Google Play Store or distribute directly

## 📈 Performance

### Optimizations
- **Code Splitting**: Lazy loading of routes
- **Image Optimization**: Responsive images and proper formats
- **Caching**: API response caching where appropriate
- **Bundling**: Optimized build output
- **Network**: Request timeout and retry logic

### Monitoring
- **Error Tracking**: Console error logging
- **Performance Metrics**: Load time monitoring
- **API Health**: Backend connectivity status
- **User Analytics**: Usage patterns and behavior

## 🤝 Contributing

### Development Workflow
1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

### Code Standards
- Follow TypeScript best practices
- Use meaningful variable and function names
- Add comments for complex logic
- Maintain consistent code formatting
- Write unit tests for new features

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For questions and support:
1. Check the `API_README.md` for API integration issues
2. Review console logs for error messages
3. Verify network connectivity and backend availability
4. Check environment variable configuration

---

**Built with Tiffany, ByteCraft404 and  the GreenTechHaven Team**

*Empowering sustainable agriculture through IoT innovation*