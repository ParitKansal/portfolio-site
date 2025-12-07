# Parit Kansal Portfolio Website

## Overview

This is a personal portfolio website for Parit Kansal, a Machine Learning Scientist. The application showcases professional experience, skills, projects, certifications, education, and features two distinct content sections: a Knowledge Vault for daily learnings and a Blog for occasional long-form posts. The site is built with a modern tech stack featuring React on the frontend and Express on the backend, with PostgreSQL as the database.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework & Build System**
- React 18+ with TypeScript for type safety
- Vite as the build tool and development server with HMR (Hot Module Replacement)
- React Router (wouter) for client-side routing
- Single Page Application (SPA) architecture

**UI Component System**
- shadcn/ui component library with Radix UI primitives
- Tailwind CSS for styling with custom theme configuration
- Design system follows "New York" style variant
- Component aliases configured for clean imports (`@/components`, `@/lib`, etc.)

**State Management**
- TanStack React Query (v5) for server state management and data fetching
- Custom query client with specific caching and refetch strategies
- Context API for theme management (light/dark mode)

**Design Philosophy**
- Typography-first approach drawing inspiration from Linear, Notion, and GitHub
- Responsive design with mobile-first breakpoints
- Accessibility-focused with semantic HTML and ARIA labels
- Custom CSS variables for theme tokens (HSL color system)

### Backend Architecture

**Server Framework**
- Express.js with TypeScript running on Node.js
- HTTP server created with native Node `http` module
- Development mode uses Vite middleware for SSR-like dev experience
- Production mode serves static files from dist/public

**API Design**
- RESTful API endpoints under `/api` prefix
- Routes organized by resource (knowledge entries, blog posts)
- CRUD operations for Knowledge Vault and Blog content
- Search functionality for knowledge entries

**Request/Response Handling**
- Express JSON middleware with raw body preservation
- URL-encoded body parsing
- Custom logging middleware tracking request duration and status
- Error handling with appropriate HTTP status codes

**Build Process**
- esbuild for server bundling with selective dependency bundling
- Allowlist approach for critical dependencies to reduce cold start times
- Vite build for client-side assets
- Separate build outputs: server to `dist/index.cjs`, client to `dist/public`

### Data Layer

**ORM & Schema**
- Drizzle ORM for type-safe database queries
- PostgreSQL dialect configuration
- Schema defined in shared directory for frontend/backend type sharing
- Zod integration for runtime validation via drizzle-zod

**Database Schema**
Three main tables:
1. **users**: Basic authentication (id, username, password)
2. **knowledgeEntries**: Daily learning entries with title, content, tags array, and timestamp
3. **blogPosts**: Long-form articles with title, excerpt, content, tags, readTime, and timestamp

**Data Access Pattern**
- Storage interface abstraction (`IStorage`) implemented by `DatabaseStorage` class
- Methods for CRUD operations on each entity
- Search functionality using SQL `ilike` and `or` operators for knowledge entries
- Connection pooling via `pg.Pool`

**Database Configuration**
- Connection string from `DATABASE_URL` environment variable
- Migration files output to `./migrations` directory
- Schema location: `./shared/schema.ts`

### Content Management

**Knowledge Vault**
- Daily learning entries stored in database
- Tagging system for categorization
- Search capability across title and content
- Date-based organization

**Blog Posts**
- Longer-form technical articles
- Excerpt field for list previews
- Estimated read time tracking
- Tag-based categorization

**Seeding**
- Initial seed data for both knowledge entries and blog posts
- Development data showcasing ML/AI topics
- Seed script checks for existing data before inserting

## External Dependencies

### UI Component Libraries
- **Radix UI**: Comprehensive collection of unstyled, accessible UI primitives (accordion, dialog, dropdown-menu, popover, toast, etc.)
- **shadcn/ui**: Pre-built component patterns built on Radix UI
- **Tailwind CSS**: Utility-first CSS framework with custom configuration
- **Framer Motion**: Animation library for hero section effects
- **Lucide React**: Icon library for UI elements
- **React Icons**: Additional icon sets (specifically Simple Icons for brand logos)

### Data Fetching & State
- **TanStack React Query**: Server state management, caching, and data synchronization
- **wouter**: Lightweight client-side routing alternative to React Router

### Form Handling
- **React Hook Form**: Form state management
- **@hookform/resolvers**: Validation resolver integration
- **Zod**: Schema validation for forms and API payloads

### Backend Services
- **Express.js**: Web server framework
- **pg**: PostgreSQL client
- **Drizzle ORM**: Type-safe ORM with PostgreSQL support
- **connect-pg-simple**: PostgreSQL session store (though sessions not actively used in current implementation)

### Database
- **PostgreSQL**: Primary database via environment variable `DATABASE_URL`
- Tables: users, knowledge_entries, blog_posts
- UUID primary keys using `gen_random_uuid()`

### Development Tools
- **TypeScript**: Type safety across full stack
- **Vite**: Fast development server and build tool
- **esbuild**: Fast JavaScript bundler for server code
- **tsx**: TypeScript execution for dev server and build scripts
- **Replit plugins**: Development banner, cartographer, and error overlay for Replit environment

### Build & Deployment
- Production build creates optimized bundles
- Server dependencies selectively bundled (allowlist approach)
- Static asset serving from Express in production
- Environment-based configuration (NODE_ENV)