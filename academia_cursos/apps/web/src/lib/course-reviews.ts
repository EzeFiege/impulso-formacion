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
	'desarrollo-web-fullstack': [
		{
			id: 'rev-1',
			courseHandle: 'desarrollo-web-fullstack',
			authorName: 'Martín Paredes',
			avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80',
			rating: 5,
			date: 'Hace 3 días',
			comment:
				'Excelente curso. La explicación de React 19 y Node.js es súper clara y los proyectos finales me sirvieron para armar mi primer portafolio profesional. Conseguí mi primer empleo como dev junior.',
			verifiedBuyer: true,
		},
		{
			id: 'rev-2',
			courseHandle: 'desarrollo-web-fullstack',
			authorName: 'Sofía Benítez',
			avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80',
			rating: 5,
			date: 'Hace 1 semana',
			comment:
				'Los quizzes al final de cada módulo son clave para fijar los conceptos. El aula virtual funciona de diez y el soporte de los tutores responde rápido.',
			verifiedBuyer: true,
		},
		{
			id: 'rev-3',
			courseHandle: 'desarrollo-web-fullstack',
			authorName: 'Gonzalo Rossi',
			avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=120&q=80',
			rating: 4,
			date: 'Hace 2 semanas',
			comment:
				'Muy buen contenido práctico. Me gustó especialmente el módulo de autenticación con JWT y buenas prácticas en bases de datos.',
			verifiedBuyer: true,
		},
	],
	'python-analisis-datos-ia': [
		{
			id: 'rev-py-1',
			courseHandle: 'python-analisis-datos-ia',
			authorName: 'Valentina Castro',
			avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=120&q=80',
			rating: 5,
			date: 'Hace 5 días',
			comment:
				'La profesora explica con muchísima claridad. Pasamos de no saber nada de NumPy a manipular DataFrames complejos en pocas semanas.',
			verifiedBuyer: true,
		},
	],
	'diseno-ux-ui-figma': [
		{
			id: 'rev-ux-1',
			courseHandle: 'diseno-ux-ui-figma',
			authorName: 'Nicolás Morales',
			avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=120&q=80',
			rating: 5,
			date: 'Hace 4 días',
			comment:
				'El módulo de Auto Layout y sistemas de diseño en Figma vale cada centavo. Mis prototipos ahora se ven profesionales y limpios.',
			verifiedBuyer: true,
		},
	],
	'marketing-digital-estrategia': [
		{
			id: 'rev-mkt-1',
			courseHandle: 'marketing-digital-estrategia',
			authorName: 'Carla Villalba',
			avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80',
			rating: 5,
			date: 'Hace 6 días',
			comment:
				'Estrategias muy actuales de Meta Ads y Google Ads. Pude duplicar el retorno de inversión en las campañas de mi emprendimiento.',
			verifiedBuyer: true,
		},
	],
};

export function getCourseReviews(courseHandle: string): CourseReview[] {
	const initial = INITIAL_REVIEWS[courseHandle] || INITIAL_REVIEWS['desarrollo-web-fullstack'] || [];
	if (typeof window === 'undefined') return initial;

	try {
		const raw = localStorage.getItem(`${REVIEWS_STORAGE_PREFIX}${courseHandle}`);
		if (!raw) return initial;
		const userAdded: CourseReview[] = JSON.parse(raw);
		return [...userAdded, ...initial];
	} catch {
		return initial;
	}
}

export function addCourseReview(
	courseHandle: string,
	review: { authorName: string; rating: number; comment: string },
): CourseReview {
	const newReview: CourseReview = {
		id: 'rev_' + Date.now(),
		courseHandle,
		authorName: review.authorName.trim() || 'Estudiante',
		rating: Math.min(5, Math.max(1, review.rating)),
		date: 'Recién publicado',
		comment: review.comment.trim(),
		verifiedBuyer: true,
	};

	if (typeof window !== 'undefined') {
		try {
			const raw = localStorage.getItem(`${REVIEWS_STORAGE_PREFIX}${courseHandle}`);
			const existing: CourseReview[] = raw ? JSON.parse(raw) : [];
			localStorage.setItem(`${REVIEWS_STORAGE_PREFIX}${courseHandle}`, JSON.stringify([newReview, ...existing]));
			window.dispatchEvent(new Event('impulso_reviews_updated'));
		} catch (e) {
			console.error('Error guardando reseña:', e);
		}
	}

	return newReview;
}

export function getCourseRatingSummary(courseHandle: string): { average: number; count: number } {
	const reviews = getCourseReviews(courseHandle);
	if (reviews.length === 0) return { average: 5.0, count: 0 };
	const total = reviews.reduce((acc, r) => acc + r.rating, 0);
	const avg = Number((total / reviews.length).toFixed(1));
	return { average: avg, count: reviews.length };
}
