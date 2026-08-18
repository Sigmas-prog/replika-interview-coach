import { useEffect, useMemo, useRef, useState } from 'react'
import {
  ArrowRight,
  CircleAlert,
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
  PhoneOff,
  RotateCcw,
  ShieldCheck,
  Sparkles,
  Target,
  TrendingUp,
  Video,
  VideoOff,
  X,
} from 'lucide-react'

type Stage = 'landing' | 'setup' | 'video' | 'interview' | 'report'

type InterviewProfile = {
  role: string
  level: string
  resume: string
  vacancy: string
}

type Question = {
  category: string
  text: string
  hint: string
}

type Metric = {
  label: string
  value: number
  note: string
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

function validateAnswer(value: string) {
  const text = value.trim()
  const words = text.match(/[а-яёa-z0-9-]+/gi) ?? []
  const naturalLanguageSignals = text.match(/\b(я|мы|мне|был[аи]?|проект|задач[аиу]?|команд[аеуы]?|решил[аи]?|сделал[аи]?|предложил[аи]?|результат|потому|чтобы|когда|после|сначала|поэтому)\b/gi) ?? []
  const wordsWithVowels = words.filter((word) => /[аеёиоуыэюяaeiouy]/i.test(word)).length

  if (text.length < 60 || words.length < 9) return 'Ответ слишком короткий. Опишите ситуацию, свои действия и результат — хотя бы 2–3 предложениями.'
  if (wordsWithVowels / words.length < 0.65 || naturalLanguageSignals.length < 2) return 'Похоже, это случайный набор символов. Напишите осмысленный ответ своими словами.'
  return null
}

function analyzeAnswers(answers: string[]) {
  const joined = answers.join(' ').toLowerCase()
  const averageLength = answers.reduce((sum, answer) => sum + answer.length, 0) / Math.max(answers.length, 1)
  const sentences = (joined.match(/[.!?]+/g) ?? []).length
  const actionSignals = (joined.match(/\b(сделал|сделала|предложил|предложила|решил|решила|настроил|настроила|разработал|разработала|исследовал|исследовала|выбрал|выбрала|проверил|проверила)\b/g) ?? []).length
  const resultSignals = (joined.match(/\b(результат|вырос|выросла|снизил|снизила|ускорил|ускорила|сэкономил|сэкономила|выпустил|выпустила|достиг|достигла|итоге)\b/g) ?? []).length
  const numbers = (joined.match(/\d+/g) ?? []).length
  const teamSignals = (joined.match(/\b(команда|коллега|менеджер|дизайнер|аналитик|заказчик|пользователь)\w*/g) ?? []).length
  const uncertainty = (joined.match(/\b(наверное|вроде|кажется|не знаю|как-то)\b/g) ?? []).length
  const clamp = (value: number) => Math.max(20, Math.min(96, Math.round(value)))

  const structure = clamp(38 + Math.min(sentences * 3, 24) + Math.min(actionSignals * 7, 24) + Math.min(averageLength / 30, 10))
  const specifics = clamp(34 + Math.min(numbers * 12, 30) + Math.min(resultSignals * 7, 24) + Math.min(averageLength / 38, 8))
  const relevance = clamp(42 + Math.min(actionSignals * 6, 24) + Math.min(teamSignals * 5, 18) + Math.min(averageLength / 30, 12))
  const confidence = clamp(55 + Math.min(actionSignals * 5, 25) + Math.min(sentences * 2, 12) - uncertainty * 10)
  const values = [structure, specifics, relevance, confidence]
  const overall = Math.round(values.reduce((sum, value) => sum + value, 0) / values.length)
  const notes = (value: number, strong: string, weak: string) => value >= 75 ? strong : weak
  const metrics: Metric[] = [
    { label: 'Структура', value: structure, note: notes(structure, 'Логичная подача', 'Нужна схема STAR') },
    { label: 'Конкретика', value: specifics, note: notes(specifics, 'Есть факты и цифры', 'Добавьте цифры') },
    { label: 'Релевантность', value: relevance, note: notes(relevance, 'Опыт раскрыт', 'Покажите свой вклад') },
    { label: 'Уверенность', value: confidence, note: notes(confidence, 'Уверенная формулировка', 'Уберите сомнения') },
  ]
  return { overall, metrics }
}

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

function Setup({ onBack, onStart }: { onBack: () => void; onStart: (profile: InterviewProfile) => void }) {
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
          <button className="primary-button full" onClick={() => onStart({ role, level, resume, vacancy })}>Начать видеособеседование <Video size={17} /></button>
        </div>
      </main>
    </div>
  )
}

function VideoInterview({ profile, onLeave }: { profile: InterviewProfile; onLeave: () => void }) {
  const [embedUrl, setEmbedUrl] = useState('')
  const [status, setStatus] = useState<'connecting' | 'ready' | 'error'>('connecting')
  const [message, setMessage] = useState('Создаём защищённую комнату…')
  const [cameraEnabled, setCameraEnabled] = useState(true)
  const localVideo = useRef<HTMLVideoElement>(null)
  const cameraStream = useRef<MediaStream | null>(null)

  useEffect(() => {
    let active = true
    navigator.mediaDevices?.getUserMedia({ video: true, audio: false }).then((stream) => {
      if (!active) return stream.getTracks().forEach((track) => track.stop())
      cameraStream.current = stream
      if (localVideo.current) localVideo.current.srcObject = stream
    }).catch(() => setCameraEnabled(false))

    fetch('/api/liveavatar', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(profile),
    }).then(async (response) => {
      const payload = await response.json().catch(() => ({ error: 'Backend видеозвонка запускается через защищённый сервер.' }))
      if (!response.ok) throw new Error(payload.error || 'Не удалось создать комнату')
      if (!active) return
      setEmbedUrl(payload.url)
      setMessage(payload.sandbox ? 'Песочница: звонок длится около минуты' : 'AI-интервьюер подключён')
      setStatus('ready')
    }).catch((error: Error) => {
      if (!active) return
      setMessage(error.message)
      setStatus('error')
    })

    return () => {
      active = false
      cameraStream.current?.getTracks().forEach((track) => track.stop())
    }
  }, [profile])

  const toggleCamera = () => {
    const next = !cameraEnabled
    cameraStream.current?.getVideoTracks().forEach((track) => { track.enabled = next })
    setCameraEnabled(next)
  }

  return (
    <div className="call-shell">
      <header className="call-header">
        <Brand />
        <div className={`live-status ${status}`}><span /> {status === 'connecting' ? 'ПОДКЛЮЧЕНИЕ' : status === 'ready' ? 'В ЭФИРЕ' : 'НУЖНА НАСТРОЙКА'}</div>
        <div className="call-role">{profile.role} · {profile.level}</div>
      </header>
      <main className="call-stage">
        <section className="avatar-frame" aria-live="polite">
          {status === 'connecting' && <div className="call-loader"><span className="loader-orbit"><i /></span><h1>Интервьюер подключается</h1><p>{message}</p></div>}
          {status === 'error' && <div className="call-loader error-state"><CircleAlert size={34} /><h1>Звонок пока недоступен</h1><p>{message}</p><span>Сервер готов. Для настоящего лица и голоса требуется секретный ключ LiveAvatar.</span></div>}
          {embedUrl && <iframe src={embedUrl} allow="microphone; camera; autoplay; fullscreen" title="LiveAvatar AI-интервьюер" onLoad={() => setStatus('ready')} />}
          <div className="ai-label"><Sparkles size={13} /> Алексей · AI-интервьюер</div>
          <div className={`self-view ${cameraEnabled ? '' : 'camera-off'}`}>
            <video ref={localVideo} autoPlay muted playsInline />
            {!cameraEnabled && <VideoOff size={24} />}
            <span>Вы</span>
          </div>
        </section>
        <aside className="call-notes">
          <span className="mini-label">ЖИВОЕ ИНТЕРВЬЮ</span>
          <h2>Говорите как на реальной встрече</h2>
          <p>Интервьюер слышит паузы, задаёт уточнения и может вернуть разговор к вопросу.</p>
          <div className="privacy-note"><ShieldCheck size={18} /><span><strong>AI обозначен явно</strong>Видео и микрофон используются только внутри комнаты звонка.</span></div>
        </aside>
      </main>
      <footer className="call-controls">
        <button className={cameraEnabled ? '' : 'off'} onClick={toggleCamera} aria-label={cameraEnabled ? 'Выключить камеру' : 'Включить камеру'}>{cameraEnabled ? <Video size={20} /> : <VideoOff size={20} />}</button>
        <div className="call-caption"><span>{message}</span></div>
        <button className="hangup" onClick={onLeave} aria-label="Завершить звонок"><PhoneOff size={21} /> Завершить</button>
      </footer>
    </div>
  )
}

function Interview({ onFinish }: { onFinish: (answers: string[]) => void }) {
  const [index, setIndex] = useState(0)
  const [answer, setAnswer] = useState('')
  const [answers, setAnswers] = useState<string[]>([])
  const [showHint, setShowHint] = useState(false)
  const [error, setError] = useState('')
  const question = questions[index]
  const progress = ((index + 1) / questions.length) * 100

  const next = () => {
    const validationError = validateAnswer(answer)
    if (validationError) {
      setError(validationError)
      return
    }
    const updated = [...answers]
    updated[index] = answer.trim()
    setAnswers(updated)
    if (index === questions.length - 1) onFinish(updated)
    else {
      setIndex(index + 1)
      setAnswer(updated[index + 1] || '')
      setShowHint(false)
      setError('')
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
            <textarea autoFocus value={answer} onChange={(e) => { setAnswer(e.target.value); setError('') }} placeholder="Начните писать ответ здесь..." aria-label="Ваш ответ" aria-invalid={Boolean(error)} aria-describedby={error ? 'answer-error' : undefined} />
            <div className="answer-toolbar"><button className="mic-button" onClick={() => setAnswer(sampleAnswer)}><Mic size={18} /> Заполнить демо-ответ</button><span>{answer.length} знаков</span></div>
          </div>
          {error && <div className="error-box" id="answer-error" role="alert"><CircleAlert size={18} /><p>{error}</p></div>}
          {showHint && <div className="hint-box"><Lightbulb size={17} /><p>{question.hint}</p></div>}
          <div className="interview-actions"><button className="ghost-button" onClick={() => setShowHint(!showHint)}><Lightbulb size={16} /> {showHint ? 'Скрыть подсказку' : 'Нужна подсказка'}</button><button className="primary-button" onClick={next}>{index === questions.length - 1 ? 'Завершить' : 'Следующий вопрос'} <ChevronRight size={17} /></button></div>
        </section>
      </main>
    </div>
  )
}

function Report({ answers, onRestart }: { answers: string[]; onRestart: () => void }) {
  const { overall, metrics } = useMemo(() => analyzeAnswers(answers), [answers])
  const strongResult = overall >= 75

  return (
    <div className="app-shell report-bg">
      <header className="app-header"><Brand /><span className="demo-pill">ОТЧЁТ ГОТОВ</span></header>
      <main className="report-main">
        <section className="report-intro">
          <div><span className="category"><Sparkles size={15} /> ПРЕДВАРИТЕЛЬНЫЙ РАЗБОР</span><h1>{strongResult ? <>Хорошая работа.<br />Осталось усилить детали.</> : <>Есть база.<br />Ответы нужно доработать.</>}</h1><p>{strongResult ? 'Вы ясно описываете свой вклад. Главная зона роста — добавлять больше измеримых результатов.' : 'Ответам не хватает структуры, конкретных действий и результатов. Используйте схему: ситуация → задача → действие → результат.'}</p></div>
          <div className="big-score"><span>ГОТОВНОСТЬ</span><strong>{overall}<small>%</small></strong><p><TrendingUp size={15} /> {strongResult ? 'Хорошая база' : 'Есть зоны роста'}</p></div>
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
  const [completedAnswers, setCompletedAnswers] = useState<string[]>([])
  const [profile, setProfile] = useState<InterviewProfile>({ role: 'Frontend-разработчик', level: 'Middle', resume: '', vacancy: '' })
  if (stage === 'setup') return <Setup onBack={() => setStage('landing')} onStart={(nextProfile) => { setProfile(nextProfile); setStage('video') }} />
  if (stage === 'video') return <VideoInterview profile={profile} onLeave={() => setStage('setup')} />
  if (stage === 'interview') return <Interview onFinish={(answers) => { setCompletedAnswers(answers); setStage('report') }} />
  if (stage === 'report') return <Report answers={completedAnswers} onRestart={() => setStage('setup')} />
  return <Landing onStart={() => setStage('setup')} />
}
