# Workshop Booking UI/UX Refresh

This submission refreshes the FOSSEE workshop booking portal with a mobile-first UI while keeping the existing Django workflow intact.

Django still handles routing, authentication, validation, and form submission. The main user-facing screens are rendered through React components, with Django passing structured page data to the frontend.

## What I changed

- Reworked the shared navigation into a cleaner mobile-friendly header.
- Rebuilt the login and registration screens as React-rendered pages.
- Rebuilt the coordinator and instructor dashboards as React-rendered pages.
- Rebuilt workshop type browsing, workshop proposal, public statistics, and team statistics as React-rendered pages.
- Replaced the old chart/modal flow with inline summaries and responsive chart cards.
- Restyled the workshop type editing flow so instructor tools match the rest of the redesign.
- Added a lightweight React build step for the frontend page layer and shared components.
- Updated visual styling with better spacing, typography, color hierarchy, and responsive layouts.
- Replaced stale legacy tests with smoke tests that match the current app structure.

## Tech stack

- Django
- React
- esbuild

## Setup

### 1. Clone the repository

```bash
git clone https://github.com/FOSSEE/workshop_booking.git
cd workshop_booking
```

### 2. Create and activate a virtual environment

```bash
python -m venv .venv
```

Windows:

```bash
.venv\Scripts\activate
```

### 3. Install Python dependencies

```bash
pip install -r requirements.txt
```

### 4. Install frontend dependencies

```bash
npm install
```

### 5. Build the React bundle

```bash
npm run build
```

### 6. Apply migrations

```bash
python manage.py migrate
```

### 7. Run the development server

```bash
python manage.py runserver
```

Open:

```text
http://127.0.0.1:8000/workshop/login/
```

### 8. Run the smoke tests

```bash
python manage.py test workshop_app.tests.test_views statistics_app.tests.test_views
```

### Optional: load demo data for screenshots and UI review

```bash
python manage.py seed_demo_data
```

To remove that seeded content later:

```bash
python manage.py clear_demo_data
```

## Design reasoning

### What design principles guided your improvements?

I focused on clarity, hierarchy, and flow.

The original project already had the right features, but many screens felt table-heavy and visually flat. I tried to make each page answer three simple questions quickly:

- Where am I?
- What matters on this page?
- What should I do next?

That led to a few consistent choices:

- stronger page headings and short supporting descriptions
- clearer grouping of actions and content
- clearer separation between pending and accepted states
- simpler forms with better spacing and labels
- softer visual surfaces instead of dense full-width tables everywhere

### How did you ensure responsiveness across devices?

I treated mobile as the default case.

The new layout uses:

- a compact navigation that collapses cleanly on smaller screens
- single-column layouts for forms and content blocks on mobile
- card-based sections instead of relying only on wide tables
- spacing and typography that stay readable on smaller widths
- touch-friendly buttons and form controls with larger tap targets

I used responsive CSS grids and media queries to scale the layout up for larger screens rather than shrinking a desktop-first design down.

### What trade-offs did you make between the design and performance?

I wanted the redesign to feel modern without turning the project into a heavy frontend rewrite.

Instead of turning the entire project into a standalone SPA, I kept Django in charge of data and form submission while moving the main user-facing interface into React. That kept the existing workflows intact, reduced backend rewrite risk, and still made the frontend implementation clearly React-driven.

I also kept the visual system simple:

- limited animation
- no large UI framework on top of the existing project
- small React surface area
- reusable CSS instead of many page-specific assets

### What was the most challenging part of the task and how did you approach it?

The hardest part was modernizing the experience without breaking the structure of an older Django app.

A full standalone frontend with a separate API layer would have taken more time and introduced extra complexity around authentication, form handling, and deployment. Instead, I used a React page layer on top of Django:

- keep the original backend behavior
- pass page data from Django into React
- rebuild the main screens as reusable React components

That approach let me improve the experience meaningfully while still keeping the project grounded and maintainable.

## Visual Showcase

Add before-and-after screenshots for the pages below before submission.

### Desktop views

#### 1. Login
| Before | After |
|--------|-------|
| ![](docs/screenshots/login-before-desktop.png) | ![](docs/screenshots/login-after-desktop.png) |

#### 2. Registration
| Before | After |
|--------|-------|
| ![](docs/screenshots/register-before-desktop.png) | ![](docs/screenshots/register-after-desktop.png) |

#### 3. Coordinator Dashboard
| Before | After |
|--------|-------|
| ![](docs/screenshots/coordinator-before-desktop.png) | ![](docs/screenshots/coordinator-after-desktop.png) |

#### 4. Instructor Dashboard
| Before | After |
|--------|-------|
| ![](docs/screenshots/instructor-before-desktop.png) | ![](docs/screenshots/instructor-after-desktop.png) |

#### 5. Workshop Types
| Before | After |
|--------|-------|
| ![](docs/screenshots/workshop-types-before-desktop.png) | ![](docs/screenshots/workshop-types-after-desktop.png) |

#### 6. Propose Workshop
| Before | After |
|--------|-------|
| ![](docs/screenshots/propose-before-desktop.png) | ![](docs/screenshots/propose-after-desktop.png) |

#### 7. Public Statistics
| Before | After |
|--------|-------|
| ![](docs/screenshots/statistics-before-desktop.png) | ![](docs/screenshots/statistics-after-desktop.png) |

#### 8. Team Statistics
| Before | After |
|--------|-------|
| ![](docs/screenshots/team-stats-before-desktop.png) | ![](docs/screenshots/team-stats-after-desktop.png) |

#### 9. Workshop Details
| Before | After |
|--------|-------|
| ![](docs/screenshots/workshop-details-before-desktop.png) | ![](docs/screenshots/workshop-details-after-desktop.png) |

### Mobile views

<table align="center">
  <tr>
    <td align="center"><b>Login</b><br/>
      <img src="docs/screenshots/login-after-mobile.png" width="220"/>
    </td>
    <td align="center"><b>Registration</b><br/>
      <img src="docs/screenshots/register-after-mobile.png" width="220"/>
    </td>
    <td align="center"><b>Coordinator Dashboard</b><br/>
      <img src="docs/screenshots/coordinator-after-mobile.png" width="220"/>
    </td>
  </tr>

  <tr>
    <td align="center"><b>Instructor Dashboard</b><br/>
      <img src="docs/screenshots/instructor-after-mobile.png" width="220"/>
    </td>
    <td align="center"><b>Workshop Types</b><br/>
      <img src="docs/screenshots/workshop-types-after-mobile.png" width="220"/>
    </td>
    <td align="center"><b>Workshop Details</b><br/>
      <img src="docs/screenshots/workshop-details-after-mobile.png" width="220"/>
    </td>
  </tr>

  <tr>
    <td align="center"><b>Propose Workshop</b><br/>
      <img src="docs/screenshots/propose-after-mobile.png" width="220"/>
    </td>
    <td align="center"><b>Public Statistics</b><br/>
      <img src="docs/screenshots/statistics-after-mobile.png" width="220"/>
    </td>
    <td align="center"><b>Team Statistics</b><br/>
      <img src="docs/screenshots/team-stats-after-mobile.png" width="220"/>
    </td>
  </tr>
</table>

---

## Notes

- The project still uses Django for authentication, data handling, and routing.
- The main user-facing screens are rendered through React using data provided by Django templates.
- The current React entry point lives in `frontend/src/main.jsx` and is bundled into `workshop_app/static/workshop_app/js/frontend-app.js`.