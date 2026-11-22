import { useState, useEffect, useRef } from 'react'
import './Hero.css'

const HERO_IMAGE = `${import.meta.env.BASE_URL}main/SCR-20261104.jpeg`

export default function Hero() {
    const [imageLoaded, setImageLoaded] = useState(false)
    const heroRef = useRef<HTMLElement>(null)
    const [iconOffset, setIconOffset] = useState({ x: 0, y: 0 })

    useEffect(() => {
        const img = new Image()
        img.onload = () => setImageLoaded(true)
        img.src = HERO_IMAGE
    }, [])

    // Легкий параллакс для иконки
    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (!heroRef.current) return
            const x = (e.clientX / window.innerWidth - 0.5) * 30
            const y = (e.clientY / window.innerHeight - 0.5) * 30
            setIconOffset({ x, y })
        }
        window.addEventListener('mousemove', handleMouseMove)
        return () => window.removeEventListener('mousemove', handleMouseMove)
    }, [])

    return (
        <section className="hero" ref={heroRef}>
            <div className="hero-bg">
                {!imageLoaded && <div className="hero-bg-placeholder" />}
                <img
                    src={HERO_IMAGE}
                    alt="Дарья Сиволобова"
                    className={`hero-photo ${imageLoaded ? 'loaded' : ''}`}
                />
            </div>

            <div className="hero-overlay"><div className="hero-gradient"></div></div>

            {/* Дракон вместо маски */}
            <div 
                className="hero-icon-wrapper"
                style={{ transform: `translate(${iconOffset.x}px, ${iconOffset.y}px)` }}
            >
                <div className="hero-icon-body">
                    <img 
                        src="/images/dragon.svg" 
                        alt="Дракон" 
                        style={{ 
                            width: '100%', 
                            height: '100%', 
                            objectFit: 'contain',
                            filter: 'drop-shadow(0px 4px 12px rgba(233, 30, 99, 0.3))' // Легкая тень в тон вашего дизайна
                        }} 
                    />
                </div>
            </div>

            <div className="hero-layout">
                <div className="hero-content">
                    <h1 className="hero-name">Дарья Сиволобова</h1>
                    <p className="hero-subtitle">Актриса &bull; Сцена</p>
                    <p className="hero-description">
                        Юная актриса с искренней улыбкой и безграничной любовью к сцене.
                        Артистичная, пластичная и очень харизматичная. 
                        Умеет перевоплощаться в любого героя и каждый день делает шаг к своей большой мечте.
                    </p>
                    <div className="hero-cta-group">
                        <a href="#about" className="hero-cta hero-cta-primary">Узнать больше</a>
                        <a href="#video" className="hero-cta hero-cta-secondary">Видео &#10132;</a>
                    </div>
                </div>
            </div>

            <div className="hero-scroll">
                <span>Листайте вниз</span>
                <div className="scroll-arrow">&#8595;</div>
            </div>
        </section>
    )
}