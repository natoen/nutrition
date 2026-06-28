import React, { useState, useMemo } from 'react'
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
    'Vitamin B5 (Pantothenic Acid) (mg)', 'Vitamin B6 (Pyridoxine) (mg)', 'Vitamin B7 (Biotin) (mcg)', 
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
  'Vitamin B6 (Pyridoxine) (mg)': '1.7 mg',
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

const getFoodStyle = (name: string) => {
  const lower = name.toLowerCase()
  if (lower.includes('milk')) return { icon: '🥛', color: '#f8fafc' }
  if (lower.includes('banana')) return { icon: '🍌', color: '#fde047' }
  if (lower.includes('blueberry')) return { icon: '🫐', color: '#3b82f6' }
  if (lower.includes('strawberry')) return { icon: '🍓', color: '#ef4444' }
  if (lower.includes('pineapple')) return { icon: '🍍', color: '#eab308' }
  if (lower.includes('apple')) return { icon: '🍎', color: '#ef4444' }
  if (lower.includes('orange')) return { icon: '🍊', color: '#f97316' }
  if (lower.includes('tomato')) return { icon: '🍅', color: '#ef4444' }
  if (lower.includes('potato')) return { icon: '🥔', color: '#d97706' }
  if (lower.includes('carrot')) return { icon: '🥕', color: '#f97316' }
  if (lower.includes('kabocha') || lower.includes('pumpkin')) return { icon: '🎃', color: '#d97706' }
  if (lower.includes('kiwi')) return { icon: '🥝', color: '#84cc16' }
  if (lower.includes('avocado')) return { icon: '🥑', color: '#10b981' }
  if (lower.includes('natto') || lower.includes('bean')) return { icon: '🫘', color: '#a16207' }
  if (lower.includes('rice')) return { icon: '🍚', color: '#f8fafc' }
  if (lower.includes('spinach') || lower.includes('kale') || lower.includes('lettuce')) return { icon: '🥬', color: '#10b981' }
  if (lower.includes('broccoli')) return { icon: '🥦', color: '#10b981' }
  if (lower.includes('salad') || lower.includes('celery')) return { icon: '🥗', color: '#10b981' }
  if (lower.includes('liver') || lower.includes('beef') || lower.includes('pork')) return { icon: '🥩', color: '#ef4444' }
  if (lower.includes('salmon') || lower.includes('mackerel') || lower.includes('fish')) return { icon: '🐟', color: '#f97316' }
  if (lower.includes('uni') || lower.includes('sea urchin') || lower.includes('ikura') || lower.includes('roe')) return { icon: '🍣', color: '#f97316' }
  if (lower.includes('egg')) return { icon: '🍳', color: '#eab308' }
  if (lower.includes('sunflower')) return { icon: '🌻', color: '#a16207' }
  if (lower.includes('peanut')) return { icon: '🥜', color: '#a16207' }
  if (lower.includes('chicken')) return { icon: '🍗', color: '#f59e0b' }
  if (lower.includes('sesame') || lower.includes('ごま') || lower.includes('胡麻')) return { icon: '🫘', color: '#a16207' }
  return { icon: '🍽️', color: 'white' }
}

const getNutrientStyle = (name: string) => {
  const lower = name.toLowerCase()
  if (lower.includes('calories')) return { icon: '🔥', color: '#ef4444' }
  if (lower.includes('protein')) return { icon: '💪', color: '#ec4899' }
  if (lower.includes('fat')) return { icon: '🥑', color: '#eab308' }
  if (lower.includes('carbohydrates')) return { icon: '🍞', color: '#d97706' }
  if (lower.includes('fiber')) return { icon: '🥦', color: '#22c55e' }
  if (lower.includes('sodium')) return { icon: '🧂', color: '#94a3b8' }
  
  if (lower.includes('vitamin a') || lower.includes('lutein')) return { icon: '🥕', color: '#f97316' }
  if (lower.includes('vitamin c')) return { icon: '🍊', color: '#fbbf24' }
  if (lower.includes('vitamin d')) return { icon: '☀️', color: '#fbbf24' }
  if (lower.includes('vitamin e')) return { icon: '🌻', color: '#84cc16' }
  if (lower.includes('vitamin k')) return { icon: '🥬', color: '#15803d' }
  if (lower.includes('vitamin b') || lower.includes('folate')) return { icon: '⚡', color: '#3b82f6' }
  if (lower.includes('choline')) return { icon: '🧠', color: '#3b82f6' }
  
  if (lower.includes('calcium') || lower.includes('phosphorus')) return { icon: '🥛', color: '#94a3b8' }
  if (lower.includes('iron')) return { icon: '🩸', color: '#b91c1c' }
  if (lower.includes('potassium')) return { icon: '🍌', color: '#a855f7' }
  if (lower.includes('selenium') || lower.includes('zinc')) return { icon: '🛡️', color: '#b91c1c' }
  
  return { icon: '✨', color: 'white' }
}

const getFoodTypeWeight = (name: string) => {
  const lower = name.toLowerCase()
  // Exact user-requested order
  if (lower.includes('milk')) return 10
  if (lower.includes('banana')) return 20
  if (lower.includes('spinach')) return 30
  if (lower.includes('peanut butter')) return 40
  if (lower.includes('sunflower')) return 50
  
  // Group by food categories
  if (lower.includes('broccoli') || lower.includes('celery') || lower.includes('kale') || lower.includes('carrot')) return 100 // Veggies
  if (lower.includes('apple') || lower.includes('strawberry') || lower.includes('orange') || lower.includes('fruit')) return 200 // Fruits
  if (lower.includes('egg')) return 300 // Eggs
  if (lower.includes('liver') || lower.includes('beef') || lower.includes('chicken') || lower.includes('pork') || lower.includes('meat')) return 400 // Meats
  if (lower.includes('salmon') || lower.includes('uni') || lower.includes('mackerel') || lower.includes('fish') || lower.includes('sea urchin')) return 500 // Seafood
  if (lower.includes('seed') || lower.includes('nut') || lower.includes('almond') || lower.includes('peanut')) return 600 // Nuts/Seeds
  
  return 1000 // Others (sorted alphabetically later if same weight)
}

const MealBuilder: React.FC<MealBuilderProps> = ({ data }) => {
  // Extract food items and their RDI data
  const foods = useMemo(() => {
    const items: any[] = []
    for (let i = 0; i < data.length; i++) {
      const row = data[i]
      const name = row['Food Item']
      if (!name.includes('%')) {
        const nextRow = data[i + 1]
        if (nextRow && nextRow['Food Item'].includes('%')) {
          const rdiMap: Record<string, number> = {}
          const absMap: Record<string, number> = {}
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
              absMap[key] = parseFloat(row[key]) || 0
            }
          })
          items.push({
            id: name,
            name: name.replace('Total', '').trim(),
            rdi: rdiMap,
            absolute: absMap
          })
        }
      }
    }
    
    // Sort items based on the requested category weights
    items.sort((a, b) => {
      const weightDiff = getFoodTypeWeight(a.name) - getFoodTypeWeight(b.name)
      if (weightDiff === 0) {
        return a.name.localeCompare(b.name)
      }
      return weightDiff
    })
    
    return items
  }, [data])

  const [quantities, setQuantities] = useState<Record<string, number>>({})

  // Calculate accumulated RDIs and Absolutes
  const { totalRDI, totalAbsolute } = useMemo(() => {
    const totalsRDI: Record<string, number> = {}
    const totalsAbs: Record<string, number> = {}
    Object.keys(quantities).forEach(id => {
      const qty = quantities[id]
      const food = foods.find(f => f.id === id)
      if (food) {
        Object.keys(food.rdi).forEach(nutrient => {
          totalsRDI[nutrient] = (totalsRDI[nutrient] || 0) + (food.rdi[nutrient] * qty)
          totalsAbs[nutrient] = (totalsAbs[nutrient] || 0) + (food.absolute[nutrient] * qty)
        })
      }
    })
    return { totalRDI: totalsRDI, totalAbsolute: totalsAbs }
  }, [quantities, foods])

  return (
    <div className="meal-builder">
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div className="glass-panel food-selector">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2 style={{ marginBottom: 0 }}>Available Foods</h2>
          <button 
            onClick={() => setQuantities({})}
            style={{
              background: 'rgba(255,255,255,0.1)',
              color: 'white',
              border: '1px solid rgba(255,255,255,0.2)',
              padding: '6px 12px',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: 500,
              transition: 'background 0.2s'
            }}
            onMouseOver={(e) => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.4)'}
            onMouseOut={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
          >
            Reset
          </button>
        </div>
        <div className="food-list">
          {foods.map(food => {
            const { icon } = getFoodStyle(food.name)
            return (
              <div key={food.id} className="food-item">
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '1.2rem' }}>{icon}</span>
                  <span className="food-name" style={{ color: 'white' }}>{food.name}</span>
                </div>
                <div className="controls" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <input
                    type="number"
                    min="0"
                    max="1000"
                    value={quantities[food.id] || ''}
                    placeholder="0"
                    onChange={(e) => {
                      const val = parseInt(e.target.value, 10);
                      setQuantities(prev => {
                        const next = { ...prev };
                        if (isNaN(val) || val <= 0) {
                          delete next[food.id];
                        } else {
                          next[food.id] = Math.min(val, 1000);
                        }
                        return next;
                      });
                    }}
                    style={{
                      width: '70px',
                      background: 'rgba(0,0,0,0.3)',
                      border: '1px solid var(--border-color)',
                      color: 'white',
                      padding: '6px 8px',
                      borderRadius: '6px',
                      textAlign: 'center',
                      fontSize: '1rem',
                      outline: 'none'
                    }}
                  />
                  <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                    {food.name.toLowerCase().includes('milk') ? 'ml' : (food.name.toLowerCase().includes('salad') ? 'qty' : 'g')}
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      </div>
      
      {/* Selected Foods Summary Box */}
      {Object.keys(quantities).length > 0 && (
        <div className="glass-panel">
          <h3 style={{ color: 'white', fontSize: '1.1rem', marginBottom: '16px' }}>Selected Foods</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {Object.keys(quantities).map(id => {
              const qty = quantities[id];
              if (!qty || qty <= 0) return null;
              const food = foods.find(f => f.id === id);
              if (!food) return null;
              
              const unitStr = food.name.toLowerCase().includes('milk') ? 'ml' : (food.name.toLowerCase().includes('salad') ? 'qty' : 'g');
              return (
                <div key={`summary-${id}`} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'rgba(255,255,255,0.9)', fontSize: '0.95rem' }}>
                  <span>{food.name}</span>
                  <span style={{ fontWeight: 'bold' }}>{qty}{unitStr}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}
      </div>

      <div className="rdi-dashboard">
        {Object.entries(NUTRIENT_GROUPS).map(([groupName, nutrients]) => (
          <div key={groupName} className="glass-panel rdi-group">
            <h3>{groupName}</h3>
            <div className="progress-list">
              {nutrients.map(nutrient => {
                const percentage = totalRDI[nutrient] || 0
                const absValue = totalAbsolute[nutrient] || 0
                const isComplete = percentage >= 100
                
                // Strip only the LAST set of parentheses (which contains the unit) to preserve names like '(Thiamin)'
                const shortName = nutrient.replace(/\s*\([^)]+\)$/, '').trim()
                
                const targetStr = RDI_TARGETS[nutrient] ? ` (${RDI_TARGETS[nutrient]})` : ''
                
                // Extract the unit from the LAST set of parentheses
                const unitMatches = nutrient.match(/\(([^)]+)\)/g)
                const unitStr = unitMatches && unitMatches.length > 0 
                  ? unitMatches[unitMatches.length - 1].replace(/[()]/g, '') 
                  : ''
                
                const { icon, color } = getNutrientStyle(nutrient)
                
                // Keep values to 1 decimal place, but trim trailing zeros
                const displayAbs = Number(absValue.toFixed(1))
                
                return (
                  <div key={nutrient} className="progress-item">
                    <div className="progress-label" style={{ color: 'white' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ fontSize: '1.1rem' }}>{icon}</span>
                        {shortName}
                        <span style={{ opacity: 0.8, fontSize: '0.8em', marginLeft: '6px', color: 'white' }}>{targetStr}</span>
                      </span>
                      <span className={isComplete ? 'complete-text' : ''} style={{ color: 'white', fontWeight: isComplete ? 'bold' : 'normal' }}>
                        <span style={{ opacity: 0.8, marginRight: '8px', fontSize: '0.85em', fontWeight: 'normal' }}>({displayAbs}{unitStr})</span>
                        {percentage.toFixed(1)}%
                      </span>
                    </div>
                    <div className="progress-bar-bg">
                      <div 
                        className={`progress-bar-fill ${isComplete ? 'complete' : ''}`}
                        style={{ width: `${Math.min(percentage, 100)}%`, background: isComplete ? color : `linear-gradient(90deg, ${color}88, ${color})`, boxShadow: isComplete ? `0 0 10px ${color}` : 'none' }}
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
