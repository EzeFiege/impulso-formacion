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
	passingScore: number; // Porcentaje mínimo para aprobar (ej: 75 o 80)
	questions: QuizQuestion[];
	timeLimitMinutes?: number; // Para exámenes finales cronometrados
	isFinalExam?: boolean;
};

export type StoredQuizResult = {
	quizId: string;
	courseHandle: string;
	score?: number;
	scorePercent: number;
	passed: boolean;
	completedAt: string;
	answers?: Record<string, number>;
	selectedAnswers: Record<string, number>;
	totalQuestions?: number;
	correctAnswersCount?: number;
};

export type QuizAttemptResult = StoredQuizResult;

const QUIZ_STORAGE_PREFIX = 'impulso_quiz_result_';

export const COURSES_QUIZZES: Record<string, CourseQuiz[]> = {
	'programacion-plc-siemens-tia-portal': [
		{
			id: 'quiz-mod-1',
			moduleId: 'mod-1',
			courseHandle: 'programacion-plc-siemens-tia-portal',
			title: 'Evaluación Módulo 1: Arquitectura de PLC y Entorno TIA Portal',
			description: 'Valida tus conocimientos sobre ciclo de scan, direccionamiento de memoria y lógica de contactos Ladder (KOP).',
			passingScore: 75,
			questions: [
				{
					id: 'q1-1',
					question: 'En un PLC, ¿cuál es el orden secuencial del ciclo de scan (Scan Cycle) de la CPU?',
					options: [
						'1. Ejecución del programa, 2. Lectura de entradas, 3. Diagnóstico interno.',
						'1. Lectura del estado de las entradas físicas a la memoria imagen (PII), 2. Ejecución cíclica del programa de usuario, 3. Escritura de la imagen de salidas (PIQ) a los módulos físicos.',
						'1. Envío de datos a la pantalla HMI, 2. Escritura de salidas, 3. Ejecución de interrupciones.',
						'1. Reseteo de marcas de memoria, 2. Lectura de entradas, 3. Actualización de reloj.',
					],
					correctOptionIndex: 1,
					explanation:
						'El ciclo de scan estándar del PLC lee primero las entradas físicas en la memoria de imagen de proceso (Process-Image Input), ejecuta el código de usuario de arriba a abajo y de izquierda a derecha, y finalmente actualiza todas las salidas físicas de una sola vez.',
				},
				{
					id: 'q1-2',
					question: '¿Por qué en un circuito de parada de emergencia (Emergency Stop) el pulsador físico debe ser de contacto Normalmente Cerrado (NC)?',
					options: [
						'Porque es más económico de fabricar y requiere cables más delgados.',
						'Por principio de seguridad positiva (Fail-Safe): si el cable se corta o se desconecta, el circuito se abre y el PLC detiene la máquina inmediatamente.',
						'Porque la lógica Ladder no permite usar contactos normalmente cerrados en el software.',
						'Para que la bobina del contactor reciba menor consumo de corriente.',
					],
					correctOptionIndex: 1,
					explanation:
						'La seguridad positiva (Fail-Safe) exige que cualquier rotura de conductor, fallo de alimentación o desconexión física sea detectada de inmediato como una condición de paro (cero lógico en la entrada del PLC), evitando que la máquina continúe operando sin control.',
				},
				{
					id: 'q1-3',
					question: 'En la familia Siemens S7-1200 / S7-1500, ¿qué identificador de área de memoria corresponde a una marca interna de bit?',
					options: [
						'%I0.0 (Entrada física digital)',
						'%Q0.0 (Salida física digital)',
						'%M0.0 (Bit de marca interna en la memoria de trabajo)',
						'%DB1.DBD0 (Doble palabra en bloque de datos)',
					],
					correctOptionIndex: 2,
					explanation:
						'El prefijo %M identifica el área de marcas (Merker / Memory Bits), utilizada como memoria auxiliar interna no ligada directamente a bornes físicos de entrada o salida.',
				},
				{
					id: 'q1-4',
					question: '¿Qué problema ocurre comúnmente si en un programa Ladder se programa una misma bobina física (%Q0.0) en dos segmentos (networks) diferentes?',
					options: [
						'El PLC entra en estado de Error Fatal (Falla de hardware) inmediatamente.',
						'La bobina suma la corriente de ambos segmentos duplicando la potencia de salida.',
						'Efecto de "doble bobina": el estado final de la salida física dependerá únicamente del resultado lógico del último segmento que se ejecute en el scan, ignorando el anterior.',
						'El compilador de TIA Portal borra automáticamente el primer segmento sin avisar.',
					],
					correctOptionIndex: 2,
					explanation:
						'Como el ciclo de scan sobreescribe la imagen de proceso secuencialmente, el último segmento evaluado es el que escribe el valor definitivo en la imagen de salidas antes de enviarlo al borne físico.',
				},
			],
		},
		{
			id: 'quiz-mod-2',
			moduleId: 'mod-2',
			courseHandle: 'programacion-plc-siemens-tia-portal',
			title: 'Evaluación Módulo 2: Lógica Avanzada, Bloques FB/FC y Texto Estructurado (SCL)',
			description: 'Evalúa la estructura modular de programas, uso de bloques de datos de instancia y código en SCL.',
			passingScore: 75,
			questions: [
				{
					id: 'q2-1',
					question: '¿Cuál es la diferencia fundamental entre una Función (FC) y un Bloque de Función (FB) en TIA Portal?',
					options: [
						'La FC sólo puede programarse en Ladder, mientras que el FB sólo se programa en Texto Estructurado.',
						'Un FB posee memoria propia mediante un Bloque de Datos de Instancia (Instance DB) para almacenar sus variables estáticas (Static), mientras que una FC no tiene memoria propia entre ciclos de scan.',
						'Una FC se ejecuta más lento porque no tiene acceso a las entradas físicas del PLC.',
						'Los FB son exclusivos para comunicación de redes y las FC son para cálculos matemáticos.',
					],
					correctOptionIndex: 1,
					explanation:
						'Un Bloque de Función (FB) requiere un Data Block de instancia para persistir el valor de sus variables estáticas (STAT) entre llamadas sucesivas, mientras que una FC (Función) libera sus variables temporales (TEMP) al finalizar su ejecución.',
				},
				{
					id: 'q2-2',
					question: 'En un temporizador IEC del tipo TON (Retardo a la conexión), ¿cuándo pasa a nivel alto (TRUE) su salida Q?',
					options: [
						'Inmediatamente cuando la entrada IN pasa a TRUE y luego se apaga al terminar el tiempo.',
						'Cuando la entrada IN se mantiene en TRUE de forma ininterrumpida durante el tiempo predeterminado fijado en el parámetro PT.',
						'Cuando la entrada IN pasa de TRUE a FALSE (flanco descendente).',
						'Únicamente cuando se resetea la alimentación eléctrica de la CPU.',
					],
					correctOptionIndex: 1,
					explanation:
						'El temporizador TON inicia el conteo cuando IN pasa a TRUE. Si IN permanece activa durante el tiempo PT, la salida Q se enciende (TRUE) y se mantendrá así hasta que IN vuelva a FALSE.',
				},
				{
					id: 'q2-3',
					question: 'En programación SCL (Texto Estructurado), ¿cuál es la estructura de control recomendada para ejecutar un cálculo iterativo sobre los elementos de un array de datos?',
					options: [
						'Instrucción JUMP incondicional.',
						'Bucle FOR con variable índice y límites definidos (ej: FOR i := 1 TO 10 DO ... END_FOR;).',
						'Instrucción CASE sin selector de estado.',
						'Llamada recursiva a la función principal OB1.',
					],
					correctOptionIndex: 1,
					explanation:
						'El bucle FOR es la estructura idónea y determinista para iterar colecciones y arrays de tamaño conocido en tiempo de compilación según la norma IEC 61131-3.',
				},
				{
					id: 'q2-4',
					question: 'Al procesar una entrada analógica de 4-20mA leída por un módulo Siemens (%IW64, rango raw de 0 a 27648), ¿cuál es el procedimiento estándar de conversión en TIA Portal?',
					options: [
						'Sumar 20 al valor y dividir por 4.',
						'Usar la instrucción NORM_X para normalizar de 0 a 27648 a un valor real (0.0 a 1.0) y luego SCALE_X para escalar al rango de ingeniería deseado (ej: 0.0 a 100.0 °C).',
						'Aplicar un temporizador de 1 segundo para filtrar el ruido.',
						'Multiplicar el valor entero por 100 y forzar la salida a un relé.',
					],
					correctOptionIndex: 1,
					explanation:
						'En Siemens TIA Portal la combinación NORM_X (normalización del valor bruto 0..27648 a 0.0..1.0) seguida de SCALE_X (escalado a unidades físicas de ingeniería) es el estándar oficial recomendado.',
				},
			],
		},
		{
			id: 'quiz-mod-3',
			moduleId: 'mod-3',
			courseHandle: 'programacion-plc-siemens-tia-portal',
			title: 'Evaluación Módulo 3: Pantallas HMI WinCC, Comunicación Industrial y Puesta en Marcha',
			description: 'Validación de conceptos sobre interfaces de operador, alarmas y comunicación Modbus TCP.',
			passingScore: 75,
			questions: [
				{
					id: 'q3-1',
					question: 'Al diseñar pantallas HMI en WinCC para plantas industriales, ¿qué buena práctica de diseño de la norma ISA-101 se debe priorizar?',
					options: [
						'Utilizar fondos brillantes y animaciones 3D parpadeantes constantes para llamar la atención del operario.',
						'Utilizar fondos neutros en escala de grises y reservar los colores de alto contraste (rojo, amarillo) exclusivamente para alarmas y anomalías operativas.',
						'Colocar todas las variables del proceso en una sola pantalla principal sin páginas secundarias.',
						'Ocultar las opciones de parada y dejar sólo los comandos de marcha automática.',
					],
					correctOptionIndex: 1,
					explanation:
						'La norma ISA-101 (High Performance HMI) promueve pantallas de fondo gris claro u oscuro neutro sin distracciones cromáticas, haciendo que cualquier condición de alarma o desvío sea detectada instantáneamente por el operador humano.',
				},
				{
					id: 'q3-2',
					question: 'En una red de comunicación industrial Modbus TCP, ¿qué puerto estándar TCP/IP utiliza por defecto el protocolo para las transacciones?',
					options: ['Puerto 80', 'Puerto 443', 'Puerto 502', 'Puerto 8080'],
					correctOptionIndex: 2,
					explanation:
						'El puerto estándar asignado por IANA para el protocolo industrial Modbus TCP es el puerto 502.',
				},
				{
					id: 'q3-3',
					question: '¿Para qué sirve la herramienta de forzado de variables (Force Table / Forzado permanente) en un PLC y por qué debe usarse con extremo cuidado?',
					options: [
						'Sirve para acelerar la velocidad del reloj de la CPU al doble de frecuencia.',
						'Permite fijar una entrada o salida física a un valor constante independientemente de la señal real de campo o del programa, pudiendo anular enclavamientos de seguridad física en planta.',
						'Es una función para borrar el firmware del PLC.',
						'Sirve únicamente para calibrar la hora y fecha del equipo.',
					],
					correctOptionIndex: 1,
					explanation:
						'El forzado permanente sobreescribe directamente el hardware a nivel periférico saltándose la lógica de seguridad del programa de usuario, por lo que su uso descuidado en una máquina real puede ocasionar accidentes graves.',
				},
			],
		},
	],
	'electricidad-industrial-tableros': [
		{
			id: 'quiz-elec-mod-1',
			moduleId: 'elec-mod-1',
			courseHandle: 'electricidad-industrial-tableros',
			title: 'Evaluación Módulo 1: Seguridad Eléctrica y Esquemas bajo Norma IEC',
			description: 'Protecciones eléctricas, curvas de disparo, conductores y simbología industrial.',
			passingScore: 75,
			questions: [
				{
					id: 'qe1-1',
					question: '¿Qué tipo de protección brinda un Interruptor Termomagnético (Disyuntor magnetotérmico) en un circuito de potencia?',
					options: [
						'Protección únicamente contra corrientes de fuga a tierra.',
						'Protección térmica contra sobrecargas prolongadas y protección magnética instantánea contra cortocircuitos.',
						'Regulación automática de la frecuencia de la red eléctrica.',
						'Compensación de potencia reactiva inductiva.',
					],
					correctOptionIndex: 1,
					explanation:
						'El elemento bimetálico se deforma por calor protegiendo contra sobrecargas sostenidas en el tiempo, mientras que la bobina electromagnética abre el circuito en milisegundos ante la corriente destructiva de un cortocircuito.',
				},
				{
					id: 'qe1-2',
					question: 'En la protección de motores eléctricos trifásicos, ¿qué curva de disparo de interruptor termomagnético se recomienda utilizar y por qué?',
					options: [
						'Curva B: para que dispare de inmediato con la menor corriente.',
						'Curva D: porque tolera corrientes transitorias de arranque de entre 10 a 20 veces la corriente nominal (In) sin disparar en falso.',
						'Curva Z: diseñada para semiconductores ultra rápidos.',
						'No se debe utilizar interruptor, solo fusibles de cristal.',
					],
					correctOptionIndex: 1,
					explanation:
						'Los motores tienen picos de corriente de arranque que pueden alcanzar entre 6 y 10 veces su corriente nominal. Las curvas D (o guardamotores calibrados) están diseñadas para tolerar estos picos sin disparos intempestivos.',
				},
				{
					id: 'qe1-3',
					question: 'En un contactor de maniobra trifásico según norma IEC, ¿cómo se numeran los contactos principales de fuerza y los auxiliares normalmente abiertos (NO)?',
					options: [
						'Fuerza: 1/L1-2/T1, 3/L2-4/T2, 5/L3-6/T3. Auxiliar NO: terminación 3-4 (ej: 13-14).',
						'Fuerza: A1 y A2. Auxiliar NO: 1-2.',
						'Todos los contactos tienen números aleatorios sin estándar.',
						'Fuerza: +24V y 0V. Auxiliar NO: 21-22.',
					],
					correctOptionIndex: 0,
					explanation:
						'Los polos principales de potencia se designan 1-2, 3-4, 5-6 (L1-T1, L2-T2, L3-T3). Los contactos auxiliares siguen la regla: 1-2 para Normalmente Cerrados (NC) y 3-4 para Normalmente Abiertos (NO). La bobina se alimenta en A1-A2.',
				},
			],
		},
	],
	'instrumentacion-control-procesos': [
		{
			id: 'quiz-inst-mod-1',
			moduleId: 'inst-mod-1',
			courseHandle: 'instrumentacion-control-procesos',
			title: 'Evaluación Módulo 1: Instrumentación y Señales Analógicas',
			description: 'Lazo 4-20mA, termocuplas, RTD PT100 y calibración HART.',
			passingScore: 75,
			questions: [
				{
					id: 'qi1-1',
					question: '¿Por qué la señal de instrumentación analógica estándar de la industria comienza en 4 mA y no en 0 mA (cero vivo / Live Zero)?',
					options: [
						'Para ahorrar energía en el generador de la planta.',
						'Permite distinguir de forma inequívoca entre una lectura de cero por ciento de variable (4 mA) y una condición de falla por rotura o corte de cable (0 mA).',
						'Porque los circuitos electrónicos no pueden conducir corrientes menores a 4 mA.',
						'Es una limitación impuesta por los cables de cobre trenzados.',
					],
					correctOptionIndex: 1,
					explanation:
						'El "cero vivo" en 4 mA permite tanto alimentar al transmisor por el mismo lazo (2 hilos) como detectar al instante si el cable se cortó físicamente (la corriente cae a 0 mA, disparando la alarma de rotura de lazo).',
				},
				{
					id: 'qi1-2',
					question: 'En un algoritmo de control PID, ¿cuál es el rol de la acción Integral (I)?',
					options: [
						'Predecir el comportamiento futuro del error para reaccionar antes.',
						'Amplificar el ruido de alta frecuencia del sensor.',
						'Eliminar por completo el error en estado estacionario (Offset), acumulando el error a lo largo del tiempo hasta que la variable de proceso alcance exactamente el Setpoint.',
						'Limitar la apertura máxima de la válvula de control al 50%.',
					],
					correctOptionIndex: 2,
					explanation:
						'La acción proporcional pura siempre deja un error residual (offset). La acción integral suma continuamente el error en el tiempo, forzando la salida hasta que el error sea matemáticamente cero.',
				},
			],
		},
	],
	'scada-redes-industriales-ot': [
		{
			id: 'quiz-scada-mod-1',
			moduleId: 'scada-mod-1',
			courseHandle: 'scada-redes-industriales-ot',
			title: 'Evaluación Módulo 1: Redes Industriales y Arquitectura OT',
			description: 'Modelo Purdue, Profinet, switches gestionables y ciberseguridad industrial.',
			passingScore: 75,
			questions: [
				{
					id: 'qs1-1',
					question: 'Según la arquitectura de referencia Purdue (ISA-95), ¿qué zona o nivel separa la red corporativa de oficina (IT) de las redes de control de planta (OT)?',
					options: [
						'El nivel 0 de sensores físicos.',
						'La DMZ Industrial (IDMZ / Nivel 3.5), con firewalls que impiden el enrutamiento directo de tráfico entre ambos entornos.',
						'El switch no gestionable del gabinete principal.',
						'La pantalla táctil del panel operador.',
					],
					correctOptionIndex: 1,
					explanation:
						'La IDMZ (Industrial Demilitarized Zone) en el nivel 3.5 actúa como barrera de aislamiento estricta, asegurando que ningún host corporativo de IT tenga acceso directo a los controladores PLC o sistemas críticos de producción en OT.',
				},
				{
					id: 'qs1-2',
					question: '¿Qué ventaja clave ofrece el protocolo abierto OPC UA frente a su antecesor OPC DA (Data Access)?',
					options: [
						'Es exclusivo para sistemas operativos Windows XP.',
						'Es multiplataforma (corre en Linux, Windows y dispositivos embebidos), incluye seguridad nativa con certificados X.509 y cifrado de extremo a extremo, y no depende de la compleja tecnología DCOM de Microsoft.',
						'Solo permite transferir datos a un máximo de 10 variables.',
						'Requiere conexión obligatoria a internet público.',
					],
					correctOptionIndex: 1,
					explanation:
						'OPC Unified Architecture eliminó por completo los dolores de cabeza de DCOM, integrando un modelo de información enriquecido, seguridad criptográfica robusta y compatibilidad absoluta entre diferentes sistemas operativos y fabricantes.',
				},
			],
		},
	],
};

// Aliases para compatibilidad con accesos antiguos
COURSES_QUIZZES['desarrollo-web-fullstack'] = COURSES_QUIZZES['programacion-plc-siemens-tia-portal'];
COURSES_QUIZZES['python-analisis-datos-ia'] = COURSES_QUIZZES['electricidad-industrial-tableros'];
COURSES_QUIZZES['diseno-ux-ui-figma'] = COURSES_QUIZZES['instrumentacion-control-procesos'];
COURSES_QUIZZES['marketing-digital-estrategia'] = COURSES_QUIZZES['scada-redes-industriales-ot'];

export function getQuizzesForCourse(courseHandle: string): CourseQuiz[] {
	return COURSES_QUIZZES[courseHandle] || COURSES_QUIZZES['programacion-plc-siemens-tia-portal'];
}

export function getFinalCertificationExam(courseHandle: string): CourseQuiz {
	const handle = courseHandle || 'programacion-plc-siemens-tia-portal';

	return {
		id: `final-exam-${handle}`,
		moduleId: 'mod-final',
		courseHandle: handle,
		title: 'Examen Final de Certificación Profesional · Automatización Industrial & OT',
		description: 'Evaluación integral cronometrada de 20 minutos. Exige 80% o más de respuestas correctas para acreditar la Certificación Oficial con Mención de Honor.',
		passingScore: 80,
		timeLimitMinutes: 20,
		isFinalExam: true,
		questions: [
			{
				id: 'fe-1',
				question: '¿Cuál es la función principal de la rutina de organización OB1 (Main) en un PLC Siemens?',
				options: [
					'Almacenar las contraseñas de acceso al proyecto.',
					'Ejecutar el bucle principal cíclico del programa llamado continuamente por el sistema operativo de la CPU.',
					'Gestionar las alarmas horarias una vez al día.',
					'Controlar la velocidad de los ventiladores del gabinete.',
				],
				correctOptionIndex: 1,
				explanation: 'El OB1 es el bloque cíclico principal del sistema operativo de la CPU que se ejecuta indefinidamente en cada scan.',
			},
			{
				id: 'fe-2',
				question: '¿Qué ocurre si se supera el tiempo máximo de scan (Scan Watchdog Time) configurado en el PLC?',
				options: [
					'El PLC reinicia el programa en silencio sin advertencias.',
					'La CPU entra en estado STOP por desborde de tiempo de ciclo para evitar que la máquina quede sin control.',
					'Aumenta automáticamente la velocidad del procesador.',
					'Se apagan solo las pantallas HMI.',
				],
				correctOptionIndex: 1,
				explanation: 'El temporizador de vigilancia (Watchdog) previene bucles infinitos; si se supera el tiempo límite la CPU se detiene por seguridad en STOP.',
			},
			{
				id: 'fe-3',
				question: 'En un transmisor de 4-20mA alimentado a 24VCC, ¿qué valor de corriente física representa el 50% del rango de medición de ingeniería?',
				options: ['10 mA', '12 mA', '8 mA', '16 mA'],
				correctOptionIndex: 1,
				explanation: 'El span de la señal es 20 - 4 = 16 mA. El 50% es 8 mA sumados al cero vivo de 4 mA: 4 + 8 = 12 mA.',
			},
			{
				id: 'fe-4',
				question: '¿Cuál es la principal ventaja de utilizar arrancadores suaves (Soft Starters) o variadores de frecuencia (VFD) frente al arranque directo de un motor?',
				options: [
					'Aumentan el ruido mecánico del motor.',
					'Reducen los picos destructivos de corriente eléctrica y el golpe de ariete / estrés mecánico en acoples y cañerías.',
					'Permiten que el motor funcione sin conexión a tierra.',
					'Duplican la tensión nominal del motor.',
				],
				correctOptionIndex: 1,
				explanation: 'El arranque suave elimina el shock mecánico sobre reductores y correas, y limita la corriente de arranque que provoca caídas de tensión en la instalación eléctrica.',
			},
			{
				id: 'fe-5',
				question: '¿Por qué en los cables de comunicación industrial (ej: Profinet, Modbus RS-485) es mandatorio el blindaje o malla conectada a tierra en un único punto o según norma?',
				options: [
					'Para que el cable no sea masticado por roedores.',
					'Para drenar a tierra el ruido electromagnético inducido por motores, contactores y variadores cercanos.',
					'Para hacer que los paquetes de datos viajen a mayor velocidad.',
					'Es solo un requerimiento estético del peinado de cables.',
				],
				correctOptionIndex: 1,
				explanation: 'El apantallamiento protege la señal digital de perturbaciones de alta frecuencia generadas por la conmutación de IGBTs en variadores de velocidad.',
			},
		],
	};
}

export function saveQuizResult(
	resultOrHandle: StoredQuizResult | string,
	quizId?: string,
	score?: number,
	passed?: boolean,
	answers?: Record<string, number>,
): StoredQuizResult {
	let record: StoredQuizResult;

	if (typeof resultOrHandle === 'object') {
		const res = resultOrHandle;
		const s = res.score ?? res.scorePercent ?? 0;
		record = {
			quizId: res.quizId,
			courseHandle: res.courseHandle,
			score: s,
			scorePercent: res.scorePercent ?? s,
			passed: res.passed,
			completedAt: res.completedAt || new Date().toISOString(),
			answers: res.answers || res.selectedAnswers || {},
			selectedAnswers: res.selectedAnswers || res.answers || {},
			totalQuestions: res.totalQuestions,
			correctAnswersCount: res.correctAnswersCount,
		};
	} else {
		const s = score ?? 0;
		record = {
			quizId: quizId || '',
			courseHandle: resultOrHandle,
			score: s,
			scorePercent: s,
			passed: passed ?? false,
			completedAt: new Date().toISOString(),
			answers: answers || {},
			selectedAnswers: answers || {},
		};
	}

	try {
		localStorage.setItem(`${QUIZ_STORAGE_PREFIX}${record.courseHandle}_${record.quizId}`, JSON.stringify(record));
		window.dispatchEvent(
			new CustomEvent('impulso_quiz_completed', {
				detail: { courseHandle: record.courseHandle, quizId: record.quizId, score: record.score, passed: record.passed },
			}),
		);
	} catch (e) {
		console.warn('Error guardando resultado de quiz:', e);
	}

	return record;
}

export function getStoredQuizResult(courseHandle: string, quizId: string): StoredQuizResult | null {
	try {
		const raw = localStorage.getItem(`${QUIZ_STORAGE_PREFIX}${courseHandle}_${quizId}`);
		if (!raw) return null;
		const parsed = JSON.parse(raw);
		return {
			...parsed,
			scorePercent: parsed.scorePercent ?? parsed.score ?? 0,
			selectedAnswers: parsed.selectedAnswers ?? parsed.answers ?? {},
		};
	} catch {
		return null;
	}
}

export function checkAllCourseQuizzesPassed(courseHandle: string): boolean {
	const quizzes = getQuizzesForCourse(courseHandle);
	if (quizzes.length === 0) return true;

	return quizzes.every((quiz) => {
		const res = getStoredQuizResult(courseHandle, quiz.id);
		return res && res.passed;
	});
}

export const areAllCourseQuizzesPassed = checkAllCourseQuizzesPassed;

export function getPassedQuizzesCount(courseHandle: string): number {
	const quizzes = getQuizzesForCourse(courseHandle);
	return quizzes.filter((quiz) => {
		const res = getStoredQuizResult(courseHandle, quiz.id);
		return res && res.passed;
	}).length;
}

export function hasPassedFinalHonorsExam(courseHandle: string): boolean {
	try {
		return localStorage.getItem(`impulso_honors_${courseHandle}`) === 'true';
	} catch {
		return false;
	}
}
