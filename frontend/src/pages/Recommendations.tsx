import { useState } from 'react'
import Card from '../components/Card'
import styles from './Recommendations.module.css'

interface Recommendation {
  id: number
  category: string
  title: string
  description: string
  priority: 'high' | 'medium' | 'low'
  icon: string
}

const recommendations: Recommendation[] = [
  {
    id: 1,
    category: 'Exercise',
    title: 'Best Time for Outdoor Exercise',
    description: 'Air quality is excellent between 6-8 AM. Consider a morning jog or walk for optimal health benefits.',
    priority: 'high',
    icon: '🏃'
  },
  {
    id: 2,
    category: 'Hydration',
    title: 'Increase Water Intake',
    description: 'Temperature is rising to 29°C today. Aim for 3 liters of water to stay properly hydrated.',
    priority: 'high',
    icon: '💧'
  },
  {
    id: 3,
    category: 'Sun Protection',
    title: 'UV Protection Needed',
    description: 'UV index is 6 (high). Apply SPF 30+ sunscreen and wear protective clothing during midday hours.',
    priority: 'medium',
    icon: '☀️'
  },
  {
    id: 4,
    category: 'Allergies',
    title: 'Pollen Count Alert',
    description: 'High pollen count expected. If you have allergies, consider taking antihistamines and limit outdoor exposure.',
    priority: 'medium',
    icon: '🌿'
  },
  {
    id: 5,
    category: 'Sleep',
    title: 'Optimize Sleep Schedule',
    description: 'Your sleep data shows irregular patterns. Try to maintain a consistent bedtime of 10:30 PM.',
    priority: 'low',
    icon: '😴'
  },
  {
    id: 6,
    category: 'Nutrition',
    title: 'Seasonal Foods Recommendation',
    description: 'Hot weather ahead - increase intake of water-rich fruits like watermelon and cucumber.',
    priority: 'low',
    icon: '🥗'
  },
]

export default function Recommendations() {
  const [activeCategory, setActiveCategory] = useState<string>('all')
  const [dismissed, setDismissed] = useState<number[]>([])

  const categories = ['all', ...new Set(recommendations.map(r => r.category.toLowerCase()))]

  const filteredRecs = recommendations.filter(r => {
    const matchesCategory = activeCategory === 'all' || r.category.toLowerCase() === activeCategory
    const notDismissed = !dismissed.includes(r.id)
    return matchesCategory && notDismissed
  })

  const handleDismiss = (id: number) => {
    setDismissed([...dismissed, id])
  }

  const priorityColors = {
    high: '#ef4444',
    medium: '#f59e0b',
    low: '#22c55e'
  }

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>AI Health Recommendations</h2>
      
      <Card title="Filter by Category">
        <div className={styles.filterContainer}>
          {categories.map(cat => (
            <button
              key={cat}
              className={`${styles.filterBtn} ${activeCategory === cat ? styles.active : ''}`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </button>
          ))}
        </div>
      </Card>

      <div className={styles.recommendationsGrid}>
        {filteredRecs.map(rec => (
          <div key={rec.id} className={styles.recCard}>
            <div className={styles.recHeader} style={{ borderLeftColor: priorityColors[rec.priority] }}>
              <span className={styles.recIcon}>{rec.icon}</span>
              <div className={styles.recTitleArea}>
                <span className={styles.recCategory}>{rec.category}</span>
                <h3 className={styles.recTitle}>{rec.title}</h3>
              </div>
              <button 
                className={styles.dismissBtn}
                onClick={() => handleDismiss(rec.id)}
                title="Dismiss"
              >
                ×
              </button>
            </div>
            <p className={styles.recDescription}>{rec.description}</p>
            <div className={styles.recFooter}>
              <span 
                className={styles.priorityBadge}
                style={{ backgroundColor: priorityColors[rec.priority] }}
              >
                {rec.priority} priority
              </span>
            </div>
          </div>
        ))}
      </div>

      {filteredRecs.length === 0 && (
        <Card title="No Recommendations">
          <p style={{ textAlign: 'center', color: '#666', padding: '2rem' }}>
            No recommendations in this category. Great job! 🎉
          </p>
        </Card>
      )}
    </div>
  )
}
