# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

City Resolve is a full-stack civic engagement platform for reporting and tracking local issues. Citizens can report problems (roads, water, lighting, waste, parks), track their status, and earn points through gamification.

**Tech Stack:**
- **Frontend:** React 18 + TypeScript + Vite + Tailwind CSS + React Router
- **Backend:** Express.js + Node.js
- **Database:** MongoDB with Mongoose ODM
- **Auth:** JWT tokens with bcrypt password hashing
- **Maps:** Leaflet + React Leaflet
- **Image Upload:** Cloudinary
- **Validation:** Zod schemas

## Development Commands

**Full Stack Development:**
```bash
npm run dev              # Start both client (Vite) and server (Express) concurrently
npm run dev:client       # Start only the frontend (http://localhost:5173)
npm run dev:server       # Start only the backend (http://localhost:5000)
```

**Frontend:**
```bash
npm run build            # Build for production
npm run preview          # Preview production build
npm run lint             # Run ESLint
```

**Backend (run from server/ directory):**
```bash
npm run dev              # Start server with nodemon (auto-restart)
npm start                # Start server in production mode
npm run seed             # Seed database with sample data
```

## Architecture

### Frontend Structure

**Entry Points:**
- `src/main.tsx` - React app initialization with AuthProvider
- `src/App.tsx` - React Router configuration with protected routes

**Authentication Flow:**
- `src/auth/AuthContext.tsx` - Global auth state management (token in localStorage)
- `src/auth/RequireAuth.tsx` - Route protection component
- `src/lib/api.ts` - API client with automatic token injection

**Key Directories:**
- `src/pages/` - Route components (Dashboard, ReportIssue, OpenIssues, MapPage, Rewards, etc.)
- `src/components/domain/` - Domain-specific components (IssueCard, StatCard, BadgeShelf)
- `src/components/layout/` - Layout components (Navbar, Sidebar, NotificationDrawer)
- `src/components/ui/` - Reusable UI components (StatusBadge, etc.)

### Backend Structure

**Entry Point:**
- `server/src/index.js` - Express app bootstrap with middleware and route mounting

**Key Directories:**
- `server/src/routes/` - Express route handlers (auth, issues, uploads, notifications, dashboard, activity, rewards)
- `server/src/models/` - Mongoose schemas (User, Issue, Comment, Vote, Notification, ActivityEvent, PointsLedger)
- `server/src/middleware/` - Express middleware (auth, error handling)
- `server/src/services/` - Business logic (points system, Cloudinary integration)

**Database Models:**
- `User` - User accounts with points, level, badges, role (citizen/admin)
- `Issue` - Issue reports with GeoJSON location, status workflow, upvotes, comments
- `Comment` - Issue comments with author references
- `Vote` - User upvotes on issues (prevents duplicate voting)
- `Notification` - User notifications (resolved, info, badge, comment, upvote)
- `ActivityEvent` - Public activity feed (reported, resolved, upvoted, commented, badge)
- `PointsLedger` - Immutable point transactions with idempotency keys

### API Architecture

**Authentication:**
- JWT tokens stored in localStorage
- `Authorization: Bearer <token>` header for protected routes
- Token validation via `requireAuth` middleware
- Role-based access via `requireRole('admin')` middleware

**API Proxy:**
- Vite dev server proxies `/api` requests to `http://localhost:5000`
- Production requires CORS configuration

**Key API Endpoints:**
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `GET /api/issues` - List issues with filtering (q, category, status, severity, sort, page, pageSize)
- `POST /api/issues` - Create new issue
- `GET /api/issues/:id` - Get issue details
- `PATCH /api/issues/:id` - Admin-only issue status update
- `POST /api/issues/:id/upvote` - Toggle upvote
- `GET /api/issues/:id/comments` - List comments
- `POST /api/issues/:id/comments` - Create comment
- `GET /api/issues/map` - Get map markers with bbox filtering
- `POST /api/uploads/images` - Upload images to Cloudinary
- `GET /api/notifications` - List user notifications
- `PATCH /api/notifications/:id/read` - Mark notification as read
- `GET /api/dashboard/summary` - Dashboard KPIs and recent issues
- `GET /api/activity` - Public activity feed
- `GET /api/rewards/me` - Get user points/level/badges
- `GET /api/rewards/leaderboard` - Get leaderboard

### Points & Gamification System

**Point Awards (server/src/services/points.js):**
- Issue reported: 50 points
- Issue resolved: 100 points (awarded to reporter)
- Comment created: 10 points
- Upvote created: 2 points

**Leveling:**
- Level = floor(points / 100) + 1
- Level 1: 0-99 points
- Level 2: 100-199 points, etc.

**Badges:**
- `first_report` - 50+ points
- `community_builder` - 200+ points
- `city_champion` - 500+ points

**Idempotency:**
- All point transactions use unique idempotency keys
- Prevents duplicate point awards for same action
- Stored in PointsLedger with unique index

### Issue Status Workflow

**Status Values:**
- `pending` - New issue awaiting review
- `inprogress` - Issue being addressed
- `resolved` - Issue completed
- `rejected` - Issue declined

**Categories:**
- `road`, `water`, `light`, `waste`, `park`, `other`

**Severity Levels:**
- `low`, `medium`, `high`, `critical`

### Environment Configuration

**Required Environment Variables (server/.env):**
```
PORT=5000
CLIENT_ORIGIN=http://localhost:5173
MONGODB_URI=mongodb://127.0.0.1:27017/cityresolve
JWT_SECRET=<long_random_string>
JWT_EXPIRES_IN=7d
CLOUDINARY_CLOUD_NAME=<cloud_name>
CLOUDINARY_API_KEY=<api_key>
CLOUDINARY_API_SECRET=<api_secret>
```

**Configuration Loading:**
- `server/src/config.js` - Centralized config with validation
- `requireConfig()` throws on missing required vars

### Data Validation

**Backend:**
- Zod schemas for request validation
- Example: `createIssueSchema` validates issue creation input
- Returns 400 with error details on validation failure

**Frontend:**
- TypeScript types in `src/lib/api.ts` match API responses
- Form validation typically handled by UI components

### GeoJSON & Maps

**Location Storage:**
- GeoJSON Point format: `{ type: 'Point', coordinates: [lng, lat] }`
- MongoDB 2dsphere index for geospatial queries
- Bounding box filtering via `$geoWithin` with Polygon

**Map Integration:**
- Leaflet maps in `src/pages/MapPage.tsx`
- Markers fetched via `/api/issues/map?bbox=west,south,east,north`
- Status-based marker colors and icons

### Error Handling

**Backend:**
- `server/src/middleware/error.js` - Centralized error handler
- Returns JSON error responses with status codes
- Logs errors in development mode

**Frontend:**
- `ApiError` class in `src/lib/api.ts` for typed error handling
- Automatic token refresh on 401 responses (if implemented)

### File Upload

**Image Upload Flow:**
1. Frontend: `apiUploadImages(files)` sends FormData to `/api/uploads/images`
2. Backend: Multer middleware validates and stores in memory
3. Cloudinary: Images uploaded to `cityresolve/issues` folder
4. Response: Array of `{ url, width, height }` objects

**Constraints:**
- Max 4 images per upload
- Max 6MB per file
- Allowed types: JPEG, PNG, WebP

## Common Patterns

**Creating API Endpoints:**
1. Add route handler in `server/src/routes/`
2. Use `requireAuth` for protected routes
3. Use `requireRole('admin')` for admin-only routes
4. Validate input with Zod schemas
5. Return JSON responses with consistent structure

**Adding Frontend Pages:**
1. Create component in `src/pages/`
2. Add route in `src/App.tsx` (protected routes inside `<RequireAuth>`)
3. Use `useAuth()` hook for auth state
4. Use API functions from `src/lib/api.ts`

**Database Queries:**
- Use Mongoose models from `server/src/models/`
- Chain `.lean()` for performance when not using document methods
- Use `.populate()` for referenced documents
- Index frequently queried fields

**Point System Integration:**
- Call `awardPoints()` from route handlers after user actions
- Provide unique `idempotencyKey` to prevent duplicates
- Set `createNotification` and `createActivity` flags appropriately
- Points automatically update user level and badges

## Testing & Debugging

**Database Connection:**
- Ensure MongoDB is running on configured URI
- Check `server/src/db.js` for connection logic
- Use MongoDB Compass for visual inspection

**API Testing:**
- Use Postman or similar for endpoint testing
- Include `Authorization: Bearer <token>` header
- Check server logs for errors

**Frontend Debugging:**
- React DevTools for component inspection
- Network tab for API request/response inspection
- Console for error messages

## Deployment Notes

**Production Build:**
- Frontend: `npm run build` → static files in `dist/`
- Backend: `npm start` → serves API on configured port
- Configure CORS for production domain
- Set `NODE_ENV=production`

**Security Considerations:**
- Change `JWT_SECRET` in production
- Use HTTPS in production
- Configure Cloudinary upload presets
- Enable rate limiting (if needed)
- Set appropriate CORS origins