import { useState, useEffect, useCallback } from 'react'
import { createPortal } from 'react-dom'
import './VideoSection.css'

const BASE = import.meta.env.BASE_URL

const VIDEOS_DATA = [
    {
        id: 1,
        title: 'Видеовизитка',
        iframeSrc: 'https://vkvideo.ru/video_ext.php?oid=886560078&id=456239023&hash=e7e4f9abef674ad7&hd=3',
        vkLink: 'https://vkvideo.ru/video886560078_456239023',
        thumb: `${BASE}main/SCR-20261105-htba.jpeg`, 
    },
    {
        id: 2,
        title: 'Стихотворение Расула Гамзатова "Берегите матерей"',
        iframeSrc: 'https://vk.com/video_ext.php?oid=886560078&id=456239019&hd=3',
        vkLink: 'https://vk.ru/clip886560078_456239019?c=1',
        thumb: `${BASE}main/clip2.jpeg`, // Ваше фото для 1 клипа
    },
    {
        id: 3,
        title: 'Отрывок из рассказа Михаила Зощенко "Находка"',
        iframeSrc: 'https://vk.com/video_ext.php?oid=886560078&id=456239017&hd=3',
        vkLink: 'https://vk.ru/clip886560078_456239017?c=1',
        thumb: `${BASE}main/clip1.jpeg`, // Ваше фото для 2 клипа
    }
]

export default function VideoSection() {
    const [current, setCurrent] = useState(0)
    const total = VIDEOS_DATA.length
    const [touchStart, setTouchStart] = useState<number | null>(null)
    const [videoFrameOpen, setVideoFrameOpen] = useState(false)

    const goNext = useCallback(() => setCurrent((c) => (c + 1) % total), [total])
    const goPrev = useCallback(() => setCurrent((c) => (c - 1 + total) % total), [total])

    const handleTouchStart = (e: React.TouchEvent) => setTouchStart(e.touches[0].clientX)

    const handleTouchEnd = (e: React.TouchEvent) => {
        if (touchStart === null) return
        const diff = e.changedTouches[0].clientX - touchStart
        if (Math.abs(diff) > 50) {
            diff < 0 ? goNext() : goPrev()
        }
        setTouchStart(null)
    }

    // Блокировка скролла + обработка клавиш
    useEffect(() => {
        if (videoFrameOpen) {
            document.body.style.overflow = 'hidden'
        } else {
            document.body.style.overflow = ''
        }
        
        const handleKey = (e: KeyboardEvent) => {
            if (!videoFrameOpen) return
            if (e.key === 'ArrowRight') goNext()
            if (e.key === 'ArrowLeft') goPrev()
            if (e.key === 'Escape') setVideoFrameOpen(false)
        }
        window.addEventListener('keydown', handleKey)
        
        return () => {
            document.body.style.overflow = ''
            window.removeEventListener('keydown', handleKey)
        }
    }, [videoFrameOpen, goNext, goPrev])

    return (
        <section className="video-section">
            <div className="container">
                <h2 className="section-title">Видео</h2>

                {/* Карусель */}
                <div className="video-carousel" onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
                    {/* Декоративные уголки для активного слайда */}
                    <div className="video-corner video-corner-tl"></div>
                    <div className="video-corner video-corner-tr"></div>
                    <div className="video-corner video-corner-bl"></div>
                    <div className="video-corner video-corner-br"></div>

                    <button className="video-nav video-prev" onClick={goPrev} aria-label="Предыдущее видео">{'←'}</button>

                    <div className="video-slides">
                        {VIDEOS_DATA.map((video, i) => (
                            <div key={video.id} className={`video-slide ${current === i ? 'active' : ''}`}>
                                <div className="video-play-area" onClick={() => setVideoFrameOpen(true)}>
                                    {video.thumb && (
                                        <img src={video.thumb} alt={video.title} className="video-slide-preview" loading="lazy" />
                                    )}
                                    <div className="video-play-icon">{'▶'}</div>
                                    <h3 className="video-title">{video.title}</h3>
                                    <span className="video-hint">{'🎬'} Нажмите для просмотра видео</span>
                                </div>
                            </div>
                        ))}
                    </div>

                    <button className="video-nav video-next" onClick={goNext} aria-label="Следующее видео">{'→'}</button>
                </div>

                {/* Точки */}
                <div className="video-dots">
                    {VIDEOS_DATA.map((_, i) => (
                        <button
                            key={i}
                            className={`video-dot ${current === i ? 'active' : ''}`}
                            onClick={() => setCurrent(i)}
                            aria-label={`Видео ${i + 1}`}
                        />
                    ))}
                </div>

                {/* Прогресс-бар */}
                <div className="video-progress-bar">
                    {Array.from({ length: total }, (_, i) => (
                        <div key={i} className={`video-progress-segment ${i <= current ? 'filled' : ''}`} />
                    ))}
                </div>

                <p className="video-hint-text">{'👻'} Листайте нажатием или стрелками</p>
            </div>

            {/* Модальное окно с видео */}
            {videoFrameOpen && createPortal(
                <div className="video-player-overlay" onClick={() => setVideoFrameOpen(false)}>
                    <button
                        className="video-modal-nav video-modal-prev"
                        onClick={(e) => { e.stopPropagation(); goPrev() }}
                        aria-label="Предыдущее видео"
                    >{'←'}</button>

                    <div className="video-player-content" onClick={(e) => e.stopPropagation()}>
                        <button className="video-player-close" onClick={() => setVideoFrameOpen(false)} aria-label="Закрыть">{'×'}</button>

                        <div className="video-player-iframe-wrap">
                            <iframe
                                src={VIDEOS_DATA[current].iframeSrc}
                                allowFullScreen
                                allow="autoplay; encrypted-media; fullscreen; picture-in-picture"
                                title={VIDEOS_DATA[current].title}
                                className="video-player-iframe"
                            />
                        </div>

                        <h4 className="video-player-title">{VIDEOS_DATA[current].title}</h4>

                        <div className="video-player-fallback">
                            <a
                                href={VIDEOS_DATA[current].vkLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="video-player-link"
                            >
                                ▶ Открыть в VK
                            </a>
                            <p className="video-player-note">
                                На случай, если видео не воспроизводится
                            </p>
                        </div>

                        <div className="video-modal-counter">
                            {current + 1} / {total}
                            <span className="video-modal-hint"> · Листайте стрелками ← →</span>
                        </div>
                    </div>

                    <button
                        className="video-modal-nav video-modal-next"
                        onClick={(e) => { e.stopPropagation(); goNext() }}
                        aria-label="Следующее видео"
                    >{'→'}</button>
                </div>,
                document.body
            )}
        </section>
    )
}