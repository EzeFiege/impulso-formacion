import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import type { Route } from './+types/dashboard';
import { getProducts, type ProductListItem } from '@/api/ecommerce-api';
import { FALLBACK_COURSES } from '@/api/mock-courses';
import { getCourseCurriculum, getAllLessons } from '@/lib/course-curricula';
import { getStoredProgress } from '@/lib/course-progress';
import {
	getStudentSession,
	saveStudentSession,
	enrollStudentInCourses,
	logoutStudent,
	type Student,
	DEFAULT_STUDENT,
} from '@/lib/student-auth';
import {
	getGamificationStats,
	type GamificationStats,
} from '@/lib/student-gamification';
import { GlobalNavbar } from '@/components/global-navbar';
import { GlobalFooter } from '@/components/global-footer';
import {
	GraduationCap,
	BookOpen,
	Award,
	Play,
	Clock,
	CheckCircle2,
	ArrowRight,
	ShoppingBag,
	User,
	LogOut,
	Sparkles,
	Layers,
	ChevronRight,
	Check,
	PlusCircle,
	Flame,
	Trophy,
	Target,
	Zap,
	HelpCircle,
	Lock,
} from 'lucide-react';

export async function loader() {
	try {
		const res = await getProducts({ limit: 12, exclude_types: 'subscription' });
		if (res.products && res.products.length > 0) {
			return { allCourses: res.products };
		}
		return { allCourses: FALLBACK_COURSES };
	} catch {
		return { allCourses: FALLBACK_COURSES };
	}
}

export function meta() {
	return [
		{ title: 'Mi Panel de Aprendizaje | Impulso Formación' },
		{ name: 'description', content: 'Panel del estudiante: revisa tus cursos, lecciones y progreso académico.' },
	];
}

export default function Dashboard({ loaderData }: Route.ComponentProps) {
	const { allCourses } = loaderData;
	const [student, setStudent] = useState<Student>(DEFAULT_STUDENT);
	const [gamification, setGamification] = useState<GamificationStats | null>(null);
	const [ready, setReady] = useState(false);
	const [editModal, setEditModal] = useState(false);
	const [tempName, setTempName] = useState('');
	const [notification, setNotification] = useState<string | null>(null);

	// Cargar sesión del estudiante y gamificación
	useEffect(() => {
		const session = getStudentSession();
		setStudent(session);
		setTempName(session.name);
		setGamification(getGamificationStats());
		setReady(true);

		const handleAuth = () => {
			setStudent(getStudentSession());
			setGamification(getGamificationStats());
		};
		const handleProgress = () => {
			setGamification(getGamificationStats());
		};

		window.addEventListener('impulso_auth_change', handleAuth);
		window.addEventListener('impulso_quiz_completed', handleProgress);
		window.addEventListener('impulso_progress_updated', handleProgress);

		return () => {
			window.removeEventListener('impulso_auth_change', handleAuth);
			window.removeEventListener('impulso_quiz_completed', handleProgress);
			window.removeEventListener('impulso_progress_updated', handleProgress);
		};
	}, []);

	function showToast(msg: string) {
		setNotification(msg);
		setTimeout(() => setNotification(null), 3500);
	}

	function handleUpdateProfile(e: React.FormEvent) {
		e.preventDefault();
		if (!tempName.trim()) return;
		const updated = { ...student, name: tempName.trim() };
		saveStudentSession(updated);
		setStudent(updated);
		setEditModal(false);
		showToast('Perfil actualizado con éxito.');
	}

	function handleEnrollCourse(handle: string) {
		enrollStudentInCourses([handle]);
		showToast('¡Te has matriculado en el curso!');
	}

	// Cursos matriculados
	const enrolledCoursesList = allCourses.filter((c) =>
		student.enrolledCourses.includes(c.url_handle) || student.enrolledCourses.includes(c.id),
	);

	// Cursos disponibles para explorar
	const otherCourses = allCourses.filter(
		(c) => !student.enrolledCourses.includes(c.url_handle) && !student.enrolledCourses.includes(c.id),
	);

	// Métricas acumuladas del alumno
	const totalCompletedLessons = enrolledCoursesList.reduce((acc, c) => {
		const prog = getStoredProgress(c.url_handle);
		return acc + prog.completedLessons.length;
	}, 0);

	const totalCertificates = enrolledCoursesList.filter((c) => {
		const curr = getCourseCurriculum(c.url_handle);
		const lessons = getAllLessons(curr);
		const prog = getStoredProgress(c.url_handle);
		return lessons.length > 0 && prog.completedLessons.length >= lessons.length;
	}).length;

	return (
		<div className="min-h-screen bg-[#f8fafc] text-[#102a43] flex flex-col font-sans">
			{/* Toast */}
			{notification && (
				<div className="fixed bottom-6 right-6 z-50 bg-[#102a43] text-white px-5 py-3 rounded-xl shadow-2xl border border-sky-400/40 text-sm flex items-center gap-3 animate-fade-in">
					<Sparkles size={18} className="text-sky-400" />
					<span>{notification}</span>
				</div>
			)}

			{/* Modal de Editar Perfil */}
			{editModal && (
				<div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
					<div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
						<h3 className="text-lg font-bold text-[#102a43] mb-4">Editar Perfil del Estudiante</h3>
						<form onSubmit={handleUpdateProfile} className="space-y-4">
							<div>
								<label className="block text-xs font-semibold text-slate-600 mb-1">Nombre Completo</label>
								<input
									type="text"
									value={tempName}
									onChange={(e) => setTempName(e.target.value)}
									className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-blue-500"
									required
								/>
							</div>
							<div>
								<label className="block text-xs font-semibold text-slate-600 mb-1">Email</label>
								<input
									type="email"
									value={student.email}
									disabled
									className="w-full px-3 py-2 border border-slate-200 bg-slate-50 text-slate-500 rounded-lg text-sm cursor-not-allowed"
								/>
							</div>
							<div className="flex justify-end gap-2 pt-2">
								<button
									type="button"
									onClick={() => setEditModal(false)}
									className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
								>
									Cancelar
								</button>
								<button
									type="submit"
									className="px-4 py-2 text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors"
								>
									Guardar Cambios
								</button>
							</div>
						</form>
					</div>
				</div>
			)}

			{/* Navbar Unificada */}
			<GlobalNavbar />

			{/* Contenido Principal del Dashboard */}
			<main className="flex-1 max-w-6xl w-full mx-auto px-4 py-8 md:py-12 space-y-10">
				{/* Cabecera del Estudiante */}
				<div className="bg-white rounded-2xl p-6 md:p-8 border border-slate-200 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
					<div className="flex items-center gap-5">
						<img
							src={student.avatar}
							alt={student.name}
							className="w-20 h-20 rounded-full object-cover border-4 border-blue-100 shadow-sm"
						/>
						<div>
							<div className="flex items-center gap-2">
								<span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-blue-100 text-blue-800">
									ALUMNO ACTIVO
								</span>
								<span className="text-xs text-slate-400">Desde enero 2026</span>
							</div>
							<h1 className="text-2xl font-bold text-[#102a43] mt-1">{student.name}</h1>
							<p className="text-xs text-slate-500">{student.email}</p>
						</div>
					</div>

					<div className="flex items-center gap-3">
						<button
							onClick={() => setEditModal(true)}
							className="px-4 py-2 rounded-lg border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors flex items-center gap-1.5"
						>
							<User size={14} /> Editar Perfil
						</button>
					</div>
				</div>

				{/* Gamificación & Racha de Estudio */}
				{gamification && (
					<div className="bg-gradient-to-br from-[#102a43] via-[#1e3a5f] to-[#0f172a] text-white rounded-2xl p-6 md:p-8 shadow-md border border-slate-700/60 flex flex-col md:flex-row items-center justify-between gap-6">
						<div className="flex-1 space-y-3 w-full">
							<div className="flex items-center gap-3 flex-wrap">
								<span className="px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-sky-300 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
									<Trophy size={14} /> Nivel {gamification.level} · {gamification.levelTitle}
								</span>
								<span className="px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400/30 text-amber-300 text-xs font-bold flex items-center gap-1.5">
									<Zap size={14} /> {gamification.xp} XP Acumulados
								</span>
							</div>

							<div>
								<div className="flex justify-between text-xs text-slate-300 mb-1.5 font-medium">
									<span>Progreso hacia el Nivel {gamification.level + 1}</span>
									<span>{gamification.xp} / {gamification.nextLevelXp} XP</span>
								</div>
								<div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden border border-slate-700">
									<div
										className="h-full bg-gradient-to-r from-blue-500 via-sky-400 to-emerald-400 rounded-full transition-all duration-500"
										style={{ width: `${Math.min(100, Math.round((gamification.xp / gamification.nextLevelXp) * 100))}%` }}
									/>
								</div>
							</div>
						</div>

						{/* Tarjeta de Racha Diaria */}
						<div className="bg-white/10 backdrop-blur-sm border border-white/15 rounded-xl p-4 md:p-5 flex items-center gap-4 shrink-0 w-full md:w-auto">
							<div className="p-3 bg-amber-500/20 text-amber-400 rounded-2xl border border-amber-400/30">
								<Flame size={32} className="animate-pulse" />
							</div>
							<div>
								<div className="text-2xl font-black text-amber-300 flex items-center gap-1.5">
									{gamification.streakDays} {gamification.streakDays === 1 ? 'Día' : 'Días'}
								</div>
								<div className="text-xs text-slate-300 font-semibold">Racha de Estudio Diaria 🔥</div>
								<div className="text-[10px] text-emerald-400 mt-0.5 font-medium">¡Estudiaste hoy! Continúa mañana</div>
							</div>
						</div>
					</div>
				)}

				{/* Métricas del Alumno */}
				<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
					<div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
						<div className="p-2 w-fit rounded-lg bg-blue-50 text-blue-600 mb-2">
							<BookOpen size={20} />
						</div>
						<div className="text-2xl font-extrabold text-[#102a43]">{enrolledCoursesList.length}</div>
						<div className="text-xs text-slate-500 font-medium">Cursos Inscriptos</div>
					</div>

					<div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
						<div className="p-2 w-fit rounded-lg bg-emerald-50 text-emerald-600 mb-2">
							<CheckCircle2 size={20} />
						</div>
						<div className="text-2xl font-extrabold text-[#102a43]">{totalCompletedLessons}</div>
						<div className="text-xs text-slate-500 font-medium">Clases Finalizadas</div>
					</div>

					<div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
						<div className="p-2 w-fit rounded-lg bg-amber-50 text-amber-600 mb-2">
							<Award size={20} />
						</div>
						<div className="text-2xl font-extrabold text-[#102a43]">{totalCertificates}</div>
						<div className="text-xs text-slate-500 font-medium">Certificados Obtenidos</div>
					</div>

					<div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
						<div className="p-2 w-fit rounded-lg bg-sky-50 text-sky-600 mb-2">
							<Clock size={20} />
						</div>
						<div className="text-2xl font-extrabold text-[#102a43]">
							{enrolledCoursesList.reduce((acc, c) => acc + (getCourseCurriculum(c.url_handle).totalHours || 0), 0)}h
						</div>
						<div className="text-xs text-slate-500 font-medium">Horas de Formación</div>
					</div>
				</div>

				{/* Sección "Mis Cursos en Progreso" */}
				<section className="space-y-4">
					<div className="flex items-center justify-between">
						<div>
							<h2 className="text-xl font-bold text-[#102a43]">Mis Cursos en Progreso</h2>
							<p className="text-xs text-slate-500">Continuá aprendiendo donde lo dejaste.</p>
						</div>
						<Link
							to="/cursos"
							className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1"
						>
							Explorar más cursos <ArrowRight size={14} />
						</Link>
					</div>

					{enrolledCoursesList.length === 0 ? (
						<div className="bg-white p-8 rounded-xl border border-slate-200 text-center space-y-3">
							<BookOpen size={40} className="mx-auto text-slate-400" />
							<p className="text-sm font-semibold text-slate-700">No estás matriculado en ningún curso todavía.</p>
							<Link
								to="/cursos"
								className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-xs font-bold"
							>
								Ver catálogo de cursos
							</Link>
						</div>
					) : (
						<div className="grid md:grid-cols-2 gap-6">
							{enrolledCoursesList.map((course, idx) => {
								const curr = getCourseCurriculum(course.url_handle);
								const allLessons = getAllLessons(curr);
								const progress = getStoredProgress(course.url_handle);
								const completedCount = progress.completedLessons.length;
								const totalCount = allLessons.length;
								const percent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
								const nextLesson = allLessons.find((l) => !progress.completedLessons.includes(l.id)) || allLessons[0];

								return (
									<div
										key={course.id}
										className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
									>
										<div className="p-6 space-y-4">
											<div className="flex justify-between items-start gap-4">
												<div>
													<span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
														{curr.level}
													</span>
													<h3 className="text-base font-bold text-[#102a43] mt-2 line-clamp-1">
														{course.title}
													</h3>
													<p className="text-xs text-slate-500 mt-1">Instructor: {curr.instructor.name}</p>
												</div>
												<span className="text-xs font-extrabold text-blue-600 shrink-0">
													{percent}%
												</span>
											</div>

											{/* Barra de progreso */}
											<div className="space-y-1.5">
												<div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
													<div
														className="bg-blue-600 h-full rounded-full transition-all duration-300"
														style={{ width: `${percent}%` }}
													/>
												</div>
												<div className="flex justify-between text-[11px] text-slate-500">
													<span>{completedCount} de {totalCount} clases finalizadas</span>
													{percent === 100 && (
														<span className="text-emerald-600 font-bold flex items-center gap-1">
															<Check size={12} /> Completado
														</span>
													)}
												</div>
											</div>
										</div>

										<div className="bg-slate-50 p-4 border-t border-slate-200 flex items-center justify-between">
											<Link
												to={`/curso/${course.url_handle}`}
												className="text-xs font-semibold text-slate-600 hover:text-slate-900"
											>
												Ver temario
											</Link>
											<Link
												to={`/curso/${course.url_handle}/aprender/${nextLesson?.id || ''}`}
												className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-lg shadow-sm transition-colors"
											>
												<Play size={13} fill="white" />
												{percent === 100 ? 'Repasar curso' : 'Continuar aprendiendo'}
											</Link>
										</div>
									</div>
								);
							})}
						</div>
					)}
				</section>

				{/* Sección de Insignias y Logros Académicos */}
				{gamification && (
					<section className="bg-white rounded-2xl p-6 md:p-8 border border-slate-200 shadow-sm space-y-6">
						<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
							<div>
								<h2 className="text-xl font-bold text-[#102a43] flex items-center gap-2">
									<Trophy className="text-amber-500" size={22} /> Insignias y Logros Académicos
								</h2>
								<p className="text-xs text-slate-500 mt-0.5">
									Desbloqueá reconocimientos completando clases, aprobando quizzes y manteniendo tu racha de estudio.
								</p>
							</div>
							<span className="text-xs font-bold px-3 py-1 bg-amber-50 text-amber-700 border border-amber-200 rounded-full w-fit">
								{gamification.badges.filter((b) => b.unlocked).length} de {gamification.badges.length} Desbloqueadas
							</span>
						</div>

						<div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
							{gamification.badges.map((badge) => (
								<div
									key={badge.id}
									className={`p-5 rounded-xl border transition-all flex flex-col justify-between ${
										badge.unlocked
											? 'bg-gradient-to-br from-amber-50/40 via-white to-white border-amber-300 shadow-sm'
											: 'bg-slate-50/60 border-slate-200 opacity-80'
									}`}
								>
									<div>
										<div className="flex items-center justify-between mb-3">
											<span className="text-3xl">{badge.icon}</span>
											{badge.unlocked ? (
												<span className="text-[10px] font-bold px-2.5 py-0.5 bg-emerald-100 text-emerald-800 rounded-full flex items-center gap-1">
													<Check size={11} /> Desbloqueada
												</span>
											) : (
												<span className="text-[10px] font-semibold px-2.5 py-0.5 bg-slate-200 text-slate-600 rounded-full flex items-center gap-1">
													<Lock size={10} /> {badge.progressPercent}%
												</span>
											)}
										</div>
										<h4 className="font-bold text-sm text-[#102a43]">{badge.title}</h4>
										<p className="text-xs text-slate-500 mt-1 leading-relaxed">{badge.description}</p>
									</div>

									{!badge.unlocked && (
										<div className="mt-4 pt-3 border-t border-slate-200/60">
											<div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
												<div
													className="h-full bg-blue-600 rounded-full transition-all duration-300"
													style={{ width: `${badge.progressPercent}%` }}
												/>
											</div>
										</div>
									)}
								</div>
							))}
						</div>
					</section>
				)}

				{/* Sección "Cursos recomendados para ampliar tu formación" */}
				{otherCourses.length > 0 && (
					<section className="space-y-4 pt-4 border-t border-slate-200">
						<div className="flex items-center justify-between">
							<div>
								<h2 className="text-xl font-bold text-[#102a43]">Cursos recomendados para tu perfil</h2>
								<p className="text-xs text-slate-500">Añadí nuevas habilidades técnicas a tu currículum.</p>
							</div>
						</div>

						<div className="grid sm:grid-cols-2 md:grid-cols-3 gap-5">
							{otherCourses.map((c) => {
								const curr = getCourseCurriculum(c.url_handle);
								return (
									<div
										key={c.id}
										className="bg-white p-5 rounded-xl border border-slate-200 flex flex-col justify-between space-y-4"
									>
										<div>
											<span className="text-[10px] font-bold text-slate-500 uppercase">
												{curr.level} · {curr.totalHours}H
											</span>
											<h4 className="text-sm font-bold text-[#102a43] mt-1 line-clamp-1">{c.title}</h4>
											<p className="text-xs text-slate-500 mt-2 line-clamp-2">
												{c.subtitle || 'Formación práctica con proyectos reales y tutoría.'}
											</p>
										</div>

										<div className="flex items-center justify-between pt-2 border-t border-slate-100">
											<span className="text-sm font-extrabold text-[#102a43]">{c.price_formatted}</span>
											<button
												onClick={() => handleEnrollCourse(c.url_handle)}
												className="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold rounded-lg transition-colors"
											>
												<PlusCircle size={14} /> Inscribirme
											</button>
										</div>
									</div>
								);
							})}
						</div>
					</section>
				)}
			</main>

			{/* Footer Unificado */}
			<GlobalFooter />
		</div>
	);
}
