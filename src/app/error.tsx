'use client'
export default function GlobalError() {
  return (
    <html><body>
      <div className="max-w-lg mx-auto card">
        <h1 className="text-xl font-semibold">Something went wrong</h1>
        <p className="text-white/70">Please try again.</p>
      </div>
    </body></html>
  );
}
