import { useEffect, useRef } from 'react'
import './AboutMe.css'

const STATS = [
    { value: '2+', label: 'Года занятий актёрским мастерством' },
    { value: '5+', label: 'Выступлений на сцене' },
    { value: '10', label: 'Лет творческого пути' },
]

export default function AboutMe() {
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
        <section className="about-section" ref={sectionRef}>
            <div className="container">
                <h2 className="section-title">Обо мне</h2>

                <div className="about-layout">
                    {/* Photo side */}
                    <div className="about-photo-wrapper">
                        <div className="about-photo-frame">
                            <img
                                src={`${import.meta.env.BASE_URL}about/IMG_20260103_133944_1.jpg`}
                                alt="Дарья Сиволобова — фото для портфолио"
                                loading="lazy"
                                className="about-photo"
                            />
                            <div className="about-photo-glow"></div>
                        </div>
                    </div>

                    {/* Text side */}
                    <div className="about-text">
                        <p>
                            Всем привет! Я <strong>Дарья Сиволобова</strong>. мне 10 лет, и я — юная артистка. 
                            Актерское мастерство — это то, что заряжает меня энергией каждый день.
                        </p>

                        <p>
                            Уже 2 года я постигаю секреты сцены в школе {' '}
                            <a
                                href="https://vk.ru/i_actor.volgograd"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="about-link"
                            >
                                "Я-Актёр!"
                            </a> Я обожаю перевоплощаться в разных героев,
                            ловить эмоции зала и чувствовать эту невероятную магию театра.
                        </p>

                        <p>
                            Яркая, эмоциональная и трудолюбивая актриса. Отлично чувствую ритм сцены,
                            уверенно работаю с текстом и партнёрами. Обладаю хорошей памятью,
                            быстро схватываю режиссёрские задачи и смело пробую новое.
                            С удовольствием участвую в репетициях, ответственно отношусь к каждой роли
                            и стремлюсь раскрыть характер персонажа до мельчайших деталей.
                            Мечтаю сыграть героя, который вдохновляет и помогает другим не сдаваться.
                        </p>

                        {/* Stats */}
                        <div className="about-stats">
                            {STATS.map((stat) => (
                                <div key={stat.label} className="stat-card">
                                    <span className="stat-value">{stat.value}</span>
                                    <span className="stat-label">{stat.label}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
