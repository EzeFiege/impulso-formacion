export type Lesson = {
	id: string;
	title: string;
	durationMinutes: number;
	type: 'video' | 'reading' | 'quiz' | 'practice';
	videoUrl: string;
	description: string;
	summaryMarkdown?: string;
	keyTakeaways: string[];
	resources?: { title: string; url: string; size?: string; type: 'pdf' | 'code' | 'link' }[];
};

export type CourseModule = {
	id: string;
	title: string;
	description: string;
	lessons: Lesson[];
};

export type Instructor = {
	name: string;
	title: string;
	avatar: string;
	bio: string;
};

export type CourseCurriculum = {
	courseHandle: string;
	instructor: Instructor;
	level: 'Principiante' | 'Intermedio' | 'Avanzado';
	totalHours: number;
	certificateAvailable: boolean;
	modules: CourseModule[];
};

export const COURSES_CURRICULA: Record<string, CourseCurriculum> = {
	'desarrollo-web-fullstack': {
		courseHandle: 'desarrollo-web-fullstack',
		instructor: {
			name: 'Ing. Lucas Ferrero',
			title: 'Senior Full Stack Tech Lead & Mentor',
			avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',
			bio: 'Más de 10 años creando plataformas escalables con React, Node.js y cloud computing. Instructor de más de 12.000 profesionales en América Latina.',
		},
		level: 'Principiante',
		totalHours: 36,
		certificateAvailable: true,
		modules: [
			{
				id: 'mod-1',
				title: 'Módulo 1: Fundamentos y Entorno Profesional',
				description: 'Configuración del espacio de trabajo moderno, Git, terminal y bases de arquitectura web.',
				lessons: [
					{
						id: 'les-1-1',
						title: '1.1 Bienvenida y hoja de ruta del curso',
						durationMinutes: 12,
						type: 'video',
						videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
						description: 'Presentación del programa, objetivos de aprendizaje, metodología de proyectos y cómo aprovechar al máximo los recursos.',
						keyTakeaways: [
							'Entender el rol del desarrollador Full Stack hoy.',
							'Metodología práctica: aprender construyendo proyectos.',
							'Acceso a la comunidad y soporte de instructores.',
						],
						resources: [
							{ title: 'Guía de inicio y Syllabus completo (PDF)', url: '#', size: '2.4 MB', type: 'pdf' },
							{ title: 'Repositorio inicial del proyecto en GitHub', url: '#', type: 'code' },
						],
					},
					{
						id: 'les-1-2',
						title: '1.2 Configuración del entorno de desarrollo (VS Code, Node y Git)',
						durationMinutes: 24,
						type: 'video',
						videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
						description: 'Instalación paso a paso de Node.js LTS, extensiones clave de VS Code, terminal interactiva y control de versiones con Git.',
						keyTakeaways: [
							'Instalación limpia de Node.js y gestión de versiones.',
							'Configuración de Git con SSH y llaves seguras.',
							'Extensiones recomendadas para máxima productividad.',
						],
						resources: [
							{ title: 'Cheatsheet de comandos de Git esenciales', url: '#', size: '450 KB', type: 'pdf' },
							{ title: 'Configuración recomendada de VS Code (settings.json)', url: '#', type: 'code' },
						],
					},
					{
						id: 'les-1-3',
						title: '1.3 HTML Semántico y CSS3 Moderno para maquetación profesional',
						durationMinutes: 35,
						type: 'video',
						videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
						description: 'Estructuración accesible con etiquetas semánticas, Flexbox, Grid CSS y variables de diseño.',
						keyTakeaways: [
							'Por qué la semántica importa para SEO y accesibilidad (a11y).',
							'Dominio de Flexbox vs Grid en layouts responsivos.',
							'Variables CSS y tokens de diseño modernos.',
						],
						resources: [
							{ title: 'Guía visual de Flexbox y CSS Grid', url: '#', size: '1.8 MB', type: 'pdf' },
						],
					},
				],
			},
			{
				id: 'mod-2',
				title: 'Módulo 2: JavaScript Moderno (ES6+) y Fundamentos de React',
				description: 'Domina los conceptos clave de JavaScript que sostienen a React: desestructuración, promesas, async/await y componentes.',
				lessons: [
					{
						id: 'les-2-1',
						title: '2.1 JavaScript ES6+: Desestructuración, Spread, Arrow Functions y Métodos de Array',
						durationMinutes: 28,
						type: 'video',
						videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
						description: 'Repaso acelerado de las características indispensables del lenguaje para programar en React con soltura.',
						keyTakeaways: [
							'Uso de map, filter, reduce y find en estructuras complejas.',
							'Inmutabilidad de datos y patrones declarativos.',
							'Manejo de asincronía con promesas y async/await.',
						],
						resources: [
							{ title: 'Ejercicios prácticos con soluciones en JS', url: '#', type: 'code' },
						],
					},
					{
						id: 'les-2-2',
						title: '2.2 Introducción a React 19 y arquitectura por componentes',
						durationMinutes: 32,
						type: 'video',
						videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
						description: 'Cómo piensa React: JSX, componentes funcionales, props y renderizado condicional.',
						keyTakeaways: [
							'El modelo mental de componentes reutilizables.',
							'Paso de propiedades (props) y Children.',
							'Renderizado de listas con claves únicas.',
						],
					},
					{
						id: 'les-2-3',
						title: '2.3 Manejo de Estado (useState) y Efectos Secundarios (useEffect)',
						durationMinutes: 40,
						type: 'video',
						videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyBlazes.mp4',
						description: 'Ciclo de vida del componente, sincronización de estado, dependencias y llamadas a APIs REST.',
						keyTakeaways: [
							'Buenas prácticas para evitar re-renderizados innecesarios.',
							'Limpieza de efectos y temporizadores.',
							'Consumo de datos con fetch y manejo de errores.',
						],
						resources: [
							{ title: 'Proyecto de práctica: Buscador de películas con API', url: '#', type: 'code' },
						],
					},
				],
			},
			{
				id: 'mod-3',
				title: 'Módulo 3: Backend con Node.js, Express y Bases de Datos',
				description: 'Creación de APIs REST seguras, validación de esquemas, middleware y persistencia.',
				lessons: [
					{
						id: 'les-3-1',
						title: '3.1 Servidores HTTP con Express y arquitectura RESTful',
						durationMinutes: 30,
						type: 'video',
						videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4',
						description: 'Rutas, controladores, middlewares y manejo centralizado de errores.',
						keyTakeaways: [
							'Estructura de carpetas limpia y mantenible.',
							'Códigos de estado HTTP y respuestas consistentes.',
							'Validación con bibliotecas modernas como Zod.',
						],
					},
					{
						id: 'les-3-2',
						title: '3.2 Autenticación con JWT y protección de rutas',
						durationMinutes: 45,
						type: 'video',
						videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
						description: 'Flujo completo de registro, hash de contraseñas con bcrypt, emisión y verificación de JSON Web Tokens.',
						keyTakeaways: [
							'Almacenamiento seguro de credenciales.',
							'Middleware de autorización en Express.',
							'Cookies HTTPOnly vs Bearer tokens en headers.',
						],
						resources: [
							{ title: 'Diagrama de flujo de autenticación JWT', url: '#', size: '890 KB', type: 'pdf' },
						],
					},
					{
						id: 'les-3-3',
						title: '3.3 Proyecto Final: Despliegue en la nube y CI/CD',
						durationMinutes: 50,
						type: 'video',
						videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackSeeTheWorld.mp4',
						description: 'Conectando el frontend y backend, variables de entorno seguras y deploy a producción.',
						keyTakeaways: [
							'Configuración de CORS para producción.',
							'Despliegue automatizado con GitHub Actions.',
							'Monitoreo básico y métricas de rendimiento.',
						],
					},
				],
			},
		],
	},
	'python-analisis-datos-ia': {
		courseHandle: 'python-analisis-datos-ia',
		instructor: {
			name: 'Dra. Mariana Gómez',
			title: 'Científica de Datos & Investigadora en IA',
			avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=250&q=80',
			bio: 'Doctora en Computación con especialización en procesamiento de datos a gran escala y redes neuronales. Consultora para fintechs internacionales.',
		},
		level: 'Principiante',
		totalHours: 32,
		certificateAvailable: true,
		modules: [
			{
				id: 'py-mod-1',
				title: 'Módulo 1: Fundamentos de Python para Ciencia de Datos',
				description: 'Estructuras de datos nativas, programación funcional y librerías numéricas base.',
				lessons: [
					{
						id: 'py-les-1-1',
						title: '1.1 Introducción al ecosistema de datos y Google Colab',
						durationMinutes: 18,
						type: 'video',
						videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
						description: 'Configuración de notebooks en la nube, celdas de código y texto enriquecido con Markdown.',
						keyTakeaways: [
							'Uso productivo de Jupyter Notebooks y Google Colab.',
							'Buenas prácticas PEP 8 en Python.',
							'Librerías principales del ecosistema científico.',
						],
					},
					{
						id: 'py-les-1-2',
						title: '1.2 Vectores y Matrices de alto rendimiento con NumPy',
						durationMinutes: 34,
						type: 'video',
						videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4',
						description: 'Operaciones vectorizadas, broadcasting, indexado booleano y optimización de memoria.',
						keyTakeaways: [
							'Por qué NumPy supera en velocidad a las listas tradicionales.',
							'Creación y remodelado de ndarrays.',
							'Álgebra lineal básica aplicada a datos.',
						],
					},
				],
			},
			{
				id: 'py-mod-2',
				title: 'Módulo 2: Limpieza y Manipulación de Datos con Pandas',
				description: 'DataFrames, tratamiento de valores nulos, agregaciones y cruce de datasets.',
				lessons: [
					{
						id: 'py-les-2-1',
						title: '2.1 Carga de datos, filtrado e indexación avanzada',
						durationMinutes: 40,
						type: 'video',
						videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WhatCarCanYouGetForAGrand.mp4',
						description: 'Importar archivos CSV, Excel y JSON; explorar estadísticas descriptivas rápidamente.',
						keyTakeaways: [
							'Funciones head, info y describe para auditoría inicial.',
							'Filtrado por múltiples condiciones lógicas.',
							'Manejo de columnas categóricas y tipos de datos.',
						],
					},
				],
			},
		],
	},
	'diseno-ux-ui-figma': {
		courseHandle: 'diseno-ux-ui-figma',
		instructor: {
			name: 'Tomás Valenzuela',
			title: 'Product Designer Lead en Scaleups',
			avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=250&q=80',
			bio: 'Especialista en sistemas de diseño y usabilidad con más de 8 años diseñando aplicaciones móviles y web galardonadas.',
		},
		level: 'Principiante',
		totalHours: 28,
		certificateAvailable: true,
		modules: [
			{
				id: 'ux-mod-1',
				title: 'Módulo 1: Fundamentos de UX y Research Centrado en el Usuario',
				description: 'Entrevistas, arquetipos de usuario, mapas de empatía y arquitectura de la información.',
				lessons: [
					{
						id: 'ux-les-1-1',
						title: '1.1 Qué es UX y cómo plantear un proyecto de diseño',
						durationMinutes: 20,
						type: 'video',
						videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
						description: 'Diferencia entre UX y UI, etapas del Design Thinking y cómo justificar decisiones de diseño.',
						keyTakeaways: [
							'Las 5 etapas del Design Thinking.',
							'Cómo recolectar requerimientos reales de usuarios.',
							'Definición de problemas con declaraciones "How Might We".',
						],
					},
					{
						id: 'ux-les-1-2',
						title: '1.2 Wireframes y flujos de usuario (User Journeys)',
						durationMinutes: 30,
						type: 'video',
						videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
						description: 'Creación de bocetos de baja fidelidad y prototipado rápido de navegación.',
						keyTakeaways: [
							'Beneficios del prototipado rápido en papel y digital.',
							'Identificación de cuellos de botella en la experiencia.',
						],
					},
				],
			},
			{
				id: 'ux-mod-2',
				title: 'Módulo 2: Dominio de Figma & Design Systems',
				description: 'Auto-layout, componentes interactivos, tokens y entrega a desarrollo.',
				lessons: [
					{
						id: 'ux-les-2-1',
						title: '2.1 Auto Layout y componentes reutilizables',
						durationMinutes: 42,
						type: 'video',
						videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
						description: 'Estructuración de interfaces fluidas que se adaptan a cualquier resolución de pantalla.',
						keyTakeaways: [
							'Reglas clave de espaciado y alineación.',
							'Creación de variantes y propiedades de componentes.',
						],
					},
				],
			},
		],
	},
	'marketing-digital-estrategia': {
		courseHandle: 'marketing-digital-estrategia',
		instructor: {
			name: 'Camila Morales',
			title: 'Growth Marketing Director',
			avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=250&q=80',
			bio: 'Especialista en adquisición, SEO y retención para negocios digitales. Ha gestionado más de 2M USD en campañas publicitarias de performance.',
		},
		level: 'Principiante',
		totalHours: 24,
		certificateAvailable: true,
		modules: [
			{
				id: 'mkt-mod-1',
				title: 'Módulo 1: Estrategia de Marca y Embudos de Conversión',
				description: 'Definición de propuesta de valor, buyer persona y diseño de funnels.',
				lessons: [
					{
						id: 'mkt-les-1-1',
						title: '1.1 Estructura del embudo de ventas digital (TOFU, MOFU, BOFU)',
						durationMinutes: 22,
						type: 'video',
						videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
						description: 'Atracción, consideración y conversión para productos y servicios.',
						keyTakeaways: [
							'Medición de métricas de adquisición (CAC, LTV, ROAS).',
							'Creación de ofertas irresistibles.',
						],
					},
					{
						id: 'mkt-les-1-2',
						title: '1.2 Campañas publicitarias en Meta Ads y Google Ads',
						durationMinutes: 38,
						type: 'video',
						videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
						description: 'Segmentación, creatividades de alto impacto y optimización de presupuesto.',
						keyTakeaways: [
							'Estructura de campañas y conjuntos de anuncios.',
							'Estrategias de retargeting efectivas.',
						],
					},
				],
			},
		],
	},
};

export function getCourseCurriculum(handle: string): CourseCurriculum {
	if (COURSES_CURRICULA[handle]) {
		return COURSES_CURRICULA[handle];
	}
	// Fallback genérico si no coincide exactamente
	return COURSES_CURRICULA['desarrollo-web-fullstack'];
}

export function getAllLessons(curriculum: CourseCurriculum): Lesson[] {
	return curriculum.modules.flatMap((m) => m.lessons);
}
