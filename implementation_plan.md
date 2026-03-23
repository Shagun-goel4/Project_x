# DevLinks Application Implementation Plan

This plan details the architecture and features of the full-stack link-sharing application based on the provided requirements and design mockup. The application will allow users to customize their profile (including bio), add links with drag-and-drop support, log in securely, and track analytics. Users can share their profile via a direct link or QR code.

## Goal Description
Build a full-stack web application that closely matches the provided UI mockup. Users can authenticate, construct a personalized link profile (DevLinks) containing their avatar, name, bio, and links. They can rearrange links via drag and drop, preview their mobile profile live, and share it via a unique URL or QR Code. Additional functionality includes user analytics (link tracking, popular links dashboard).

## Technology Stack
- **Frontend**: React.js
- **Styling**: TailwindCSS
- **State/Form Management**: `react-hook-form` with `zod` for validation
- **Routing**: `react-router-dom`
- **Drag & Drop**: `@hello-pangea/dnd`
- **QR Code Generation**: `qrcode.react` (for dynamic QR sharing)
- **Backend Framework**: Node.js with Express.js
- **Database**: PostgreSQL (with Prisma ORM)
- **Authentication**: JWT (JSON Web Tokens) with `bcrypt` for password hashing
- **Icons**: `lucide-react` or similar package for platform icons

## Proposed Changes
Instead of file changes, since this is a new app buildout, here are the architectural layers we'll construct:

### 1. Database & Backend API Development
- Setup an Express server.
- Initialize Prisma with a PostgreSQL connection.
- Define `User` schema (first name, last name, email, avatar URL, bio, hashed password).
- Define `Link` schema (URL, platform string, user reference, order index, click count).
- Build Authentication endpoints (`/api/auth/register`, `/api/auth/login`).
- Build Profile endpoints (`/api/profile` GET/PUT).
- Build Links endpoints (`/api/links` GET, POST, PUT (bulk order update), DELETE).
- Analytics tracking endpoint (`/api/analytics/track/:linkId` - triggered on public profile clicks).
- Analytics dashboard endpoints (`/api/analytics/dashboard`).

### 2. Frontend Core Setup & UI Foundations
- Initialize `React` utilizing Vite + Javascript.
- Configure `TailwindCSS` utilizing the exact visual branding of the UI designs (e.g., standard purples, layout padding).
- Create shared UI components (Buttons, Inputs, Select Dropdowns, Navigation Header).

### 3. Application Features Implementation
- **Authentication Pages**: Login and signup pages.
- **Links Editor Page**:
  - Integration of iterative Drag-and-Drop to reorder lists iteratively.
  - Auto platform detection on URL paste using simple string `.includes()` checks.
- **Profile Details Page**:
  - Image uploader component with sizing guidelines.
  - Form validation with structured checks (no empty fields, correct email parsing).
  - Bio text area input for adding a short personal description.
- **Live Preview Sidebar**:
  - Split-screen visualizer where data states are bound dynamically.
- **Public DevLinks Page & Sharing**:
  - Viewable page displaying avatar, name, bio, and populated links.
  - "Copy to clipboard" functionality natively.
  - Auto-generated QR Code module allowing users to scan and visit the public profile.
- **Analytics Dashboard**:
  - Popular links sorted by click rates natively via API.

## Verification Plan
### Automated Tests
- Basic API route tests to ensure CRUD operations respond to RESTful requirements securely.
- Extensive validation logic routines checking URL matching criteria.

### Manual Verification
- Testing the UI extensively to ensure platform icons update properly contextually.
- Testing screen responsiveness across devices to guarantee optimal layout adjustments matching the screen size cleanly.
- Simulating User flow: creating an account, constructing a profile with a bio, deploying links, inspecting the preview URL, sharing via QR code, verifying layout visually.
