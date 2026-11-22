import { createContext, useContext, useState, useCallback, ReactNode } from 'react'

// Available seasons configuration
export type Season = 'autumn' | 'winter' | 'spring' | 'summer'

interface SeasonConfig {
    label: string
    emoji: string
    icon: string // Unicode symbol for toggle button
    colors: [string, string, string] // particle color gradient
}

export const SEASON_CONFIG: Record<Season, SeasonConfig> = {
    autumn: {
        label: 'Осень',
        emoji: '🍂',
        icon: '🍁',
        colors: ['#d46a1e', '#c0392b', '#f39c12'],
    },
    winter: {
        label: 'Зима',
        emoji: '❄️',
        icon: '⛄',
        colors: ['#e8e8f0', '#a8d8ea', '#ffffff'],
    },
    spring: {
        label: 'Весна',
        emoji: '🌸',
        icon: '💧',
        colors: ['#74b9ff', '#a29bfe', '#dfe6e9'],
    },
    summer: {
        label: 'Лето',
        emoji: '☀️',
        icon: '✨',
        colors: ['#ffeaa7', '#fdcb6e', '#fab1a0'],
    },
}

interface SeasonContextType {
    season: Season
    setSeason: (season: Season) => void
    particlesEnabled: boolean
    toggleParticles: () => void
    config: SeasonConfig
}

const SeasonContext = createContext<SeasonContextType | null>(null)

export function useSeason() {
    const context = useContext(SeasonContext)
    if (!context) {
        throw new Error('useSeason must be used within SeasonProvider')
    }
    return context
}

export function SeasonProvider({ children }: { children: ReactNode }) {
    const [season, setSeasonState] = useState<Season>('autumn')
    const [particlesEnabled, setParticlesEnabled] = useState(true)

    const setSeason = useCallback((s: Season) => {
        setSeasonState(s)
    }, [])

    const toggleParticles = useCallback(() => {
        setParticlesEnabled((prev) => !prev)
    }, [])

    return (
        <SeasonContext.Provider
            value={{
                season,
                setSeason,
                particlesEnabled,
                toggleParticles,
                config: SEASON_CONFIG[season],
            }}
        >
            {children}
        </SeasonContext.Provider>
    )
}

export default SeasonContext
