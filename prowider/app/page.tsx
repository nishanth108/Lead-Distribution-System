import Link from 'next/link'

export default function Home() {
  return (
    <main style={{ maxWidth: 400, margin: '80px auto', fontFamily: 'sans-serif', textAlign: 'center' }}>
      <h1>Prowider</h1>
      <p style={{ color: '#666', marginBottom: 32 }}>Lead Distribution System</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <Link href="/request-service" style={{ padding: '12px 24px', background: '#0070f3', color: '#fff', borderRadius: 8, textDecoration: 'none' }}>
          Request a Service
        </Link>
        <Link href="/dashboard" style={{ padding: '12px 24px', background: '#fff', color: '#0070f3', border: '1px solid #0070f3', borderRadius: 8, textDecoration: 'none' }}>
          Provider Dashboard
        </Link>
        <Link href="/test-tools" style={{ padding: '12px 24px', background: '#fff', color: '#666', border: '1px solid #ccc', borderRadius: 8, textDecoration: 'none' }}>
          Test Tools
        </Link>
      </div>
    </main>
  )
}