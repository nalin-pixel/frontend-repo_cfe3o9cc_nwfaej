import Generator from './components/Generator'

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.05),transparent_50%)]"></div>

      <div className="relative min-h-screen p-6 sm:p-10">
        <header className="max-w-5xl mx-auto text-center mb-10">
          <div className="inline-flex items-center justify-center mb-6">
            <img
              src="/flame-icon.svg"
              alt="Flames"
              className="w-16 h-16 drop-shadow-[0_0_25px_rgba(59,130,246,0.5)]"
            />
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4 tracking-tight">
            Text-to-Image Playground
          </h1>
          <p className="text-lg text-blue-200">
            Type a description and generate an image. Works in mock mode by default — plug in an API key later for real images.
          </p>
        </header>

        <main className="max-w-5xl mx-auto">
          <Generator />

          <div className="text-center mt-10 text-blue-300/60 text-sm">
            <p>No keys needed to try it. For real generations, set the provider and add keys in the backend env.</p>
          </div>
        </main>
      </div>
    </div>
  )
}

export default App
