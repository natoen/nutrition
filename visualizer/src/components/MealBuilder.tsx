import React, { useState, useMemo } from 'react'
import { Plus, Minus, Info } from 'lucide-react'
import './MealBuilder.css'

interface MealBuilderProps {
  data: any[]
}

const NUTRIENT_GROUPS = {
  Macronutrients: [
    'Calories (kcal)', 'Protein (g)', 'Fat (g)', 'Carbohydrates (g)', 
    'Dietary Fiber (g)', 'Sodium (mg)'
  ],
  'Fat Soluble Vitamins': [
    'Vitamin A (mcg RAE)', 'Vitamin D (mcg)', 'Vitamin E (mg)', 'Vitamin K (mcg)'
  ],
  'Water Soluble Vitamins': [
    'Vitamin B1 (Thiamin) (mg)', 'Vitamin B2 (Riboflavin) (mg)', 'Vitamin B3 (Niacin) (mg)', 
    'Vitamin B5 (Pantothenic Acid) (mg)', 'Vitamin B6 (mg)', 'Vitamin B7 (Biotin) (mcg)', 
    'Vitamin B9 (Folate) (mcg)', 'Vitamin B12 (Cobalamin) (mcg)', 'Vitamin C (mg)', 'Choline (mg)'
  ],
  Others: [
    'Lutein + Zeaxanthin (mcg)', 'Calcium (mg)', 'Iron (mg)', 'Potassium (mg)', 'Selenium (mcg)'
  ]
}

const RDI_TARGETS: Record<string, string> = {
  'Calories (kcal)': '2000 kcal',
  'Protein (g)': '50 g',
  'Fat (g)': '78 g',
  'Carbohydrates (g)': '275 g',
  'Dietary Fiber (g)': '28 g',
  'Sodium (mg)': '2300 mg',
  'Vitamin A (mcg RAE)': '900 mcg',
  'Vitamin D (mcg)': '20 mcg',
  'Vitamin E (mg)': '15 mg',
  'Vitamin K (mcg)': '120 mcg',
  'Vitamin B1 (Thiamin) (mg)': '1.2 mg',
  'Vitamin B2 (Riboflavin) (mg)': '1.3 mg',
  'Vitamin B3 (Niacin) (mg)': '16 mg',
  'Vitamin B5 (Pantothenic Acid) (mg)': '5 mg',
  'Vitamin B6 (mg)': '1.7 mg',
  'Vitamin B7 (Biotin) (mcg)': '30 mcg',
  'Vitamin B9 (Folate) (mcg)': '400 mcg',
  'Vitamin B12 (Cobalamin) (mcg)': '2.4 mcg',
  'Vitamin C (mg)': '90 mg',
  'Choline (mg)': '550 mg',
  'Lutein + Zeaxanthin (mcg)': '10000 mcg',
  'Calcium (mg)': '800 mg',
  'Iron (mg)': '18 mg',
  'Potassium (mg)': '3000 mg',
  'Selenium (mcg)': '55 mcg'
}

const MealBuilder: React.FC<MealBuilderProps> = ({ data }) => {
  // Extract food items and their RDI data
  const foods = useMemo(() => {
    const items: any[] = []
    for (let i = 0; i < data.length; i++) {
      const row = data[i]
      const name = row['Food Item']
      if (!name.includes('%')) {
        // Find the next row which might be the RDI row
        const nextRow = data[i + 1]
        if (nextRow && nextRow['Food Item'].includes('%')) {
          const rdiMap: Record<string, number> = {}
          Object.keys(nextRow).forEach(key => {
            if (key !== 'Food Item') {
              let val = nextRow[key]?.replace('%', '')
              let num = parseFloat(val)
              
              // Handle Lutein specifically since it has no official %DV and is left empty in CSV
              if (isNaN(num) && key === 'Lutein + Zeaxanthin (mcg)') {
                const absolute = parseFloat(row[key]) || 0
                num = (absolute / 10000) * 100 // 10,000mcg target
              }
              
              rdiMap[key] = num || 0
            }
          })
          items.push({
            id: name,
            name: name.replace('Total', '').trim(),
            rdi: rdiMap
          })
        }
      }
    }
    return items
  }, [data])

  const [quantities, setQuantities] = useState<Record<string, number>>({})

  const handleAdd = (id: string) => {
    setQuantities(prev => ({ ...prev, [id]: (prev[id] || 0) + 1 }))
  }

  const handleSubtract = (id: string) => {
    setQuantities(prev => {
      const current = prev[id] || 0
      if (current <= 1) {
        const next = { ...prev }
        delete next[id]
        return next
      }
      return { ...prev, [id]: current - 1 }
    })
  }

  // Calculate accumulated RDIs
  const totalRDI = useMemo(() => {
    const totals: Record<string, number> = {}
    Object.keys(quantities).forEach(id => {
      const qty = quantities[id]
      const food = foods.find(f => f.id === id)
      if (food) {
        Object.keys(food.rdi).forEach(nutrient => {
          totals[nutrient] = (totals[nutrient] || 0) + (food.rdi[nutrient] * qty)
        })
      }
    })
    return totals
  }, [quantities, foods])

  return (
    <div className="meal-builder">
      <div className="glass-panel food-selector">
        <h2>Available Foods</h2>
        <div className="food-list">
          {foods.map(food => (
            <div key={food.id} className="food-item">
              <span className="food-name">{food.name}</span>
              <div className="controls">
                <button onClick={() => handleSubtract(food.id)} disabled={!quantities[food.id]}>
                  <Minus size={16} />
                </button>
                <span className="qty">{quantities[food.id] || 0}</span>
                <button onClick={() => handleAdd(food.id)}>
                  <Plus size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="rdi-dashboard">
        {Object.entries(NUTRIENT_GROUPS).map(([groupName, nutrients]) => (
          <div key={groupName} className="glass-panel rdi-group">
            <h3>{groupName}</h3>
            <div className="progress-list">
              {nutrients.map(nutrient => {
                const percentage = totalRDI[nutrient] || 0
                const isComplete = percentage >= 100
                const shortName = nutrient.split('(')[0].trim()
                const targetStr = RDI_TARGETS[nutrient] ? ` (${RDI_TARGETS[nutrient]})` : ''
                
                return (
                  <div key={nutrient} className="progress-item">
                    <div className="progress-label">
                      <span>{shortName}<span style={{ opacity: 0.6, fontSize: '0.8em', marginLeft: '6px' }}>{targetStr}</span></span>
                      <span className={isComplete ? 'complete-text' : ''}>
                        {percentage.toFixed(1)}%
                      </span>
                    </div>
                    <div className="progress-bar-bg">
                      <div 
                        className={`progress-bar-fill ${isComplete ? 'complete' : ''}`}
                        style={{ width: `${Math.min(percentage, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default MealBuilder
