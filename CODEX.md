# Trendsetter - React Native + Expo

## Project Overview

Trendsetter is a goal-tracking mobile application built with React Native and Expo. It features AI-powered goal planning, event scheduling, progress tracking, and feedback logging.

## Tech Stack

- **Framework**: React Native 0.79.2, Expo ~53.0.9
- **Language**: TypeScript (strict mode)
- **Navigation**: Expo Router (file-based routing)
- **State Management**: Zustand with AsyncStorage persistence
- **Styling**: NativeWind (Tailwind CSS for React Native)
- **HTTP Client**: Axios
- **Date Handling**: Moment.js
- **UI Components**: React Native Calendars, React Native Reanimated

## Project Structure

```
trendsetter/
├── app/                          # Expo Router file-based navigation
│   ├── (tabs)/                   # Tab navigation group
│   │   ├── _layout.tsx           # Tab bar configuration
│   │   ├── index.tsx             # Home screen
│   │   ├── calendar.tsx          # Calendar view
│   │   ├── ai-chat/              # AI planning assistant (Forge)
│   │   ├── events/[id].tsx       # Event detail screen
│   │   ├── goals/[id].tsx        # Goal detail screen
│   │   └── create-goal/          # Goal/event creation flow
│   ├── login/                    # Authentication screen
│   └── _layout.tsx               # Root layout
├── components/                   # Reusable components
│   ├── common/                   # Shared UI components
│   ├── index/                    # Home screen components
│   ├── calendar/                 # Calendar components
│   ├── events/                   # Event-related components
│   ├── create-goal/              # Goal creation components
│   └── ai-chat/                  # Chat interface components
├── stores/                       # Zustand stores
│   ├── useGoalStore.ts           # Goals state
│   └── useEventStore.ts          # Events state
├── api/                          # API service layer
│   ├── authApi.ts                # Authentication endpoints
│   ├── goalsApi.ts               # Goals CRUD
│   ├── eventsApi.ts              # Events & feedback
│   └── aiChatApi.ts              # AI chat endpoints
├── types/                        # TypeScript definitions
│   ├── models/                   # Domain models
│   └── requests/                 # API request DTOs
├── utils/                        # Utility functions
├── constants/                    # App constants
├── hooks/                        # Custom React hooks
└── assets/                       # Images, fonts, icons
```

## Conventions

### File Naming

- Components: PascalCase (`TodaysFocus.tsx`, `CurrentGoals.tsx`)
- Utilities: camelCase (`scheduleHandler.ts`, `progressCalculator.ts`)
- Types: PascalCase matching model name (`Goal.ts`, `Event.ts`)
- Stores: `use[Name]Store.ts` pattern (`useGoalStore.ts`)
- API files: `[name]Api.ts` pattern (`goalsApi.ts`)

### Component Structure

```typescript
// Standard component pattern
import { View, Text } from "react-native";

interface ComponentNameProps {
  prop1: string;
  prop2?: number;
}

export default function ComponentName({ prop1, prop2 }: ComponentNameProps) {
  return (
    <View className="flex-1">
      <Text className="text-white">{prop1}</Text>
    </View>
  );
}
```

### Styling with NativeWind

Use Tailwind classes via `className` prop:

```typescript
// Correct
<View className="flex-1 bg-secondary p-4">
<Text className="text-white font-satoshi text-lg">

// Theme colors (defined in tailwind.config.js)
// primary: #FF6B00 (orange - main accent)
// lightPrimary: #FF8F19
// secondary: #323232 (dark backgrounds)
// tertiary: #1E1E24 (darker backgrounds)
// cardSubtitle: #FF9139
```

### State Management with Zustand

```typescript
// Store pattern (stores/use[Name]Store.ts)
import { create } from "zustand";
import { persist, createJSONStorage } from "expo-zustand-persist";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface StoreState {
  items: Item[];
  setItems: (items: Item[]) => void;
  updateItems: (item: Item) => void;
}

export const useItemStore = create<StoreState>()(
  persist(
    (set) => ({
      items: [],
      setItems: (items) => set({ items }),
      updateItems: (item) => set((state) => ({
        items: [...state.items, item]
      })),
    }),
    {
      name: "items-storage",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
```

### API Layer Pattern

```typescript
// api/[name]Api.ts pattern
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_URL } from "@/constants/Config";

export const fetchItems = async () => {
  const token = await AsyncStorage.getItem("token");
  const response = await axios.get(`${API_URL}/items`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const storeItem = async (payload: ItemRequest) => {
  const token = await AsyncStorage.getItem("token");
  const response = await axios.post(`${API_URL}/items`, payload, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};
```

### Type Definitions

```typescript
// types/models/[Name].ts
export interface Goal {
  id: number;
  user_id: number;
  title: string;
  description: string;
  category: string;
  status: string;
  start_date: Date;
  end_date: Date;
  events?: Event[];
}

// types/requests/[Name]Request.ts
export interface GoalRequest {
  title: string;
  description: string;
  end_date: string;
}
```

### Navigation

Expo Router file-based routing:

```typescript
// Navigate to a screen
import { router } from "expo-router";

router.push("/goals/123");           // Push to stack
router.replace("/login");            // Replace current screen
router.back();                       // Go back

// Dynamic routes: app/(tabs)/goals/[id].tsx
import { useLocalSearchParams } from "expo-router";

export default function GoalDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  // ...
}
```

### Authentication Pattern

```typescript
// Check auth and redirect
const token = await AsyncStorage.getItem("token");
if (!token) {
  router.replace("/login");
  return;
}

// Store auth data on login
await AsyncStorage.setItem("token", response.token);
await AsyncStorage.setItem("user", JSON.stringify(response.user));
```

## Key Patterns

### Goal/Event Form Styling

- `components/events/GoalEventForm.tsx` mirrors `EventForm` behavior but matches `CreateGoalForm` styling (dividers, input treatments, spacing).
- Use this when you need event fields in the goal creation flow while keeping the goal screen's visual language.

### Event Repeat Configuration

Events support recurring schedules:

```typescript
interface EventRepeat {
  frequency: "daily" | "weekly" | "monthly";
  times_per_week?: number;
  duration_in_weeks: number;
}
```

### Feedback System

Event feedback uses status and mood enums:

```typescript
// Status: "completed" | "skipped" | "partial" | "struggled" | "nailed_it"
// Mood: "happy" | "good" | "meh" | "frustrated"

// Points mapping (utils/progressCalculator.ts)
const points = { nailed_it: 4, completed: 3, struggled: 2, partial: 1, skipped: 0 };
```

### Progress Calculation

```typescript
// Calculate goal progress
import { calculateCompletionPercentage } from "@/utils/scheduleHandler";
const progress = calculateCompletionPercentage(goal.start_date, goal.end_date);

// Calculate event progress
import { calculateCurrentProgressForEvent, calculateMaxProgressForEvent } from "@/utils/progressCalculator";
const current = calculateCurrentProgressForEvent(event.feedback);
const max = calculateMaxProgressForEvent(event);
```

## Adding New Features

### New Screen

1. Create file in `app/(tabs)/[screen-name].tsx` or `app/(tabs)/[feature]/index.tsx`
2. For tab visibility, update `app/(tabs)/_layout.tsx`
3. Hidden screens use `href: null` in tab config

### New Component

1. Create in appropriate `components/[feature]/` directory
2. Use TypeScript interfaces for props
3. Use NativeWind for styling
4. Export as default

### New API Endpoint

1. Add function to relevant `api/[name]Api.ts`
2. Create request type in `types/requests/`
3. Handle token from AsyncStorage
4. Return typed response

### New Store

1. Create `stores/use[Name]Store.ts`
2. Follow Zustand + persist pattern
3. Use unique storage key

### New Type

1. Models go in `types/models/[Name].ts`
2. Request DTOs go in `types/requests/[Name]Request.ts`
3. Export from index if needed

## Backend API

Base URL: `https://trendsetter-core.test/api/v1` (dev)

### Endpoints Used

- `POST /auth/login` - Login, returns token + user + goals
- `GET /goals` - Fetch user goals with events
- `POST /goals` - Create new goal
- `POST /events` - Create new event
- `POST /events/{id}/feedback` - Log event feedback
- `GET /events/{id}/feedback` - Get feedback history
- `GET /goals/{id}/feedback` - Get all feedback for goal
- `POST /ai-plan/chat` - AI planning conversation

## Git Workflow

- **Main branch**: `main`
- **Current feature branch**: `feature/create-and-complete-goals`
- Commit messages: `feat:`, `fix:`, `refactor:` prefixes
