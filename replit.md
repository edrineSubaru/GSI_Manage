# Overview

GSI Management System is a comprehensive business management application built with a modern full-stack architecture. The system provides enterprise-level functionality for managing employees, projects, tasks, finances, payroll, proposals, and performance monitoring. It features a React-based frontend with shadcn/ui components and an Express.js backend with PostgreSQL database integration using Drizzle ORM.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Framework**: React 18 with TypeScript and Vite for build tooling
- **UI Framework**: shadcn/ui component library built on Radix UI primitives
- **Styling**: Tailwind CSS with custom design system and CSS variables for theming
- **State Management**: TanStack Query (React Query) for server state management
- **Routing**: Wouter for client-side routing with protected route patterns
- **Form Handling**: React Hook Form with Zod validation schemas

## Backend Architecture
- **Framework**: Express.js with TypeScript in ESM module format
- **Database ORM**: Drizzle ORM with PostgreSQL dialect
- **API Design**: RESTful API with CRUD operations for all entities
- **Authentication**: Session-based authentication with mock JWT tokens
- **Middleware**: Custom logging middleware for API request tracking
- **Development**: Hot reload with Vite middleware integration

## Database Design
- **Primary Database**: PostgreSQL with Neon serverless driver
- **Schema Management**: Drizzle Kit for migrations and schema generation
- **Entity Structure**: Comprehensive schema covering:
  - Users and authentication with role-based permissions
  - Employee management with hierarchical relationships
  - Project management with progress tracking and budget control
  - Task management with assignment and status tracking
  - KPI monitoring with targets and current values
  - Financial transactions with categorization
  - Payroll processing with detailed breakdown
  - Proposal management with client tracking
  - Performance evaluations with scoring systems

## Authentication & Authorization
- **Authentication Strategy**: Email/password login with stored user sessions
- **Role System**: Multi-level roles (administrator, manager, user) with permission arrays
- **Route Protection**: Client-side route guards with authentication checks
- **Session Management**: Browser localStorage for authentication state persistence

## Component Architecture
- **Design System**: Consistent component library with theme support
- **Layout System**: Sidebar navigation with topbar and responsive design
- **Data Display**: Reusable components for tables, cards, and dashboards
- **Form Components**: Standardized form controls with validation integration
- **UI Patterns**: Modal dialogs, dropdown menus, and toast notifications

# External Dependencies

## Core Framework Dependencies
- **@neondatabase/serverless**: Neon PostgreSQL serverless database driver
- **drizzle-orm**: Type-safe database ORM with PostgreSQL support
- **@tanstack/react-query**: Server state management and caching
- **express**: Node.js web application framework
- **react**: Frontend UI framework with hooks and concurrent features

## UI and Styling Dependencies
- **@radix-ui/***: Comprehensive set of unstyled, accessible UI primitives
- **tailwindcss**: Utility-first CSS framework for styling
- **class-variance-authority**: Type-safe variant API for component styling
- **clsx**: Utility for constructing className strings conditionally

## Development and Build Tools
- **vite**: Fast build tool and development server
- **tsx**: TypeScript execution environment for Node.js
- **esbuild**: Fast JavaScript/TypeScript bundler for production builds
- **@replit/vite-plugin-runtime-error-modal**: Development error overlay integration

## Form and Validation
- **react-hook-form**: Performant forms with easy validation
- **@hookform/resolvers**: Form validation resolvers for various schema libraries
- **zod**: TypeScript-first schema validation library
- **drizzle-zod**: Integration between Drizzle ORM and Zod validation

## Utility Libraries
- **date-fns**: Modern JavaScript date utility library
- **nanoid**: Secure, URL-friendly unique string ID generator
- **wouter**: Minimalist routing library for React applications