import { useState, FormEvent, useEffect } from 'react';
import { useRouter } from 'next/router';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.NEXT_PUBLIC_JWT_SECRET || 'supersecretkey';

export default function CreateInvoicePage() {
  const router = useRouter();
  const [userEmail, setUserEmail] = useState('');
  const [form, setForm] = useState({
    client: '',
    amount: '',
    dueDate: '',
    description: '',
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return router.push('/login');

    try {
      const decoded = jwt.verify(token, JWT_SECRET) as { email: string };
      setUserEmail(decoded.email);
    } catch {
      localStorage.removeItem('token');
      router.push('/login');
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    const res = await fetch('/api/invoice/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ ...form, user: userEmail }),
    });

    const data = await res.json();
    if (res.ok) {
      alert('Invoice berhasil dibuat!');
      router.push('/dashboard');
    } else {
      alert('Gagal: ' + data.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-8 shadow-lg rounded w-full max-w-lg">
        <h2 className="text-xl font-bold mb-6 text-center">Buat Invoice Baru</h2>
        <input
          type="text"
          name="client"
          placeholder="Nama Klien"
          onChange={handleChange}
          className="w-full mb-3 px-4 py-2 border rounded"
          required
        />
        <input
          type="number"
          name="amount"
          placeholder="Jumlah (Rp)"
          onChange={handleChange}
          className="w-full mb-3 px-4 py-2 border rounded"
          required
        />
        <input
          type="date"
          name="dueDate"
          placeholder="Jatuh Tempo"
          onChange={handleChange}
          className="w-full mb-3 px-4 py-2 border rounded"
          required
        />
        <textarea
          name="description"
          placeholder="Keterangan"
          onChange={handleChange}
          className="w-full mb-4 px-4 py-2 border rounded"
        />
        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
          Simpan Invoice
        </button>
      </form>
    </div>
  );
}
