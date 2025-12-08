# LeadForge

LeadForge is a modern lead management platform built for financial institutions to capture, track, and manage client applications efficiently.

## Features

- **Public Lead Capture Wizard**: Multi-step form for detailed client data collection (Personal, Employment, Assets).
- **Returning User Logic**: Securely recognizes existing users and pre-fills known data.
- **Admin Dashboard**: Real-time statistics and lead verification.
- **Lead Management**: 
  - Status tracking (New, Contacted, Qualified, etc.)
  - Owner assignment
  - Activity notes and history logging
- **Role-Based Access**: Secure login for Admins and Agents.

## tech Stack

- **Framework**: Next.js 14 (App Router)
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js (Credentials + bcrypt)
- **Styling**: Tailwind CSS
- **Validation**: Zod & React Hook Form
- **Security**: AES-256 encryption for sensitive data (SIN).

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL

### Installation

1. **Clone the repository**
   ```bash
   git clone <repo-url>
   cd leadforge
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Environment**
   Create a `.env` file based on the example:
   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/leadmanager"
   NEXTAUTH_SECRET="your-secret"
   NEXTAUTH_URL="http://localhost:3000"
   ENCRYPTION_KEY="32-byte-key"
   ```

4. **Setup Database**
   ```bash
   npx prisma migrate dev
   ```

5. **Run Development Server**
   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) to view the application.

## Project Structure

- `src/app`: App Router pages and API routes.
- `src/components`: UI components (forms, dashboard, leads).
- `src/lib`: Utilities (auth, prisma, encryption).
- `prisma`: Database schema and migrations.

## License

Private and Confidential.
