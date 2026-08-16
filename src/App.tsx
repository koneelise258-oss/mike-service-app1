import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '@/context/AuthContext';
import { Layout } from '@/components/Layout';
import { HomePage } from '@/pages/HomePage';
import { CatalogPage } from '@/pages/CatalogPage';
import { PhoneDetailPage } from '@/pages/PhoneDetailPage';
import { AccessoriesPage } from '@/pages/AccessoriesPage';
import { ContactPage } from '@/pages/ContactPage';
import { AdminLoginPage } from '@/pages/admin/AdminLoginPage';
import { AdminDashboardPage } from '@/pages/admin/AdminDashboardPage';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/catalogue" element={<CatalogPage />} />
            <Route path="/telephone/:brandSlug/:modelSlug" element={<PhoneDetailPage />} />
            <Route path="/accessoires" element={<AccessoriesPage />} />
            <Route path="/contact" element={<ContactPage />} />
          </Route>
          <Route path="/admin" element={<AdminLoginPage />} />
          <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
              }
