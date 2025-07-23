# Pattern & Logic Challenge Game

## Overview

This is a full-stack educational game application built with a React frontend and Express backend. The game consists of three progressively challenging levels: number pattern recognition, logic puzzle solving, and statistical outlier detection. It's designed to test and improve players' analytical and pattern recognition skills.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter for client-side routing
- **Styling**: Tailwind CSS with shadcn/ui component library
- **State Management**: TanStack Query for server state, React hooks for local state
- **Build Tool**: Vite with custom configuration for development and production

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **Runtime**: Node.js with ES modules
- **Storage**: In-memory storage with interface for future database integration
- **API Design**: RESTful endpoints for game session management

### Key Components

#### Game Logic Components
1. **Level1**: Number sequence pattern recognition with multiple choice answers
2. **Level2**: Logic puzzle solving with shape/color/count constraints
3. **Level3**: Interactive data visualization for outlier detection
4. **ProgressIndicator**: Visual progress tracking across all levels
5. **GameCompletion**: End game celebration and replay functionality

#### Data Models
- **GameSession**: Tracks player progress, current level, completion status
- **Question**: Defines number pattern questions with difficulty levels
- **Level2Solution**: Schema for logic puzzle answers

#### API Endpoints
- `GET /api/game/:sessionId` - Retrieve or create game session
- `PATCH /api/game/:sessionId` - Update game session progress
- `POST /api/game/:sessionId/validate-level2` - Validate logic puzzle solution

## Data Flow

1. **Session Management**: Each player gets a unique session ID generated client-side
2. **Progress Tracking**: Game state persisted on server, synchronized with client via TanStack Query
3. **Level Progression**: Sequential unlocking of levels based on completion status
4. **Real-time Updates**: Optimistic updates with server synchronization for responsive UX

## External Dependencies

### Core Framework Dependencies
- **React Ecosystem**: React 18, React DOM, React Query for state management
- **UI Components**: Radix UI primitives with shadcn/ui styling system
- **Styling**: Tailwind CSS with PostCSS processing
- **Development**: Vite with React plugin, TypeScript compilation

### Database Integration (Configured but Not Active)
- **ORM**: Drizzle ORM with PostgreSQL dialect
- **Database**: Neon Database serverless PostgreSQL (connection configured)
- **Migrations**: Drizzle Kit for schema management

### Utility Libraries
- **Validation**: Zod for runtime type checking and schema validation
- **Date Handling**: date-fns for date manipulation
- **Styling Utilities**: clsx and class-variance-authority for conditional styling
- **Icons**: Lucide React for consistent iconography

## Deployment Strategy

### Development Environment
- **Hot Reload**: Vite development server with HMR
- **TypeScript**: Strict type checking with path mapping
- **Replit Integration**: Custom plugins for Replit development environment

### Production Build
- **Frontend**: Vite builds optimized React bundle to `dist/public`
- **Backend**: ESBuild compiles TypeScript server to `dist/index.js`
- **Static Serving**: Express serves built frontend assets in production

### Environment Configuration
- **Development**: Uses tsx for TypeScript execution with hot reload
- **Production**: Compiled JavaScript with NODE_ENV=production
- **Database**: Environment variable for DATABASE_URL (currently unused but configured)

### Storage Strategy
- **Current**: In-memory storage for game sessions (development/demo)
- **Future**: Database integration ready via Drizzle ORM configuration
- **Scalability**: Storage interface allows easy swap to persistent database