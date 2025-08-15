# Healthcare Portfolio Website

## Overview

This is a professional portfolio website for Rohit Shelhalkar, a healthcare technology leader with over 10 years of experience. The application is built as a full-stack web application featuring a React frontend with a Node.js/Express backend, designed to showcase professional experience, projects, and skills in the healthcare technology domain.

## Recent Changes (August 2025)

- Implemented comprehensive projects page with 5 detailed project case studies (latest to oldest sequence)
- Added functional navigation between home and projects pages with proper routing
- Fixed image serving for attached assets including professional photo
- Updated all content with correct career timeline (ended FoldHealth in Mar 2025, not present)
- Enhanced resume download with detailed professional summary and education
- Added Education section with Bachelor's and Master's degrees from Pune University
- Integrated JWT authentication functionality into FoldHealth project (not separate)
- Removed impact metrics as requested (cannot be directly calculated)
- Added contact form functionality explanation (messages stored in database)
- Updated LinkedIn URL to correct profile: www.linkedin.com/in/rohit-shelhalkar-728879137
- Projects now ordered chronologically from latest (2025) to oldest (2014)

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript for type safety and modern development
- **Styling**: Tailwind CSS with shadcn/ui component library for consistent, professional design
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: TanStack Query (React Query) for server state management and API caching
- **Form Handling**: React Hook Form with Zod validation for type-safe form validation
- **Animations**: Framer Motion for smooth animations and interactive elements
- **UI Components**: Comprehensive shadcn/ui component system with Radix UI primitives

### Backend Architecture
- **Framework**: Express.js with TypeScript for the REST API server
- **Database ORM**: Drizzle ORM with PostgreSQL dialect for type-safe database operations
- **Session Management**: Express sessions with PostgreSQL store for user session handling
- **API Design**: RESTful endpoints for contact form submissions and resume downloads
- **Middleware**: Custom logging middleware for API request tracking and debugging

### Data Storage
- **Primary Database**: PostgreSQL with Neon serverless hosting
- **Schema Design**: Two main entities - users and contacts tables
- **ORM**: Drizzle ORM for type-safe database queries and migrations
- **Validation**: Zod schemas for runtime type validation matching database schema

### Development Tools
- **Build System**: Vite for fast development and optimized production builds
- **Package Management**: npm with lockfile for dependency consistency
- **Development Server**: Vite dev server with HMR and Express API integration
- **Code Quality**: TypeScript for static type checking across the entire stack

### Deployment Architecture
- **Frontend Build**: Vite builds to static assets served by Express in production
- **Backend**: Express server bundled with esbuild for Node.js production deployment
- **Asset Serving**: Express serves both API routes and static frontend assets
- **Environment**: Replit-optimized with cartographer plugin for development

## External Dependencies

### Database Services
- **Neon Database**: Serverless PostgreSQL hosting for production database
- **Connection**: @neondatabase/serverless driver for database connectivity

### UI/UX Libraries
- **Radix UI**: Comprehensive set of accessible, unstyled UI primitives
- **Tailwind CSS**: Utility-first CSS framework for rapid styling
- **Framer Motion**: Animation library for smooth user interactions
- **Lucide React**: Modern icon library for consistent iconography

### Development Infrastructure
- **Replit Platform**: Cloud development environment with integrated deployment
- **Vite Plugins**: Runtime error overlay and cartographer for enhanced development experience
- **Build Tools**: esbuild for fast backend bundling, PostCSS for CSS processing

### Form and Validation
- **React Hook Form**: Performance-focused form library with minimal re-renders
- **Zod**: TypeScript-first schema validation for forms and API data
- **Hookform Resolvers**: Integration between React Hook Form and Zod validation

### Styling and Theming
- **Class Variance Authority**: Utility for creating consistent component variants
- **clsx/tailwind-merge**: Efficient className composition and conflict resolution
- **CSS Variables**: Theme system supporting light/dark modes and healthcare-specific color palette