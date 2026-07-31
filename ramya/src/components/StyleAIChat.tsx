'use client'

import { useState, useRef, useEffect } from 'react'
import { Sparkles, X, Send, ChevronDown } from 'lucide-react'

type Message = {
  role: 'user' | 'assistant'
  content: string
}

const SUGGESTIONS = [
  'What to wear to a wedding?',
  'Best saree for dusky skin tone',
  'Suggest an outfit for Diwali',
  'Party look under ₹2000',
]

function MarkdownText({ text }: { text: string }) {
  // Render **bold**, ✨⭐💎🎨 emoji headers, and line breaks
  const lines = text.split('\n')
  return (
    <div className="space-y-1.5">
      {lines.map((line, i) => {
        if (!line.trim()) return <div key={i} className="h-1" />
        // Section headers (lines starting with emoji)
        if (/^[✨⭐💎🎨]/.test(line.trim())) {
          return (
            <p key={i} className="text-[#FBC02D] font-semibold text-xs tracking-wide mt-3 mb-1">
              {line.trim()}
            </p>
          )
        }
        // Render **bold** inline
        const parts = line.split(/(\*\*[^*]+\*\*)/)
        return (
          <p key={i} className="text-[#F5E6D0]/90 text-xs leading-relaxed">
            {parts.map((part, j) =>
              part.startsWith('**') && part.endsWith('**')
                ? <strong key={j} className="text-[#F5E6D0] font-semibold">{part.slice(2, -2)}</strong>
                : part
            )}
          </p>
        )
      })}
    </div>
  )
}

export default function StyleAIChat() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: "Hi! I'm **StyleAI** ✨ — your personal stylist at Luxy Haven.\n\nTell me the occasion, your style preference, or what you're looking for and I'll find the perfect look for you.",
    },
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (open) {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
      setTimeout(() => inputRef.current?.focus(), 100)
    }
  }, [open, messages])

  async function sendMessage(text?: string) {
    const content = (text ?? input).trim()
    if (!content || loading) return

    const userMsg: Message = { role: 'user', content }
    const updated = [...messages, userMsg]
    setMessages(updated)
    setInput('')
    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/styleai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: updated }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'Failed')
      setMessages([...updated, { role: 'assistant', content: data.reply }])
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Something went wrong.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setOpen(o => !o)}
        aria-label="Open StyleAI"
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full flex items-center justify-center
                   bg-[#FBC02D] text-[#1A0000] shadow-[0_0_30px_rgba(251,192,45,0.5)]
                   hover:bg-[#F9A825] hover:shadow-[0_0_40px_rgba(251,192,45,0.7)]
                   transition-all duration-300"
      >
        {open ? <ChevronDown size={22} /> : <Sparkles size={22} />}
      </button>

      {/* Chat panel */}
      {open && (
        <div
          className="fixed bottom-24 right-6 z-50 w-[360px] max-w-[calc(100vw-24px)]
                     flex flex-col rounded-none overflow-hidden
                     border border-[#5C1010]
                     shadow-[0_20px_60px_rgba(0,0,0,0.8),0_0_0_1px_rgba(251,192,45,0.08)]"
          style={{ height: '520px', background: 'rgba(20,0,0,0.97)', backdropFilter: 'blur(16px)' }}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-[#5C1010] bg-[#3B0A0A]/90">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-full bg-[#FBC02D] flex items-center justify-center">
                <Sparkles size={13} className="text-[#1A0000]" />
              </div>
              <div>
                <p className="text-[#FBC02D] text-xs font-semibold tracking-widest uppercase">StyleAI</p>
                <p className="text-[#F5E6D0]/40 text-[9px] tracking-widest uppercase">Personal Stylist</p>
              </div>
            </div>
            <button onClick={() => setOpen(false)} className="text-[#F5E6D0]/40 hover:text-[#FBC02D] transition-colors">
              <X size={16} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 scrollbar-thin">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                {msg.role === 'assistant' && (
                  <div className="w-5 h-5 rounded-full bg-[#FBC02D]/20 border border-[#FBC02D]/30
                                  flex items-center justify-center flex-shrink-0 mt-0.5 mr-2">
                    <Sparkles size={10} className="text-[#FBC02D]" />
                  </div>
                )}
                <div
                  className={`max-w-[82%] px-3 py-2.5 text-xs leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-[#5C1010]/80 border border-[#8B1A1A] text-[#F5E6D0]'
                      : 'bg-[#2A0505]/60 border border-[#5C1010] text-[#F5E6D0]/90'
                  }`}
                >
                  {msg.role === 'assistant'
                    ? <MarkdownText text={msg.content} />
                    : <p className="text-xs">{msg.content}</p>}
                </div>
              </div>
            ))}

            {/* Loading dots */}
            {loading && (
              <div className="flex justify-start">
                <div className="w-5 h-5 rounded-full bg-[#FBC02D]/20 border border-[#FBC02D]/30
                                flex items-center justify-center flex-shrink-0 mt-0.5 mr-2">
                  <Sparkles size={10} className="text-[#FBC02D]" />
                </div>
                <div className="bg-[#2A0505]/60 border border-[#5C1010] px-4 py-3 flex items-center gap-1.5">
                  {[0, 1, 2].map(d => (
                    <span key={d} className="w-1.5 h-1.5 rounded-full bg-[#FBC02D]/60 animate-bounce"
                      style={{ animationDelay: `${d * 0.15}s` }} />
                  ))}
                </div>
              </div>
            )}

            {/* Error */}
            {error && (
              <p className="text-[10px] text-[#C0392B] text-center tracking-wide">{error}</p>
            )}

            <div ref={bottomRef} />
          </div>

          {/* Quick suggestions — only show when just the greeting */}
          {messages.length === 1 && !loading && (
            <div className="px-4 pb-2 flex flex-wrap gap-1.5">
              {SUGGESTIONS.map(s => (
                <button
                  key={s}
                  onClick={() => sendMessage(s)}
                  className="text-[9px] tracking-wide px-2.5 py-1 border border-[#5C1010]
                             text-[#FBC02D]/70 hover:text-[#FBC02D] hover:border-[#FBC02D]/50
                             transition-colors bg-[#3B0A0A]/40"
                >
                  {s}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <div className="border-t border-[#5C1010] px-3 py-2.5 flex items-center gap-2 bg-[#1A0000]/80">
            <input
              ref={inputRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && !e.shiftKey && sendMessage()}
              placeholder="Ask your stylist…"
              disabled={loading}
              className="flex-1 bg-transparent text-[#F5E6D0] text-xs outline-none
                         placeholder:text-[#F5E6D0]/25 disabled:opacity-50"
            />
            <button
              onClick={() => sendMessage()}
              disabled={loading || !input.trim()}
              className="w-7 h-7 flex items-center justify-center
                         bg-[#FBC02D] text-[#1A0000] disabled:opacity-30
                         hover:bg-[#F9A825] transition-colors flex-shrink-0"
            >
              <Send size={13} />
            </button>
          </div>

          {/* Branding */}
          <div className="text-center py-1.5 bg-[#1A0000]/60 border-t border-[#3B0A0A]">
            <p className="text-[8px] tracking-[0.2em] uppercase text-[#FBC02D]/20">Powered by StyleAI · Luxy Haven</p>
          </div>
        </div>
      )}
    </>
  )
}
