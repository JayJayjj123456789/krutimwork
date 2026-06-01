export default function AIRecommendations() {
  return (
    <div className="section-gap page-enter">
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.6fr 1fr', gap: 20 }}>
        <div className="ai-accent-card">
          <span className="material-symbols-outlined ai-watermark">water_drop</span>
          <div style={{ position: 'relative', zIndex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
              <span className="material-symbols-outlined icon-fill" style={{ color: 'var(--color-secondary)', fontSize: 22 }}>local_drink</span>
              <span className="section-label" style={{ color: 'var(--color-secondary)' }}>Hydration Goal</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginBottom: 6 }}>
              <span style={{ fontFamily: 'var(--font-headline)', fontSize: 48, fontWeight: 700, color: 'var(--color-primary)', lineHeight: 1 }}>1.2</span>
              <span style={{ fontFamily: 'var(--font-body)', fontSize: 16, color: 'var(--color-on-surface-variant)' }}>/ 2.5 L</span>
            </div>
            <p style={{ fontSize: 13, color: 'var(--color-on-surface-variant)', marginBottom: 14 }}>1.3 L remaining today</p>
            <div className="progress-track" style={{ height: 10, marginBottom: 8 }}>
              <div className="progress-fill" style={{ width: '48%' }}>
                <div className="progress-shimmer" />
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, fontFamily: 'var(--font-headline)', fontWeight: 700, color: 'var(--color-on-surface-variant)' }}>
              <span>0L</span><span>1.25L</span><span>2.5L</span>
            </div>
            <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: 16 }}>
              <span className="material-symbols-outlined" style={{ fontSize: 18 }}>add</span>
              Log Intake
            </button>
          </div>
        </div>

        <div className="glass-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
            <span className="material-symbols-outlined" style={{ color: 'var(--color-ai-accent)', fontSize: 18 }}>auto_awesome</span>
            <span className="section-label" style={{ color: 'var(--color-ai-accent)' }}>Today's Weather Analysis</span>
          </div>
          <h3 style={{ fontFamily: 'var(--font-headline)', fontSize: 22, fontWeight: 700, color: 'var(--color-primary)', marginBottom: 4, lineHeight: 1.3 }}>
            Extremely Hot Day
          </h3>
          <p style={{ fontSize: 14, color: 'var(--color-on-surface-variant)', marginBottom: 16 }}>
            Focus on protection and hydration
          </p>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: 14, lineHeight: 1.75, color: 'var(--color-on-surface-variant)' }}>
            Today's heat index reaches 38°C with high UV radiation. AI analysis indicates elevated dehydration risk and sun exposure hazards. Follow all hydration targets and limit outdoor activity between 11:00–15:00.
          </p>
          <div style={{ display: 'flex', gap: 8, marginTop: 16, flexWrap: 'wrap' }}>
            <span className="chip chip-warning">UV Very High</span>
            <span className="chip chip-warning">Heat Index 38°C</span>
            <span className="chip chip-good">AQI Good</span>
          </div>
        </div>

        <div className="error-accent-card">
          <span className="material-symbols-outlined ai-watermark">sunny</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
            <span className="material-symbols-outlined icon-fill" style={{ color: 'var(--color-error)', fontSize: 20 }}>warning</span>
            <span className="section-label" style={{ color: 'var(--color-error)' }}>Outdoor Safety</span>
          </div>
          <div style={{ marginBottom: 12 }}>
            <p style={{ fontFamily: 'var(--font-headline)', fontSize: 18, fontWeight: 700, color: 'var(--color-primary)', marginBottom: 6 }}>UV Index Very High</p>
            <p style={{ fontSize: 13, lineHeight: 1.65, color: 'var(--color-on-surface-variant)' }}>
              Avoid direct sunlight <strong style={{ color: 'var(--color-primary)' }}>11:00–15:00</strong>. If outdoor exposure is necessary:
            </p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {[
              { icon: 'sunny', text: 'SPF 50+ sunscreen' },
              { icon: 'beach_access', text: 'Wide-brim hat' },
              { icon: 'local_drink', text: 'Water every 30 min' },
            ].map(({ icon, text }) => (
              <div key={text} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 32, height: 32, borderRadius: 'var(--radius-md)', background: 'rgba(147,0,10,0.2)', border: '1px solid rgba(255,180,171,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <span className="material-symbols-outlined" style={{ color: 'var(--color-on-error-container)', fontSize: 16 }}>{icon}</span>
                </div>
                <span style={{ fontSize: 13, color: 'var(--color-on-surface-variant)' }}>{text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        <div className="glass-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
            <div style={{ width: 36, height: 36, borderRadius: 'var(--radius-md)', background: 'rgba(137,208,237,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span className="material-symbols-outlined" style={{ color: 'var(--color-secondary)', fontSize: 20 }}>directions_run</span>
            </div>
            <div>
              <span className="section-label" style={{ color: 'var(--color-secondary)' }}>Recommended Activities</span>
              <p style={{ fontFamily: 'var(--font-headline)', fontSize: 14, fontWeight: 700, color: 'var(--color-primary)', marginTop: 2 }}>Indoor & low-intensity</p>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            {[
              { icon: 'pool',             label: 'Swimming',       time: 'Any time'   },
              { icon: 'self_improvement', label: 'Indoor Yoga',    time: 'Morning'    },
              { icon: 'fitness_center',   label: 'Gym Workout',    time: 'Evening'    },
              { icon: 'hiking',           label: 'Light Walking',  time: 'After 17:00'},
            ].map(({ icon, label, time }) => (
              <div key={label} style={{ display: 'flex', gap: 12, alignItems: 'center', padding: '12px 14px', borderRadius: 'var(--radius-lg)', background: 'var(--color-glass-fill)', border: '1px solid var(--color-glass-border)' }}>
                <div style={{ width: 38, height: 38, borderRadius: 'var(--radius-md)', background: 'var(--color-surface-container-high)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <span className="material-symbols-outlined" style={{ color: 'var(--color-secondary)', fontSize: 20 }}>{icon}</span>
                </div>
                <div>
                  <p style={{ fontFamily: 'var(--font-headline)', fontSize: 13, fontWeight: 700, color: 'var(--color-primary)' }}>{label}</p>
                  <p style={{ fontSize: 11, color: 'var(--color-on-surface-variant)' }}>{time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
            <div style={{ width: 36, height: 36, borderRadius: 'var(--radius-md)', background: 'rgba(137,208,237,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span className="material-symbols-outlined" style={{ color: 'var(--color-secondary)', fontSize: 20 }}>checkroom</span>
            </div>
            <div>
              <span className="section-label" style={{ color: 'var(--color-secondary)' }}>Clothing Suggestions</span>
              <p style={{ fontFamily: 'var(--font-headline)', fontSize: 14, fontWeight: 700, color: 'var(--color-primary)', marginTop: 2 }}>Breathable & light-coloured</p>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {[
              { icon: 'apparel', label: 'Linen or Cotton', sub: 'Lightweight, breathable fabrics' },
              { icon: 'air',     label: 'Light Colours',   sub: 'Reflects sunlight and heat'      },
              { icon: 'face',    label: 'Wide-Brim Hat',   sub: 'Essential for UV protection'     },
              { icon: 'visibility', label: 'UV Sunglasses', sub: 'UV400 lenses recommended'       },
            ].map(({ icon, label, sub }) => (
              <div key={label} style={{ display: 'flex', gap: 14, alignItems: 'center', padding: '10px 14px', borderRadius: 'var(--radius-lg)', background: 'var(--color-glass-fill)', border: '1px solid var(--color-glass-border)' }}>
                <div style={{ width: 38, height: 38, borderRadius: 'var(--radius-md)', background: 'var(--color-surface-container-high)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <span className="material-symbols-outlined" style={{ color: 'var(--color-primary)', fontSize: 20 }}>{icon}</span>
                </div>
                <div>
                  <p style={{ fontFamily: 'var(--font-headline)', fontSize: 13, fontWeight: 700, color: 'var(--color-primary)' }}>{label}</p>
                  <p style={{ fontSize: 11, color: 'var(--color-on-surface-variant)', marginTop: 2 }}>{sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
