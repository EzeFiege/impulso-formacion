export type QuizQuestion = {
	id: string;
	question: string;
	options: string[];
	correctOptionIndex: number;
	explanation: string;
};

export type CourseQuiz = {
	id: string;
	moduleId: string;
	courseHandle: string;
	title: string;
	description: string;
	passingScore: number; // Porcentaje mínimo, ej: 75
	timeLimitMinutes?: number; // Tiempo límite en minutos (opcional para exámenes cronometrados)
	isFinalExam?: boolean;
	questions: QuizQuestion[];
};

export type QuizAttemptResult = {
	quizId: string;
	courseHandle: string;
	scorePercent: number;
	passed: boolean;
	totalQuestions: number;
	correctAnswersCount: number;
	selectedAnswers: Record<string, number>;
	completedAt: string;
};

const QUIZ_STORAGE_PREFIX = 'impulso_quiz_result_';

export const COURSES_QUIZZES: Record<string, CourseQuiz[]> = {
	'desarrollo-web-fullstack': [
		{
			id: 'quiz-mod-1',
			moduleId: 'mod-1',
			courseHandle: 'desarrollo-web-fullstack',
			title: 'Evaluación Módulo 1: Fundamentos y Entorno Web',
			description: 'Valida tus conocimientos sobre HTML5 semántico, CSS3 moderno y control de versiones con Git.',
			passingScore: 75,
			questions: [
				{
					id: 'q1-1',
					question: '¿Por qué es fundamental utilizar etiquetas semánticas como <main>, <article> y <nav> en lugar de solo <div>?',
					options: [
						'Porque el navegador las procesa más rápido en tiempo de ejecución.',
						'Mejora la accesibilidad (a11y) para lectores de pantalla y optimiza el posicionamiento SEO.',
						'Es un requerimiento estricto de CSS Grid para funcionar.',
						'Permite compilar el código JavaScript sin errores.',
					],
					correctOptionIndex: 1,
					explanation:
						'El HTML semántico provee significado estructural a los motores de búsqueda (SEO) y a tecnologías de asistencia (accesibilidad), permitiendo una navegación accesible para todos los usuarios.',
				},
				{
					id: 'q1-2',
					question: 'En Git, ¿cuál es la diferencia principal entre los comandos "git fetch" y "git pull"?',
					options: [
						'"git fetch" descarga los cambios del repositorio remoto sin fusionarlos con tu rama local, mientras que "git pull" hace el fetch y luego el merge.',
						'"git fetch" borra las ramas remotas y "git pull" las restaura.',
						'No hay diferencia, son alias exactamente idénticos.',
						'"git pull" solo se usa para repositorios de producción.',
					],
					correctOptionIndex: 0,
					explanation:
						'"git fetch" consulta y descarga los commits del servidor remoto para que puedas inspeccionarlos de forma segura. "git pull" hace un fetch y automáticamente fusiona (merge) esos cambios en tu rama actual.',
				},
				{
					id: 'q1-3',
					question: '¿Qué propiedad de CSS Flexbox se utiliza para alinear los elementos sobre el eje transversal (cross axis)?',
					options: [
						'justify-content',
						'align-items',
						'flex-direction',
						'grid-template-columns',
					],
					correctOptionIndex: 1,
					explanation:
						'"justify-content" controla la distribución en el eje principal (main axis), mientras que "align-items" alinea los elementos en el eje transversal (cross axis).',
				},
				{
					id: 'q1-4',
					question: '¿Qué ventaja ofrecen las CSS Custom Properties (Variables CSS, ej: --primary-color)?',
					options: [
						'Son estáticas y no pueden cambiar una vez cargada la página.',
						'Se definen solo en archivos .json externos.',
						'Tienen alcance en cascada (DOM scope) y pueden actualizarse dinámicamente con JavaScript o media queries.',
						'Aumentan el peso del archivo HTML.',
					],
					correctOptionIndex: 2,
					explanation:
						'Las variables CSS nativas respetan la cascada y la herencia del DOM, permitiendo crear temas oscuros/claros o sistemas de diseño dinámicos que se adaptan en tiempo real.',
				},
			],
		},
		{
			id: 'quiz-mod-2',
			moduleId: 'mod-2',
			courseHandle: 'desarrollo-web-fullstack',
			title: 'Evaluación Módulo 2: JavaScript Moderno y React 19',
			description: 'Demuestra tu comprensión de la inmutabilidad, hooks fundamentales y el ciclo de vida de los componentes.',
			passingScore: 75,
			questions: [
				{
					id: 'q2-1',
					question: '¿Por qué nunca se debe mutar el estado directamente en React (ej: state.push(nuevoItem))?',
					options: [
						'Porque JavaScript arroja un error de sintaxis TypeError.',
						'Porque React compara las referencias anteriores y nuevas para detectar cambios; si mutas la misma referencia, no dispara el re-renderizado.',
						'Porque los arrays en JavaScript son de solo lectura.',
						'Porque el compilador de TypeScript no lo permite.',
					],
					correctOptionIndex: 1,
					explanation:
						'React utiliza comparación por referencia superficial (shallow compare) para determinar cuándo actualizar la UI. La inmutabilidad garantiza que al generar una nueva referencia, React sepa exactamente cuándo volver a renderizar.',
				},
				{
					id: 'q2-2',
					question: '¿Cuál es el propósito del array de dependencias en el hook useEffect(fn, [deps])?',
					options: [
						'Indica a React que ejecute el efecto únicamente cuando alguno de los valores listados en el array cambie de valor.',
						'Define los estilos visuales que afectará el componente.',
						'Sirve para importar librerías externas de npm.',
						'Convierte la función en un worker asíncrono en segundo plano.',
					],
					correctOptionIndex: 0,
					explanation:
						'El array de dependencias le indica a React cuándo sincronizar el efecto. Si está vacío ([]), se ejecuta solo al montar. Si incluye variables, se vuelve a ejecutar cada vez que alguna de ellas cambie.',
				},
				{
					id: 'q2-3',
					question: '¿Qué método de array en JavaScript retorna un nuevo array transformando cada elemento según una función provista?',
					options: ['forEach', 'reduce', 'map', 'filter'],
					correctOptionIndex: 2,
					explanation:
						'Array.prototype.map crea un nuevo array con los resultados de la llamada a la función indicada aplicados a cada uno de sus elementos, siendo el método predilecto para renderizar listas en React.',
				},
				{
					id: 'q2-4',
					question: '¿Qué beneficio aporta desestructurar props en la firma de un componente de React (ej: function Card({ title, price }))?',
					options: [
						'Hace que el componente sea más limpio, explícito y permite declarar valores por defecto fácilmente.',
						'Hace que la aplicación corra un 50% más rápido en producción.',
						'Elimina la necesidad de utilizar TypeScript.',
						'Permite conectarse a una base de datos sin backend.',
					],
					correctOptionIndex: 0,
					explanation:
						'La desestructuración de parámetros mejora la legibilidad, permite documentar visualmente qué espera el componente y facilita la asignación de valores por defecto.',
				},
			],
		},
		{
			id: 'quiz-mod-3',
			moduleId: 'mod-3',
			courseHandle: 'desarrollo-web-fullstack',
			title: 'Evaluación Módulo 3: Backend, APIs REST y Seguridad',
			description: 'Demuestra tu dominio de arquitectura de APIs, autenticación con JWT y buenas prácticas.',
			passingScore: 75,
			questions: [
				{
					id: 'q3-1',
					question: '¿Cuál es la función principal de un Middleware en un servidor Express.js?',
					options: [
						'Reemplazar la base de datos SQL.',
						'Interceptar y procesar la petición (req) y respuesta (res) antes de que llegue al controlador final o pasar al siguiente middleware con next().',
						'Compilar los archivos TypeScript al cliente.',
						'Reducir el tamaño de las imágenes del servidor.',
					],
					correctOptionIndex: 1,
					explanation:
						'Los middlewares son funciones con acceso al objeto de solicitud (req), al de respuesta (res) y a next(), ideales para autenticación, logging, validación y manejo de errores.',
				},
				{
					id: 'q3-2',
					question: 'En una API RESTful, ¿qué código de estado HTTP representa que un recurso fue creado exitosamente?',
					options: ['200 OK', '201 Created', '204 No Content', '301 Moved Permanently'],
					correctOptionIndex: 1,
					explanation:
						'El código HTTP 201 Created indica que la solicitud fue completada exitosamente y ha resultado en la creación de un nuevo recurso.',
				},
				{
					id: 'q3-3',
					question: '¿Qué información NUNCA debe guardarse en el payload de un JSON Web Token (JWT)?',
					options: [
						'El ID del usuario (sub).',
						'El rol o permisos del usuario.',
						'Contraseñas en texto plano o claves privadas confidenciales.',
						'La fecha de expiración del token (exp).',
					],
					correctOptionIndex: 2,
					explanation:
						'El payload de un JWT solo está codificado en Base64Url y no está cifrado. Cualquiera puede leer su contenido decodificándolo, por lo que nunca debe contener contraseñas o datos altamente sensibles.',
				},
			],
		},
	],
	'python-analisis-datos-ia': [
		{
			id: 'quiz-py-1',
			moduleId: 'py-mod-1',
			courseHandle: 'python-analisis-datos-ia',
			title: 'Evaluación: Fundamentos de Python & NumPy',
			description: 'Pone a prueba tus habilidades en manipulación matricial y operaciones vectorizadas.',
			passingScore: 75,
			questions: [
				{
					id: 'q-py-1',
					question: '¿Qué significa que una operación en NumPy sea "vectorizada"?',
					options: [
						'Que se ejecuta en bucles for tradicionales de Python.',
						'Que aplica operaciones elemento a elemento en código C optimizado sin necesidad de bucles explícitos en Python.',
						'Que solo funciona con gráficos en dos dimensiones.',
						'Que requiere conexión obligatoria a internet.',
					],
					correctOptionIndex: 1,
					explanation:
						'La vectorización delega las operaciones a librerías de bajo nivel en C/Fortran, logrando ejecuciones de órdenes de magnitud más veloces que los bucles de Python.',
				},
				{
					id: 'q-py-2',
					question: 'En Pandas, ¿qué estructura representa una tabla bidimensional con filas y columnas etiquetadas?',
					options: ['Series', 'DataFrame', 'ndarray', 'Dictionary'],
					correctOptionIndex: 1,
					explanation:
						'Un DataFrame es la estructura fundamental de dos dimensiones en Pandas, compuesta por múltiples Series como columnas.',
				},
			],
		},
	],
	'diseno-ux-ui-figma': [
		{
			id: 'quiz-ux-1',
			moduleId: 'ux-mod-1',
			courseHandle: 'diseno-ux-ui-figma',
			title: 'Evaluación: Principios de UX y Prototipado',
			description: 'Valida tu comprensión de arquitectura de información y diseño centrado en el usuario.',
			passingScore: 75,
			questions: [
				{
					id: 'q-ux-1',
					question: '¿Qué busca resolver la fase de "Empatía" en el proceso de Design Thinking?',
					options: [
						'Elegir la paleta de colores final de la app.',
						'Comprender las necesidades, frustraciones, contexto y comportamientos reales de los usuarios.',
						'Programar la base de datos de usuarios.',
						'Calcular el costo financiero del proyecto.',
					],
					correctOptionIndex: 1,
					explanation:
						'La empatía permite despojarse de suposiciones propias para escuchar e investigar a las personas reales que utilizarán el producto.',
				},
				{
					id: 'q-ux-2',
					question: 'En Figma, ¿cuál es la ventaja clave de utilizar Auto Layout?',
					options: [
						'Crea interfaces responsivas cuyos botones y tarjetas se adaptan automáticamente al contenido y tamaño de pantalla.',
						'Exporta código PHP listo para producción.',
						'Genera logotipos vectoriales de forma automática.',
						'Reemplaza la necesidad de hacer pruebas de usabilidad.',
					],
					correctOptionIndex: 0,
					explanation:
						'Auto Layout emula las propiedades de Flexbox del desarrollo web, permitiendo que los componentes crezcan o se adapten de forma elástica a diferentes textos y resoluciones.',
				},
			],
		},
	],
	'marketing-digital-estrategia': [
		{
			id: 'quiz-mkt-1',
			moduleId: 'mkt-mod-1',
			courseHandle: 'marketing-digital-estrategia',
			title: 'Evaluación: Embudos de Conversión y Adquisición',
			description: 'Demuestra tu comprensión de métricas de rendimiento y embudos digitales.',
			passingScore: 75,
			questions: [
				{
					id: 'q-mkt-1',
					question: '¿Qué representa la etapa "TOFU" (Top of the Funnel) en un embudo de ventas?',
					options: [
						'El momento en que el cliente introduce su tarjeta de crédito.',
						'La etapa de descubrimiento y atracción donde el usuario conoce la marca por primera vez.',
						'La fase de fidelización y post-venta.',
						'La baja de suscripción del usuario.',
					],
					correctOptionIndex: 1,
					explanation:
						'TOFU se enfoca en generar conciencia (awareness) y atraer tráfico cualificado a través de contenidos educativos y publicidad de alcance.',
				},
				{
					id: 'q-mkt-2',
					question: '¿Qué mide la métrica ROAS (Return On Ad Spend)?',
					options: [
						'El costo de envío de un producto físico.',
						'El retorno de ingresos brutos generado por cada dólar o peso invertido en publicidad paga.',
						'La cantidad de seguidores que tiene una cuenta en redes sociales.',
						'La velocidad de carga del sitio web.',
					],
					correctOptionIndex: 1,
					explanation:
						'ROAS = Ingresos generados / Gasto publicitario. Es una métrica crucial para evaluar la rentabilidad directa de las campañas pagas en Google y Meta.',
				},
			],
		},
	],
};

export function getQuizzesForCourse(courseHandle: string): CourseQuiz[] {
	return COURSES_QUIZZES[courseHandle] || COURSES_QUIZZES['desarrollo-web-fullstack'];
}

export function getStoredQuizResult(courseHandle: string, quizId: string): QuizAttemptResult | null {
	if (typeof window === 'undefined') return null;
	try {
		const raw = localStorage.getItem(`${QUIZ_STORAGE_PREFIX}${courseHandle}_${quizId}`);
		if (!raw) return null;
		return JSON.parse(raw);
	} catch {
		return null;
	}
}

export function saveQuizResult(result: QuizAttemptResult): void {
	if (typeof window === 'undefined') return;
	try {
		localStorage.setItem(
			`${QUIZ_STORAGE_PREFIX}${result.courseHandle}_${result.quizId}`,
			JSON.stringify(result),
		);
		window.dispatchEvent(new Event('impulso_quiz_completed'));
	} catch (e) {
		console.error('Error guardando resultado del quiz:', e);
	}
}

export function areAllCourseQuizzesPassed(courseHandle: string): boolean {
	const quizzes = getQuizzesForCourse(courseHandle);
	if (quizzes.length === 0) return true;
	return quizzes.every((q) => {
		const result = getStoredQuizResult(courseHandle, q.id);
		return result && result.passed;
	});
}

export function getPassedQuizzesCount(courseHandle: string): number {
	const quizzes = getQuizzesForCourse(courseHandle);
	if (quizzes.length === 0) return 0;
	return quizzes.filter((q) => {
		const result = getStoredQuizResult(courseHandle, q.id);
		return result && result.passed;
	}).length;
}

export function getFinalCertificationExam(courseHandle: string): CourseQuiz {
	const regularQuizzes = getQuizzesForCourse(courseHandle);
	// Pool questions across all modules
	const allQuestions = regularQuizzes.flatMap((q) => q.questions);

	return {
		id: 'final-certification-exam',
		moduleId: 'final-exam',
		courseHandle,
		title: 'Examen Final de Certificación Profesional con Mención de Honor',
		description:
			'Evaluación integral cronometrada de 20 minutos. Cubre todos los módulos del curso. Requiere 80% para obtener la Mención de Honor en tu diploma.',
		passingScore: 80,
		timeLimitMinutes: 20,
		isFinalExam: true,
		questions: allQuestions.length > 0 ? allQuestions : [
			{
				id: 'fe-1',
				question: '¿Qué principio de arquitectura asegura escalabilidad y mantenibilidad en un proyecto real?',
				options: [
					'Separación de responsabilidades, componentes modulares y pruebas automatizadas.',
					'Escribir todo el código en un único archivo grande para evitar importaciones.',
					'Evitar el uso de librerías y control de versiones.',
					'Desplegar cambios directamente en producción sin entornos de staging.',
				],
				correctOptionIndex: 0,
				explanation:
					'La separación de responsabilidades y la modularidad son los pilares de la ingeniería de software moderna.',
			},
		],
	};
}

export function hasPassedFinalHonorsExam(courseHandle: string): boolean {
	if (typeof window === 'undefined') return false;
	try {
		return localStorage.getItem(`impulso_honors_${courseHandle}`) === 'true';
	} catch {
		return false;
	}
}

