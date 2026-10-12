export type Student = {
	id: string;
	name: string;
	email: string;
	avatar: string;
	enrolledCourses: string[];
	joinedDate: string;
};

const STUDENT_SESSION_KEY = 'impulso_student_session';

export const DEFAULT_STUDENT: Student = {
	id: 'std_01',
	name: 'Alex González',
	email: 'alex.gonzalez@impulso.edu',
	avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
	enrolledCourses: ['desarrollo-web-fullstack'],
	joinedDate: '2026-01-15',
};

export function getStudentSession(): Student {
	if (typeof window === 'undefined') {
		return DEFAULT_STUDENT;
	}
	try {
		const raw = localStorage.getItem(STUDENT_SESSION_KEY);
		if (!raw) {
			localStorage.setItem(STUDENT_SESSION_KEY, JSON.stringify(DEFAULT_STUDENT));
			return DEFAULT_STUDENT;
		}
		return JSON.parse(raw);
	} catch {
		return DEFAULT_STUDENT;
	}
}

export function saveStudentSession(student: Student): void {
	if (typeof window === 'undefined') return;
	try {
		localStorage.setItem(STUDENT_SESSION_KEY, JSON.stringify(student));
		window.dispatchEvent(new Event('impulso_auth_change'));
	} catch (e) {
		console.error('Error guardando sesión de estudiante:', e);
	}
}

export function enrollStudentInCourses(courseHandles: string[]): Student {
	const current = getStudentSession();
	const uniqueHandles = Array.from(new Set([...current.enrolledCourses, ...courseHandles]));
	const updated: Student = {
		...current,
		enrolledCourses: uniqueHandles,
	};
	saveStudentSession(updated);
	return updated;
}

export function loginStudent(name: string, email: string): Student {
	const current = getStudentSession();
	const updated: Student = {
		...current,
		name: name.trim() || 'Estudiante Impulso',
		email: email.trim() || 'alumno@impulso.edu',
	};
	saveStudentSession(updated);
	return updated;
}

export function logoutStudent(): void {
	if (typeof window === 'undefined') return;
	try {
		localStorage.removeItem(STUDENT_SESSION_KEY);
		window.dispatchEvent(new Event('impulso_auth_change'));
	} catch (e) {
		console.error('Error cerrando sesión:', e);
	}
}
