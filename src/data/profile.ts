export const profile = {
  name: 'Sri Likhin',
  fullName: 'Manne Sri Likhin',
  location: 'Hyderabad, India',
  timezone: 'Asia/Kolkata',
  email: 'srilikhin@gmail.com',
  site: 'https://srilikhin.vercel.app',
  links: {
    linkedin: 'https://www.linkedin.com/in/sri-likhin-prasad',
    github: 'https://github.com/likhinnandu',
    krudex: 'https://krudex.in',
  },
  roles: [
    { title: 'Co-founder', org: 'Krudex', since: '2025', href: 'https://krudex.in' },
    { title: 'Associate Solutions Engineer', org: 'Trundl, Inc.', since: '2026' },
  ],
}

export type Node = { label: string; sub?: string; x: number; y: number; live?: boolean }
export type Edge = [number, number]

export type CaseStudy = {
  id: string
  index: string
  tag: string
  title: string
  summary: string
  meta: [string, string][]
  nodes: Node[]
  edges: Edge[]
  href?: string
}

export const cases: CaseStudy[] = [
  {
    id: 'krudex',
    index: '01',
    tag: 'Agency',
    title: 'Krudex',
    summary:
      'The web engineering studio I co-founded in 2025. We take client briefs and ship the websites and the web services behind them, from first conversation to launch.',
    meta: [
      ['Context', 'Co-founder'],
      ['Period', '2025 → now'],
      ['Scope', 'Websites, web services'],
      ['Clients', 'Studio work'],
    ],
    nodes: [
      { label: 'Client brief', x: 30, y: 110 },
      { label: 'Krudex', sub: 'studio', x: 230, y: 110, live: true },
      { label: 'Website', sub: 'front end', x: 430, y: 40 },
      { label: 'Web services', sub: 'back end', x: 430, y: 180 },
    ],
    edges: [
      [0, 1],
      [1, 2],
      [1, 3],
    ],
    href: 'https://krudex.in',
  },
  {
    id: 'b2b',
    index: '02',
    tag: 'Platform',
    title: 'B2B order creation and automation',
    summary:
      'An internal platform for a Spanish e-commerce sales team. AI-driven features run in Python and FastAPI, deterministic business rules in NestJS, all over PostgreSQL.',
    meta: [
      ['Context', 'Soludity, internship'],
      ['Period', '2026'],
      ['Stack', 'Next.js, NestJS, FastAPI'],
      ['Data', 'PostgreSQL'],
    ],
    nodes: [
      { label: 'Sales team UI', sub: 'Next.js + React', x: 20, y: 110, live: true },
      { label: 'AI features', sub: 'Python + FastAPI', x: 235, y: 40 },
      { label: 'Rules engine', sub: 'Node.js + NestJS', x: 235, y: 180 },
      { label: 'PostgreSQL', sub: 'orders', x: 450, y: 110 },
    ],
    edges: [
      [0, 1],
      [0, 2],
      [2, 3],
      [1, 3],
    ],
  },
  {
    id: 'ngo',
    index: '03',
    tag: 'Mobile',
    title: 'Skills training app for an NGO',
    summary:
      'A mobile app that gives underprivileged learners accessible training in skills like information technology and tailoring.',
    meta: [
      ['Context', 'Soludity, internship'],
      ['Period', '2026'],
      ['Platform', 'Mobile app'],
      ['Users', 'NGO learners'],
    ],
    nodes: [
      { label: 'Learners', x: 30, y: 110 },
      { label: 'Mobile app', sub: 'courses', x: 230, y: 110, live: true },
      { label: 'IT course', x: 430, y: 40 },
      { label: 'Tailoring course', x: 430, y: 180 },
    ],
    edges: [
      [0, 1],
      [1, 2],
      [1, 3],
    ],
  },
  {
    id: 'fake',
    index: '04',
    tag: 'Applied AI',
    title: 'Unmasking the Fake',
    summary:
      'Explainable deepfake detection. It checks both the faces and the audio in a piece of media, then reports its verdict on a compliance dashboard people can review.',
    meta: [
      ['Context', 'Personal project'],
      ['Models', 'MTCNN, InceptionResNetV1'],
      ['Stack', 'Python, LangChain'],
      ['LLM', 'Gemini API'],
    ],
    nodes: [
      { label: 'Media', sub: 'video + audio', x: 20, y: 110 },
      { label: 'Visual analysis', sub: 'faces', x: 200, y: 40 },
      { label: 'Audio analysis', sub: 'voice', x: 200, y: 180 },
      { label: 'Verdict', sub: 'explained', x: 380, y: 110, live: true },
      { label: 'Dashboard', sub: 'compliance', x: 440, y: 200 },
    ],
    edges: [
      [0, 1],
      [0, 2],
      [1, 3],
      [2, 3],
      [3, 4],
    ],
    href: 'https://github.com/likhinnandu/Unmasking-the-fake',
  },
  {
    id: 'rag',
    index: '05',
    tag: 'Applied AI',
    title: 'Document search with RAG',
    summary:
      'Ask a pile of documents a question in plain language. It retrieves the relevant passages with semantic search and answers from them, keeping context across the conversation.',
    meta: [
      ['Context', 'Personal project'],
      ['Retrieval', 'FAISS vectors'],
      ['Stack', 'Python, LangChain'],
      ['LLM', 'Gemini API'],
    ],
    nodes: [
      { label: 'Documents', x: 20, y: 40 },
      { label: 'Embeddings', x: 200, y: 40 },
      { label: 'FAISS index', x: 380, y: 40 },
      { label: 'Question', x: 20, y: 180 },
      { label: 'Grounded answer', sub: 'Gemini', x: 380, y: 180, live: true },
    ],
    edges: [
      [0, 1],
      [1, 2],
      [3, 4],
      [2, 4],
    ],
    href: 'https://github.com/likhinnandu/DOCUMENT-RETRIEVAL-SYSTEM-USING-RAG',
  },
  {
    id: 'fn7',
    index: '06',
    tag: 'Applied AI',
    title: 'AI response quality at Fn7',
    summary:
      'Prompt optimisation and testing so model outputs matched user and client requirements, OpenAI API integrations in JavaScript, and validation of AI responses behind real-time outreach features.',
    meta: [
      ['Context', 'Fn7, internship'],
      ['Period', '2025'],
      ['Stack', 'JavaScript'],
      ['API', 'OpenAI'],
    ],
    nodes: [
      { label: 'Prompt', sub: 'tuned + tested', x: 20, y: 110 },
      { label: 'OpenAI API', x: 220, y: 110 },
      { label: 'Validation', sub: 'checks', x: 420, y: 40, live: true },
      { label: 'Outreach feature', sub: 'real-time', x: 420, y: 180 },
    ],
    edges: [
      [0, 1],
      [1, 2],
      [2, 3],
    ],
  },
  {
    id: 'mifisica',
    index: '07',
    tag: 'Mobile',
    title: 'Mifisica',
    summary:
      'A community fitness app that records steps, calories and heart rate, and turns them into virtual challenges people share with each other.',
    meta: [
      ['Context', 'Personal project'],
      ['Build', 'FlutterFlow'],
      ['Backend', 'Firebase'],
      ['Cloud', 'Google Cloud'],
    ],
    nodes: [
      { label: 'Activity', sub: 'steps, heart rate', x: 20, y: 110 },
      { label: 'Firebase', x: 220, y: 110, live: true },
      { label: 'Challenges', x: 420, y: 40 },
      { label: 'Shared updates', x: 420, y: 180 },
    ],
    edges: [
      [0, 1],
      [1, 2],
      [1, 3],
    ],
    href: 'https://github.com/likhinnandu/MLRIT-mini-project',
  },
]

export const capabilities = [
  {
    index: '01',
    title: 'Web platforms',
    text: 'Front ends in React and Next.js, services in Node, NestJS and FastAPI, data in PostgreSQL. Built as one system, not three.',
    tools: ['React', 'Next.js', 'TypeScript', 'Tailwind', 'NestJS', 'FastAPI', 'PostgreSQL'],
  },
  {
    index: '02',
    title: 'Applied AI',
    text: 'LLM features that earn their place: retrieval over your documents, prompt testing and validation, multimodal detection with explainable output.',
    tools: ['LangChain', 'FAISS', 'OpenAI API', 'Gemini API', 'Python', 'RAG'],
  },
  {
    index: '03',
    title: 'Solutions engineering',
    text: 'The step between a requirement and a working system. Architecture on one page, integrations that hold, and a clear story for the people who use it.',
    tools: ['Architecture', 'Integrations', 'Firebase', 'Google Cloud', 'MongoDB'],
  },
]

export const approach = [
  {
    index: '01',
    title: 'Understand',
    text: 'Get the brief straight: who it is for, what it must do, and what it must never do.',
  },
  {
    index: '02',
    title: 'Shape',
    text: 'Map the system on one page: data, services, screens. You see the diagram before the code.',
  },
  {
    index: '03',
    title: 'Build',
    text: 'Ship in slices. Front end, back end and AI features land together so nothing waits on anything.',
  },
  {
    index: '04',
    title: 'Launch',
    text: 'Deploy, measure, fix. Then the next slice.',
  },
]

export const experience = [
  {
    from: '2026-08',
    to: 'now',
    role: 'Associate Solutions Engineer',
    org: 'Trundl, Inc.',
    place: 'Hyderabad, on-site',
    current: true,
  },
  {
    from: '2026-05',
    to: '2026-07',
    role: 'Software Intern',
    org: 'Soludity',
    place: 'Remote',
  },
  {
    from: '2025-09',
    to: 'now',
    role: 'Co-founder',
    org: 'Krudex Technologies',
    place: 'Remote',
    current: true,
  },
  {
    from: '2025-04',
    to: '2025-06',
    role: 'Software Intern',
    org: 'Fn7',
    place: 'Hyderabad',
  },
  {
    from: '2022-11',
    to: '2026-07',
    role: 'B.Tech, CSE (AI and ML)',
    org: 'MLR Institute of Technology',
    place: 'Hyderabad',
  },
]

export const skills = [
  { group: 'Languages', items: ['Python', 'TypeScript', 'JavaScript', 'Java', 'C', 'C#'] },
  { group: 'Front end', items: ['React', 'Next.js', 'Angular', 'Tailwind CSS', 'HTML, CSS'] },
  { group: 'Back end', items: ['Node.js', 'NestJS', 'FastAPI', 'PostgreSQL', 'MongoDB'] },
  { group: 'AI', items: ['LangChain', 'FAISS', 'OpenAI API', 'Gemini API', 'MTCNN, InceptionResNet'] },
  { group: 'Cloud and tools', items: ['Google Cloud', 'Firebase', 'FlutterFlow', 'Vercel', 'Git'] },
]

export const certifications = [
  { title: 'Google Cloud Computing Foundations (Elite)', org: 'NPTEL', date: '2024-10' },
  { title: 'Fire Flow', org: 'GDGC', date: '2025-01' },
  { title: 'UI/UX Bootcamp', org: 'MLRIT', date: '2024-01' },
]
