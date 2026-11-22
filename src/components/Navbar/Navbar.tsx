import { useState, useEffect } from 'react'
import './Navbar.css'

interface NavItem { label: string; href: string; }
interface NavbarProps { items: NavItem[]; menuOpen: boolean; onToggleMenu: () => void; }

export default function Navbar({ items, menuOpen, onToggleMenu }: NavbarProps) {
    const [scrolled, setScrolled] = useState(false)

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 50)
        window.addEventListener('scroll', handleScroll, { passive: true })
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    const handleLinkClick = () => { if (menuOpen) onToggleMenu() }

    return (
        <nav className={`navbar ${scrolled ? 'scrolled' : ''} ${menuOpen ? 'menu-open' : ''}`}>
            <div className="container navbar-container">
                {/* Логотип */}
                <a href="#hero" className="navbar-logo" onClick={handleLinkClick}>
                    <div className="logo-dragon-wrapper">
                        {/* ⬇⬇⬇ ДОБАВЛЕН ПРОМЕЖУТОЧНЫЙ ДИВ ДЛЯ ДВИЖЕНИЯ ВВЕРХ-ВНИЗ ⬇⬇⬇ */}
                        <div className="logo-floating">
                            <img
                                src={`${import.meta.env.BASE_URL}images/dragon.svg`}
                                alt="Логотип Дракон"
                                className="logo-img"
                            />
                        </div>
                    </div>
                    <span className="logo-text">Дарья Сиволобова</span>
                </a>

                {/* Кнопка-бургер / Крестик */}
                <button
                    className={`navbar-toggle ${menuOpen ? 'open' : ''}`}
                    onClick={onToggleMenu}
                    aria-label={menuOpen ? 'Закрыть меню' : 'Открыть меню'}
                >
                    <span className="bar bar-1"></span>
                    <span className="bar bar-2"></span>
                    <span className="bar bar-3"></span>
                </button>

                {/* Выпадающее меню */}
                <ul className={`navbar-menu ${menuOpen ? 'open' : ''}`}>
                    {items.map((item) => (
                        <li key={item.href}>
                            <a href={item.href} onClick={handleLinkClick}>{item.label}</a>
                        </li>
                    ))}
                </ul>
            </div>
        </nav>
    )
}