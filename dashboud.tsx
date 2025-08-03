import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.NEXT_PUBLIC_JWT_SECRET || 'supersecretkey';

export default function DashboardPage() {
  const router = useRouter();
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    try {
      const decoded = jwt.verify(token, JWT_SECRET) as { email: string };
      setEmail(decoded.email);
    } catch (error) {
      localStorage.removeItem('token');
      router.push('/login');
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/login');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white shadow-md p-8 rounded text-center">
        <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
        {email ? (
          <>
            <p className="mb-4">Selamat datang, <strong>{email}</strong>!</p>
            <button
              onClick={handleLogout}
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
            >
              Keluar
            </button>
          </>
        ) : (
          <p>Mengecek sesi...</p>
        )}
      </div>
    </div>
  );
}
