'use client'
import { useState, useEffect } from 'react'

type Service = { id: number; name: string }

type SubmittedLead = {
  name: string
  phone: string
  city: string
  serviceName: string
  description: string
  leadId: number
}

export default function RequestService() {
  const [services, setServices] = useState<Service[]>([])
  const [form, setForm] = useState({
    name: '', phone: '', city: '', serviceId: '', description: ''
  })
  const [error, setError] = useState('')
  const [submitted, setSubmitted] = useState<SubmittedLead | null>(null)
  const [loading, setLoading] = useState(false)

  // Fetch services from DB on page load
  useEffect(() => {
    fetch('/api/services')
      .then(r => r.json())
      .then(data => {
        setServices(data)
        if (data.length > 0) setForm(f => ({ ...f, serviceId: String(data[0].id) }))
      })
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    const res = await fetch('/api/leads', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, serviceId: Number(form.serviceId) })
    })

    const data = await res.json()
    setLoading(false)

    if (!res.ok) {
      setError(data.error || 'Something went wrong')
      return
    }

    // Show thank you screen with submitted details
    const selectedService = services.find(s => s.id === Number(form.serviceId))
    setSubmitted({
      name: form.name,
      phone: form.phone,
      city: form.city,
      serviceName: selectedService?.name ?? '',
      description: form.description,
      leadId: data.leadId
    })
  }

  // ── Thank you screen ──
  if (submitted) {
    return (
      <main style={{ maxWidth: 480, margin: '60px auto', padding: '0 16px', fontFamily: 'sans-serif' }}>
        <div style={{
          border: '1px solid #d4edda', borderRadius: 12,
          padding: 32, background: '#f0fff4', textAlign: 'center'
        }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>✅</div>
          <h2 style={{ margin: '0 0 8px', color: '#1a7f37' }}>Request Submitted!</h2>
          <p style={{ color: '#555', marginBottom: 24 }}>
            We've received your enquiry and assigned it to providers. You'll hear back shortly.
          </p>

          <div style={{
            background: '#fff', borderRadius: 8, padding: 20,
            textAlign: 'left', border: '1px solid #c3e6cb'
          }}>
            <p style={{ margin: '0 0 8px', fontSize: 13, color: '#888' }}>
              Lead ID: <strong>#{submitted.leadId}</strong>
            </p>
            <hr style={{ margin: '8px 0', borderColor: '#e8f5e9' }} />
            {[
              ['Name', submitted.name],
              ['Phone', submitted.phone],
              ['City', submitted.city],
              ['Service', submitted.serviceName],
              ['Description', submitted.description],
            ].map(([label, value]) => (
              <div key={label} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', fontSize: 14 }}>
                <span style={{ color: '#666' }}>{label}</span>
                <span style={{ fontWeight: 500 }}>{value}</span>
              </div>
            ))}
          </div>

          <button
            onClick={() => {
              setSubmitted(null)
              setForm({ name: '', phone: '', city: '', serviceId: String(services[0]?.id ?? ''), description: '' })
            }}
            style={{
              marginTop: 24, padding: '10px 24px',
              background: '#1a7f37', color: '#fff',
              border: 'none', borderRadius: 8, cursor: 'pointer', fontSize: 14
            }}
          >
            Submit another request
          </button>
        </div>
      </main>
    )
  }

  // ── Form ──
  return (
    <main style={{ maxWidth: 480, margin: '40px auto', padding: '0 16px', fontFamily: 'sans-serif' }}>
      <h1 style={{ marginBottom: 24 }}>Request a Service</h1>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div>
          <label style={{ display: 'block', fontSize: 13, marginBottom: 4, color: '#555' }}>Name</label>
          <input
            style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid #ccc', fontSize: 14, boxSizing: 'border-box' }}
            placeholder="Your full name"
            value={form.name}
            onChange={e => setForm({ ...form, name: e.target.value })}
            required
          />
        </div>

        <div>
          <label style={{ display: 'block', fontSize: 13, marginBottom: 4, color: '#555' }}>Phone Number</label>
          <input
            style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid #ccc', fontSize: 14, boxSizing: 'border-box' }}
            placeholder="10-digit phone"
            value={form.phone}
            onChange={e => setForm({ ...form, phone: e.target.value })}
            required
          />
        </div>

        <div>
          <label style={{ display: 'block', fontSize: 13, marginBottom: 4, color: '#555' }}>City</label>
          <input
            style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid #ccc', fontSize: 14, boxSizing: 'border-box' }}
            placeholder="Your city"
            value={form.city}
            onChange={e => setForm({ ...form, city: e.target.value })}
            required
          />
        </div>

        <div>
          <label style={{ display: 'block', fontSize: 13, marginBottom: 4, color: '#555' }}>Service Type</label>
          <select
            style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid #ccc', fontSize: 14, boxSizing: 'border-box', background: '#fff' }}
            value={form.serviceId}
            onChange={e => setForm({ ...form, serviceId: e.target.value })}
          >
            {services.map(s => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label style={{ display: 'block', fontSize: 13, marginBottom: 4, color: '#555' }}>Description</label>
          <textarea
            style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid #ccc', fontSize: 14, boxSizing: 'border-box', minHeight: 90, resize: 'vertical' }}
            placeholder="Describe what you need"
            value={form.description}
            onChange={e => setForm({ ...form, description: e.target.value })}
            required
          />
        </div>

        {error && (
          <div style={{ padding: '10px 14px', background: '#fff0f0', border: '1px solid #ffcccc', borderRadius: 8, color: '#cc0000', fontSize: 14 }}>
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading || services.length === 0}
          style={{
            padding: '12px', background: loading ? '#aaa' : '#0070f3',
            color: '#fff', border: 'none', borderRadius: 8,
            cursor: loading ? 'not-allowed' : 'pointer', fontSize: 15, fontWeight: 500
          }}
        >
          {loading ? 'Submitting…' : 'Submit Request'}
        </button>
      </form>
    </main>
  )
}