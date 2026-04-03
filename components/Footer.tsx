export default function Footer() {
  return (
    <footer className="bg-white/80 backdrop-blur-sm border-t border-slate-200 mt-auto">
      <div className="container mx-auto px-4 py-6 max-w-6xl">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-slate-500">
            © {new Date().getFullYear()} AI Document Analyzer. All rights reserved.
          </p>
          <div className="flex items-center gap-6 text-sm text-slate-500">
            <span>Supports: TXT, PDF text, Markdown</span>
            <span>•</span>
            <span>Max 50,000 characters</span>
            <span>•</span>
            <span>Instant analysis</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
