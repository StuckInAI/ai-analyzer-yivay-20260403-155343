import Header from '@/components/Header';
import DocumentAnalyzer from '@/components/DocumentAnalyzer';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <Header />
      <div className="flex-1 container mx-auto px-4 py-8 max-w-6xl">
        <DocumentAnalyzer />
      </div>
      <Footer />
    </main>
  );
}
