export type LessonProgressState = {
	completedLessons: string[];
	lastLessonId?: string;
	updatedAt: string;
};

const PROGRESS_PREFIX = 'impulso_lms_progress_';
const QUESTIONS_PREFIX = 'impulso_lms_questions_';

export type UserQuestion = {
	id: string;
	authorName: string;
	avatar?: string;
	question: string;
	createdAt: string;
	replies?: { authorName: string; reply: string; createdAt: string }[];
};

export function getStoredProgress(courseHandle: string): LessonProgressState {
	if (typeof window === 'undefined') {
		return { completedLessons: [], updatedAt: new Date().toISOString() };
	}
	try {
		const raw = localStorage.getItem(`${PROGRESS_PREFIX}${courseHandle}`);
		if (!raw) return { completedLessons: [], updatedAt: new Date().toISOString() };
		return JSON.parse(raw);
	} catch {
		return { completedLessons: [], updatedAt: new Date().toISOString() };
	}
}

export function saveProgress(courseHandle: string, completedLessons: string[], lastLessonId?: string): void {
	if (typeof window === 'undefined') return;
	try {
		const state: LessonProgressState = {
			completedLessons,
			lastLessonId,
			updatedAt: new Date().toISOString(),
		};
		localStorage.setItem(`${PROGRESS_PREFIX}${courseHandle}`, JSON.stringify(state));
	} catch (e) {
		console.error('Error saving course progress:', e);
	}
}

export function toggleLessonCompletion(courseHandle: string, lessonId: string): { completed: boolean; completedList: string[] } {
	const current = getStoredProgress(courseHandle);
	const exists = current.completedLessons.includes(lessonId);
	const nextList = exists
		? current.completedLessons.filter((id) => id !== lessonId)
		: [...current.completedLessons, lessonId];

	saveProgress(courseHandle, nextList, lessonId);
	return { completed: !exists, completedList: nextList };
}

export function getStoredQuestions(lessonId: string): UserQuestion[] {
	if (typeof window === 'undefined') return [];
	try {
		const raw = localStorage.getItem(`${QUESTIONS_PREFIX}${lessonId}`);
		if (!raw) return [];
		return JSON.parse(raw);
	} catch {
		return [];
	}
}

export function addStoredQuestion(lessonId: string, questionText: string, authorName = 'Estudiante'): UserQuestion {
	const current = getStoredQuestions(lessonId);
	const newQuestion: UserQuestion = {
		id: 'q_' + Date.now(),
		authorName,
		question: questionText,
		createdAt: new Date().toLocaleDateString('es-AR', { hour: '2-digit', minute: '2-digit' }),
		replies: [
			{
				authorName: 'Tutor de Impulso',
				reply: '¡Excelente consulta! Este concepto se profundiza además con los ejercicios prácticos del módulo.',
				createdAt: 'Hace instantes',
			},
		],
	};
	const updated = [newQuestion, ...current];
	if (typeof window !== 'undefined') {
		try {
			localStorage.setItem(`${QUESTIONS_PREFIX}${lessonId}`, JSON.stringify(updated));
		} catch (e) {
			console.error('Error saving question:', e);
		}
	}
	return newQuestion;
}
