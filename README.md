# Admin Dashboard – Users Management

A **modern Admin Dashboard** built with **React + TypeScript**, featuring a **metadata-driven data grid**, **nested user-group relationships**, **optimistic UI updates**, and **high-performance virtualization**.  

This project demonstrates **clean component design**, **type-safe models**, and **accessible UI/UX patterns**, making it a strong showcase for frontend engineering best practices.  

---



https://github.com/user-attachments/assets/82db7882-6dbe-41fd-9211-44d2a28b6354




---
## 🚀 Features

- **Users Grid (Material React Table)**  
  - Metadata-driven columns with dynamic rendering  
  - Sorting, pagination, and search  
  - Preserves **nested data** (Users → Groups) with chiplist rendering  

- **Row Selection & Optimistic UI**  
  - Toggle **Activate/Deactivate** user status  
  - Updates applied instantly with **snackbar feedback**  

- **Performance**  
  - Virtualized rows for handling large datasets (100+ users)  
  - Lazy rendering for smooth scrolling and interactions  

- **Mock API Integration**  
  - Mocked backend via **MSW (Mock Service Worker)**  
  - Endpoints:  
    - `GET /api/users?query=&status=&page=&pageSize=`  
    - `PATCH /api/users/:id` → Toggle user status  

- **Clean UX / UI Enhancements**  
  - Loading skeletons and empty states  
  - Error boundaries and per-section error UI  
  - Keyboard focus states and accessible labels  

---

## 🛠️ Tech Stack

- **Frontend**: React 18+, TypeScript (strict mode), Vite  
- **UI Library**: Material UI + Material React Table (MRT)  
- **Mock API**: MSW (Mock Service Worker)  
- **State Management**: React Hooks + Context (lightweight, Redux optional)  
- **Lint & Format**: ESLint + Prettier  





