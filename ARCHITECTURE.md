# DreamTrip AI - Architecture Documentation

## 📁 Complete Folder Structure

```
dreamprip-ai/
├── src/
│   ├── app/                          # Next.js 15 App Router (Page-based routing)
│   │   ├── (auth)/                   # Route groups - Auth pages (no layout wrapper)
│   │   │   ├── login/
│   │   │   └── register/
│   │   ├── (main)/                   # Route groups - Main app pages (with layout)
│   │   │   ├── dashboard/
│   │   │   ├── trips/
│   │   │   ├── profile/
│   │   │   └── settings/
│   │   ├── trips/[tripId]/           # Dynamic route - Individual trip features
│   │   │   ├── itinerary/
│   │   │   ├── budget/
│   │   │   ├── stories/
│   │   │   └── poster/
│   │   ├── api/                      # API Routes (Server-side endpoints)
│   │   │   ├── auth/
│   │   │   ├── trips/
│   │   │   ├── itineraries/
│   │   │   ├── budget/
│   │   │   ├── stories/
│   │   │   ├── poster/
│   │   │   └── preferences/
│   │   ├── layout.tsx                # Root layout
│   │   ├── page.tsx                  # Landing/home page
│   │   └── globals.css               # Tailwind imports
│   │
│   ├── components/                   # React components (Presentational)
│   │   ├── ui/                       # Base UI components (Atomic design)
│   │   │   ├── button/
│   │   │   ├── input/
│   │   │   ├── card/
│   │   │   ├── modal/
│   │   │   └── dropdown/
│   │   ├── layout/                   # Layout components
│   │   │   ├── header/
│   │   │   ├── footer/
│   │   │   ├── sidebar/
│   │   │   └── container/
│   │   ├── forms/                    # Form components
│   │   ├── dashboard/                # Dashboard-specific components
│   │   ├── trips/                    # Trip-related components
│   │   │   ├── itinerary-form/
│   │   │   ├── budget-calculator/
│   │   │   ├── destination-card/
│   │   │   └── day-planner/
│   │   ├── ai/                       # AI interaction components
│   │   │   ├── chat/
│   │   │   ├── itinerary-generator/
│   │   │   ├── recommendation/
│   │   │   └── preferences-form/
│   │   ├── poster/                   # Poster generation components
│   │   │   ├── template/
│   │   │   ├── generator/
│   │   │   └── preview/
│   │   └── stories/                  # Travel stories components
│   │       ├── editor/
│   │       ├── viewer/
│   │       └── card/
│   │
│   ├── lib/                          # Business logic & integrations
│   │   ├── ai/                       # AI providers & chains
│   │   │   ├── openai/               # OpenAI integration
│   │   │   ├── anthropic/            # Claude integration
│   │   │   ├── prompts/              # Prompt templates
│   │   │   └── chain/                # LangChain chains
│   │   ├── db/                       # Database integrations
│   │   │   ├── prisma/               # Prisma ORM (PostgreSQL)
│   │   │   ├── mongodb/              # MongoDB integration
│   │   │   └── redis/                # Redis caching
│   │   ├── auth/                     # Authentication
│   │   │   ├── nextauth/             # NextAuth.js configuration
│   │   │   ├── token/                # Token management
│   │   │   └── jwt/                  # JWT utilities
│   │   └── utils/                    # Utility functions
│   │
│   ├── hooks/                        # Custom React hooks
│   │   ├── useTrips/
│   │   ├── useItinerary/
│   │   ├── useBudget/
│   │   ├── useAuth/
│   │   └── useStories/
│   │
│   ├── types/                        # TypeScript type definitions
│   │   ├── trip.ts
│   │   ├── itinerary.ts
│   │   ├── budget.ts
│   │   ├── user.ts
│   │   ├── story.ts
│   │   └── poster.ts
│   │
│   ├── utils/                        # Pure utility functions
│   │   ├── validation/
│   │   ├── formatting/
│   │   └── helpers/
│   │
│   └── styles/                       # Additional styles
│
├── prisma/                           # Database schema
├── public/images/posters/            # Generated poster assets
└── package.json
```

---

## 🏗️ Architecture Explanation

### 1. **Route Groups Architecture** (`app/`)

| Route Group | Purpose | Layout |
|-------------|---------|--------|
| `(auth)` | Login, Register pages | No sidebar/header (clean auth forms) |
| `(main)` | Dashboard, Profile, Settings | Full app layout with navigation |
| `trips/[tripId]` | Individual trip management | Trip-specific sub-pages |

**Benefit**: Route groups allow logical organization without affecting URL structure.

### 2. **Component Architecture** (Atomic Design)

```
ui/          → Atoms (Button, Input, Card)      → Reusable primitives
layout/      → Molecules (Header, Footer)        → Structural components
forms/       → Molecules (Form components)        → User input
trips/       → Organisms (DayPlanner, BudgetCalc) → Feature-specific
ai/          → Organisms (Chat, ItineraryGen)    → AI interactions
stories/     → Organisms (Editor, Card)          → Content features
poster/      → Organisms (Generator, Preview)    → Visual generation
```

### 3. **Library Architecture** (`lib/`)

```
ai/
├── openai/       → Generate itineraries, recommendations
├── anthropic/    → Travel stories generation
├── prompts/      → Reusable prompt templates
└── chain/        → Multi-step AI workflows (RAG)

db/
├── prisma/       → Main database (PostgreSQL)
├── mongodb/      → Document storage (trips, stories)
└── redis/        → Session caching, rate limiting

auth/
├── nextauth/     → OAuth providers, session management
├── token/        → Access/refresh token logic
└── jwt/          → Token signing/verification
```

---

## 🔄 Data Flow Architecture

### Core Flow Diagram

```
┌─────────────┐      ┌──────────────┐      ┌─────────────────┐
│   Client    │──────│  Next.js API │──────│  AI Providers   │
│  (Browser)  │      │   Routes     │      │  (OpenAI/Claude)│
└─────────────┘      └──────┬───────┘      └─────────────────┘
                           │
                    ┌──────┴───────┐
                    │              │
              ┌─────┴─────┐  ┌─────┴─────┐
              │ PostgreSQL│  │  MongoDB  │
              │ (Prisma)  │  │(Documents)│
              └───────────┘  └───────────┘
```

### Feature-Specific Data Flows

#### 1. AI Itinerary Generation
```
User Input → useItinerary hook → POST /api/itineraries
                                    ↓
                             Prompt Engineering (lib/ai/prompts)
                                    ↓
                             OpenAI API Call
                                    ↓
                             Parse & Validate Response
                                    ↓
                             Store in MongoDB (itinerary collection)
                                    ↓
                             Return to Client → UI Update
```

#### 2. Budget Planning
```
User Input → useBudget hook → POST /api/budget
                                ↓
                         Calculate with preferences
                                ↓
                         Query costs DB (cities, hotels, activities)
                                ↓
                         Generate budget breakdown
                                ↓
                         Store in PostgreSQL (via Prisma)
                                ↓
                         Return charts/tables to UI
```

#### 3. Travel Stories Generation
```
User Input → useStories hook → POST /api/stories
                                 ↓
                          Enhance with context (trip data, photos)
                                 ↓
                          Claude API Call (creative writing)
                                 ↓
                          Store in MongoDB (stories collection)
                                 ↓
                          Return rich content to UI
```

#### 4. Poster Generation
```
User Input → Poster Component → POST /api/poster
                                   ↓
                            Select Template
                                   ↓
                            Apply AI-generated content (destinations, highlights)
                                   ↓
                            Generate SVG/Canvas output
                                   ↓
                            Store in /public/images/posters
                                   ↓
                            Return URL to client
```

#### 5. Travel Preferences
```
User Input → Preferences Form → POST /api/preferences
                                     ↓
                              Validate preferences schema
                                     ↓
                              Store in PostgreSQL (user preferences)
                                     ↓
                              Update AI prompt context
                                     ↓
                              Personalize future recommendations
```

---

## 📊 Scalability Features

| Feature | Implementation |
|---------|----------------|
| **Route Groups** | Logical code organization without URL changes |
| **Atomic Components** | Easy to maintain, test, and swap implementations |
| **Separation of Concerns** | AI logic isolated from UI, DB logic separated |
| **Type Safety** | Full TypeScript coverage with shared types |
| **Custom Hooks** | Reusable data fetching and state management |
| **API Routes** | Serverless endpoints for each feature domain |

---

## 🔧 Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| AI | OpenAI API, Anthropic Claude |
| Database | PostgreSQL (Prisma), MongoDB |
| Caching | Redis |
| Auth | NextAuth.js |
| State | React hooks, Server Components |