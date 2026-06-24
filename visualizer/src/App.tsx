import { useEffect, useState } from 'react'
import Papa from 'papaparse'
import MealBuilder from './components/MealBuilder'

function App() {
  const [data, setData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/nutrition.csv?t=' + Date.now())
      .then(res => res.text())
      .then(csvText => {
        Papa.parse(csvText, {
          header: true,
          skipEmptyLines: true,
          complete: (results) => {
            const validData = results.data.filter((row: any) => {
              const name = row['Food Item']
              return name && name.trim() !== '' && name !== 'Food Item'
            })
            setData(validData)
            setLoading(false)
          }
        })
      })
  }, [])

  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '40px 24px' }}>
      <header style={{ textAlign: 'center', marginBottom: '40px' }}>
        <h1 className="gradient-text" style={{ fontSize: '3rem', marginBottom: '16px' }}>
          Interactive Meal & RDI Builder
        </h1>
        <p style={{ color: 'var(--text-secondary)' }}>Add foods and track your RDI progression.</p>
      </header>
      
      {loading ? (
        <div style={{ textAlign: 'center', marginTop: '100px', color: 'var(--accent-1)' }}>
          Loading dataset...
        </div>
      ) : (
        <MealBuilder data={data} />
      )}
    </div>
  )
}

export default App
