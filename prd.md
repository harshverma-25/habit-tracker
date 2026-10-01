HabitFlow — Product Requirements Document (PRD)

Version: 1.0
Project: HabitFlow
Type: Full-stack habit tracking web application
Frontend: Next.js + TypeScript
Database: MongoDB
Authentication: Google OAuth
UI: Tailwind CSS + shadcn/ui
Animation: Framer Motion
Icons: Lucide React

1. Product Overview
1.1 Product Name

HabitFlow

HabitFlow is a modern, minimal, dark-themed habit tracking application that allows users to:

Create personal habits
Track habits day-by-day
View habits organized by week
Navigate between months and years
See daily and monthly progress
Track streaks
View habit completion statistics
Maintain a history of their habits

The primary inspiration is the provided monthly habit-tracking spreadsheet.

However, HabitFlow should not look like an Excel spreadsheet.

The goal is to take the useful structure:

Habit → Day → Week → Month → Progress

and turn it into a modern interactive web application.

2. Product Vision

The application should answer one simple question:

"How consistently am I following my habits?"

The user should be able to open the application and understand their current progress within a few seconds.

The experience should feel:

Simple
Fast
Motivating
Clean
Modern
Personal
Satisfying to use

The application should avoid unnecessary complexity.

3. Target Users

Primary users:

Students
Developers
Professionals
People building daily routines
People trying to improve consistency

Example habits:

Read a book
Exercise
Study DSA
Code for 2 hours
Drink water
Meditate
Sleep before 11 PM
Practice English
Go for a walk
4. Core User Journey

The basic journey should be:

Landing Page
     ↓
Continue with Google
     ↓
Authentication
     ↓
Dashboard
     ↓
Create Habit
     ↓
Track Daily Habit
     ↓
View Progress
     ↓
Build Streak
     ↓
Review Monthly History

The user should not need a complicated onboarding process.

5. Authentication
5.1 Google Sign-In

Users should be able to authenticate using Google.

Primary CTA:

Continue with Google

No traditional username/password authentication is required for V1.

5.2 User Data

Every user's data must be isolated.

Example:

User A
 ├── Habits
 └── Completions

User B
 ├── Habits
 └── Completions

User A must never be able to access User B's habits or completion records.

6. Technology Architecture
Frontend
Next.js
TypeScript
React
Tailwind CSS
shadcn/ui
Framer Motion
Lucide React
Backend

Use Next.js server-side functionality where practical:

Server Components
Server Actions
Route Handlers

Avoid creating a separate Express server unless there is a genuine requirement later.

7. Database
MongoDB

MongoDB will be the primary database.

A MongoDB Atlas deployment is recommended for production.

The database should be structured around:

Users
Habits
HabitCompletions

Potential future collections:

UserSettings
Achievements

These should not be created until actually required.

8. Database Design
8.1 User

Conceptual schema:

User
├── _id
├── name
├── email
├── image
├── provider
├── createdAt
└── updatedAt

The user should have a unique identifier.

Email should be unique where appropriate.

9. Habit Model

Conceptually:

Habit
├── _id
├── userId
├── name
├── description
├── icon
├── color
├── frequency
├── isArchived
├── createdAt
└── updatedAt
Example
{
  "name": "Read a book",
  "icon": "book-open",
  "color": "blue",
  "frequency": "daily",
  "isArchived": false
}
10. Habit Completion Model

Do not store the entire monthly grid inside the Habit document.

Instead, store individual completion records.

Example:

HabitCompletion

habitId
userId
date
completed
createdAt
updatedAt

Example:

{
  "habitId": "abc123",
  "userId": "user123",
  "date": "2026-10-01",
  "completed": true
}

Then:

2026-10-01 → true
2026-10-02 → true
2026-10-03 → false
2026-10-04 → true

The frontend generates the calendar grid from the selected month.

This is important because the application must support:

January 2026
February 2026
March 2026
...
December 2026

without storing separate month grids.

11. Date Handling

Date handling is a critical part of the application.

The application must correctly understand:

Year
Month
Date
Day of week
Number of days in month
Leap years
Week grouping

For example:

October 2026
Thu 1
Fri 2
Sat 3
Sun 4
Mon 5
...
Sat 31
February 2028
29 days

because 2028 is a leap year.

The calendar generation must be dynamic.

Do not hardcode dates.

12. Monthly Tracker

This is the primary feature of HabitFlow.

The user sees:

October 2026

and the application automatically generates the month.

12.1 Header

Example:

                 October 2026

             ←              →

Users can navigate:

September 2026
October 2026
November 2026
13. Week Organization

The days should be grouped into weeks.

Example:

                October 2026

         WEEK 1        WEEK 2        WEEK 3

       Thu Fri Sat   Sun Mon Tue Wed   Thu Fri...
        1   2   3     4   5   6   7    8   9...

The week grouping must be generated dynamically.

The application should not assume every month contains exactly five complete weeks.

14. Day Display

Each day should show:

Day name
Day number

Example:

Thu
 1

or a compact version:

Thu 1

The exact visual implementation can be refined during UI development.

15. Habit Rows

Every habit receives its own row.

Example:

Habit             Week 1              Week 2

📖 Reading        □ □ □ □ □ □ □      □ □ □ □ □ □ □

💻 Coding         □ □ □ □ □ □ □      □ □ □ □ □ □ □

🏃 Exercise       □ □ □ □ □ □ □      □ □ □ □ □ □ □

Each checkbox corresponds to exactly one date.

16. Checkbox Behavior

When a user clicks a checkbox:

□

it becomes:

✓

The completion should immediately be persisted to MongoDB.

The UI should optimistically update so the interaction feels instant.

If the database request fails:

revert the optimistic UI state
show a small error message/toast
17. Today's Date

The current day should have special visual treatment.

Example:

                 TODAY
                   ↓
Mon 28   Tue 29   Wed 30   Thu 1

Today's column could have:

subtle border
background highlight
accent color
small "Today" indicator

Do not make it excessively bright.

18. Future Dates

Recommended behavior:

Future dates should be visually distinguishable.

For V1:

Past       → selectable
Today      → selectable
Future     → disabled

This prevents users from accidentally marking future habits as completed.

However, this should be implemented as a centralized rule so it can easily be changed later.

19. Habit Creation

Primary button:

+ Add Habit

Clicking it opens a modal/dialog.

Example:

┌─────────────────────────────┐
│       Create Habit          │
│                             │
│ Habit name                  │
│ ┌─────────────────────────┐ │
│ │ Read a book             │ │
│ └─────────────────────────┘ │
│                             │
│ Icon                        │
│ 📖                          │
│                             │
│ Color                       │
│ ● ● ● ● ●                   │
│                             │
│       Cancel    Create      │
└─────────────────────────────┘
20. Habit Properties

Initially, a habit should have:

Required
Name
Optional
Icon
Color
Description

Avoid excessive configuration.

The user should be able to create a habit in a few seconds.

21. Habit Editing

Each habit should have a small menu:

•••

Options:

Edit
Archive
Delete

Editing should allow modification of:

Name
Icon
Color
Description
22. Delete vs Archive

We should distinguish these.

Archive

The habit disappears from the active tracker but its historical data remains.

Example:

Coding habit
↓
Archived
↓
Not shown in active habits
↓
History remains
Delete

Permanent deletion.

Because deletion is destructive, show confirmation.

Example:

Delete "Read a book"?

This will permanently remove the habit
and its completion history.

Cancel      Delete
23. Dashboard

The dashboard should contain the main tracking experience.

Suggested structure:

Navbar

Greeting

Statistics

Month Navigation

Habit Tracker

Add Habit
24. Dashboard Greeting

Example:

Good morning, Harsh 👋

Stay consistent. Small actions become big results.

The greeting can eventually change based on the time of day:

Good morning
Good afternoon
Good evening
25. Statistics Cards

At the top:

┌────────────┐
│ HABITS     │
│ 8          │
└────────────┘

┌────────────┐
│ COMPLETED  │
│ 164        │
└────────────┘

┌────────────┐
│ STREAK     │
│ 🔥 12 days │
└────────────┘

┌────────────┐
│ PROGRESS   │
│ 79%        │
└────────────┘

These values must eventually be calculated from actual database data.

26. Progress Calculation

Monthly progress:

Completed check-ins
────────────────────── × 100
Possible check-ins

Example:

10 habits
31 days

Possible:
310

Completed:
248

Progress:
80%

Future dates should not be counted as missed opportunities.

This distinction is important.

27. Habit Progress

Each habit should have its own completion percentage.

Example:

📖 Reading

████████████████░░░░ 82%

25 / 30 completed
28. Streak System

A streak represents consecutive completed days.

Example:

Oct 1 ✓
Oct 2 ✓
Oct 3 ✓
Oct 4 ✓
Oct 5 ✓

Current streak = 5 days

If a day is missed:

Oct 1 ✓
Oct 2 ✓
Oct 3 ✗
Oct 4 ✓

Current streak = 1

The system should calculate:

Current streak
Longest streak

These calculations should be based on completion records.

29. Analytics Page

A separate Analytics page can provide deeper information.

Initial version:

Analytics

Overall Progress
79%

Current Streak
12 days

Longest Streak
28 days

Then:

Weekly completion
Week 1   72%
Week 2   84%
Week 3   68%
Week 4   91%
Habit performance
Reading      84%
Coding       91%
Exercise     65%
Meditation   73%

Charts should be simple and readable.

Do not overload the page with charts.

30. Future Analytics

Potential future features:

Heatmap
Monthly comparison
Habit consistency score
Best day of week
Most consistent habit
Completion trends
Personal records
Habit milestones

These are not required for the first release.

31. Navigation

Main navigation:

HabitFlow

Dashboard
Analytics
Settings

Profile

Mobile navigation can later use:

Bottom navigation
32. Settings

Settings page can initially contain:

Account
Name
Email
Profile picture
Appearance
Dark theme

Since the product is dark-first, light mode is not required for V1.

Account actions
Sign out
33. Landing Page

Unauthenticated users should see a landing page.

Hero:

Build better habits.
One day at a time.

Track your habits.
Build streaks.
See your progress.

[ Continue with Google ]

Show a visual preview of the tracker.

The landing page should be simple rather than a huge marketing website.

34. UI Design Direction

The reference image provides the information architecture, not the exact design.

HabitFlow should be:

Dark
#0A0A0A
#111111
#171717
Cards

Subtle contrast:

background
↓
card
↓
border
Typography

Use a clean modern font.

Strong hierarchy:

Large heading
Medium section heading
Small muted metadata
35. Animation System

Animations should improve the experience, not distract from it.

Use Framer Motion for:

Page entrance

Fade + slight vertical movement.

Cards

Small staggered entrance.

Checkbox
unchecked
    ↓
scale
    ↓
checkmark
Progress

Smooth percentage transition.

Modal

Scale + fade.

Month transition

Subtle slide/fade.

Avoid excessive animations.

36. Responsive Design

Desktop is the primary experience.

The tracker can become very wide.

Therefore:

┌ Habit ────────────────────────────── Dates ────────┐
│                                                    │
│             horizontal scrolling                  │
│                                                    │
└────────────────────────────────────────────────────┘

The habit name column should remain sticky while horizontally scrolling.

On mobile:

Habit
│
├──────────────→ dates
│

The date grid should scroll horizontally.

Do not shrink every day into unreadable tiny elements.

37. Performance Requirements

The application should feel fast.

Important principles:

Server-side data fetching where appropriate
Avoid unnecessary client components
Avoid unnecessary database requests
Optimistic checkbox updates
Proper MongoDB indexes
Fetch only required month's completion data
Avoid loading the entire historical database into the browser

For example, when viewing:

October 2026

the application should primarily request October completion data.

38. MongoDB Indexing

Important indexes should be considered.

For completion records:

userId
habitId
date

A useful compound lookup pattern will likely be:

userId + habitId + date

The exact indexes should be finalized during implementation.

39. Security

Every database operation must verify the authenticated user.

Never trust:

userId

sent from the browser.

The server should determine the authenticated user.

For example:

Browser
   ↓
Request
   ↓
Authenticated session
   ↓
Server determines userId
   ↓
MongoDB query

Not:

Browser says:
userId = xyz

Server blindly trusts it
40. Error Handling

The application should gracefully handle:

Authentication failure
Database failure
Network failure
Invalid habit name
Duplicate completion request
Unauthorized request
Invalid date
Deleted/archived habit

Use toast notifications where appropriate.

41. Loading States

Use skeletons for:

Dashboard
Statistics
Habit tracker
Analytics

Avoid showing a completely blank page while data loads.

42. Empty States

If a new user has no habits:

You don't have any habits yet.

Start with one small habit.

[ + Create your first habit ]

This is important because the empty state is likely the first dashboard experience.

43. Accessibility

The application should include:

Keyboard-accessible controls
Proper button elements
Accessible labels
Sufficient contrast
Focus states
Screen-reader-friendly checkbox controls
Tooltips where icons aren't self-explanatory
44. Data Rules

Important rules:

Habit

A habit belongs to exactly one user.

Completion

A completion belongs to:

User
+
Habit
+
Date

There should not be multiple completion records for the same habit/date combination.

Therefore the system should prevent duplicate records.

45. Recommended Project Architecture

A possible structure:

app/
├── (auth)/
│   ├── login/
│   └── ...
│
├── (dashboard)/
│   ├── dashboard/
│   ├── analytics/
│   └── settings/
│
├── api/
│   └── ...
│
├── layout.tsx
└── page.tsx

components/
├── auth/
├── dashboard/
│   ├── DashboardHeader
│   ├── StatsCards
│   ├── MonthSelector
│   ├── HabitTracker
│   ├── HabitRow
│   ├── DayCell
│   └── AddHabitDialog
│
├── analytics/
├── settings/
└── ui/

lib/
├── mongodb.ts
├── auth.ts
├── dates/
├── calculations/
└── utils/

models/
├── User
├── Habit
└── HabitCompletion

types/
├── habit.ts
├── completion.ts
└── calendar.ts

The exact structure can change if Antigravity has a better Next.js architecture, but responsibilities should remain separated.

46. Development Phases

The project should be built incrementally.

Phase 1 — Foundation

Build:

Next.js
TypeScript
Tailwind
shadcn
Dark theme
Layout
Navbar
Dashboard visual structure
Static tracker prototype
Responsive structure
Animation foundation

Commit:

chore: initialize habit tracker foundation
Phase 2 — Authentication + MongoDB

Build:

Google authentication
MongoDB connection
User model
Authenticated routes
Session handling
User isolation

Commit:

feat: add google authentication and mongodb
Phase 3 — Dynamic Calendar Engine

Build:

Year selection
Month selection
Previous/next month
Dynamic number of days
Day names
Day numbers
Dynamic week grouping
Leap-year handling
Today detection
Future-date handling

Commit:

feat: add dynamic monthly calendar
Phase 4 — Habit Management

Build:

Create habit
Edit habit
Archive habit
Delete habit
Habit icon
Habit color
Empty state
MongoDB persistence

Commit:

feat: add habit management
Phase 5 — Habit Completion

Build:

Dynamic checkbox grid
Completion persistence
Optimistic updates
Completion loading
Monthly filtering
Today's highlighting
Error rollback

Commit:

feat: add habit completion tracking
Phase 6 — Statistics + Streaks

Build:

Overall progress
Habit progress
Current streak
Longest streak
Monthly statistics
Weekly statistics
Animated progress

Commit:

feat: add habit analytics and streaks
Phase 7 — Premium UI + Animation

Build:

Framer Motion animations
Checkbox animation
Month transition
Card animations
Progress animation
Better empty states
Toast feedback
UI polish

Commit:

feat: polish habit tracker experience
Phase 8 — Analytics

Build:

Analytics page
Weekly chart
Habit performance
Monthly progress
Completion trends
Streak statistics

Commit:

feat: add analytics dashboard
Phase 9 — Responsive + Accessibility

Build:

Mobile tracker
Horizontal scrolling
Sticky habit column
Mobile navigation
Keyboard navigation
Accessibility improvements
Loading states
Error states

Commit:

feat: improve responsive and accessible experience
Phase 10 — Production Hardening

Build:

Security review
MongoDB indexes
Query optimization
Error handling
Validation
Environment variable cleanup
Production configuration
Final testing

Commit:

chore: prepare habit tracker for production
47. MVP Definition

The first usable version of HabitFlow should have:

✓ Google login
✓ MongoDB
✓ User accounts
✓ Create habits
✓ Edit habits
✓ Delete/archive habits
✓ Dynamic months
✓ Dynamic dates
✓ Week grouping
✓ Day numbers
✓ Daily completion
✓ Progress percentage
✓ Streak
✓ Dark UI
✓ Responsive tracker

Everything else can build on top of this.

48. Features Explicitly Out of Scope for V1

Do not add these just because they sound interesting:

❌ AI habit recommendations
❌ AI coach
❌ Social feed
❌ Friends
❌ Public profiles
❌ Leaderboards
❌ Chat
❌ Gamification points
❌ Notifications
❌ Email reminders
❌ Mobile app
❌ Wearable integration
❌ Complex habit scheduling
❌ Subscription/payment system

These can be considered later if the core product gets users.

49. Important Product Principle

The application should follow:

Simple to start, satisfying to continue.

A user should be able to:

Sign in
   ↓
Create "Read a book"
   ↓
See today's checkbox
   ↓
Click it
   ↓
See progress update

in less than a minute.

The complexity should exist behind the interface, not in front of the user.

50. Final Product Concept

The final experience should feel like:

                         HabitFlow

              Build better habits.
                  One day at a time.


       ┌──────────┐ ┌──────────┐ ┌──────────┐
       │  8       │ │   79%    │ │ 🔥 12    │
       │  Habits  │ │ Progress │ │  Streak  │
       └──────────┘ └──────────┘ └──────────┘


                  ← October 2026 →


 ┌─────────────────────────────────────────────────────────────┐
 │ HABIT      │             WEEK 1            │     WEEK 2    │
 │            │ Thu 1 Fri 2 Sat 3 Sun 4 ...  │ ...           │
 ├────────────┼───────────────────────────────┼───────────────┤
 │ 📖 Reading │  ✓     ✓     □     ✓          │ ✓  ✓  □ ...  │
 │ 💻 Coding  │  ✓     □     ✓     ✓          │ ✓  ✓  ✓ ...  │
 │ 🏃 Exercise│  □     ✓     □     ✓          │ ✓  □  ✓ ...  │
 │            │                               │               │
 └─────────────────────────────────────────────────────────────┘

                         + Add Habit