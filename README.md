# SecureShare – File Sharing System Using Blockchain Technology

A modern, responsive frontend UI for a Final Year Engineering Project demonstrating secure decentralized file sharing using blockchain technology and SHA-256 hashing.

## Tech Stack

- **React 18** – UI framework
- **Tailwind CSS 3** – Styling
- **Vite** – Build tool
- **React Router** – Page navigation
- **Lucide React** – Icons

## Design

- Dark navy blue + purple gradient theme (`#6C63FF`)
- Glassmorphism cards & white content panels
- Fully responsive layout
- Mock data only — no backend

## Screens (9 Pages)

| # | Page | Route |
|---|------|-------|
| 1 | Landing Page | `/` |
| 2 | Register | `/register` |
| 3 | Login | `/login` |
| 4 | Dashboard | `/dashboard` |
| 5 | Upload File | `/upload` |
| 6 | My Files | `/my-files` |
| 7 | Share File | `/share` |
| 8 | Shared With Me | `/shared-with-me` |
| 9 | File Verification | `/verify` |

Additional: **Shared By Me** (`/shared-by-me`), **Profile** (`/profile`)

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## Build for Production

```bash
npm run build
npm run preview
```

## Project Structure

```
src/
├── components/          # Shared UI (Sidebar, Navbar, Logo, Layout)
├── components/illustrations/  # SVG blockchain & shield illustrations
├── data/mockData.js     # Realistic dummy data
├── pages/               # All 9+ screen pages
├── App.jsx              # Router configuration
└── index.css            # Tailwind + custom utilities
```

## Screenshots for BE Project Report

Navigate to each route above and capture full-page screenshots. Recommended order:

1. Landing → Register → Login → Dashboard
2. Upload → My Files → Share File
3. Shared With Me → File Verification

---

**SecureShare** – Final Year Engineering Project UI
