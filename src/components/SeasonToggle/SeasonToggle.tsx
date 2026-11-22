import { useSeason } from '../../context/SeasonContext'
import './SeasonToggle.css'

// Season options with icons
const SEASONS = [
    { key: 'autumn', icon: '🍁', label: 'Осень' },
    { key: 'winter', icon: '❄️', label: 'Зима' },
    { key: 'spring', icon: '💧', label: 'Весна' },
    { key: 'summer', icon: '✨', label: 'Лето' },
] as const

export default function SeasonToggle() {
    const { season, setSeason, particlesEnabled, toggleParticles } = useSeason()

    return (
        <div className="season-toggle">
            {/* Particles toggle button */}
            <button
                className={`season-particles-btn ${particlesEnabled ? 'on' : 'off'}`}
                onClick={toggleParticles}
                title={particlesEnabled ? 'Выключить анимацию' : 'Включить анимацию'}
                aria-label={particlesEnabled ? 'Выключить анимацию' : 'Включить анимацию'}
            >
                {particlesEnabled ? '🎆' : '🚫'}
            </button>

            {/* Season selector */}
            <div className="season-selector">
                {SEASONS.map(({ key, icon, label }) => (
                    <button
                        key={key}
                        className={`season-btn ${season === key ? 'active' : ''}`}
                        onClick={() => setSeason(key)}
                        title={label}
                        aria-label={`Сезон: ${label}`}
                    >
                        {icon}
                    </button>
                ))}
            </div>
        </div>
    )
}
