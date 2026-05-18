'use client'

import { useState, useEffect } from 'react'

interface LeadAssignment {
  id: number
  lead: {
    name: string
    service: {
      name: string
    }
  }
}

interface Provider {
  id: number
  name: string
  leadsReceived: number
  monthlyQuota: number
  leadAssignments: LeadAssignment[]
}

export default function Dashboard() {

  const [providers, setProviders] = useState<Provider[]>([])

  async function fetchData() {

    const res = await fetch('/api/dashboard')

    const data = await res.json()

    setProviders(data)
  }

  useEffect(() => {

  async function loadData() {
    await fetchData()
  }

  void loadData()

  const interval = setInterval(() => {
    void loadData()
  }, 3000)

  return () => clearInterval(interval)

}, [])

  return (
    <main style={{ maxWidth: 900, margin: '40px auto', padding: '0 16px' }}>

      <h1>Provider Dashboard</h1>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: 16
        }}
      >

        {providers.map((p) => (

          <div
            key={p.id}
            style={{
              border: '1px solid #ddd',
              borderRadius: 8,
              padding: 16
            }}
          >

            <h3>{p.name}</h3>

            <p>
              Leads received: {p.leadsReceived}
            </p>

            <p>
              Remaining quota:
              {p.monthlyQuota - p.leadsReceived}
            </p>

            <h4>Assigned Leads:</h4>

            <ul>

              {p.leadAssignments.map((a) => (

                <li key={a.id}>
                  {a.lead.name} — {a.lead.service.name}
                </li>

              ))}

            </ul>

          </div>

        ))}

      </div>

    </main>
  )
}