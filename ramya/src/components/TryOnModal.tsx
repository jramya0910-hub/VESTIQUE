'use client'

import { useState, useRef } from 'react'
import { X, Upload, Camera } from 'lucide-react'
import { Product } from '@/lib/supabase'

interface TryOnModalProps {
  product: Product
  onClose: () => void
}

export default function TryOnModal({ product, onClose }: TryOnModalProps) {
  const [photoPreview, setPhotoPreview] = useState<string | null>(null)
  const [mode, setMode] = useState<'upload' | 'camera'>('upload')
  const fileRef = useRef<HTMLInputElement>(null)

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => setPhotoPreview(ev.target?.result as string)
    reader.readAsDataURL(file)
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-end sm:items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <div>
            <h2 className="text-lg font-bold text-gray-900">Virtual Try-On</h2>
            <p className="text-xs text-gray-500 mt-0.5">See how {product.name} looks on you</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Mode toggle */}
        <div className="flex gap-2 p-4 pb-0">
          {(['upload', 'camera'] as const).map(m => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
                mode === m
                  ? 'bg-violet-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {m === 'upload' ? <><Upload size={14} className="inline mr-1" />Upload Photo</> : <><Camera size={14} className="inline mr-1" />Camera</>}
            </button>
          ))}
        </div>

        {/* Preview area */}
        <div className="p-4">
          <div className="relative rounded-xl overflow-hidden bg-gray-50 border-2 border-dashed border-gray-200"
               style={{ minHeight: 280 }}>
            {photoPreview ? (
              <div className="relative w-full h-72">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={photoPreview} alt="Your photo" className="w-full h-full object-cover" />
                {/* Dress overlay */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  {product.image_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={product.image_url}
                      alt={product.name}
                      className="h-3/4 object-contain opacity-75 drop-shadow-2xl"
                    />
                  ) : (
                    <span className="text-8xl opacity-60">👗</span>
                  )}
                </div>
                <div className="absolute top-3 left-3">
                  <span className="bg-white/90 text-xs font-semibold px-2 py-1 rounded-full text-violet-700">
                    {product.name}
                  </span>
                </div>
              </div>
            ) : mode === 'upload' ? (
              <button
                onClick={() => fileRef.current?.click()}
                className="w-full h-72 flex flex-col items-center justify-center gap-3 text-gray-400 hover:text-violet-500 transition-colors"
              >
                <Upload size={40} strokeWidth={1.5} />
                <div className="text-sm font-medium">Click to upload your photo</div>
                <div className="text-xs">JPG, PNG — full body works best</div>
              </button>
            ) : (
              <div className="w-full h-72 flex flex-col items-center justify-center gap-3 text-gray-400">
                <Camera size={40} strokeWidth={1.5} />
                <div className="text-sm font-medium">Camera access</div>
                <div className="text-xs text-center px-4">Camera try-on requires a live environment with HTTPS</div>
              </div>
            )}
          </div>

          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFile}
          />

          {/* Controls */}
          <div className="flex gap-3 mt-4">
            {photoPreview && (
              <button
                onClick={() => setPhotoPreview(null)}
                className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
              >
                Change Photo
              </button>
            )}
            <button
              onClick={() => fileRef.current?.click()}
              className="flex-1 py-2.5 rounded-xl bg-violet-600 text-white text-sm font-medium hover:bg-violet-700 transition-colors"
            >
              {photoPreview ? 'Try Different Photo' : 'Upload Photo'}
            </button>
          </div>

          <p className="text-xs text-center text-gray-400 mt-3">
            📱 Photos are processed locally — never uploaded to any server
          </p>
        </div>
      </div>
    </div>
  )
}
