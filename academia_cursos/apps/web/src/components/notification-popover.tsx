import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router';
import {
	Bell,
	CheckCheck,
	Flame,
	MessageSquare,
	Trophy,
	Sparkles,
	ChevronRight,
	X,
} from 'lucide-react';
import {
	getStoredNotifications,
	markNotificationAsRead,
	markAllNotificationsAsRead,
	type NotificationItem,
} from '@/lib/student-notifications';

export function NotificationPopover() {
	const [isOpen, setIsOpen] = useState(false);
	const [notifications, setNotifications] = useState<NotificationItem[]>([]);
	const popoverRef = useRef<HTMLDivElement>(null);

	function refreshNotifications() {
		setNotifications(getStoredNotifications());
	}

	useEffect(() => {
		refreshNotifications();
		const handler = () => refreshNotifications();
		window.addEventListener('impulso_notifications_change', handler);
		return () => window.removeEventListener('impulso_notifications_change', handler);
	}, []);

	// Click outside to close
	useEffect(() => {
		function handleClickOutside(event: MouseEvent) {
			if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
				setIsOpen(false);
			}
		}
		if (isOpen) {
			document.addEventListener('mousedown', handleClickOutside);
		}
		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, [isOpen]);

	const unreadCount = notifications.filter((n) => !n.isRead).length;

	function getNotificationIcon(type: NotificationItem['type']) {
		switch (type) {
			case 'tutor':
				return <MessageSquare size={16} className="text-blue-500" />;
			case 'streak':
				return <Flame size={16} className="text-orange-500" />;
			case 'certificate':
				return <Trophy size={16} className="text-amber-500" />;
			case 'system':
			default:
				return <Sparkles size={16} className="text-sky-500" />;
		}
	}

	return (
		<div className="relative" ref={popoverRef}>
			{/* Botón Campana */}
			<button
				type="button"
				onClick={() => setIsOpen(!isOpen)}
				aria-label="Notificaciones de estudio"
				className="relative p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors border border-slate-200 flex items-center justify-center cursor-pointer"
			>
				<Bell size={18} />
				{unreadCount > 0 && (
					<span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-extrabold w-4 h-4 rounded-full flex items-center justify-center ring-2 ring-white animate-pulse">
						{unreadCount}
					</span>
				)}
			</button>

			{/* Desplegable de Notificaciones */}
			{isOpen && (
				<div
					style={{ width: 360, maxWidth: '90vw' }}
					className="absolute right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-slate-200 z-50 overflow-hidden animate-fade-in"
				>
					{/* Cabecera del Popover */}
					<div className="px-4 py-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
						<div className="flex items-center gap-2">
							<span className="font-bold text-sm text-[#102a43]">Avisos de Estudio</span>
							{unreadCount > 0 && (
								<span className="bg-blue-100 text-blue-700 text-[10px] font-bold px-2 py-0.5 rounded-full">
									{unreadCount} nuevas
								</span>
							)}
						</div>

						{unreadCount > 0 && (
							<button
								type="button"
								onClick={() => markAllNotificationsAsRead()}
								className="text-[11px] font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1 cursor-pointer"
							>
								<CheckCheck size={13} /> Marcar todas
							</button>
						)}
					</div>

					{/* Lista de Notificaciones */}
					<div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
						{notifications.length === 0 ? (
							<div className="p-8 text-center text-slate-400">
								<Bell size={28} className="mx-auto mb-2 opacity-30" />
								<p className="text-xs font-semibold">No tenés notificaciones pendientes</p>
							</div>
						) : (
							notifications.map((item) => (
								<div
									key={item.id}
									onClick={() => {
										markNotificationAsRead(item.id);
									}}
									className={`p-3.5 transition-colors flex gap-3 text-left ${
										item.isRead ? 'bg-white hover:bg-slate-50 opacity-80' : 'bg-blue-50/50 hover:bg-blue-50/80 font-medium'
									}`}
								>
									<div className="mt-0.5 p-2 rounded-xl bg-white border border-slate-200 shadow-xs shrink-0 h-fit">
										{getNotificationIcon(item.type)}
									</div>

									<div className="flex-1 min-w-0">
										<div className="flex items-center justify-between gap-2">
											<h4 className="text-xs font-bold text-[#102a43] truncate">{item.title}</h4>
											<span className="text-[10px] text-slate-400 shrink-0">{item.time}</span>
										</div>
										<p className="text-xs text-slate-600 mt-1 line-clamp-2 leading-relaxed">
											{item.message}
										</p>

										{item.link && (
											<Link
												to={item.link}
												onClick={() => {
													markNotificationAsRead(item.id);
													setIsOpen(false);
												}}
												className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-600 hover:text-blue-700 mt-2"
											>
												Ver detalle <ChevronRight size={12} />
											</Link>
										)}
									</div>

									{!item.isRead && (
										<span className="w-2 h-2 rounded-full bg-blue-600 shrink-0 self-center" />
									)}
								</div>
							))
						)}
					</div>

					{/* Pie del Popover */}
					<div className="p-2.5 bg-slate-50 border-t border-slate-200 text-center">
						<Link
							to="/dashboard"
							onClick={() => setIsOpen(false)}
							className="text-[11px] font-bold text-slate-600 hover:text-blue-600"
						>
							Ir a Mi Panel de Alumno
						</Link>
					</div>
				</div>
			)}
		</div>
	);
}
