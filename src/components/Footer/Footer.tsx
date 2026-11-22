import './Footer.css'

export default function Footer() {
    return (
        <footer className="footer">
            <div className="container footer-content">
                <p className="footer-brand">
                    <span className="footer-dragon">🐉</span> Дарья Сиволобова
                </p>
                <p className="footer-text">
                    Актриса • Сцена
                </p>
                <div className="footer-divider"></div>
                <p className="footer-copyright">
                    © {new Date().getFullYear()} Дарья Сиволобова. Все права защищены.
                </p>
            </div>
        </footer>
    )
}
