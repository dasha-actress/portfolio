import { useLayoutEffect, useRef, useCallback } from 'react'
import { useSeason } from '../../context/SeasonContext'
import './SeasonParticles.css'

interface Particle {
    x: number
    y: number
    size: number
    speedY: number
    speedX: number
    rotation: number
    rotationSpeed: number
    opacity: number
    color: string
}

const COUNT = 40

export default function SeasonParticles() {
    const { season, particlesEnabled } = useSeason()
    const canvasRef = useRef<HTMLCanvasElement | null>(null)
    const rafRef = useRef<number>(0)
    const particlesRef = useRef<Particle[]>([])

    const colors: string[] = (() => {
        switch (season) {
            case 'autumn':   return ['#d46a1e', '#c0392b', '#f39c12', '#e74c3c']
            case 'winter':   return ['#ffffff', '#a8d8ea', '#dfe6e9']
            case 'spring':   return ['#74b9ff', '#a29bfe', '#63b5ed']
            case 'summer':   return ['#ffeaa7', '#fdcb6e', '#feca57']
            default:         return ['#fff']
        }
    })()

    // --- Отрисовка красивого листа (осень) ---
    const drawLeaf = (ctx: CanvasRenderingContext2D, p: Particle) => {
        ctx.fillStyle = p.color
        ctx.beginPath()
        // Форма листа (две дуги)
        ctx.moveTo(0, -p.size)
        ctx.bezierCurveTo(p.size * 0.8, -p.size * 0.5, p.size * 0.8, p.size * 0.5, 0, p.size)
        ctx.bezierCurveTo(-p.size * 0.8, p.size * 0.5, -p.size * 0.8, -p.size * 0.5, 0, -p.size)
        ctx.fill()

        // Прожилки
        ctx.strokeStyle = 'rgba(0,0,0,0.2)'
        ctx.lineWidth = 1
        ctx.beginPath()
        ctx.moveTo(0, -p.size)
        ctx.lineTo(0, p.size)
        ctx.stroke()
        
        // Боковые прожилки
        for(let i=0; i<3; i++) {
            const y = -p.size*0.5 + i * p.size * 0.5
            ctx.beginPath()
            ctx.moveTo(0, y)
            ctx.lineTo(p.size * 0.4, y + p.size * 0.2)
            ctx.stroke()
            ctx.beginPath()
            ctx.moveTo(0, y)
            ctx.lineTo(-p.size * 0.4, y + p.size * 0.2)
            ctx.stroke()
        }
    }

    // --- Отрисовка снежинки (зима) ---
    const drawSnowflake = (ctx: CanvasRenderingContext2D, p: Particle) => {
        ctx.strokeStyle = p.color
        ctx.lineWidth = 2
        ctx.beginPath()
        // 6 лучей
        for (let i = 0; i < 6; i++) {
            const angle = (i * Math.PI) / 3
            const dx = Math.cos(angle) * p.size
            const dy = Math.sin(angle) * p.size
            ctx.moveTo(0, 0)
            ctx.lineTo(dx, dy)
            
            // Веточки на лучах
            const bx = Math.cos(angle) * p.size * 0.6
            const by = Math.sin(angle) * p.size * 0.6
            ctx.moveTo(bx, by)
            ctx.lineTo(bx + Math.cos(angle + 1) * 3, by + Math.sin(angle + 1) * 3)
            ctx.moveTo(bx, by)
            ctx.lineTo(bx + Math.cos(angle - 1) * 3, by + Math.sin(angle - 1) * 3)
        }
        ctx.stroke()
    }

    // --- Отрисовка капли (весна) ---
    const drawDrop = (ctx: CanvasRenderingContext2D, p: Particle) => {
        ctx.fillStyle = p.color
        ctx.beginPath()
        // Форма капли
        ctx.moveTo(0, -p.size)
        ctx.bezierCurveTo(p.size, -p.size * 0.2, p.size * 0.8, p.size, 0, p.size)
        ctx.bezierCurveTo(-p.size * 0.8, p.size, -p.size, -p.size * 0.2, 0, -p.size)
        ctx.fill()
        
        // Блик
        ctx.fillStyle = 'rgba(255,255,255,0.6)'
        ctx.beginPath()
        ctx.arc(-p.size * 0.2, -p.size * 0.2, p.size * 0.2, 0, Math.PI * 2)
        ctx.fill()
    }

    // --- Отрисовка лучика/звездочки (лето) ---
    const drawRay = (ctx: CanvasRenderingContext2D, p: Particle) => {
        ctx.fillStyle = p.color
        ctx.beginPath()
        // 4-конечная звезда
        for (let i = 0; i < 8; i++) {
            const angle = (i * Math.PI) / 4
            const r = i % 2 === 0 ? p.size : p.size * 0.3
            ctx.lineTo(Math.cos(angle) * r, Math.sin(angle) * r)
        }
        ctx.closePath()
        ctx.fill()
        
        // Свечение
        ctx.shadowBlur = 10
        ctx.shadowColor = p.color
        ctx.fill()
        ctx.shadowBlur = 0 // сброс
    }

    const drawForSeason = (ctx: CanvasRenderingContext2D, p: Particle) => {
        switch (season) {
            case 'autumn': drawLeaf(ctx, p); break
            case 'winter': drawSnowflake(ctx, p); break
            case 'spring': drawDrop(ctx, p); break
            case 'summer': drawRay(ctx, p); break
        }
    }

    const animate = useCallback(() => {
        const canvas = canvasRef.current
        if (!canvas) return
        const ctx = canvas.getContext('2d')
        if (!ctx) return

        canvas.width = window.innerWidth
        canvas.height = window.innerHeight
        ctx.clearRect(0, 0, canvas.width, canvas.height)

        const list = particlesRef.current

        for (let i = 0; i < list.length; i++) {
            const p = list[i]
            p.y += p.speedY
            p.x += p.speedX + Math.sin(p.y * 0.01) * 0.5
            p.rotation += p.rotationSpeed

            if (p.y > canvas.height + 30) {
                p.y = -30
                p.x = Math.random() * canvas.width
            }

            ctx.save()
            ctx.translate(p.x, p.y)
            ctx.rotate(p.rotation)
            drawForSeason(ctx, p)
            ctx.restore()
        }

        rafRef.current = requestAnimationFrame(animate)
    }, [season])

    useLayoutEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return
        const syncSize = () => {
            canvas.width = window.innerWidth
            canvas.height = window.innerHeight
        }
        syncSize()
        window.addEventListener('resize', syncSize)
        return () => window.removeEventListener('resize', syncSize)
    }, [])

    useLayoutEffect(() => {
        if (!particlesEnabled) {
            cancelAnimationFrame(rafRef.current)
            particlesRef.current = []
            const canvas = canvasRef.current
            if (canvas) {
                const ctx = canvas.getContext('2d')
                if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height)
            }
            return
        }

        particlesRef.current = Array.from({ length: COUNT }, (): Particle => ({
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
            size: 6 + Math.random() * 10,
            speedY: 0.5 + Math.random() * 1.5,
            speedX: -0.5 + Math.random() * 1,
            rotation: Math.random() * Math.PI * 2,
            rotationSpeed: (Math.random() - 0.5) * 0.03,
            opacity: 0.5 + Math.random() * 0.5,
            color: colors[Math.floor(Math.random() * colors.length)],
        }))

        rafRef.current = requestAnimationFrame(animate)
        return () => cancelAnimationFrame(rafRef.current)
    }, [particlesEnabled, animate, season, colors])

    return (
        <canvas
            ref={canvasRef}
            className="season-canvas"
            style={{ width: '100vw', height: '100vh', pointerEvents: 'none' }}
            aria-hidden="true"
        />
    )
}