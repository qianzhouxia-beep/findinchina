'use client'
import { useState, useTransition, useMemo } from 'react'

interface GalleryItem {
  src: string
  alt?: string
}

export function GalleryEditor({
  slug,
  initialGallery,
  lastVerified,
}: {
  slug: string
  initialGallery: GalleryItem[]
  lastVerified: string | null
}) {
  const initialText = useMemo(
    () => initialGallery.map((g) => g.src).join('\n'),
    [initialGallery]
  )
  const [text, setText] = useState(initialText)
  const [savedAt, setSavedAt] = useState<string | null>(null)
  const [err, setErr] = useState<string | null>(null)
  const [pending, start] = useTransition()
  const [dirty, setDirty] = useState(false)

  // Live preview: parse lines, build gallery items
  const previewItems = useMemo(() => {
    return text
      .split('\n')
      .map((l) => l.trim())
      .filter((l) => l.length > 0)
  }, [text])

  function onChange(v: string) {
    setText(v)
    setDirty(v !== initialText)
    setSavedAt(null)
    setErr(null)
  }

  function save() {
    setErr(null)
    setSavedAt(null)
    start(async () => {
      const r = await fetch(`/api/admin/brands/${encodeURIComponent(slug)}`, {
        method: 'PUT',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ gallery: previewItems }),
      })
      if (r.ok) {
        const j = await r.json()
        setSavedAt(new Date().toLocaleTimeString())
        setDirty(false)
        // Note: gallery written = j.brand.gallery (server returns it)
        if (j.brand?.last_verified) {
          // small UX nicety: show updated last_verified
        }
      } else {
        const j = await r.json().catch(() => ({}))
        setErr(j.error || `HTTP ${r.status}`)
      }
    })
  }

  function reset() {
    setText(initialText)
    setDirty(false)
    setErr(null)
    setSavedAt(null)
  }

  return (
    <div>
      <div className="flex items-baseline justify-between mb-3">
        <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-widest">
          Gallery URLs
        </h3>
        <div className="text-xs text-slate-500">
          {previewItems.length} {previewItems.length === 1 ? 'image' : 'images'}
          {lastVerified && (
            <span className="ml-2 text-slate-400">
              (last verified {lastVerified})
            </span>
          )}
        </div>
      </div>

      <p className="text-xs text-slate-500 mb-2">
        One URL per line. Must start with <code>/brands/</code>. Files live
        under <code>public/brands/{slug}/</code>.
      </p>

      <textarea
        value={text}
        onChange={(e) => onChange(e.target.value)}
        rows={Math.max(6, previewItems.length + 1)}
        className="w-full font-mono text-xs border border-slate-300 rounded p-3 focus:outline-none focus:ring-2 focus:ring-brand-500 resize-y"
        spellCheck={false}
      />

      {/* Live preview */}
      {previewItems.length > 0 && (
        <div className="mt-5">
          <div className="text-xs font-semibold text-slate-600 uppercase tracking-widest mb-2">
            Preview
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
            {previewItems.map((src, i) => (
              <div
                key={i}
                className="aspect-square bg-slate-50 border border-slate-200 rounded overflow-hidden"
                title={src}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={src}
                  alt={src}
                  className="w-full h-full object-contain p-1"
                  onError={(e) => {
                    ;(e.currentTarget as HTMLImageElement).style.opacity = '0.2'
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="mt-5 flex items-center gap-3 flex-wrap">
        <button
          type="button"
          onClick={save}
          disabled={pending || !dirty || previewItems.length === 0}
          className="bg-brand-600 hover:bg-brand-700 text-white font-semibold rounded px-5 py-2 disabled:opacity-50"
        >
          {pending ? 'Saving…' : 'Save'}
        </button>
        <button
          type="button"
          onClick={reset}
          disabled={pending || !dirty}
          className="text-sm text-slate-600 hover:text-slate-900 disabled:opacity-50"
        >
          Reset
        </button>

        <div className="ml-auto text-sm">
          {savedAt && (
            <span className="text-green-700">✓ Saved at {savedAt}</span>
          )}
          {err && <span className="text-red-600">Error: {err}</span>}
        </div>
      </div>
    </div>
  )
}
