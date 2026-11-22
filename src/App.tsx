import { useState, useEffect } from 'react'
import './App.css'
// import { SeasonProvider } from './context/SeasonContext'
import Navbar from './components/Navbar/Navbar'
import Hero from './components/Hero/Hero'
import AboutMe from './components/AboutMe/AboutMe'
import VideoSection from './components/VideoSection/VideoSection'
import PhotoCarousel from './components/PhotoCarousel/PhotoCarousel'
import Contact from './components/Contact/Contact'
// import SeasonParticles from './components/SeasonParticles/SeasonParticles'
// import SeasonToggle from './components/SeasonToggle/SeasonToggle'
import Footer from './components/Footer/Footer'

const NAV_ITEMS = [
    { label: 'Главная', href: '#hero' },
    { label: 'Обо мне', href: '#about' },
    { label: 'Видео', href: '#video' },
    { label: 'Сцена', href: '#scene' },
    { label: 'Галерея', href: '#gallery' },
    { label: 'Фото', href: '#foto' },
    { label: 'Достижения', href: '#achievements' },
    { label: 'Контакты', href: '#contact' },
]

function AppInner() {
    const [menuOpen, setMenuOpen] = useState(false)

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') setMenuOpen(false)
        }
        if (menuOpen) document.addEventListener('keydown', handleKeyDown)
        return () => document.removeEventListener('keydown', handleKeyDown)
    }, [menuOpen])

    // Блокируем скролл при открытом меню и добавляем класс на body
    useEffect(() => {
        if (menuOpen) {
            document.body.classList.add('menu-is-open')
            document.body.style.overflow = 'hidden'
        } else {
            document.body.classList.remove('menu-is-open')
            document.body.style.overflow = ''
        }
        return () => {
            document.body.classList.remove('menu-is-open')
            document.body.style.overflow = ''
        }
    }, [menuOpen])

    return (
        <div className={`app ${menuOpen ? 'menu-open' : ''}`}>
            <Navbar
                items={NAV_ITEMS}
                menuOpen={menuOpen}
                onToggleMenu={() => setMenuOpen((v) => !v)}
            />

            {/* <SeasonParticles />
            <SeasonToggle /> */}

            <main>
                <section id="hero"><Hero /></section>
                <section id="about"><AboutMe /></section>
                <section id="video"><VideoSection /></section>
                <section id="scene"><PhotoCarousel title="Сцена" folder="scene" autoplayDelay={4000} /></section>
                <section id="gallery"><PhotoCarousel title="Галерея" folder="actress" autoplayDelay={4000} /></section>
                <section id="foto"><PhotoCarousel title="Фото" folder="foto" autoplayDelay={4000} /></section>
                <section id="achievements"><PhotoCarousel title="Достижения" folder="diplom" autoplayDelay={5000} /></section>
                <section id="contact"><Contact /></section>
            </main>

            <Footer />
        </div>
    )
}

export default function App() {
    return (
        // <SeasonProvider>
            <AppInner />
        // </SeasonProvider>
    )
}