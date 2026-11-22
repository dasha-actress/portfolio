import { useEffect, useRef } from 'react'
import './Contact.css'

interface SocialLink {
    name: string
    url: string
    color: string
    icon: JSX.Element
}

const socialLinks: SocialLink[] = [
    {
        name: 'VK',
        url: 'https://vk.com/id886560078',
        color: '#4C75A3',
        icon: (
            <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true">
                <path d="M13.162 18.994c.609 0 .858-.406.851-.915-.031-1.917.714-2.949 2.059-1.604 1.488 1.488 1.796 2.519 3.603 2.519h3.2c.808 0 1.126-.26 1.126-.668 0-.863-1.421-2.386-2.625-3.504-1.686-1.565-1.765-1.602-.313-3.486 1.801-2.339 4.157-5.336 2.073-5.336h-3.981c-.772 0-.828.435-1.103 1.083-.995 2.347-2.886 5.387-3.604 4.922-.751-.485-.407-2.406-.35-5.261.015-.754.011-1.271-1.141-1.539-.629-.145-1.241-.205-1.809-.205-2.273 0-3.841.953-2.95 1.119 1.571.293 1.42 3.692 1.054 5.16-.638 2.556-3.036-2.024-4.035-4.305-.241-.548-.315-.974-1.175-.974H.861c-.492 0-.787.16-.787.516 0 .602 2.96 6.72 5.786 9.77 2.756 2.975 5.48 2.708 7.302 2.708z" />
            </svg>
        ),
    },
]

const EMAIL = 'dns114@yandex.ru'
const EMAIL_SUBJECT = 'Сотрудничество / предложение о выступлении'
const EMAIL_BODY = `Здравствуйте, Дарья!\n\nПишу вам по поводу возможного сотрудничества / выступления.\n\nМеня зовут: [Ваше имя]\nКонтакт для связи: [Ваш телефон или email]\n\nС уважением,\n[Ваше имя]`

const MAILTO_HREF = `mailto:${EMAIL}?subject=${encodeURIComponent(EMAIL_SUBJECT)}&body=${encodeURIComponent(EMAIL_BODY)}`

const PHONE_NUMBER = '+7 (988) 396-68-15'
const PHONE_HREF = 'tel:+79883966815'

export default function Contact() {
    const sectionRef = useRef<HTMLElement>(null)

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible')
                    }
                })
            },
            { threshold: 0.15 }
        )

        const el = sectionRef.current
        if (el) {
            observer.observe(el)
            return () => observer.unobserve(el)
        }
    }, [])

    return (
        <section className="contact-section" ref={sectionRef}>
            <div className="container">
                <h2 className="section-title">Контакты</h2>

                <p className="contact-intro">
                    Буду рада сотрудничеству и предложениям о выступлениях! ✨
                </p>

                {/* CTA Email Button */}
                <a href={MAILTO_HREF} className="contact-cta" target="_blank" rel="noopener noreferrer">
                    &#9993; Связаться со мной
                </a>

                {/* Social links */}
                <div className="contact-socials">
                    <span className="contact-socials-label">Социальные сети:</span>
                    <div className="socials-grid">
                        {socialLinks.map((link) => (
                            <a
                                key={link.name}
                                className="social-link"
                                href={link.url}
                                style={{ '--social-color': link.color } as React.CSSProperties}
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label={link.name}
                            >
                                {/* Выводим SVG-иконку из массива */}
                                <span className="social-link-icon">{link.icon}</span>
                                <span className="social-link-name">{link.name}</span>
                            </a>
                        ))}
                    </div>
                </div>

                {/* Contact info */}
                <div className="contact-info">
                    <div className="contact-info-item">
                        <span className="contact-info-icon">&#9742;</span>
                        <a href={PHONE_HREF}>{PHONE_NUMBER}</a>
                    </div>
                    <div className="contact-info-item">
                        <span className="contact-info-icon">&#9993;</span>
                        <a href={MAILTO_HREF}>{EMAIL}</a>
                    </div>
                </div>
            </div>
        </section>
    )
}