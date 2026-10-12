export type LessonResource = {
	title: string;
	url: string;
	size?: string;
	type: 'pdf' | 'code' | 'video' | 'link';
};

export type Lesson = {
	id: string;
	title: string;
	durationMinutes: number;
	type: 'video' | 'article' | 'quiz';
	videoUrl?: string;
	description: string;
	keyTakeaways: string[];
	resources?: LessonResource[];
};

export type CourseModule = {
	id: string;
	title: string;
	description: string;
	lessons: Lesson[];
};

export type CourseCurriculum = {
	courseHandle: string;
	instructor: {
		name: string;
		title: string;
		avatar: string;
		bio: string;
	};
	level: 'Principiante' | 'Intermedio' | 'Avanzado';
	totalHours: number;
	certificateAvailable: boolean;
	modules: CourseModule[];
};

export const COURSES_CURRICULA: Record<string, CourseCurriculum> = {
	'programacion-plc-siemens-tia-portal': {
		courseHandle: 'programacion-plc-siemens-tia-portal',
		instructor: {
			name: 'Ing. Carlos Valenzuela',
			title: 'Especialista en Automatización & Control Industrial Senior',
			avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=250&q=80',
			bio: 'Más de 14 años de experiencia en automatización de plantas siderúrgicas, alimenticias y de tratamiento de aguas. Certificado oficial en TIA Portal Siemens y Rockwell Studio 5000.',
		},
		level: 'Intermedio',
		totalHours: 42,
		certificateAvailable: true,
		modules: [
			{
				id: 'mod-1',
				title: 'Módulo 1: Arquitectura de Control y Entorno TIA Portal V18/V19',
				description: 'Hardware S7-1200/1500, direccionamiento I/O, ciclo de scan y lógica de contactos Ladder (KOP).',
				lessons: [
					{
						id: 'les-1-1',
						title: '1.1 Introducción a la Automatización Industrial y Arquitectura de un PLC',
						durationMinutes: 14,
						type: 'video',
						videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
						description: 'Ciclo de scan de la CPU (lectura de imagen de entradas, ejecución de programa cíclico, actualización de imagen de salidas). Familias Siemens S7-1200 y S7-1500.',
						keyTakeaways: [
							'Entender el tiempo de ciclo (Scan Time) y monitoreo de watchdog.',
							'Diferencias entre hardware compacto y modular.',
							'Configuración del entorno de ingeniería TIA Portal.',
						],
						resources: [
							{ title: 'Manual del Sistema SIMATIC S7-1200 (PDF)', url: '#', size: '4.8 MB', type: 'pdf' },
							{ title: 'Proyecto Base TIA Portal V18 (Simulador)', url: '#', type: 'code' },
						],
					},
					{
						id: 'les-1-2',
						title: '1.2 Configuración de Hardware, Direccionamiento I/O y Redes Profinet',
						durationMinutes: 26,
						type: 'video',
						videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
						description: 'Creación de la estación en TIA Portal, asignación de direcciones IP, nombres de dispositivo Profinet y parametrización de módulos analógicos y digitales.',
						keyTakeaways: [
							'Asignación de subred industrial y configuración IP fija.',
							'Mapeo de tags globales en tabla de variables PLC.',
							'Configuración de periferia descentralizada ET 200SP.',
						],
						resources: [
							{ title: 'Tabla de Tags y Mapeo I/O de Referencia (Excel)', url: '#', size: '280 KB', type: 'pdf' },
						],
					},
					{
						id: 'les-1-3',
						title: '1.3 Lógica Digital y Programación en Lenguaje de Contactos (Ladder / KOP)',
						durationMinutes: 38,
						type: 'video',
						videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
						description: 'Instrucciones lógicas fundamentales: contactos normalmente abiertos/cerrados, bobinas simples, set/reset (latch/unlatch) y memorias de enclavamiento.',
						keyTakeaways: [
							'Circuitos de retención y marcha/paro seguro.',
							'Detección de flancos ascendentes (P_TRIG) y descendentes (N_TRIG).',
							'Buenas prácticas para evitar bobinas dobles en el programa.',
						],
						resources: [
							{ title: 'Guía de Buenas Prácticas de Programación PLC', url: '#', size: '750 KB', type: 'pdf' },
						],
					},
				],
			},
			{
				id: 'mod-2',
				title: 'Módulo 2: Lógica Avanzada, Bloques FB/FC/DB y Texto Estructurado (SCL)',
				description: 'Temporizadores, contadores, organización modular con bloques de función y programación en SCL.',
				lessons: [
					{
						id: 'les-2-1',
						title: '2.1 Temporizadores IEC (TON, TOF, TP) y Contadores (CTU, CTD)',
						durationMinutes: 30,
						type: 'video',
						videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
						description: 'Aplicación práctica de retardos a la conexión y desconexión, impulsos de tiempo y conteo de piezas en líneas continuas.',
						keyTakeaways: [
							'Comportamiento de la base de tiempo y tipos de datos TIME.',
							'Implementación de secuencias con marcas de reloj (Clock Memory).',
							'Rutinas de reset y reinicio seguro de contadores.',
						],
					},
					{
						id: 'les-2-2',
						title: '2.2 Creación de Bloques de Función (FB), Funciones (FC) y Bloques de Datos (DB)',
						durationMinutes: 42,
						type: 'video',
						videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
						description: 'Diseño de arquitectura de software modular. Parámetros de entrada, salida, in/out y creación de Data Blocks globales e instancias múltiples.',
						keyTakeaways: [
							'Diferencias críticas entre FC (sin memoria interna) y FB (con DB de instancia).',
							'Tipos de datos definidos por el usuario (PLC Data Types / UDT).',
							'Estandarización de módulos de control para motores y válvulas.',
						],
						resources: [
							{ title: 'Librería de Control de Motores (Bloque FB_Motor)', url: '#', type: 'code' },
						],
					},
					{
						id: 'les-2-3',
						title: '2.3 Programación en Texto Estructurado (SCL) para Cálculos Complejos',
						durationMinutes: 45,
						type: 'video',
						videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyBlazes.mp4',
						description: 'Sintaxis de SCL basada en estándar IEC 61131-3: bucles FOR/WHILE, condicionales IF-THEN-ELSE, tratamiento de arrays y escalado de señales analógicas.',
						keyTakeaways: [
							'Ventajas de SCL frente a Ladder para recetas y algoritmos matemáticos.',
							'Escalado y normalización de señales de 4-20mA (NORM_X y SCALE_X).',
							'Gestión de punteros y estructuras de datos en memoria.',
						],
					},
				],
			},
			{
				id: 'mod-3',
				title: 'Módulo 3: Pantallas HMI WinCC, Comunicación Industrial y Puesta en Marcha',
				description: 'Interfaces hombre-máquina, alarmas de proceso, comunicación Modbus TCP y simulaciones completas.',
				lessons: [
					{
						id: 'les-3-1',
						title: '3.1 Diseño de Interfaces HMI en WinCC y Sistema de Alarmas',
						durationMinutes: 35,
						type: 'video',
						videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4',
						description: 'Vinculación de tags HMI-PLC, botones con pulsación directa, visualizadores numéricos y configuración de avisos y alarmas discretas y analógicas.',
						keyTakeaways: [
							'Diseño ergonómico y navegación entre pantallas del panel operador.',
							'Jerarquía de alarmas de advertencia y paros de emergencia.',
							'Animaciones por cambio de estado y niveles de acceso de seguridad.',
						],
					},
					{
						id: 'les-3-2',
						title: '3.2 Comunicación Modbus TCP y Diagnóstico de Fallas en Tiempo Real',
						durationMinutes: 40,
						type: 'video',
						videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
						description: 'Configuración de instrucciones MB_CLIENT y MB_SERVER para enlazar variadores de frecuencia e instrumentos de campo vía Ethernet.',
						keyTakeaways: [
							'Mapa de registros Holding Registers y Códigos de Función Modbus.',
							'Uso del buffer de diagnóstico de la CPU para resolución de fallas.',
							'Monitoreo online de tablas de variables y forzado de señales (Force/Watch).',
						],
					},
					{
						id: 'les-3-3',
						title: '3.3 Proyecto Final: Automatización y Simulación de una Celda de Producción',
						durationMinutes: 50,
						type: 'video',
						videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackSeeTheWorld.mp4',
						description: 'Integración completa: lógica secuencial Grafcet/SFC en Ladder, bloques SCL, recetas en HMI y prueba integral en simulador S7-PLCSIM.',
						keyTakeaways: [
							'Puesta en marcha virtual paso a paso.',
							'Verificación de secuencias en modo manual, automático y parada de emergencia.',
							'Generación de documentación técnica de entrega de proyecto.',
						],
					},
				],
			},
		],
	},
	'electricidad-industrial-tableros': {
		courseHandle: 'electricidad-industrial-tableros',
		instructor: {
			name: 'Ing. Martín Bustamante',
			title: 'Ingeniero Eléctrico y Proyectista de Tableros de Potencia',
			avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=250&q=80',
			bio: 'Especialista en instalaciones eléctricas de media y baja tensión, cálculo de cortocircuito y dimensionamiento de tableros de transferencia y control de motores (CCM).',
		},
		level: 'Principiante',
		totalHours: 36,
		certificateAvailable: true,
		modules: [
			{
				id: 'elec-mod-1',
				title: 'Módulo 1: Seguridad Eléctrica y Esquemas bajo Norma IEC',
				description: 'Seguridad en el taller, bloqueo y etiquetado (LOTO) e interpretación de planos unifilares y funcionales.',
				lessons: [
					{
						id: 'elec-les-1-1',
						title: '1.1 Seguridad Eléctrica, Bloqueo/Etiquetado (LOTO) y Normativa IEC 60364',
						durationMinutes: 20,
						type: 'video',
						videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
						description: 'Cinco reglas de oro de la seguridad eléctrica, equipos de protección personal (EPP), riesgos de arco eléctrico y protocolo LOTO.',
						keyTakeaways: [
							'Procedimientos de desenergización y puesta a tierra transitoria.',
							'Clasificación de esquemas de conexión a tierra: TT, TN y IT.',
							'Normas de seguridad eléctrica en ambientes industriales.',
						],
					},
					{
						id: 'elec-les-1-2',
						title: '1.2 Simbología Eléctrica y Lectura de Planos Multifilares y Unifilares',
						durationMinutes: 32,
						type: 'video',
						videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4',
						description: 'Identificación de bornes según IEC (1-2 NC, 3-4 NO), referencias cruzadas entre bobinas y contactos auxiliares, numeración de regletas de bornes.',
						keyTakeaways: [
							'Lectura fluida de planos en software CAD eléctrico (EPLAN / AutoCAD Electrical).',
							'Códigos de colores de conductores de potencia, control y tierra.',
							'Estructura de designación de aparamenta según IEC 81346.',
						],
					},
					{
						id: 'elec-les-1-3',
						title: '1.3 Selección y Dimensionamiento de Protecciones Termomagnéticas y Diferenciales',
						durationMinutes: 38,
						type: 'video',
						videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
						description: 'Curvas de disparo (B, C, D), poder de corte en kA, selectividad amperimétrica y cronométrica, e interruptores diferenciales clase AC, A y B.',
						keyTakeaways: [
							'Cálculo de corriente nominal (In) y capacidad de conducción de conductores.',
							'Protección contra corrientes de sobrecarga y cortocircuito.',
							'Selección de protecciones adecuadas para cargas no lineales.',
						],
					},
				],
			},
			{
				id: 'elec-mod-2',
				title: 'Módulo 2: Maniobra de Motores y Montaje de Tableros Eléctricos',
				description: 'Contactores, relés térmicos, arrancadores estrella-triángulo y cableado prolijo con canaleta ranurada.',
				lessons: [
					{
						id: 'elec-les-2-1',
						title: '2.1 Contactores, Guardamotores y Relés Térmicos: Circuitos de Comando',
						durationMinutes: 30,
						type: 'video',
						videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
						description: 'Dimensionamiento de contactores según categorías de empleo (AC-1, AC-3, AC-4). Coordinación de protecciones tipo 1 y tipo 2.',
						keyTakeaways: [
							'Circuitos de mando en 24VCC vs 220VCA.',
							'Enclavamiento mecánico y eléctrico para prevención de cortocircuitos entre fases.',
							'Regulación precisa de relés de sobrecarga según placa del motor.',
						],
					},
					{
						id: 'elec-les-2-2',
						title: '2.2 Arranque Directo, Estrella-Triángulo e Inversión de Giro',
						durationMinutes: 40,
						type: 'video',
						videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
						description: 'Armado práctico de circuito de fuerza y comando para arranque estrella-triángulo con temporizador de transición y transitorio de conmutación.',
						keyTakeaways: [
							'Reducción de corriente de arranque a 1/3 del valor nominal.',
							'Dimensionamiento de los 3 contactores (Línea, Estrella y Triángulo).',
							'Conexión de motores de 6 bornes según tensión de red (220V/380V).',
						],
					},
					{
						id: 'elec-les-2-3',
						title: '2.3 Montaje, Peinado de Conductores y Rotulación de Tableros Eléctricos',
						durationMinutes: 36,
						type: 'video',
						videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
						description: 'Distribución espacial en placa de montaje, grado de protección IP/IK, ventilación forzada y rotulación termocontraíble según normativa.',
						keyTakeaways: [
							'Uso correcto de terminales tubulares preaislados y pinzas crimpeadoras.',
							'Separación física de cables de potencia y señales débiles de instrumentación.',
							'Pruebas de continuidad y aislamiento con megóhmetro antes de energizar.',
						],
					},
				],
			},
			{
				id: 'elec-mod-3',
				title: 'Módulo 3: Variadores de Frecuencia (VFD) y Corrección de Factor de Potencia',
				description: 'Parametrización de convertidores de frecuencia, rampas de aceleración y bancos de capacitores.',
				lessons: [
					{
						id: 'elec-les-3-1',
						title: '3.1 Parametrización y Puesta en Marcha de Variadores de Frecuencia',
						durationMinutes: 44,
						type: 'video',
						videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
						description: 'Control escalar V/Hz vs control vectorial sensorless. Ajuste de rampas, frenado por inyección de CC, resistencias de frenado y protecciones.',
						keyTakeaways: [
							'Conexionado de entradas digitales (Marcha, Sentido) y analógicas (Potenciómetro 0-10V).',
							'Uso de filtros EMC y cables apantallados para mitigar armónicos.',
							'Configuración rápida de datos de placa de motor en el display del variador.',
						],
					},
					{
						id: 'elec-les-3-2',
						title: '3.2 Factor de Potencia, Armónicos y Bancos Automáticos de Condensadores',
						durationMinutes: 32,
						type: 'video',
						videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyBlazes.mp4',
						description: 'Compensación de energía reactiva inductiva, penalizaciones en la factura eléctrica y dimensionamiento de pasos con contactores para capacitores.',
						keyTakeaways: [
							'Cálculo de kVAR necesarios para elevar cos phi a 0.95.',
							'Instalación de reactancias de rechazo (desintonizadas) ante presencia de armónicos.',
							'Reguladores automáticos de reactiva: configuración de pasos y tiempos de reconexión.',
						],
					},
				],
			},
		],
	},
	'instrumentacion-control-procesos': {
		courseHandle: 'instrumentacion-control-procesos',
		instructor: {
			name: 'Ing. Roberto Vignolo',
			title: 'Especialista en Control de Procesos e Instrumentación de Planta',
			avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',
			bio: 'Ingeniero Químico y Electrónico con 18 años liderando proyectos de instrumentación en refinerías y plantas petroquímicas. Asesor técnico de la ISA (International Society of Automation).',
		},
		level: 'Intermedio',
		totalHours: 38,
		certificateAvailable: true,
		modules: [
			{
				id: 'inst-mod-1',
				title: 'Módulo 1: Medición de Variables de Proceso y Señales de Campo',
				description: 'Transmisores de presión, nivel, caudal y temperatura, lazo 4-20mA y comunicación HART.',
				lessons: [
					{
						id: 'inst-les-1-1',
						title: '1.1 Sensores Industriales y Señales Analógicas Estándar (4-20 mA y 0-10V)',
						durationMinutes: 25,
						type: 'video',
						videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4',
						description: 'Por qué el bucle de corriente 4-20 mA es el estándar indiscutido en la industria (inmunidad al ruido electromagnético y detección de corte de hilo a 0 mA).',
						keyTakeaways: [
							'Alimentación a 2 hilos (loop powered) vs instrumentos a 4 hilos.',
							'Cálculo de resistencia de carga máxima del lazo (Loop Burden).',
							'Acondicionamiento y aislamiento galvánico de señales.',
						],
					},
					{
						id: 'inst-les-1-2',
						title: '1.2 Medición de Temperatura con Termorresistencias PT100 y Termocuplas',
						durationMinutes: 34,
						type: 'video',
						videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
						description: 'Diferencias operativas entre RTD (PT100 a 2, 3 y 4 hilos) y termocuplas (J, K, T, S). Compensación de unión fría y cables de extensión compensados.',
						keyTakeaways: [
							'Selección del sensor adecuado según rango de temperatura y ambiente.',
							'Efecto Seebeck y termopares en aplicaciones de alta temperatura.',
							'Calibración con calibrador de procesos multifunción y horno térmico.',
						],
					},
					{
						id: 'inst-les-1-3',
						title: '1.3 Calibración de Transmisores Inteligentes con Comunicador HART',
						durationMinutes: 38,
						type: 'video',
						videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackSeeTheWorld.mp4',
						description: 'Modulación FSK sobre el lazo 4-20mA, configuración de rango LRV/URV, damping, trim de cero/span y lectura de variables primarias y secundarias.',
						keyTakeaways: [
							'Uso de comunicador de campo (Handheld 475 o software PACTware).',
							'Ajuste del tiempo de amortiguamiento (Damping) en procesos turbulentos.',
							'Detección de alarmas de falla según estándar NAMUR NE43.',
						],
					},
				],
			},
			{
				id: 'inst-mod-2',
				title: 'Módulo 2: Válvulas de Control y Elementos Finales',
				description: 'Actuadores neumáticos, posicionadores inteligentes y dimensionamiento de válvulas (Cv).',
				lessons: [
					{
						id: 'inst-les-2-1',
						title: '2.1 Válvulas de Control Globo, Mariposa y Esféricas: Selección del Cv',
						durationMinutes: 30,
						type: 'video',
						videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
						description: 'Coeficiente de caudal (Cv/Kv), características de flujo inherentes (igual porcentaje, lineal, apertura rápida) y fenómenos de cavitación y flashing.',
						keyTakeaways: [
							'Cálculo de caída de presión requerida en la válvula.',
							'Acción ante falla de aire: Falla Cierra (Air-to-Open) vs Falla Abre (Air-to-Close).',
							'Materiales de empaquetadura y compatibilidad química.',
						],
					},
					{
						id: 'inst-les-2-2',
						title: '2.2 Posicionadores Electroneumáticos Inteligentes y Autocalibración',
						durationMinutes: 35,
						type: 'video',
						videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4',
						description: 'Montaje del posicionador sobre el vástago, ajuste de carrera, feedback de posición y prueba de carrera parcial (Partial Stroke Test - PST).',
						keyTakeaways: [
							'Curva de linealización y autotuning neumático.',
							'Presión de suministro de aire de instrumentos (filtro regulador).',
							'Monitoreo de rozamiento y estado del obturador.',
						],
					},
				],
			},
			{
				id: 'inst-mod-3',
				title: 'Módulo 3: Lazos de Control en Lazo Cerrado y Sintonía PID',
				description: 'Teoría de control retroalimentado, algoritmos PID y sintonización práctica en planta.',
				lessons: [
					{
						id: 'inst-les-3-1',
						title: '3.1 Dinámica de Procesos: Ganancia, Tiempo Muerto y Constante de Tiempo',
						durationMinutes: 36,
						type: 'video',
						videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
						description: 'Identificación de modelos de proceso de primer orden con retardo (FOPDT) mediante respuesta al escalón en lazo abierto.',
						keyTakeaways: [
							'Comportamiento de la Variable de Proceso (PV), Setpoint (SP) y Variable Manipulada (MV).',
							'Procesos autorregulados vs procesos integradores (ej: nivel de tanques).',
							'Impacto del tiempo muerto en la estabilidad del lazo.',
						],
					},
					{
						id: 'inst-les-3-2',
						title: '3.2 Acciones Proporcional, Integral y Derivativa (PID) y Sintonía Práctica',
						durationMinutes: 48,
						type: 'video',
						videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
						description: 'Función de cada parámetro: ganancia Kp (banda proporcional), tiempo integral Ti (eliminación del error en régimen permanente) y tiempo derivativo Td.',
						keyTakeaways: [
							'Prevención del fenómeno de Windup Integral con anti-windup.',
							'Métodos de sintonía rápida: Ziegler-Nichols, Cohen-Coon y Lambda tuning.',
							'Criterios para activar o desactivar la acción derivativa ante ruido de medición.',
						],
					},
				],
			},
		],
	},
	'scada-redes-industriales-ot': {
		courseHandle: 'scada-redes-industriales-ot',
		instructor: {
			name: 'Ing. Esteban Navarro',
			title: 'Arquitecto de Redes Industriales y Ciberseguridad OT',
			avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=250&q=80',
			bio: 'Ingeniero en Telecomunicaciones y Automatización. Consultor certificado en Ignition Gold, redes Profinet/EtherNet/IP y consultoría de seguridad industrial IEC 62443 para centrales de energía.',
		},
		level: 'Avanzado',
		totalHours: 40,
		certificateAvailable: true,
		modules: [
			{
				id: 'scada-mod-1',
				title: 'Módulo 1: Topologías de Redes Industriales y Ethernet en Planta',
				description: 'Arquitectura Purdue, cables apantallados, switches gestionables y protocolos de campo.',
				lessons: [
					{
						id: 'scada-les-1-1',
						title: '1.1 Modelo ISA-95 / Arquitectura Purdue y Segmentación de Redes Industriales',
						durationMinutes: 24,
						type: 'video',
						videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
						description: 'Estructura por niveles (Nivel 0 sensores, Nivel 1 PLCs, Nivel 2 SCADA, Nivel 3 Operaciones/MES, Nivel 4 Corporativo/ERP) y zona DMZ industrial.',
						keyTakeaways: [
							'Por qué nunca mezclar tráfico de oficina IT con redes de control OT en tiempo real.',
							'Diseño de zonas de seguridad y conductos según IEC 62443.',
							'Requerimientos deterministas de latencia y jitter en control de movimiento.',
						],
					},
					{
						id: 'scada-les-1-2',
						title: '1.2 Ethernet Industrial: Profinet, EtherNet/IP y Redundancia en Anillo (MRP/DLR)',
						durationMinutes: 38,
						type: 'video',
						videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
						description: 'Protocolos de capa de aplicación sobre Ethernet estándar, switches industriales gestionables y configuración de anillos redundantes con tiempos de recuperación < 50ms.',
						keyTakeaways: [
							'Diferencias entre Profinet RT (Real-Time) e IRT (Isochronous Real-Time).',
							'Configuración del protocolo MRP (Media Redundancy Protocol).',
							'VLANs para aislamiento de tráfico de control y tráfico de video/cámaras.',
						],
					},
				],
			},
			{
				id: 'scada-mod-2',
				title: 'Módulo 2: Desarrollo de Sistemas SCADA con Ignition y Servidores OPC UA',
				description: 'Arquitectura cliente-servidor, bases de datos SQL de planta, pantallas de alto rendimiento y alarmas.',
				lessons: [
					{
						id: 'scada-les-2-1',
						title: '2.1 Servidores OPC UA: Conexión Multi-Marca a PLCs Siemens, Rockwell y Schneider',
						durationMinutes: 36,
						type: 'video',
						videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
						description: 'Estándar abierto interoperable OPC Unified Architecture. Certificados de seguridad, endpoints de cifrado y árbol de nodos de variables.',
						keyTakeaways: [
							'Reemplazo de los antiguos servidores DDE y OPC DA de Windows.',
							'Suscripción por eventos e informes por excepción.',
							'Conexión segura entre servidores SCADA y controladores remotos.',
						],
					},
					{
						id: 'scada-les-2-2',
						title: '2.2 Diseño de Pantallas SCADA bajo Norma ISA-101 (High Performance HMI)',
						durationMinutes: 42,
						type: 'video',
						videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyBlazes.mp4',
						description: 'Superando los gráficos 3D sobrecargados: paletas de grises con color reservado exclusivamente para alarmas y anomalías de proceso.',
						keyTakeaways: [
							'Diseño de indicadores analógicos cualitativos (Radar y Bullet graphs).',
							'Jerarquía de 4 niveles de pantallas operativas de planta.',
							'Reducción comprobada de fatiga visual y tiempo de reacción del operador.',
						],
					},
					{
						id: 'scada-les-2-3',
						title: '2.3 Base de Datos Histórica (Historian), Tendencias y Gestión de Alarmas',
						durationMinutes: 40,
						type: 'video',
						videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4',
						description: 'Registro de variables por banda muerta (Deadband) en PostgreSQL/TimescaleDB, visualización de tendencias históricas y filosofía de alarmas ISA-18.2.',
						keyTakeaways: [
							'Evitar la inundación de alarmas (Alarm Flooding) en situaciones de emergencia.',
							'Registro de auditoría (Audit Trail) para trazabilidad de comandos de operadores.',
							'Exportación de reportes de producción por lotes (Batch).',
						],
					},
				],
			},
			{
				id: 'scada-mod-3',
				title: 'Módulo 3: Conectividad IIoT con MQTT y Ciberseguridad OT',
				description: 'Protocolos ligeros MQTT/Sparkplug B para la nube y bastionado de equipos industriales.',
				lessons: [
					{
						id: 'scada-les-3-1',
						title: '3.1 Protocolo MQTT y Sparkplug B para IIoT y Telemetría Industrial',
						durationMinutes: 32,
						type: 'video',
						videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
						description: 'Patrón Publicador/Suscriptor con brokers MQTT, payload comprimido y envío de datos eficiente a través de conexiones celulares o satelitales.',
						keyTakeaways: [
							'Ahorro del 90% en ancho de banda comparado con sondeo (polling) tradicional.',
							'Manejo de desconexiones con mensajes de Última Voluntad (LWT).',
							'Integración con plataformas analíticas en la nube (AWS IoT / Azure IoT).',
						],
					},
					{
						id: 'scada-les-3-2',
						title: '3.2 Bastionado y Ciberseguridad en Dispositivos Industriales (IEC 62443)',
						durationMinutes: 45,
						type: 'video',
						videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackSeeTheWorld.mp4',
						description: 'Protección contra amenazas en redes operativas: deshabilitación de servicios innecesarios en PLCs, firewalls industriales con inspección profunda (DPI) y accesos remotos seguros con VPNs.',
						keyTakeaways: [
							'Autenticación multifactor para acceso a ingeniería.',
							'Detección de anomalías en tráfico de red OT.',
							'Plan de respuesta a incidentes y recuperación ante desastres en planta.',
						],
					},
				],
			},
		],
	},
};

// Aliases para soportar enlaces antiguos de forma totalmente transparente
COURSES_CURRICULA['desarrollo-web-fullstack'] = COURSES_CURRICULA['programacion-plc-siemens-tia-portal'];
COURSES_CURRICULA['python-analisis-datos-ia'] = COURSES_CURRICULA['electricidad-industrial-tableros'];
COURSES_CURRICULA['diseno-ux-ui-figma'] = COURSES_CURRICULA['instrumentacion-control-procesos'];
COURSES_CURRICULA['marketing-digital-estrategia'] = COURSES_CURRICULA['scada-redes-industriales-ot'];

export function getCourseCurriculum(courseHandle: string): CourseCurriculum {
	return COURSES_CURRICULA[courseHandle] || COURSES_CURRICULA['programacion-plc-siemens-tia-portal'];
}

export function getAllLessons(curriculum: CourseCurriculum): Lesson[] {
	return curriculum.modules.flatMap((m) => m.lessons);
}
