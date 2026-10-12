export type NotificationType = 'tutor' | 'streak' | 'certificate' | 'system';

export type NotificationItem = {
	id: string;
	type: NotificationType;
	title: string;
	message: string;
	time: string;
	isRead: boolean;
	link?: string;
};

const STORAGE_KEY = 'impulso_student_notifications';

export const DEFAULT_NOTIFICATIONS: NotificationItem[] = [
	{
		id: 'notif-1',
		type: 'tutor',
		title: 'Respuesta del tutor en tu consulta',
		message: 'El Ing. Lucas Ferrero respondió a tu duda sobre "Promesas y Async/Await en React".',
		time: 'Hace 20 min',
		isRead: false,
		link: '/curso/desarrollo-web-fullstack/aprender',
	},
	{
		id: 'notif-2',
		type: 'streak',
		title: '¡Mantené tu racha activa! 🔥',
		message: 'Llevas 4 días consecutivos aprendiendo. Completá una clase hoy para sumar 50 XP extra.',
		time: 'Hace 2 horas',
		isRead: false,
		link: '/dashboard',
	},
	{
		id: 'notif-3',
		type: 'certificate',
		title: 'Nueva insignia desbloqueada 🏆',
		message: 'Alcanzaste el 100% en el módulo de Frontend Moderno y obtuviste la medalla "Master React".',
		time: 'Ayer',
		isRead: true,
		link: '/verificar-certificado',
	},
	{
		id: 'notif-4',
		type: 'system',
		title: 'Nuevo proyecto práctico disponible',
		message: 'Hemos agregado el desafío de clon de Trello con Drag & Drop en el catálogo.',
		time: 'Hace 3 días',
		isRead: true,
		link: '/cursos',
	},
];

export function getStoredNotifications(): NotificationItem[] {
	if (typeof window === 'undefined') return DEFAULT_NOTIFICATIONS;
	try {
		const raw = localStorage.getItem(STORAGE_KEY);
		if (!raw) {
			localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_NOTIFICATIONS));
			return DEFAULT_NOTIFICATIONS;
		}
		const parsed = JSON.parse(raw);
		return Array.isArray(parsed) ? parsed : DEFAULT_NOTIFICATIONS;
	} catch {
		return DEFAULT_NOTIFICATIONS;
	}
}

export function markNotificationAsRead(id: string): NotificationItem[] {
	const current = getStoredNotifications();
	const updated = current.map((item) => (item.id === id ? { ...item, isRead: true } : item));
	localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
	window.dispatchEvent(new Event('impulso_notifications_change'));
	return updated;
}

export function markAllNotificationsAsRead(): NotificationItem[] {
	const current = getStoredNotifications();
	const updated = current.map((item) => ({ ...item, isRead: true }));
	localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
	window.dispatchEvent(new Event('impulso_notifications_change'));
	return updated;
}

export function addStudentNotification(
	item: Omit<NotificationItem, 'id' | 'isRead' | 'time'> & { time?: string },
): NotificationItem[] {
	const current = getStoredNotifications();
	const newItem: NotificationItem = {
		id: `notif-${Date.now()}`,
		isRead: false,
		time: item.time || 'Reciente',
		...item,
	};
	const updated = [newItem, ...current];
	localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
	window.dispatchEvent(new Event('impulso_notifications_change'));
	return updated;
}
