# Colby GitHub Bot Frontend

A modern, responsive frontend application for the Colby GitHub Bot API, built with React, TypeScript, and Cloudflare Workers.

## Features

- **Dashboard Overview**: Real-time statistics and quick actions
- **Research & Analysis**: Repository discovery with AI-powered insights
- **Command Management**: Execute and monitor Colby commands
- **Best Practices**: Manage and review code best practices
- **Operations Monitoring**: Real-time operation tracking
- **Repository Details**: Deep dive into individual repository analysis

## Tech Stack

- **Frontend**: React 18 with TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Zustand + TanStack Query
- **Routing**: React Router
- **Icons**: Lucide React
- **Deployment**: Cloudflare Workers with Static Assets

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Cloudflare account (for deployment)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd gh-bot-frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:3000`.

### Building for Production

1. Build the React application:
```bash
npm run build:react
```

2. Build the Cloudflare Worker:
```bash
npm run build:worker
```

3. Deploy to Cloudflare Pages:
```bash
npm run deploy
```

## Project Structure

```
src/
├── components/          # Reusable UI components
│   └── Layout.tsx      # Main layout component
├── pages/              # Page components
│   ├── Dashboard.tsx   # Dashboard overview
│   ├── Research.tsx    # Research & analysis
│   ├── Commands.tsx    # Command management
│   ├── BestPractices.tsx # Best practices management
│   ├── Operations.tsx  # Operations monitoring
│   └── RepositoryDetail.tsx # Repository details
├── hooks/              # Custom React hooks
│   └── useApi.ts       # API integration hooks
├── services/           # API service layer
│   └── api.ts          # API client
├── store/              # State management
│   └── useAppStore.ts  # Zustand store
├── types/              # TypeScript types
│   └── api.ts          # API type definitions
├── utils/              # Utility functions
│   ├── cn.ts           # Class name utility
│   └── format.ts       # Formatting utilities
├── App.tsx             # Main app component
├── main.tsx            # React entry point
└── index.css           # Global styles
```

## API Integration

The frontend connects to the Colby GitHub Bot API at `https://gh-bot.hacolby.workers.dev`. The API proxy is handled by the Cloudflare Worker in `src/index.ts`.

### Key API Endpoints

- `GET /api/health` - Health check
- `GET /api/stats` - Dashboard statistics
- `GET /api/research/results` - Repository research results
- `GET /api/colby/commands` - Command history
- `GET /api/colby/best-practices` - Best practices
- `GET /api/operations` - Operations monitoring

## Features Overview

### Dashboard
- Real-time statistics display
- Research operation controls
- Quick action buttons
- Recent activity feed

### Research Module
- Repository discovery with filtering
- AI-powered analysis summaries
- Score-based ranking
- Technology stack visualization

### Command Management
- Execute new commands
- View command history
- Filter by repository, author, status
- Real-time status updates

### Best Practices
- Browse and search practices
- Approve/reject practices
- Category and technology filtering
- Implementation guides and examples

### Operations Monitoring
- Real-time operation tracking
- Progress indicators
- Error handling and retry
- Operation cancellation

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run build:react` - Build React app only
- `npm run build:worker` - Build Cloudflare Worker only
- `npm run deploy` - Deploy to Cloudflare Pages
- `npm run type-check` - Run TypeScript type checking
- `npm run lint` - Run ESLint
- `npm run test` - Run tests

### Environment Variables

No environment variables are required for development. The API base URL is configured in the Cloudflare Worker.

## Deployment

### Cloudflare Pages

1. Build the application:
```bash
npm run build
```

2. Deploy using Wrangler:
```bash
npm run deploy
```

The application will be deployed to Cloudflare Pages with the Cloudflare Worker handling API proxying.

### Manual Deployment

1. Build the application
2. Upload the `public` directory to your static hosting provider
3. Configure the Cloudflare Worker separately

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions, please open an issue in the repository.
# Redeploy trigger Mon Sep 15 01:51:40 PDT 2025
