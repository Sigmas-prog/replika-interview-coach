import { useMemo, useState } from 'react'
import {
  ArrowRight,
  BarChart3,
  BriefcaseBusiness,
  Check,
  ChevronLeft,
  ChevronRight,
  CircleUserRound,
  Clock3,
  FileText,
  Gauge,
  Lightbulb,
  Mic,
  RotateCcw,
  ShieldCheck,
  Sparkles,
  Target,
  TrendingUp,
  X,
} from 'lucide-react'

type Stage = 'landing' | 'setup' | 'interview' | 'report'

type Question = {
  category: string
  text: string
  hint: string
}

const questions: Question[] = [
  {
    category: 'ОПЫТ',
    text: 'Расскажите о задаче, где вам пришлось выбирать между скоростью разработки и качеством результата.',
    hint: 'Используйте структуру: ситуация → задача → действие → измеримый результат.',
  },
  {
    category: 'ТЕХНИЧЕСКИЙ КРУГОЗОР',
    text: 'Как бы вы искали причину резкого замедления интерфейса после нового релиза?',
    hint: 'Покажите ход мысли: метрики, гипотеза, проверка, локализация проблемы.',
  },
  {
    category: 'КОМАНДНАЯ РАБОТА',
    text: 'Вспомните ситуацию, когда вы были не согласны с решением коллеги. Как вы поступили?',
    hint: 'Не критикуйте человека — расскажите, как работали с аргументами и рисками.',
  },
  {
    category: 'РОСТ',
    text: 'Какой профессиональный навык вы развиваете сейчас и как измеряете прогресс?',
    hint: 'Свяжите навык с задачами будущей роли и приведите конкретный пример практики.',
  },
]

const sampleAnswer =
  'В прошлом проекте нам нужно было выпустить новый онбординг к конференции. Срок был две недели, а полный рефакторинг занял бы месяц. Я предложил выделить критический пользовательский путь, покрыть его тестами и вынести технический долг в отдельный спринт. Мы выпустились вовремя, конверсия в активацию выросла на 14%, а через две недели команда закрыла оставшийся долг.'

function Brand() {
  return (
    <button className="brand" onClick={() => window.location.reload()} aria-label="На главную">
      <span className="brand-mark"><span /></span>
      <span>Реплика</span>
    </button>
  )
}

function Landing({ onStart }: { onStart: () => void }) {
  return (
    <main className="landing-shell">
      <nav className="nav-wrap" aria-label="Основная навигация">
        <Brand />
        <div className="nav-links">
          <a href="#how">Как работает</a>
          <a href="#result">Результат</a>
        </div>
        <button className="nav-cta" onClick={onStart}>Попробовать <ArrowRight size={15} /></button>
      </nav>

      <section className="hero">
        <div className="eyebrow"><Sparkles size={14} /> Персональная репетиция с ИИ</div>
        <h1>Собеседование<br />без <em>неожиданностей</em></h1>
        <p className="hero-copy">Загрузите резюме и вакансию. Реплика проведёт интервью, разберёт ответы и покажет, что улучшить до реальной встречи.</p>
        <div className="hero-actions">
          <button className="primary-button" onClick={onStart}>Начать тренировку <ArrowRight size={17} /></button>
          <span><ShieldCheck size={16} /> Демо работает без регистрации</span>
        </div>

        <div className="product-preview" id="result">
          <div className="preview-top">
            <div><span className="mini-label">ГОТОВНОСТЬ К ИНТЕРВЬЮ</span><strong>82<span>%</span></strong></div>
            <div className="score-ring"><span>82</span></div>
          </div>
          <div className="preview-grid">
            <div className="preview-question">
              <span className="mini-label">ВОПРОС 4 ИЗ 7 · ОПЫТ</span>
              <h3>Расскажите о сложном решении, которое вам пришлось принять в проекте.</h3>
              <div className="answer-wave"><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /></div>
              <div className="answer-meta"><span><Mic size={14} /> Ваш ответ</span><span>01:42</span></div>
            </div>
            <div className="feedback-card">
              <span className="feedback-icon"><Sparkles size={17} /></span>
              <div><span className="mini-label">РАЗБОР ОТВЕТА</span><h4>Сильный пример</h4></div>
              <p>Вы показали личный вклад и назвали результат. Добавьте контекст: почему решение было сложным?</p>
              <div className="skill-row"><span>Структура</span><b>8.5</b></div>
              <div className="skill-row"><span>Конкретика</span><b>7.8</b></div>
              <div className="skill-row"><span>Уверенность</span><b>8.2</b></div>
            </div>
          </div>
        </div>
      </section>

      <section className="steps" id="how">
        <div><span>01</span><FileText size={22} /><h3>Дайте контекст</h3><p>Резюме и описание роли превращаются в персональный сценарий.</p></div>
        <div><span>02</span><Mic size={22} /><h3>Пройдите интервью</h3><p>Отвечайте в комфортном темпе на вопросы, похожие на реальные.</p></div>
        <div><span>03</span><TrendingUp size={22} /><h3>Станьте сильнее</h3><p>Получите точечный разбор и план подготовки без общих советов.</p></div>
      </section>
    </main>
  )
}

function Setup({ onBack, onStart }: { onBack: () => void; onStart: () => void }) {
  const [role, setRole] = useState('Frontend-разработчик')
  const [level, setLevel] = useState('Middle')
  const [resume, setResume] = useState('')
  const [vacancy, setVacancy] = useState('')

  return (
    <div className="app-shell">
      <header className="app-header"><Brand /><span className="demo-pill">ДЕМО-РЕЖИМ</span><button className="icon-button" onClick={onBack} aria-label="Закрыть"><X size={20} /></button></header>
      <main className="setup-main">
        <div className="setup-heading"><button className="back-link" onClick={onBack}><ChevronLeft size={17} /> Назад</button><span>ШАГ 1 ИЗ 2</span><h1>Настроим интервью под вас</h1><p>Чем больше контекста, тем точнее будут вопросы. Для демо достаточно выбрать роль.</p></div>
        <div className="setup-card">
          <div className="field-row">
            <label>Желаемая роль<input value={role} onChange={(e) => setRole(e.target.value)} /></label>
            <label>Уровень<select value={level} onChange={(e) => setLevel(e.target.value)}><option>Junior</option><option>Middle</option><option>Senior</option><option>Lead</option></select></label>
          </div>
          <div className="field-row textareas">
            <label>Ваш опыт <span>необязательно</span><textarea value={resume} onChange={(e) => setResume(e.target.value)} placeholder="Вставьте текст резюме или коротко опишите опыт..." /></label>
            <label>Описание вакансии <span>необязательно</span><textarea value={vacancy} onChange={(e) => setVacancy(e.target.value)} placeholder="Вставьте требования из вакансии..." /></label>
          </div>
          <div className="setup-note"><Sparkles size={18} /><div><strong>Что подготовит Реплика</strong><p>4 вопроса по опыту, техническому кругозору и командной работе для роли «{role || 'специалист'}», уровень {level}.</p></div></div>
          <button className="primary-button full" onClick={onStart}>Собрать интервью <ArrowRight size={17} /></button>
        </div>
      </main>
    </div>
  )
}

function Interview({ onFinish }: { onFinish: () => void }) {
  const [index, setIndex] = useState(0)
  const [answer, setAnswer] = useState('')
  const [answers, setAnswers] = useState<string[]>([])
  const [showHint, setShowHint] = useState(false)
  const question = questions[index]
  const progress = ((index + 1) / questions.length) * 100

  const next = () => {
    const updated = [...answers]
    updated[index] = answer || sampleAnswer
    setAnswers(updated)
    if (index === questions.length - 1) onFinish()
    else {
      setIndex(index + 1)
      setAnswer(updated[index + 1] || '')
      setShowHint(false)
    }
  }

  return (
    <div className="app-shell interview-bg">
      <header className="app-header"><Brand /><div className="session-meta"><Clock3 size={15} /> 06:24</div><span className="demo-pill">ДЕМО-РЕЖИМ</span></header>
      <div className="progress-line"><span style={{ width: `${progress}%` }} /></div>
      <main className="interview-main">
        <aside className="interview-aside">
          <span className="mini-label">ПРОГРЕСС</span><strong>{index + 1}<small> / {questions.length}</small></strong>
          <div className="question-dots">{questions.map((_, i) => <span key={i} className={i < index ? 'done' : i === index ? 'active' : ''}>{i < index ? <Check size={13} /> : i + 1}</span>)}</div>
          <div className="aside-tip"><Lightbulb size={17} /><p>Отвечайте так, будто напротив вас живой интервьюер.</p></div>
        </aside>
        <section className="question-panel">
          <span className="category"><CircleUserRound size={15} /> {question.category}</span>
          <h1>{question.text}</h1>
          <div className="answer-box">
            <textarea autoFocus value={answer} onChange={(e) => setAnswer(e.target.value)} placeholder="Начните писать ответ здесь..." aria-label="Ваш ответ" />
            <div className="answer-toolbar"><button className="mic-button" onClick={() => setAnswer(sampleAnswer)}><Mic size={18} /> Заполнить демо-ответ</button><span>{answer.length} знаков</span></div>
          </div>
          {showHint && <div className="hint-box"><Lightbulb size={17} /><p>{question.hint}</p></div>}
          <div className="interview-actions"><button className="ghost-button" onClick={() => setShowHint(!showHint)}><Lightbulb size={16} /> {showHint ? 'Скрыть подсказку' : 'Нужна подсказка'}</button><button className="primary-button" onClick={next}>{index === questions.length - 1 ? 'Завершить' : 'Следующий вопрос'} <ChevronRight size={17} /></button></div>
        </section>
      </main>
    </div>
  )
}

function Report({ onRestart }: { onRestart: () => void }) {
  const metrics = useMemo(() => [
    { label: 'Структура', value: 86, note: 'Логичная подача' },
    { label: 'Конкретика', value: 74, note: 'Нужно больше цифр' },
    { label: 'Релевантность', value: 91, note: 'Точно для роли' },
    { label: 'Уверенность', value: 79, note: 'Хороший темп' },
  ], [])

  return (
    <div className="app-shell report-bg">
      <header className="app-header"><Brand /><span className="demo-pill">ОТЧЁТ ГОТОВ</span></header>
      <main className="report-main">
        <section className="report-intro">
          <div><span className="category"><Sparkles size={15} /> РАЗБОР ЗАВЕРШЁН</span><h1>Вы готовы лучше,<br />чем вам кажется.</h1><p>Ответы убедительные и хорошо связаны с ролью. Главная зона роста — добавлять больше измеримых результатов.</p></div>
          <div className="big-score"><span>ГОТОВНОСТЬ</span><strong>82<small>%</small></strong><p><TrendingUp size={15} /> Выше среднего</p></div>
        </section>
        <section className="metrics-grid">{metrics.map((metric) => <article key={metric.label}><div><span>{metric.label}</span><strong>{metric.value}</strong></div><div className="metric-track"><i style={{ width: `${metric.value}%` }} /></div><p>{metric.note}</p></article>)}</section>
        <section className="report-grid">
          <article className="report-card accent-card"><span className="report-icon"><Target size={20} /></span><div><span className="mini-label">ГЛАВНАЯ РЕКОМЕНДАЦИЯ</span><h2>Заканчивайте каждый пример результатом</h2><p>В двух ответах вы подробно описали действия, но не показали эффект. Добавляйте метрику, срок или конкретное изменение.</p><div className="example"><span>ВМЕСТО</span><p>«Мы успешно выпустили функцию»</p><span>ЛУЧШЕ</span><p>«Выпустили на неделю раньше, конверсия выросла на 14%»</p></div></div></article>
          <article className="report-card"><span className="report-icon green"><Gauge size={20} /></span><div><span className="mini-label">СИЛЬНАЯ СТОРОНА</span><h2>Системное мышление</h2><p>Вы разбиваете проблему на этапы и объясняете логику решений. Это создаёт ощущение зрелости и контроля.</p></div></article>
          <article className="report-card"><span className="report-icon blue"><BriefcaseBusiness size={20} /></span><div><span className="mini-label">ПЕРЕД ВСТРЕЧЕЙ</span><h2>Подготовьте две истории</h2><p>О конфликте приоритетов и об ошибке в проекте. Для каждой запишите контекст, свой вклад и результат.</p></div></article>
        </section>
        <div className="report-actions"><button className="primary-button" onClick={onRestart}><RotateCcw size={17} /> Пройти ещё раз</button><button className="ghost-button" onClick={() => window.print()}><BarChart3 size={17} /> Сохранить отчёт</button></div>
      </main>
    </div>
  )
}

export default function App() {
  const [stage, setStage] = useState<Stage>('landing')
  if (stage === 'setup') return <Setup onBack={() => setStage('landing')} onStart={() => setStage('interview')} />
  if (stage === 'interview') return <Interview onFinish={() => setStage('report')} />
  if (stage === 'report') return <Report onRestart={() => setStage('setup')} />
  return <Landing onStart={() => setStage('setup')} />
}
