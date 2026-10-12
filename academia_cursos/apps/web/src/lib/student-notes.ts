export type StudentNote = {
	id: string;
	lessonId: string;
	courseHandle: string;
	timestampSeconds: number;
	formattedTime: string;
	noteText: string;
	createdAt: string;
};

const NOTES_PREFIX = 'impulso_student_notes_';

export function formatTime(seconds: number): string {
	const mins = Math.floor(seconds / 60);
	const secs = Math.floor(seconds % 60);
	return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

export function getLessonNotes(courseHandle: string, lessonId: string): StudentNote[] {
	if (typeof window === 'undefined') return [];
	try {
		const raw = localStorage.getItem(`${NOTES_PREFIX}${courseHandle}_${lessonId}`);
		if (!raw) return [];
		return JSON.parse(raw);
	} catch {
		return [];
	}
}

export function saveLessonNote(
	courseHandle: string,
	lessonId: string,
	noteText: string,
	timestampSeconds: number,
): StudentNote {
	const newNote: StudentNote = {
		id: 'note_' + Date.now(),
		lessonId,
		courseHandle,
		timestampSeconds: Math.floor(timestampSeconds),
		formattedTime: formatTime(timestampSeconds),
		noteText: noteText.trim(),
		createdAt: new Date().toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit', hour12: false }),
	};

	if (typeof window !== 'undefined') {
		try {
			const existing = getLessonNotes(courseHandle, lessonId);
			const updated = [newNote, ...existing];
			localStorage.setItem(`${NOTES_PREFIX}${courseHandle}_${lessonId}`, JSON.stringify(updated));
		} catch (e) {
			console.error('Error guardando nota del alumno:', e);
		}
	}

	return newNote;
}

export function deleteLessonNote(courseHandle: string, lessonId: string, noteId: string): void {
	if (typeof window === 'undefined') return;
	try {
		const existing = getLessonNotes(courseHandle, lessonId);
		const filtered = existing.filter((n) => n.id !== noteId);
		localStorage.setItem(`${NOTES_PREFIX}${courseHandle}_${lessonId}`, JSON.stringify(filtered));
	} catch (e) {
		console.error('Error eliminando nota:', e);
	}
}

export function exportNotesAsMarkdown(courseTitle: string, lessonTitle: string, notes: StudentNote[]): string {
	const header = `# Notas de Estudio: ${lessonTitle}\n**Curso:** ${courseTitle}\n**Fecha:** ${new Date().toLocaleDateString('es-AR', { year: 'numeric', month: '2-digit', day: '2-digit' })}\n\n---\n\n`;
	const body = notes
		.map((n) => `### [${n.formattedTime}] - Nota\n${n.noteText}\n`)
		.join('\n');
	return header + body;
}
