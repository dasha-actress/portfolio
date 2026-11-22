import { useState, useEffect, useCallback, useRef } from 'react'
import { createPortal } from 'react-dom'
import './PhotoCarousel.css'

interface PhotoItem {
    id: number
    src: string
}

interface PhotoCarouselProps {
    title: string
    folder: string
    autoplayDelay?: number
}

// Хелпер для формирования правильного пути с учетом базового URL (для GitHub Pages)
const asset = (path: string) => `${import.meta.env.BASE_URL}${path.replace(/^\//, '')}`

const FOLDER_MAP: Record<string, string[]> = {
    scene: [
        asset('scene/00WzJlWaPeU.jpg'), asset('scene/9vZ3TSVXwSI.jpg'), asset('scene/BEPjKXLeeDY.jpg'),
        asset('scene/BM0dBpznvJM.jpg'), asset('scene/CaSureNZ-BU.jpg'), asset('scene/I08afKfghZ0.jpg'),
        asset('scene/IuvY7jdZuME.jpg'), asset('scene/JMEfSK0-sWc.jpg'), asset('scene/LQ7rQcP25ms.jpg'),
        asset('scene/OdGFr-Ysz-U.jpg'), asset('scene/bocByPNm8Z4.jpg'), asset('scene/keiQ8fBq5gw.jpg'),
        asset('scene/losMjTOFLRs.jpg'), asset('scene/ndGbT8qU_eo.jpg'), asset('scene/p0bGoSNatio.jpg'),
        asset('scene/rJ8rfFUiJeA.jpg'), asset('scene/ygZi_HvrToQ.jpg'),
    ],
    actress: [
        asset('actress/IMG_20260110_191048_148.jpg'), asset('actress/IMG_20260523_184907_218.jpg'),
        asset('actress/IMG_20260619_215900.jpg'), asset('actress/IMG_20261003_153110_992.jpg'),
        asset('actress/IMG_20261010_172933_230.jpg'), asset('actress/IMG_20261017_154708_493.jpg'),
    ],
    foto: [
        asset('foto/DGawynGbB_8.jpg'), asset('foto/IMG_20260103_132610.jpg'), asset('foto/IMG_20260103_133405.jpg'),
        asset('foto/IMG_20260103_134402.jpg'), asset('foto/IMG_20260614_172000.jpg'), asset('foto/IMG_20260614_172010.jpg'),
        asset('foto/IMG_20260614_172216.jpg'), asset('foto/IMG_20260614_172220.jpg'), asset('foto/IMG_20260621_155131.jpg'),
        asset('foto/IMG_20260621_155217.jpg'), asset('foto/YxOSzcylvlI.jpg'),
    ],
    diplom: [
        asset('diplom/IMG_20260328_174253.jpg'), asset('diplom/IMG_20260530_214132.jpg'),
    ],
}

export default function PhotoCarousel({ title, folder, autoplayDelay = 4000 }: PhotoCarouselProps) {
    const [current, setCurrent] = useState(0)
    const [isPaused, setIsPaused] = useState(false)
    const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)
    const touchRef = useRef<number | null>(null)

    const photoList: PhotoItem[] = (FOLDER_MAP[folder] ?? []).map((src, i) => ({ id: i + 1, src }))
    const total = photoList.length

    const goNext = useCallback(() => setCurrent((c) => (c + 1) % total), [total])
    const goPrev = useCallback(() => setCurrent((c) => (c - 1 + total) % total), [total])

    const lightboxNext = useCallback((e?: React.MouseEvent) => {
        e?.stopPropagation()
        if (lightboxIndex !== null) setLightboxIndex((lightboxIndex + 1) % total)
    }, [lightboxIndex, total])

    const lightboxPrev = useCallback((e?: React.MouseEvent) => {
        e?.stopPropagation()
        if (lightboxIndex !== null) setLightboxIndex((lightboxIndex - 1 + total) % total)
    }, [lightboxIndex, total])

    useEffect(() => {
        if (isPaused || total <= 1 || lightboxIndex !== null) return
        const timer = setInterval(goNext, autoplayDelay)
        return () => clearInterval(timer)
    }, [goNext, isPaused, total, autoplayDelay, lightboxIndex])

    const handleTouchStart = (e: React.TouchEvent) => { touchRef.current = e.touches[0].clientX }
    const handleTouchEnd = (e: React.TouchEvent) => {
        if (touchRef.current === null || total <= 1) return
        const diff = e.changedTouches[0].clientX - touchRef.current
        if (Math.abs(diff) > 50) { diff < 0 ? goNext() : goPrev() }
        touchRef.current = null
    }

    useEffect(() => {
        const handleKey = (e: KeyboardEvent) => {
            if (lightboxIndex !== null) {
                if (e.key === 'Escape') setLightboxIndex(null)
                if (e.key === 'ArrowRight') lightboxNext()
                if (e.key === 'ArrowLeft') lightboxPrev()
                return
            }
            if (e.key === 'ArrowRight') goNext()
            if (e.key === 'ArrowLeft') goPrev()
        }
        window.addEventListener('keydown', handleKey)
        return () => window.removeEventListener('keydown', handleKey)
    }, [goNext, goPrev, lightboxIndex, lightboxNext, lightboxPrev])

    useEffect(() => {
        if (lightboxIndex !== null) document.body.style.overflow = 'hidden'
        else document.body.style.overflow = ''
        return () => { document.body.style.overflow = '' }
    }, [lightboxIndex])

    if (total === 0) return null

    return (
        <section className="carousel-section">
            <div className="container">
                <h2 className="section-title">{title}</h2>

                <div
                    className="carousel-container"
                    onTouchStart={handleTouchStart}
                    onTouchEnd={handleTouchEnd}
                    onMouseEnter={() => setIsPaused(true)}
                    onMouseLeave={() => setIsPaused(false)}
                >
                    <button className="carousel-nav carousel-prev" onClick={goPrev}>&#8592;</button>

                    <div className="carousel-slides">
                        {photoList.map((photo, i) => (
                            <div 
                                key={photo.id} 
                                className={`carousel-slide ${current === i ? 'active' : ''}`}
                            >
                                <img
                                    src={photo.src}
                                    alt={`${title} — фото ${i + 1}`}
                                    loading="lazy"
                                    onClick={() => setLightboxIndex(i)}
                                    style={{ cursor: 'zoom-in' }}
                                    onError={(e) => { e.currentTarget.style.display = 'none' }}
                                />
                                <div className="carousel-caption">Фото {i + 1}</div>
                            </div>
                        ))}
                    </div>

                    <button className="carousel-nav carousel-next" onClick={goNext}>&#8594;</button>
                </div>

                <div className="carousel-dots">
                    {photoList.map((_, i) => (
                        <button key={i} className={`carousel-dot ${current === i ? 'active' : ''}`} onClick={() => setCurrent(i)} />
                    ))}
                </div>

                <div className="carousel-progress">
                    {photoList.map((_, i) => (
                        <div key={i} className={`carousel-progress-seg ${i <= current ? 'filled' : ''}`} />
                    ))}
                </div>

                <p className="carousel-hint">👾 Листайте нажатием, свайпом или кликните для увеличения</p>
            </div>

            {/* Модальное окно (Лайтбокс) */}
            {lightboxIndex !== null && createPortal(
                <div className="photo-modal" onClick={() => setLightboxIndex(null)}>
                    <button className="photo-modal-close" onClick={() => setLightboxIndex(null)}>✕</button>
                    
                    <button className="photo-modal-nav prev" onClick={lightboxPrev}>&#8592;</button>
                    
                    <img 
                        src={photoList[lightboxIndex].src} 
                        alt="Просмотр" 
                        onClick={(e) => e.stopPropagation()} 
                    />
                    
                    <button className="photo-modal-nav next" onClick={lightboxNext}>&#8594;</button>
                    
                    <div className="photo-modal-counter">
                        {lightboxIndex + 1} / {total}
                    </div>
                </div>,
                document.body
            )}
        </section>
    )
}