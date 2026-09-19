// Redirect /admin/login to /admin-login
import { redirect } from 'next/navigation';

export default function AdminLoginRedirect() {
  redirect('/admin-login');
}
