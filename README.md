# React Developer Assessment

This project is a React-based product management dashboard built for a developer assessment. It features a product list with search/filtering and a detailed product view with an edit form.

## Tech Stack

- **Framework**: [React 19](https://react.dev/)
- **Build Tool**: [Vite 6](https://vitejs.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **State Management**: [Redux Toolkit](https://redux-toolkit.js.org/)
- **API Data Fetching**: [RTK Query](https://redux-toolkit.js.org/rtk-query/overview)
- **UI Components**: [Ant Design (antd) 5](https://ant.design/)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/) & [Sass](https://sass-lang.com/)
- **Routing**: [React Router Dom 7](https://reactrouter.com/)

## Architecture Decisions

- **Feature-Based Folder Structure**: Organized by features (e.g., `features/products`) to ensure scalability and maintainability.
- **RTK Query for API Layer**: Used for centralized data fetching, automatic caching, and simplified state management for server-side data.
- **Redux for Local UI State**: Managed globally using Redux slices (e.g., search queries, pagination state) to maintain consistency across navigation.
- **Tailwind + SCSS**: Tailwind provides utility-first rapid styling, while SCSS is used for custom variables and complex styling needs.
- **Strict TypeScript**: No `any` types used. All API responses and component props are strictly typed for better developer experience and reliability.

## Features Implemented

### Task 1: Product List Page
- Server-side pagination and sorting.
- Debounced search (400ms) integrated with API.
- Category filtering populated from the API.
- Custom skeleton loaders and background fetch indicators.

### Task 2: Product Detail & Edit Drawer
- Dynamic routing with lazy loading.
- High-quality image gallery with thumbnail selection.
- Detailed product specifications and status badges.
- Edit form with robust validation rules (required fields, min/max lengths, numeric ranges).

### Bonus Features
- **LocalStorage Persistence**: remebers the user's preferred `pageSize` across sessions.
- **Advanced Loaders**: Custom skeleton screens that improve the perceived performance.

## Running Locally

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Start Dev Server**:
   ```bash
   npm run dev
   ```

3. **Check Types**:
   ```bash
   npx tsc --noEmit
   ```

## API

Base URL: `https://dummyjson.com`
Used Endpoints: `/products`, `/products/search`, `/products/category`, `/products/categories`, `/products/{id}`.
