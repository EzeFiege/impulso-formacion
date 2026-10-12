export type CourseReview = {
	id: string;
	courseHandle: string;
	authorName: string;
	avatar?: string;
	rating: number; // 1 to 5
	date: string;
	comment: string;
	verifiedBuyer: boolean;
};

const REVIEWS_STORAGE_PREFIX = 'impulso_reviews_';

export const INITIAL_REVIEWS: Record<string, CourseReview[]> = {
	'programacion-plc-siemens-tia-portal': [
		{
			id: 'rev-1',
			courseHandle: 'programacion-plc-siemens-tia-portal',
			authorName: 'Ing. Javier Morales',
			avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80',
			rating: 5,
			date: 'Hace 3 días',
			comment:
				'La explicación de Bloques FB con memoria de instancia y la programación en Texto Estructurado (SCL) es impecable. Pudimos modernizar el control de una envasadora en planta en tiempo récord.',
			verifiedBuyer: true,
		},
		{
			id: 'rev-2',
			courseHandle: 'programacion-plc-siemens-tia-portal',
			authorName: 'Tec. Lucas Benítez',
			avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80',
			rating: 5,
			date: 'Hace 1 semana',
			comment:
				'Los ejercicios prácticos con el simulador PLC-SIM y las pantallas HMI WinCC son excelentes. Me sirvió para conseguir empleo en una integradora de automatización industrial.',
			verifiedBuyer: true,
		},
		{
			id: 'rev-3',
			courseHandle: 'programacion-plc-siemens-tia-portal',
			authorName: 'Gonzalo Rossi',
			avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=120&q=80',
			rating: 5,
			date: 'Hace 2 semanas',
			comment:
				'Muy completo el módulo de comunicación Modbus TCP y diagnóstico de fallas con el buffer de la CPU. Excelente soporte de los tutores.',
			verifiedBuyer: true,
		},
	],
	'electricidad-industrial-tableros': [
		{
			id: 'rev-elec-1',
			courseHandle: 'electricidad-industrial-tableros',
			authorName: 'Marcelo Peralta',
			avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=120&q=80',
			rating: 5,
			date: 'Hace 5 días',
			comment:
				'La lectura de planos bajo norma IEC y el cálculo de protecciones según curvas de disparo termomagnéticas y selectividad me vino de diez para armar tableros en el taller.',
			verifiedBuyer: true,
		},
	],
	'instrumentacion-control-procesos': [
		{
			id: 'rev-inst-1',
			courseHandle: 'instrumentacion-control-procesos',
			authorName: 'Laura Domínguez',
			avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80',
			rating: 5,
			date: 'Hace 4 días',
			comment:
				'La sintonía de lazos PID y el conexionado del lazo 4-20mA con comunicador HART es súper clara y aplicable a situaciones reales de planta.',
			verifiedBuyer: true,
		},
	],
	'scada-redes-industriales-ot': [
		{
			id: 'rev-scada-1',
			courseHandle: 'scada-redes-industriales-ot',
			authorName: 'Diego Fernández',
			avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80',
			rating: 5,
			date: 'Hace 6 días',
			comment:
				'Excelente enfoque en la arquitectura Purdue y la ciberseguridad industrial bajo norma IEC 62443. Indispensable para conectar IT con OT de forma segura.',
			verifiedBuyer: true,
		},
	],
};

// Aliases para soportar consultas sobre cursos antiguos
INITIAL_REVIEWS['desarrollo-web-fullstack'] = INITIAL_REVIEWS['programacion-plc-siemens-tia-portal'];
INITIAL_REVIEWS['python-analisis-datos-ia'] = INITIAL_REVIEWS['electricidad-industrial-tableros'];
INITIAL_REVIEWS['diseno-ux-ui-figma'] = INITIAL_REVIEWS['instrumentacion-control-procesos'];
INITIAL_REVIEWS['marketing-digital-estrategia'] = INITIAL_REVIEWS['scada-redes-industriales-ot'];

export function getCourseReviews(courseHandle: string): CourseReview[] {
	try {
		const raw = localStorage.getItem(`${REVIEWS_STORAGE_PREFIX}${courseHandle}`);
		if (raw) {
			const parsed = JSON.parse(raw);
			if (Array.isArray(parsed) && parsed.length > 0) return parsed;
		}
	} catch (e) {
		console.warn('Error leyendo reseñas guardadas:', e);
	}

	const initial = INITIAL_REVIEWS[courseHandle] || INITIAL_REVIEWS['programacion-plc-siemens-tia-portal'] || [];
	return initial;
}

export function addCourseReview(
	courseHandle: string,
	reviewData: Omit<CourseReview, 'id' | 'date' | 'verifiedBuyer' | 'courseHandle'>,
): CourseReview {
	const current = getCourseReviews(courseHandle);
	const newReview: CourseReview = {
		id: `rev-${Date.now()}`,
		courseHandle,
		authorName: reviewData.authorName,
		rating: reviewData.rating,
		comment: reviewData.comment,
		avatar: reviewData.avatar,
		date: 'Recién publicado',
		verifiedBuyer: true,
	};

	const updated = [newReview, ...current];
	try {
		localStorage.setItem(`${REVIEWS_STORAGE_PREFIX}${courseHandle}`, JSON.stringify(updated));
		window.dispatchEvent(new CustomEvent('impulso_reviews_change', { detail: { courseHandle } }));
	} catch (e) {
		console.warn('Error guardando reseña:', e);
	}

	return newReview;
}

export function getAverageRating(reviews: CourseReview[]): { average: number; total: number; count: number } {
	if (!reviews || reviews.length === 0) return { average: 5.0, total: 0, count: 0 };
	const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
	return {
		average: Number((sum / reviews.length).toFixed(1)),
		total: reviews.length,
		count: reviews.length,
	};
}

export function getCourseRatingSummary(courseHandle: string): { average: number; total: number; count: number } {
	const revs = getCourseReviews(courseHandle);
	return getAverageRating(revs);
}
