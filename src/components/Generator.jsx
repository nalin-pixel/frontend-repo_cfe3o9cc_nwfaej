import { useState, useMemo } from 'react'

const defaultPrompt = 'A photorealistic image of a cozy reading nook by a window, soft morning light, plants, warm tones'

function Label({ children }) {
  return <label className="block text-sm font-medium text-blue-200/90 mb-1">{children}</label>
}

function Slider({ value, onChange, min, max, step }) {
  return (
    <input
      type="range"
      min={min}
      max={max}
      step={step}
      value={value}
      onChange={(e) => onChange(parseFloat(e.target.value))}
      className="w-full accent-blue-500"
    />
  )
}

export default function Generator() {
  const [prompt, setPrompt] = useState(defaultPrompt)
  const [negativePrompt, setNegativePrompt] = useState('')
  const [steps, setSteps] = useState(28)
  const [guidance, setGuidance] = useState(7.5)
  const [seed, setSeed] = useState('')
  const [provider, setProvider] = useState('mock')
  const [image, setImage] = useState(null)
  const [status, setStatus] = useState('')
  const [latency, setLatency] = useState(null)

  const backend = useMemo(() => import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000', [])

  const generate = async () => {
    setStatus('Generating...')
    setLatency(null)
    setImage(null)

    try {
      const body = {
        prompt,
        negative_prompt: negativePrompt,
        steps: Number(steps),
        guidance_scale: Number(guidance),
        seed: seed === '' ? null : Number(seed),
        width: 640,
        height: 640,
        provider,
      }

      const res = await fetch(`${backend}/api/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })

      if (!res.ok) {
        throw new Error(`Request failed: ${res.status}`)
      }

      const data = await res.json()
      setImage(data.image)
      setLatency(data.latency_ms)
      setStatus(`Done via ${data.provider_used}`)
    } catch (e) {
      console.error(e)
      setStatus('Something went wrong. Falling back to mock output.')
      // Local mock fallback if backend failed entirely
      const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='640' height='640'><rect width='100%' height='100%' fill='#0f172a'/><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' fill='#60a5fa' font-family='Inter, system-ui' font-size='18'>${prompt}</text></svg>`
      const b64 = btoa(svg)
      setImage(`data:image/svg+xml;base64,${b64}`)
    }
  }

  return (
    <div className="relative bg-slate-800/50 backdrop-blur border border-blue-500/20 rounded-2xl p-6 shadow-xl">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <div className="space-y-4">
            <div>
              <Label>Prompt</Label>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                rows={3}
                placeholder="Describe the image you want to see"
                className="w-full bg-slate-900/50 text-white placeholder:text-blue-200/40 border border-blue-500/20 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
              />
            </div>

            <div>
              <Label>Negative prompt</Label>
              <input
                value={negativePrompt}
                onChange={(e) => setNegativePrompt(e.target.value)}
                placeholder="low quality, blurry, artifacts"
                className="w-full bg-slate-900/50 text-white placeholder:text-blue-200/40 border border-blue-500/20 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <div className="flex items-center justify-between">
                  <Label>Steps</Label>
                  <span className="text-blue-200/70 text-xs">{steps}</span>
                </div>
                <Slider value={steps} onChange={setSteps} min={1} max={100} step={1} />
              </div>
              <div>
                <div className="flex items-center justify-between">
                  <Label>Guidance</Label>
                  <span className="text-blue-200/70 text-xs">{guidance}</span>
                </div>
                <Slider value={guidance} onChange={setGuidance} min={0} max={20} step={0.5} />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <Label>Seed</Label>
                <input
                  value={seed}
                  onChange={(e) => setSeed(e.target.value.replace(/[^0-9]/g, ''))}
                  placeholder="auto"
                  className="w-full bg-slate-900/50 text-white placeholder:text-blue-200/40 border border-blue-500/20 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                />
              </div>

              <div className="sm:col-span-2">
                <Label>Provider</Label>
                <select
                  value={provider}
                  onChange={(e) => setProvider(e.target.value)}
                  className="w-full bg-slate-900/50 text-white border border-blue-500/20 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                >
                  <option value="mock">Mock (no key)</option>
                  <option value="stability">Stability AI</option>
                  <option value="replicate">Replicate</option>
                </select>
              </div>
            </div>

            <div className="flex gap-3">
              <button onClick={generate} className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-4 rounded-lg transition-colors">Generate</button>
              <button onClick={() => setImage(null)} className="px-4 py-3 rounded-lg border border-blue-500/30 text-blue-200 hover:bg-slate-900/40 transition-colors">Clear</button>
            </div>

            {status && <p className="text-blue-200/80 text-sm">{status}{latency !== null ? ` • ${latency} ms` : ''}</p>}
          </div>
        </div>

        <div className="bg-slate-900/40 border border-blue-500/10 rounded-xl p-4 min-h-[320px] flex items-center justify-center">
          {image ? (
            <img src={image} alt="Generated" className="rounded-lg shadow-2xl max-h-[512px] object-contain" />
          ) : (
            <div className="text-center text-blue-200/60">
              <p>No image yet. Enter a prompt and hit Generate.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
