export default function LoadingState() {
  const steps = [
    { label: 'Reading document...', delay: '0ms' },
    { label: 'Extracting key phrases...', delay: '200ms' },
    { label: 'Analyzing sentiment...', delay: '400ms' },
    { label: 'Generating summary...', delay: '600ms' },
    { label: 'Identifying action items...', delay: '800ms' },
  ];

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-12">
      <div className="max-w-md mx-auto text-center">
        <div className="relative w-20 h-20 mx-auto mb-6">
          <div className="absolute inset-0 rounded-full border-4 border-indigo-100"></div>
          <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-indigo-600 animate-spin"></div>
          <div className="absolute inset-3 rounded-full bg-indigo-50 flex items-center justify-center">
            <span className="text-2xl">🧠</span>
          </div>
        </div>

        <h3 className="text-xl font-semibold text-slate-900 mb-2">Analyzing Your Document</h3>
        <p className="text-slate-500 mb-8">Our AI is processing your content...</p>

        <div className="space-y-3 text-left">
          {steps.map((step, index) => (
            <div
              key={index}
              className="flex items-center gap-3 opacity-0 animate-pulse"
              style={{
                animationDelay: step.delay,
                animationFillMode: 'forwards',
                opacity: 1,
              }}
            >
              <div className="w-2 h-2 rounded-full bg-indigo-400 flex-shrink-0"></div>
              <span className="text-sm text-slate-600">{step.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
