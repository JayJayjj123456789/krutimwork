import { WeatherData } from '../../types'
import { formatTemperature } from '../../utils/weather'
import { getWmoInfo } from '../../utils/wmo'
import styles from './WeatherCard.module.css'

interface WeatherCardProps {
  data: WeatherData
}

export default function WeatherCard({ data }: WeatherCardProps) {
  return (
    <div className={`glass-card ${styles.card}`}>
      <div className={styles.row}>
        <span className="material-symbols-outlined icon-fill" style={{ fontSize: 16, color: 'var(--color-secondary)' }}>location_on</span>
        <span className={styles.city}>{data.city}</span>
      </div>
      <div className={styles.main}>
        <span className={styles.temp}>{formatTemperature(data.temperature)}</span>
        <span className="material-symbols-outlined icon-fill" style={{ fontSize: 44, color: 'var(--color-secondary)' }}>{getWmoInfo(data.weather_code).icon}</span>
      </div>
      <p className={styles.feels}>Feels like {formatTemperature(data.feels_like)}</p>
      <div className={styles.meta}>
        <div className={styles.metaItem}>
          <span className="material-symbols-outlined" style={{ fontSize: 14 }}>water_drop</span>
          <span>{data.humidity}%</span>
        </div>
        <div className={styles.metaItem}>
          <span className="material-symbols-outlined" style={{ fontSize: 14 }}>air</span>
          <span>{Math.round(data.wind_speed)} km/h</span>
        </div>
      </div>
    </div>
  )
}
