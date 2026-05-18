export default function HomePage() {

  return (

    <main
      style={{
        maxWidth: 700,
        margin: '40px auto',
        padding: '20px',
        fontFamily: 'Arial'
      }}
    >

      <h1>Lead Distribution System</h1>

      <p>
        Welcome to the Provider Allocation System
      </p>

      <div style={{ marginTop: 20 }}>

        <a
          href="/request-service"
          style={{
            display: 'inline-block',
            padding: '12px 20px',
            background: '#0070f3',
            color: 'white',
            textDecoration: 'none',
            borderRadius: 8,
            marginRight: 12
          }}
        >
          Request Service
        </a>

        <a
          href="/dashboard"
          style={{
            display: 'inline-block',
            padding: '12px 20px',
            background: 'black',
            color: 'white',
            textDecoration: 'none',
            borderRadius: 8
          }}
        >
          Open Dashboard
        </a>

      </div>

    </main>

  )
}