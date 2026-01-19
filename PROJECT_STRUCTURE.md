# Project Structure Documentation

## 📁 Enterprise-Level Folder Structure

Project ini telah direstrukturisasi mengikuti **best practices** dan **industry standards** untuk memudahkan maintenance, scalability, dan kolaborasi tim.

```
src/
├── assets/                     # Static files
│   └── (images, icons, fonts)
│
├── components/                 # React Components
│   ├── common/                 # Reusable UI components
│   │   ├── StatCard/          # Sensor statistics card component
│   │   │   ├── StatCard.jsx
│   │   │   └── StatCard.css
│   │   └── Table/             # Data table with export functionality
│   │       ├── Table.jsx
│   │       └── Table.css
│   │
│   └── layout/                # Layout components
│       ├── Header/            # App header with user info
│       │   ├── Header.jsx
│       │   └── Header.css
│       └── Footer/            # App footer
│           ├── Footer.jsx
│           └── Footer.css
│
├── pages/                     # Page components
│   ├── auth/
│   │   └── login/            # Login page
│   │       ├── login.jsx
│   │       └── login.css
│   └── dashboard/            # Main dashboard page
│       ├── Dashboard.jsx
│       └── Dashboard.css
│
├── services/                  # External services & API integrations
│   └── firebase.js           # Firebase configuration & methods
│
├── utils/                     # Utility functions & helpers
│   └── authHelper.js         # Authentication helper functions
│
├── styles/                    # Global styles
│   ├── App.css               # App-level styles
│   └── index.css             # Root styles & CSS variables
│
├── App.jsx                    # Main App component
└── main.jsx                   # Application entry point
```

## 🎯 Folder Purpose

### 📦 `components/`
Berisi semua React components yang dibagi menjadi 2 kategori:

#### `common/` - Reusable Components
- **StatCard**: Card untuk menampilkan statistik sensor
- **Table**: Tabel data dengan fitur export PDF
- Components yang bisa dipakai ulang di berbagai halaman

#### `layout/` - Layout Components
- **Header**: Navigation bar dengan info user dan logout
- **Footer**: Footer dengan informasi sistem
- Components yang membentuk struktur layout aplikasi

### 📄 `pages/`
Berisi halaman-halaman utama aplikasi:
- **auth/login**: Halaman login dengan autentikasi
- **dashboard**: Dashboard utama dengan monitoring real-time

### 🔌 `services/`
Berisi integrasi dengan layanan eksternal:
- **firebase.js**: Konfigurasi Firebase & database operations

### 🛠️ `utils/`
Berisi helper functions dan utilities:
- **authHelper.js**: Functions untuk authentication & session management

### 🎨 `styles/`
Berisi global CSS files:
- **App.css**: Styling untuk komponen App
- **index.css**: Root styles, CSS variables, theme colors

## 📊 Keuntungan Struktur Ini

### ✅ **Separation of Concerns**
- Setiap folder memiliki tanggung jawab yang jelas
- Mudah menemukan file yang dicari
- Mengurangi coupling antar komponen

### ✅ **Scalability**
- Mudah menambah components/pages baru
- Struktur yang konsisten untuk team development
- Support untuk project yang berkembang

### ✅ **Maintainability**
- Code lebih terorganisir dan mudah di-maintain
- Debugging lebih cepat dengan struktur yang jelas
- Onboarding developer baru lebih mudah

### ✅ **Reusability**
- Components di `common/` bisa dipakai di mana saja
- Services & utils bisa di-import dengan path yang jelas
- Menghindari code duplication

### ✅ **Industry Standard**
- Mengikuti convention yang umum digunakan
- Mudah dipahami oleh developer lain
- Professional dan ready untuk production

## 🔄 Migration Changes

### Import Path Changes
Berikut perubahan import paths setelah restrukturisasi:

**Before:**
```javascript
import Header from '../../components/Fragments/header/Header';
import { getUserSession } from '../auth/authHelper';
import { database } from '../../config/firebase';
```

**After:**
```javascript
import Header from '../../components/layout/Header/Header';
import { getUserSession } from '../../utils/authHelper';
import { database } from '../../services/firebase';
```

## 📝 Best Practices

1. **Component Organization**
   - Setiap component memiliki folder sendiri
   - CSS file selalu di-colocate dengan component
   - Gunakan PascalCase untuk nama folder component

2. **Import Organization**
   - React imports dulu
   - Third-party libraries kedua
   - Local imports terakhir
   - Gunakan absolute imports jika perlu

3. **File Naming**
   - Components: `PascalCase.jsx`
   - Utils/Services: `camelCase.js`
   - Styles: `PascalCase.css` (sesuai component)

4. **Code Structure**
   - Common components untuk reusable UI
   - Layout components untuk struktur halaman
   - Utils untuk pure functions
   - Services untuk external integrations

## 🚀 Development Workflow

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 📌 Notes

- Folder `assets/` siap untuk static files (images, icons, fonts)
- Struktur ini scalable untuk menambah `hooks/`, `contexts/`, `constants/` di masa depan
- Semua import paths sudah di-update dan tested
- Development server berjalan normal di `http://localhost:5173`

---

**Version**: 2.0 (Restructured)  
**Last Updated**: January 19, 2026  
**Structure**: Enterprise Standard
