import type { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';
import { getJsonFileFromGitHub } from '../../../lib/github';

const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') return res.status(405).json({ message: 'Method not allowed' });

  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: 'Token tidak ditemukan' });

  const token = authHeader.split(' ')[1];
  let userEmail = '';

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { email: string };
    userEmail = decoded.email;
  } catch {
    return res.status(401).json({ message: 'Token tidak valid' });
  }

  try {
    const invoices = await getJsonFileFromGitHub('invoices.json');
    const userInvoices = invoices.filter((inv: any) => inv.user === userEmail);

    res.status(200).json({ invoices: userInvoices });
  } catch (err) {
    res.status(500).json({ message: 'Gagal mengambil data invoice', error: String(err) });
  }
}
