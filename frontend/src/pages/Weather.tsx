import Card from '../components/Card'
import MetricDisplay from '../components/MetricDisplay'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import styles from './Weather.module.css'

const hourlyData = [
  { time: '6AM', temp: 18, humidity: 75 },
  { time: '9AM', temp: 21, humidity: 68 },
  { time: '12PM', temp: 26, humidity: 55 },
  { time: '3PM', temp: 29, humidity: 48 },
  { time: '6PM', temp: 25, humidity: 58 },
  { time: '9PM', temp: 22, humidity: 65 },
  { time: '12AM', temp: 19, humidity: 72 },
]

const forecast = [
  { day: 'Today', high: 29, low: 18, condition: 'Sunny', icon: '☀️' },
  { day: 'Tomorrow', high: 26, low: 17, condition: 'Partly Cloudy', icon: '⛅' },
  { day: 'Wednesday', high: 23, low: 15, condition: 'Rainy', icon: '🌧️' },
  { day: 'Thursday', high: 25, low: 16, condition: 'Cloudy', icon: '☁️' },
  { day: 'Friday', high: 28, low: 19, condition: 'Sunny', icon: '☀️' },
]

export default function Weather() {
  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Weather Information</h2>

      <div className={styles.currentWeather}>
        <Card title="Current Conditions" icon="🌤️">
          <div className={styles.mainTemp}>
            <span className={styles.tempValue}>24°C</span>
            <span className={styles.condition}>Partly Cloudy</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1rem' }}>
            <MetricDisplay label="Feels Like" value={26} unit="°C" />
            <MetricDisplay label="Humidity" value={62} unit="%" />
            <MetricDisplay label="Wind" value={12} unit="km/h" />
            <MetricDisplay label="UV Index" value={6} />
            <MetricDisplay label="Pressure" value={1013} unit="hPa" />
            <MetricDisplay label="Visibility" value={10} unit="km" />
          </div>
        </Card>
      </div>

      <Card title="Hourly Forecast">
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={hourlyData}>
            <defs>
              <linearGradient id="tempGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#667eea" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#667eea" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="time" />
            <YAxis />
            <Tooltip />
            <Area type="monotone" dataKey="temp" stroke="#667eea" fill="url(#tempGradient)" />
          </AreaChart>
        </ResponsiveContainer>
      </Card>

      <Card title="5-Day Forecast">
        <div className={styles.forecastGrid}>
          {forecast.map((day) => (
            <div key={day.day} style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '1rem',
              background: '#f8f9fa',
              borderRadius: '8px',
              marginBottom: '0.5rem'
            }}>
              <span style={{ fontWeight: 600, minWidth: '100px' }}>{day.day}</span>
              <span style={{ fontSize: '1.5rem' }}>{day.icon}</span>
              <span style={{ color: '#666', minWidth: '120px' }}>{day.condition}</span>
              <span>
                <span className={styles.high}>{day.high}°</span>
                <span className={styles.low}>{day.low}°</span>
              </span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
