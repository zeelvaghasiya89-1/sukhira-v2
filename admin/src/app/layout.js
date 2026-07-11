import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import AdminLayout from '@/components/layout/AdminLayout';

export const metadata = {
  title: 'Sukhira Admin Dashboard',
  description: 'Manage products, orders, stock levels, customers, coupons and analytics for Sukhira Herbal Tea.'
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <AdminLayout>{children}</AdminLayout>
        </AuthProvider>
      </body>
    </html>
  );
}
