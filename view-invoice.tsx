import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.NEXT_PUBLIC_JWT_SECRET || 'supersecretkey';

interface Invoice {
  id: number;
  user: string;
  client: string;
  amount: string;
  dueDate: string;
  description: string;
  createdAt: string;
}

export default function ViewInvoice() {
  const router = useRouter();
  const { id } = router.query;
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    const token = localStorage.getItem('token');
    if (!token) return router.push('/login');

    try {
      jwt.verify(token, JWT_SECRET);
    } catch {
      localStorage.removeItem('token');
      return router.push('/login');
    }

    fetch('/api/invoice/list', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(data => {
        const found = data.invoices.find((inv: Invoice) => inv.id.toString() === id);
        if (!found) return router.push('/404');
        setInvoice(found);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
        router.push('/404');
      });
  }, [id]);

  if (loading) return <p className="p-6">Loading...</p>;
  if (!invoice) return null;

  return (
    <div className="min-h-screen p-6 bg-gray-100">
      <div className="max-w-xl mx-auto bg-white shadow-md rounded p-6">
        <h1 className="text-xl font-bold mb-4">Invoice Detail</h1>
        <p><strong>Klien:</strong> {invoice.client}</p>
        <p><strong>Jumlah:</strong> Rp{invoice.amount}</p>
        <p><strong>Jatuh Tempo:</strong> {invoice.dueDate}</p>
        <p><strong>Keterangan:</strong> {invoice.description}</p>
        <p className="text-sm text-gray-500 mt-3">Dibuat: {new Date(invoice.createdAt).toLocaleString()}</p>

        <div className="mt-6 flex gap-4">
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded"
            onClick={() => router.push(`/print-invoice?id=${invoice.id}`)}
          >
            Cetak
          </button>
          <button
            className="bg-gray-400 text-white px-4 py-2 rounded"
            onClick={() => router.push('/invoices')}
          >
            Kembali
          </button>
        </div>
      </div>
    </div>
  );
}
