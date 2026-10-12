import { getStoredProgress } from './course-progress';
import { getPassedQuizzesCount } from './course-quizzes';

export type BadgeId = 'first_lesson' | 'perfect_quiz' | 'study_streak' | 'note_taker' | 'graduate';

export type AchievementBadge = {
	id: BadgeId;
	title: string;
	description: string;
	icon: string;
	category: 'progreso' | 'calidad' | 'constancia' | 'certificacion';
	unlocked: boolean;
	unlockedAt?: string;
	progressPercent: number;
};

export type GamificationStats = {
	xp: number;
	level: number;
	levelTitle: string;
	nextLevelXp: number;
	streakDays: number;
	streakActiveToday: boolean;
	badges: AchievementBadge[];
	lessonsCompletedCount: number;
	quizzesPassedCount: number;
};

const GAMIFICATION_STORAGE_KEY = 'impulso_gamification_state';

const LEVELS = [
	{ level: 1, minXp: 0, maxXp: 300, title: 'Estudiante Novato' },
	{ level: 2, minXp: 300, maxXp: 800, title: 'Aprendiz Comprometido' },
	{ level: 3, minXp: 800, maxXp: 1800, title: 'Desarrollador en Ascenso' },
	{ level: 4, minXp: 1800, maxXp: 3200, title: 'Especialista Técnico' },
	{ level: 5, minXp: 3200, maxXp: 5000, title: 'Maestro Académico' },
];

export function getGamificationStats(): GamificationStats {
	if (typeof window === 'undefined') {
		return getDefaultStats();
	}

	try {
		// 1. Calcular lecciones completadas a través de los cursos principales
		const courseHandles = [
			'desarrollo-web-fullstack',
			'python-analisis-datos-ia',
			'diseno-ux-ui-figma',
			'marketing-digital-estrategia',
		];

		let totalCompletedLessons = 0;
		let hasFinishedAnyCourse = false;

		courseHandles.forEach((handle) => {
			const prog = getStoredProgress(handle);
			totalCompletedLessons += prog.completedLessons.length;
			if (prog.completedLessons.length >= 8) {
				hasFinishedAnyCourse = true;
			}
		});

		// 2. Quizzes aprobados
		let totalQuizzesPassed = 0;
		courseHandles.forEach((handle) => {
			totalQuizzesPassed += getPassedQuizzesCount(handle);
		});

		// 3. Notas tomadas
		let totalNotesCount = 0;
		for (let i = 0; i < localStorage.length; i++) {
			const key = localStorage.key(i);
			if (key && key.startsWith('impulso_notes_')) {
				try {
					const notesArr = JSON.parse(localStorage.getItem(key) || '[]');
					totalNotesCount += notesArr.length;
				} catch {
					// ignore
				}
			}
		}

		// 4. Calcular Racha diaria (Streak)
		let streakDays = 1;
		let streakActiveToday = true;
		const todayStr = new Date().toISOString().split('T')[0];

		const savedRaw = localStorage.getItem(GAMIFICATION_STORAGE_KEY);
		let lastActiveDate = todayStr;

		if (savedRaw) {
			const saved = JSON.parse(savedRaw);
			streakDays = saved.streakDays || 1;
			lastActiveDate = saved.lastActiveDate || todayStr;

			// Comprobar diferencia en días
			const todayMs = new Date(todayStr).getTime();
			const lastMs = new Date(lastActiveDate).getTime();
			const diffDays = Math.round((todayMs - lastMs) / (1000 * 60 * 60 * 24));

			if (diffDays === 0) {
				streakActiveToday = true;
			} else if (diffDays === 1) {
				streakDays += 1;
				streakActiveToday = true;
				lastActiveDate = todayStr;
			} else if (diffDays > 1) {
				streakDays = 1;
				streakActiveToday = true;
				lastActiveDate = todayStr;
			}
		}

		// Guardar estado actualizado
		localStorage.setItem(
			GAMIFICATION_STORAGE_KEY,
			JSON.stringify({ streakDays, lastActiveDate, updatedAt: Date.now() }),
		);

		// 5. Calcular Puntos XP: 50 XP por clase, 150 XP por quiz, 30 XP por nota
		const xp = totalCompletedLessons * 50 + totalQuizzesPassed * 150 + totalNotesCount * 30 + (streakDays > 1 ? streakDays * 40 : 50);

		// 6. Nivel
		const currentLevelObj =
			LEVELS.find((l) => xp >= l.minXp && xp < l.maxXp) || LEVELS[LEVELS.length - 1];

		// 7. Insignias
		const badges: AchievementBadge[] = [
			{
				id: 'first_lesson',
				title: 'Primer Paso',
				description: 'Completaste tu primera clase interactiva con éxito.',
				icon: '🎯',
				category: 'progreso',
				unlocked: totalCompletedLessons >= 1,
				progressPercent: Math.min(100, Math.round((totalCompletedLessons / 1) * 100)),
			},
			{
				id: 'perfect_quiz',
				title: 'Mente Brillante',
				description: 'Aprobaste una evaluación interactiva de módulo.',
				icon: '🧠',
				category: 'calidad',
				unlocked: totalQuizzesPassed >= 1,
				progressPercent: Math.min(100, Math.round((totalQuizzesPassed / 1) * 100)),
			},
			{
				id: 'study_streak',
				title: 'Racha Imparable',
				description: 'Mantuviste una racha de estudio diaria constante.',
				icon: '🔥',
				category: 'constancia',
				unlocked: streakDays >= 2,
				progressPercent: Math.min(100, Math.round((streakDays / 2) * 100)),
			},
			{
				id: 'note_taker',
				title: 'Apuntador Pro',
				description: 'Tomaste notas de estudio sincronizadas con el video.',
				icon: '📝',
				category: 'progreso',
				unlocked: totalNotesCount >= 2,
				progressPercent: Math.min(100, Math.round((totalNotesCount / 2) * 100)),
			},
			{
				id: 'graduate',
				title: 'Graduado de Honor',
				description: 'Completaste todas las clases y aprobaste los exámenes del curso.',
				icon: '🏆',
				category: 'certificacion',
				unlocked: hasFinishedAnyCourse || totalCompletedLessons >= 6,
				progressPercent: Math.min(100, Math.round((totalCompletedLessons / 6) * 100)),
			},
		];

		return {
			xp,
			level: currentLevelObj.level,
			levelTitle: currentLevelObj.title,
			nextLevelXp: currentLevelObj.maxXp,
			streakDays,
			streakActiveToday,
			badges,
			lessonsCompletedCount: totalCompletedLessons,
			quizzesPassedCount: totalQuizzesPassed,
		};
	} catch (e) {
		console.error('Error calculando gamificación:', e);
		return getDefaultStats();
	}
}

function getDefaultStats(): GamificationStats {
	return {
		xp: 150,
		level: 1,
		levelTitle: 'Estudiante Novato',
		nextLevelXp: 300,
		streakDays: 1,
		streakActiveToday: true,
		badges: [
			{
				id: 'first_lesson',
				title: 'Primer Paso',
				description: 'Completaste tu primera clase interactiva con éxito.',
				icon: '🎯',
				category: 'progreso',
				unlocked: true,
				progressPercent: 100,
			},
			{
				id: 'perfect_quiz',
				title: 'Mente Brillante',
				description: 'Aprobaste una evaluación interactiva de módulo.',
				icon: '🧠',
				category: 'calidad',
				unlocked: false,
				progressPercent: 50,
			},
			{
				id: 'study_streak',
				title: 'Racha Imparable',
				description: 'Mantuviste una racha de estudio diaria constante.',
				icon: '🔥',
				category: 'constancia',
				unlocked: true,
				progressPercent: 100,
			},
			{
				id: 'note_taker',
				title: 'Apuntador Pro',
				description: 'Tomaste notas de estudio sincronizadas con el video.',
				icon: '📝',
				category: 'progreso',
				unlocked: false,
				progressPercent: 0,
			},
			{
				id: 'graduate',
				title: 'Graduado de Honor',
				description: 'Completaste todas las clases y aprobaste los exámenes del curso.',
				icon: '🏆',
				category: 'certificacion',
				unlocked: false,
				progressPercent: 40,
			},
		],
		lessonsCompletedCount: 2,
		quizzesPassedCount: 1,
	};
}
