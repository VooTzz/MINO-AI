import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

interface Invoice {
  id: number;
  user: string;
  client: string;
  amount: string;
  dueDate: string;
  description: string;
  createdAt: string;
}

export default function PrintInvoice() {
  const router = useRouter();
  const { id } = router.query;
  const [invoice, setInvoice] = useState<Invoice | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token || !id) return router.push('/login');

    fetch('/api/invoice/list', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        const found = data.invoices.find((inv: Invoice) => inv.id.toString() === id);
        if (found) {
          setInvoice(found);
          setTimeout(() => window.print(), 500); // otomatis print
        } else {
          router.push('/404');
        }
      });
  }, [id]);

  if (!invoice) return <p className="p-6">Menyiapkan invoice...</p>;

  return (
    <div className="p-10 text-black bg-white min-h-screen print:bg-white print:text-black">
      <h1 className="text-3xl font-bold mb-4">INVOICE</h1>
      <p><strong>ID:</strong> #{invoice.id}</p>
      <p><strong>Tanggal:</strong> {new Date(invoice.createdAt).toLocaleDateString()}</p>
      <hr className="my-4" />

      <p><strong>Klien:</strong> {invoice.client}</p>
      <p><strong>Jumlah:</strong> Rp{invoice.amount}</p>
      <p><strong>Jatuh Tempo:</strong> {invoice.dueDate}</p>
      <p><strong>Deskripsi:</strong></p>
      <p className="whitespace-pre-wrap">{invoice.description}</p>

      <div className="mt-10 text-sm text-gray-500 print:hidden">
        <p>Jika dialog print tidak muncul, tekan Ctrl + P atau Cmd + P.</p>
      </div>
    </div>
  );
}
