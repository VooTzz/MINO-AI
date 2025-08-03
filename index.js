import Head from 'next/head';
import Link from 'next/link';

export default function Home() {
  return (
    <>
      <Head>
        <title>Inovice - Buat Invoice Online</title>
        <meta name="description" content="Buat dan kirim invoice profesional secara gratis dan mudah." />
      </Head>

      {/* Musik autoplay (tidak tampil di layar) */}
      <audio autoPlay loop hidden>
        <source src="https://www.bensound.com/bensound-music/bensound-goinghigher.mp3" type="audio/mpeg" />
      </audio>

      {/* Background full screen dengan overlay */}
      <div
        className="min-h-screen bg-cover bg-center flex items-center justify-center relative text-white"
        style={{
          backgroundImage: `url('https://source.unsplash.com/1600x900/?invoice,office')`,
        }}
      >
        {/* Overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-60"></div>

        {/* Konten utama */}
        <div className="relative z-10 text-center px-4">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">Inovice</h1>
          <p className="text-lg md:text-xl mb-6">Buat dan kirim invoice profesional hanya dalam hitungan detik</p>
          <div className="space-x-4">
            <Link href="/login" className="bg-white text-black px-6 py-2 rounded-xl font-semibold hover:bg-gray-200">
              Masuk
            </Link>
            <Link href="/register" className="bg-transparent border border-white px-6 py-2 rounded-xl hover:bg-white hover:text-black font-semibold">
              Daftar
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
