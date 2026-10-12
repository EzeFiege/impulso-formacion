import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router';
import type { Route } from './+types/classroom';
import { getProductByHandle, type ProductListItem } from '@/api/ecommerce-api';
import { FALLBACK_COURSES } from '@/api/mock-courses';
import {
	getCourseCurriculum,
	getAllLessons,
	type Lesson,
} from '@/lib/course-curricula';
import {
	getStoredProgress,
	toggleLessonCompletion,
	getStoredQuestions,
	addStoredQuestion,
	type UserQuestion,
} from '@/lib/course-progress';
import {
	getQuizzesForCourse,
	getStoredQuizResult,
	areAllCourseQuizzesPassed,
	getFinalCertificationExam,
	hasPassedFinalHonorsExam,
	type CourseQuiz,
} from '@/lib/course-quizzes';
import {
	getLessonNotes,
	saveLessonNote,
	deleteLessonNote,
	exportNotesAsMarkdown,
	formatTime,
	type StudentNote,
} from '@/lib/student-notes';
import { getLessonResources, downloadMockFile } from '@/lib/lesson-resources';
import { InteractiveQuiz } from '@/components/interactive-quiz';
import {
	Play,
	CheckCircle2,
	Circle,
	ChevronLeft,
	ChevronRight,
	Menu,
	X,
	Award,
	FileText,
	Download,
	MessageSquare,
	Sparkles,
	Clock,
	User,
	Printer,
	Check,
	ArrowLeft,
	GraduationCap,
	HelpCircle,
	StickyNote,
	Trash2,
	ExternalLink,
} from 'lucide-react';

export async function loader({ params }: Route.LoaderArgs) {
	const handle = params.handle || 'programacion-plc-siemens-tia-portal';
	let course: ProductListItem;

	try {
		course = await getProductByHandle(handle);
	} catch {
		const fallback =
			FALLBACK_COURSES.find((c) => c.url_handle === handle || c.id === handle) ||
			FALLBACK_COURSES[0];
		course = fallback;
	}

	const curriculum = getCourseCurriculum(course.url_handle);
	const allLessons = getAllLessons(curriculum);

	// Determinar lección activa
	const requestedLessonId = params.lessonId;
	const activeLesson =
		allLessons.find((l) => l.id === requestedLessonId) || allLessons[0];

	return {
		course,
		curriculum,
		activeLessonId: activeLesson ? activeLesson.id : allLessons[0]?.id,
	};
}

export function meta({ loaderData }: Route.MetaArgs) {
	if (!loaderData) {
		return [{ title: 'Aula Virtual | Impulso Formación' }];
	}
	const { course, curriculum, activeLessonId } = loaderData;
	const all = getAllLessons(curriculum);
	const active = all.find((l) => l.id === activeLessonId) || all[0];
	return [
		{ title: `${active ? active.title : 'Clase'} · ${course.title} | Impulso LMS` },
		{ name: 'description', content: active?.description || 'Aula virtual de aprendizaje.' },
		{ name: 'robots', content: 'noindex' },
	];
}

export default function Classroom({ loaderData }: Route.ComponentProps) {
	const { course, curriculum, activeLessonId } = loaderData;
	const navigate = useNavigate();
	const videoRef = useRef<HTMLVideoElement | null>(null);

	const allLessons = useMemo(() => getAllLessons(curriculum), [curriculum]);
	const currentLessonIndex = allLessons.findIndex((l) => l.id === activeLessonId);
	const activeLesson: Lesson = allLessons[currentLessonIndex] || allLessons[0];

	const prevLesson = currentLessonIndex > 0 ? allLessons[currentLessonIndex - 1] : null;
	const nextLesson =
		currentLessonIndex < allLessons.length - 1 ? allLessons[currentLessonIndex + 1] : null;

	// Quizzes del curso
	const courseQuizzes = useMemo(() => getQuizzesForCourse(course.url_handle), [course.url_handle]);

	// Identificar a qué módulo pertenece la lección activa
	const currentModule = useMemo(() => {
		return (
			curriculum.modules.find((m) => m.lessons.some((l) => l.id === activeLesson.id)) ||
			curriculum.modules[0]
		);
	}, [curriculum.modules, activeLesson.id]);

	const currentModuleQuiz = useMemo(() => {
		return courseQuizzes.find((q) => q.moduleId === currentModule.id) || courseQuizzes[0];
	}, [courseQuizzes, currentModule.id]);

	const lessonResources = useMemo(() => {
		return getLessonResources(course.url_handle, activeLesson.id, activeLesson.title);
	}, [course.url_handle, activeLesson.id, activeLesson.title]);

	// Estado local de progreso, notas y examen
	const [completedLessons, setCompletedLessons] = useState<string[]>([]);
	const [sidebarOpen, setSidebarOpen] = useState(true);
	const [activeTab, setActiveTab] = useState<'overview' | 'resources' | 'community' | 'tutor' | 'quiz' | 'notes'>('overview');
	const [activeQuiz, setActiveQuiz] = useState<CourseQuiz>(currentModuleQuiz);
	const [questions, setQuestions] = useState<UserQuestion[]>([]);
	const [newQuestionText, setNewQuestionText] = useState('');
	const [notes, setNotes] = useState<StudentNote[]>([]);
	const [newNoteText, setNewNoteText] = useState('');
	const [currentVideoTime, setCurrentVideoTime] = useState(0);
	const [showCertificate, setShowCertificate] = useState(false);
	const [studentName, setStudentName] = useState('Alex González');
	const [notification, setNotification] = useState<string | null>(null);
	const [quizzesUpdateCounter, setQuizzesUpdateCounter] = useState(0);

	// Actualizar quiz al cambiar de lección/módulo
	useEffect(() => {
		if (currentModuleQuiz) {
			setActiveQuiz(currentModuleQuiz);
		}
	}, [currentModuleQuiz]);

	// Cargar progreso y notas del alumno al montar
	useEffect(() => {
		const progress = getStoredProgress(course.url_handle);
		setCompletedLessons(progress.completedLessons);
		const storedQuestions = getStoredQuestions(activeLesson.id);
		setQuestions(storedQuestions);
		const storedNotes = getLessonNotes(course.url_handle, activeLesson.id);
		setNotes(storedNotes);

		const handleQuizComplete = () => {
			setQuizzesUpdateCounter((c) => c + 1);
		};
		window.addEventListener('impulso_quiz_completed', handleQuizComplete);
		return () => window.removeEventListener('impulso_quiz_completed', handleQuizComplete);
	}, [course.url_handle, activeLesson.id]);

	// Calcular porcentaje completado
	const progressPercentage = Math.round(
		allLessons.length > 0 ? (completedLessons.length / allLessons.length) * 100 : 0,
	);
	const isCurrentCompleted = completedLessons.includes(activeLesson.id);

	// Estado de aprobación de todos los exámenes
	const allQuizzesPassed = useMemo(() => {
		if (quizzesUpdateCounter < 0) return false;
		return areAllCourseQuizzesPassed(course.url_handle);
	}, [course.url_handle, quizzesUpdateCounter]);

	const hasHonors = useMemo(() => {
		if (quizzesUpdateCounter < 0) return false;
		return hasPassedFinalHonorsExam(course.url_handle);
	}, [course.url_handle, quizzesUpdateCounter]);

	function showToast(msg: string) {
		setNotification(msg);
		setTimeout(() => setNotification(null), 3500);
	}

	function handleToggleComplete() {
		const { completed, completedList } = toggleLessonCompletion(course.url_handle, activeLesson.id);
		setCompletedLessons(completedList);
		if (completed) {
			showToast('¡Felicitaciones! Lección marcada como completada.');
			if (completedList.length === allLessons.length) {
				setTimeout(() => setShowCertificate(true), 600);
			}
		} else {
			showToast('Lección marcada como pendiente.');
		}
	}

	function handleAddQuestion(e: React.FormEvent) {
		e.preventDefault();
		if (!newQuestionText.trim()) return;
		const created = addStoredQuestion(activeLesson.id, newQuestionText.trim(), studentName);
		setQuestions((prev) => [created, ...prev]);
		setNewQuestionText('');
		showToast('Pregunta enviada a la comunidad y al tutor.');
	}

	function handleSaveNote(e: React.FormEvent) {
		e.preventDefault();
		if (!newNoteText.trim()) return;
		const created = saveLessonNote(course.url_handle, activeLesson.id, newNoteText.trim(), currentVideoTime);
		setNotes((prev) => [created, ...prev]);
		setNewNoteText('');
		showToast(`Nota guardada en el segundo ${formatTime(currentVideoTime)}`);
	}

	function handleDeleteNote(noteId: string) {
		deleteLessonNote(course.url_handle, activeLesson.id, noteId);
		setNotes((prev) => prev.filter((n) => n.id !== noteId));
		showToast('Nota eliminada.');
	}

	function jumpToTime(seconds: number) {
		if (videoRef.current) {
			videoRef.current.currentTime = seconds;
			videoRef.current.play();
			showToast(`Reproduciendo desde ${formatTime(seconds)}`);
		}
	}

	function handleDownloadNotes() {
		if (notes.length === 0) return;
		const md = exportNotesAsMarkdown(course.title, activeLesson.title, notes);
		const blob = new Blob([md], { type: 'text/markdown;charset=utf-8' });
		const url = URL.createObjectURL(blob);
		const a = document.createElement('a');
		a.href = url;
		a.download = `Notas_${activeLesson.id}.md`;
		a.click();
		URL.revokeObjectURL(url);
		showToast('Archivo de notas descargado en Markdown.');
	}

	function goToLesson(lesson: Lesson) {
		setActiveTab('overview');
		navigate(`/curso/${course.url_handle}/aprender/${lesson.id}`);
	}

	function openQuiz(quiz: CourseQuiz) {
		setActiveQuiz(quiz);
		setActiveTab('quiz');
	}

	return (
		<div className="min-h-screen bg-[#0a0f1d] text-slate-100 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
			{/* Toast flotante */}
			{notification && (
				<div className="fixed bottom-6 right-6 z-50 bg-blue-600 text-white px-4 py-3 rounded-lg shadow-xl shadow-blue-900/50 flex items-center gap-3 animate-fade-in border border-blue-400/30 text-sm font-medium">
					<Sparkles size={18} className="text-sky-300" />
					<span>{notification}</span>
				</div>
			)}

			{/* Modal de Certificado */}
			{showCertificate && (
				<div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
					<div className="bg-[#101828] border border-slate-700/80 rounded-2xl max-w-2xl w-full p-8 shadow-2xl relative animate-scale-up">
						<button
							onClick={() => setShowCertificate(false)}
							className="absolute top-5 right-5 text-slate-400 hover:text-white transition-colors p-1"
							aria-label="Cerrar modal"
						>
							<X size={22} />
						</button>

						<div className="text-center space-y-4">
							<div className="inline-flex p-3 bg-amber-500/10 border border-amber-500/30 rounded-2xl text-amber-400 mb-2">
								<Award size={48} />
							</div>

							{allQuizzesPassed && progressPercentage === 100 ? (
								<>
									<h3 className="text-2xl font-bold text-white tracking-tight">
										¡Certificado Oficial de Logro Académico!
									</h3>
									<p className="text-slate-300 text-sm max-w-lg mx-auto">
										Has completado con éxito todas las lecciones y <strong>aprobaste las evaluaciones interactivas</strong> en <strong>Impulso Formación</strong>.
									</p>
								</>
							) : (
								<>
									<h3 className="text-2xl font-bold text-amber-400 tracking-tight">
										Progreso de Certificación en Curso
									</h3>
									<p className="text-slate-300 text-sm max-w-lg mx-auto">
										{!allQuizzesPassed
											? 'Has avanzado en las clases, pero aún tenés evaluaciones de módulo pendientes de aprobar para validar tu diploma oficial con honores.'
											: `Te falta completar ${allLessons.length - completedLessons.length} lecciones para alcanzar el 100%.`}
									</p>
								</>
							)}

							{/* Vista previa del Certificado imprimible */}
							<div className="my-6 p-8 rounded-xl bg-gradient-to-br from-slate-900 to-slate-950 border-2 border-amber-500/40 text-center relative overflow-hidden shadow-inner">
								<div className="absolute top-3 left-3 text-[10px] tracking-widest text-amber-500/80 uppercase font-semibold">
									IMPULSO · CERTIFICADO DIGITAL DE LOGRO
								</div>
								<div className="text-xs text-slate-400 uppercase tracking-widest mt-4">Se otorga a:</div>
								<div className="text-2xl font-extrabold text-amber-400 tracking-wide my-2">
									{studentName}
								</div>
								<div className="text-xs text-slate-400">Por haber acreditado satisfactoriamente el curso:</div>
								<div className="text-lg font-bold text-white mt-1 mb-2">{course.title}</div>
								{hasHonors && (
									<div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-extrabold bg-amber-500/20 text-amber-300 border border-amber-400/50 uppercase tracking-wider mb-4">
										<Sparkles size={13} /> MENCIÓN DE HONOR ACADÉMICA · EXCELENCIA
									</div>
								)}
								<div className="flex justify-between items-end border-t border-slate-800 pt-4 text-[11px] text-slate-400">
									<div>
										<div className="text-white font-medium">{curriculum.instructor.name}</div>
										<div className="text-slate-500 text-[10px]">Tutor Principal</div>
									</div>
									<div className="text-right">
										<div>{new Date().toLocaleDateString('es-AR', { year: 'numeric', month: '2-digit', day: '2-digit', timeZone: 'UTC' })}</div>
										<div className={`font-semibold text-[10px] ${allQuizzesPassed ? 'text-emerald-400' : 'text-amber-400'}`}>
											{allQuizzesPassed ? 'ACREDITACIÓN COMPLETA 100%' : 'EVALUACIONES EN PROCESO'}
										</div>
									</div>
								</div>
							</div>

							<div className="flex flex-col sm:flex-row gap-3 justify-center items-center pt-2">
								{allQuizzesPassed && progressPercentage === 100 ? (
									<>
										<button
											onClick={() => window.print()}
											className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-semibold text-sm transition-all shadow-lg shadow-blue-600/30"
										>
											<Printer size={16} /> Imprimir / PDF
										</button>
										<Link
											to={`/certificado/IMP-2026-${course.url_handle.toUpperCase().slice(0, 4)}-8492`}
											className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold border border-slate-700 transition-colors"
										>
											<ExternalLink size={14} /> Ver Credencial Pública
										</Link>
									</>
								) : (
									<button
										onClick={() => {
											setShowCertificate(false);
											openQuiz(currentModuleQuiz);
										}}
										className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-amber-600 hover:bg-amber-500 text-white rounded-lg font-semibold text-sm transition-all shadow-lg shadow-amber-600/30"
									>
										<HelpCircle size={16} /> Rendir Evaluación Pendiente
									</button>
								)}
								<button
									onClick={() => setShowCertificate(false)}
									className="px-4 py-2.5 text-slate-400 hover:text-slate-200 text-xs font-medium"
								>
									Cerrar
								</button>
							</div>
						</div>
					</div>
				</div>
			)}

			{/* Barra Superior del Aula Virtual */}
			<header className="h-16 !h-16 !py-0 border-b border-slate-800 bg-[#0d1424] px-4 md:px-6 flex items-center justify-between z-20 shrink-0">
				<div className="flex items-center gap-3 sm:gap-4 min-w-0">
					<Link
						to={`/curso/${course.url_handle}`}
						className="inline-flex items-center gap-2 text-xs md:text-sm text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-800 px-3 py-1.5 rounded-md border border-slate-700/60 transition-colors shrink-0"
					>
						<ArrowLeft size={16} />
						<span className="hidden sm:inline">Volver al curso</span>
					</Link>

					<div className="h-5 w-px bg-slate-800 hidden sm:block shrink-0" />

					<div className="flex items-center gap-2.5 min-w-0">
						<GraduationCap className="text-blue-400 hidden sm:block shrink-0" size={20} />
						<div className="flex flex-col justify-center min-w-0">
							<h1 className="text-xs md:text-sm font-bold text-white truncate max-w-[200px] sm:max-w-xs md:max-w-md !m-0 !p-0 leading-tight">
								{course.title}
							</h1>
							<p className="text-[11px] text-slate-400 truncate max-w-[180px] sm:max-w-xs !m-0 !p-0 leading-tight !mt-0.5">
								{activeTab === 'quiz' ? `📝 ${activeQuiz.title}` : activeLesson.title}
							</p>
						</div>
					</div>
				</div>

				<div className="flex items-center gap-3 md:gap-5">
					{/* Barra y contador de Progreso */}
					<div className="flex items-center gap-3">
						<div className="hidden lg:flex flex-col items-end text-xs">
							<span className="text-slate-300 font-medium">
								{completedLessons.length} de {allLessons.length} clases completadas
							</span>
							<span className="text-[10px] text-slate-400">{progressPercentage}% del curso</span>
						</div>
						<div className="w-20 sm:w-28 bg-slate-800 rounded-full h-2 overflow-hidden border border-slate-700">
							<div
								className="bg-gradient-to-r from-blue-500 to-sky-400 h-full rounded-full transition-all duration-500 ease-out"
								style={{ width: `${progressPercentage}%` }}
							/>
						</div>
						<span className="text-xs font-bold text-sky-400 sm:min-w-[32px]">
							{progressPercentage}%
						</span>
					</div>

					{/* Botón de Certificado */}
					<button
						onClick={() => setShowCertificate(true)}
						className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg border transition-all ${
							allQuizzesPassed && progressPercentage === 100
								? 'bg-amber-500/20 text-amber-300 border-amber-500/50 hover:bg-amber-500/30'
								: 'bg-slate-800/60 text-slate-400 border-slate-700/60 hover:text-slate-200'
						}`}
						title={
							allQuizzesPassed && progressPercentage === 100
								? 'Ver certificado oficial acreditado'
								: 'Completá las clases y evaluaciones para tu certificado'
						}
					>
						<Award size={15} className={allQuizzesPassed && progressPercentage === 100 ? 'text-amber-400' : ''} />
						<span className="hidden md:inline">Certificado</span>
					</button>

					{/* Toggle Sidebar en Móviles/Desktop */}
					<button
						onClick={() => setSidebarOpen(!sidebarOpen)}
						className="p-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors border border-slate-700"
						aria-label={sidebarOpen ? 'Ocultar temario' : 'Mostrar temario'}
					>
						{sidebarOpen ? <X size={18} /> : <Menu size={18} />}
					</button>
				</div>
			</header>

			{/* Contenedor Principal (Video/Quiz + Sidebar) */}
			<div className="flex-1 flex overflow-hidden relative">
				{/* Zona Central: Reproductor o Evaluación Interactiva */}
				<main className="flex-1 overflow-y-auto bg-[#0a0f1d] flex flex-col">
					{/* Si la pestaña activa es Quiz, se muestra el componente de evaluación en grande */}
					{activeTab === 'quiz' ? (
						<div className="p-4 md:p-8 max-w-4xl w-full mx-auto space-y-6">
							<div className="flex items-center justify-between">
								<button
									onClick={() => setActiveTab('overview')}
									className="inline-flex items-center gap-2 text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 px-3 py-1.5 rounded-lg transition-colors border border-slate-700"
								>
									<ArrowLeft size={14} /> Volver al video de la clase
								</button>
							</div>

							<InteractiveQuiz
								quiz={activeQuiz}
								courseHandle={course.url_handle}
								onPassed={() => {
									showToast('¡Examen aprobado con éxito! Tu avance ha sido acreditado.');
									setQuizzesUpdateCounter((c) => c + 1);
								}}
								onNextLesson={() => {
									if (nextLesson) goToLesson(nextLesson);
									else setActiveTab('overview');
								}}
							/>
						</div>
					) : (
						<>
							{/* Contenedor del Reproductor de Video */}
							<div className="w-full bg-black flex justify-center items-center relative aspect-video max-h-[68vh] shadow-2xl">
								<video
									ref={videoRef}
									key={activeLesson.id}
									controls
									autoPlay={false}
									controlsList="nodownload"
									className="w-full h-full object-contain"
									src={activeLesson.videoUrl}
									onEnded={handleToggleComplete}
									onTimeUpdate={(e) => setCurrentVideoTime(e.currentTarget.currentTime)}
								>
									Tu navegador no soporta el reproductor de video HTML5.
								</video>
							</div>

							{/* Barra de Controles de la Lección */}
							<div className="border-b border-slate-800/80 bg-[#0f172a] px-4 md:px-8 py-4 flex flex-wrap items-center justify-between gap-4">
								<div className="space-y-1">
									<div className="flex items-center gap-2">
										<span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-blue-900/60 text-blue-300 border border-blue-700/50">
											Clase {currentLessonIndex + 1} de {allLessons.length}
										</span>
										<span className="flex items-center gap-1 text-slate-400 text-xs">
											<Clock size={13} /> {activeLesson.durationMinutes} minutos
										</span>
									</div>
									<h2 className="text-lg md:text-xl font-bold text-white tracking-tight !m-0 !p-0 !mt-1">
										{activeLesson.title}
									</h2>
								</div>

								{/* Botones de Acción */}
								<div className="flex items-center gap-2 sm:gap-3 flex-wrap">
									<button
										onClick={handleToggleComplete}
										className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-xs md:text-sm transition-all border ${
											isCurrentCompleted
												? 'bg-emerald-600/20 text-emerald-300 border-emerald-500/50 hover:bg-emerald-600/30'
												: 'bg-blue-600 hover:bg-blue-500 text-white border-blue-500 shadow-md shadow-blue-600/20'
										}`}
									>
										<CheckCircle2 size={16} className={isCurrentCompleted ? 'text-emerald-400' : ''} />
										{isCurrentCompleted ? 'Completada ✓' : 'Marcar como completada'}
									</button>

									<div className="flex items-center gap-1">
										<button
											disabled={!prevLesson}
											onClick={() => prevLesson && goToLesson(prevLesson)}
											className="p-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 disabled:opacity-30 disabled:pointer-events-none transition-colors border border-slate-700/80"
											title={prevLesson ? `Anterior: ${prevLesson.title}` : 'No hay clase anterior'}
										>
											<ChevronLeft size={18} />
										</button>
										<button
											disabled={!nextLesson}
											onClick={() => nextLesson && goToLesson(nextLesson)}
											className="p-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 disabled:opacity-30 disabled:pointer-events-none transition-colors border border-slate-700/80"
											title={nextLesson ? `Siguiente: ${nextLesson.title}` : 'Última clase'}
										>
											<ChevronRight size={18} />
										</button>
									</div>
								</div>
							</div>

							{/* Pestañas de Contenido Inferior */}
							<div className="p-4 md:p-8 max-w-5xl w-full mx-auto space-y-6">
								{/* Navegación por pestañas */}
								<div className="flex border-b border-slate-800 gap-6 text-sm font-semibold flex-wrap">
									<button
										onClick={() => setActiveTab('overview')}
										className={`pb-3 transition-colors border-b-2 flex items-center gap-2 ${
											activeTab === 'overview'
												? 'border-blue-500 text-blue-400'
												: 'border-transparent text-slate-400 hover:text-slate-200'
										}`}
									>
										<FileText size={16} /> Visión General
									</button>

									{currentModuleQuiz && (
										<button
											onClick={() => openQuiz(currentModuleQuiz)}
											className="pb-3 transition-colors border-b-2 border-transparent text-sky-400 hover:text-sky-300 flex items-center gap-2 font-medium"
										>
											<HelpCircle size={16} /> Evaluación Módulo ({currentModuleQuiz.questions.length})
										</button>
									)}

									<button
										onClick={() => openQuiz(getFinalCertificationExam(course.url_handle))}
										className="pb-3 transition-colors border-b-2 border-transparent text-amber-400 hover:text-amber-300 flex items-center gap-2 font-bold"
									>
										<Award size={16} /> Examen Final (Cronometrado · 20m)
									</button>

									<button
										onClick={() => setActiveTab('notes')}
										className={`pb-3 transition-colors border-b-2 flex items-center gap-2 ${
											activeTab === 'notes'
												? 'border-blue-500 text-blue-400 font-bold'
												: 'border-transparent text-slate-400 hover:text-slate-200'
										}`}
									>
										<StickyNote size={16} /> Mis Notas ({notes.length})
									</button>

									<button
										onClick={() => setActiveTab('resources')}
										className={`pb-3 transition-colors border-b-2 flex items-center gap-2 ${
											activeTab === 'resources'
												? 'border-blue-500 text-blue-400 font-bold'
												: 'border-transparent text-slate-400 hover:text-slate-200'
										}`}
									>
										<Download size={16} /> Recursos & Descargas ({lessonResources.length})
									</button>
									<button
										onClick={() => setActiveTab('community')}
										className={`pb-3 transition-colors border-b-2 flex items-center gap-2 ${
											activeTab === 'community'
												? 'border-blue-500 text-blue-400'
												: 'border-transparent text-slate-400 hover:text-slate-200'
										}`}
									>
										<MessageSquare size={16} /> Dudas y Comunidad ({questions.length})
									</button>
									<button
										onClick={() => setActiveTab('tutor')}
										className={`pb-3 transition-colors border-b-2 flex items-center gap-2 ${
											activeTab === 'tutor'
												? 'border-blue-500 text-blue-400'
												: 'border-transparent text-slate-400 hover:text-slate-200'
										}`}
									>
										<User size={16} /> Instructor
									</button>
								</div>

								{/* Contenido de la Pestaña Activa */}
								{activeTab === 'overview' && (
									<div className="space-y-6 animate-fade-in">
										<div>
											<h3 className="text-base font-bold text-white mb-2">Descripción de la Lección</h3>
											<p className="text-slate-300 text-sm leading-relaxed">
												{activeLesson.description}
											</p>
										</div>

										{activeLesson.keyTakeaways && activeLesson.keyTakeaways.length > 0 && (
											<div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 space-y-3">
												<h4 className="text-xs font-bold uppercase tracking-wider text-sky-400 flex items-center gap-2">
													<Sparkles size={14} /> Objetivos y conceptos clave
												</h4>
												<ul className="grid gap-2.5">
													{activeLesson.keyTakeaways.map((item, idx) => (
														<li key={idx} className="flex items-start gap-3 text-sm text-slate-200">
															<div className="p-0.5 rounded-full bg-emerald-500/20 text-emerald-400 mt-0.5 shrink-0">
																<Check size={13} />
															</div>
															<span>{item}</span>
														</li>
													))}
												</ul>
											</div>
										)}

										{currentModuleQuiz && (
											<div className="bg-gradient-to-r from-blue-950/40 to-slate-900 p-5 rounded-xl border border-blue-800/40 flex items-center justify-between gap-4">
												<div>
													<span className="text-[10px] font-bold uppercase tracking-wider text-sky-400">
														VALIDACIÓN DE CONOCIMIENTOS
													</span>
													<h4 className="text-sm font-bold text-white mt-0.5">{currentModuleQuiz.title}</h4>
													<p className="text-xs text-slate-400">
														Completá la evaluación interactiva de este módulo para acreditar tu certificado oficial.
													</p>
												</div>
												<button
													onClick={() => openQuiz(currentModuleQuiz)}
													className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold shrink-0 transition-colors shadow-md shadow-blue-600/30 flex items-center gap-1.5"
												>
													<HelpCircle size={14} /> Rendir Examen
												</button>
											</div>
										)}
									</div>
								)}

								{/* Pestaña: Mis Notas del Alumno con Timestamp Sync */}
								{activeTab === 'notes' && (
									<div className="space-y-6 animate-fade-in">
										<div className="flex justify-between items-center">
											<div>
												<h3 className="text-base font-bold text-white">Bloc de Notas del Estudiante</h3>
												<p className="text-xs text-slate-400">
													Tus notas quedan sincronizadas con el segundo exacto del video para repasarlas cuando quieras.
												</p>
											</div>

											{notes.length > 0 && (
												<button
													onClick={handleDownloadNotes}
													className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg border border-slate-700"
												>
													<Download size={14} /> Exportar Notas (.md)
												</button>
											)}
										</div>

										<form onSubmit={handleSaveNote} className="bg-slate-900/80 p-4 rounded-xl border border-slate-800 space-y-3">
											<div className="flex items-center gap-2 text-xs text-slate-400">
												<Clock size={14} className="text-sky-400" />
												<span>Marca de tiempo actual:</span>
												<strong className="text-sky-400 font-mono text-sm">{formatTime(currentVideoTime)}</strong>
											</div>
											<textarea
												rows={3}
												value={newNoteText}
												onChange={(e) => setNewNoteText(e.target.value)}
												placeholder="Escribí tu apunte o concepto importante aquí..."
												className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500 resize-none"
											/>
											<div className="flex justify-end">
												<button
													type="submit"
													disabled={!newNoteText.trim()}
													className="px-4 py-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5"
												>
													<StickyNote size={14} /> Guardar Nota en {formatTime(currentVideoTime)}
												</button>
											</div>
										</form>

										<div className="space-y-3">
											{notes.length === 0 ? (
												<div className="text-center py-8 text-slate-500 text-sm">
													No has guardado notas en esta clase todavía. Escribí tu primer apunte arriba.
												</div>
											) : (
												notes.map((n) => (
													<div
														key={n.id}
														className="bg-slate-900/60 border border-slate-800/80 p-4 rounded-xl flex items-start justify-between gap-4 hover:border-slate-700 transition-colors"
													>
														<div className="space-y-1.5 flex-1">
															<button
																onClick={() => jumpToTime(n.timestampSeconds)}
																className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-blue-950/80 text-sky-400 text-xs font-mono font-bold border border-blue-800/60 hover:bg-blue-900"
																title="Hacer clic para saltar al video en este segundo"
															>
																<Play size={10} fill="currentColor" /> {n.formattedTime}
															</button>
															<p className="text-sm text-slate-200 whitespace-pre-wrap">{n.noteText}</p>
															<span className="text-[10px] text-slate-500 block">{n.createdAt}</span>
														</div>

														<button
															onClick={() => handleDeleteNote(n.id)}
															className="text-slate-500 hover:text-rose-400 p-1"
															title="Eliminar nota"
														>
															<Trash2 size={16} />
														</button>
													</div>
												))
											)}
										</div>
									</div>
								)}

								{activeTab === 'resources' && (
									<div className="space-y-4 animate-fade-in">
										<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
											<div>
												<h3 className="text-base font-bold text-white">Archivos y Materiales Oficiales de Descarga</h3>
												<p className="text-xs text-slate-400">Archivos fuente, resúmenes y plantillas de prueba listos para tu aprendizaje.</p>
											</div>
											<span className="text-[11px] font-bold px-3 py-1 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-full w-fit">
												{lessonResources.length} materiales listos
											</span>
										</div>

										<div className="grid gap-3">
											{lessonResources.map((res) => (
												<div
													key={res.id}
													className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:border-slate-700 transition-colors"
												>
													<div className="flex items-start gap-3">
														<div className="p-2.5 bg-blue-500/10 text-blue-400 rounded-xl shrink-0 mt-0.5">
															{res.type === 'code' ? (
																<FileText size={20} className="text-emerald-400" />
															) : res.type === 'pdf' ? (
																<FileText size={20} className="text-rose-400" />
															) : res.type === 'template' ? (
																<FileText size={20} className="text-amber-400" />
															) : (
																<ExternalLink size={20} className="text-sky-400" />
															)}
														</div>
														<div>
															<div className="text-sm font-bold text-white">{res.title}</div>
															<p className="text-xs text-slate-400 mt-0.5 leading-relaxed">{res.description}</p>
															{res.size && (
																<span className="inline-block mt-1 text-[11px] font-mono text-slate-500">
																	Peso: {res.size}
																</span>
															)}
														</div>
													</div>

													<div className="shrink-0 w-full sm:w-auto">
														{res.externalUrl ? (
															<a
																href={res.externalUrl}
																target="_blank"
																rel="noopener noreferrer"
																className="inline-flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg border border-slate-700 transition-colors w-full sm:w-auto"
															>
																<ExternalLink size={14} /> Abrir Repo GitHub
															</a>
														) : (
															<button
																onClick={() => {
																	if (res.downloadFileName && res.fileContent) {
																		downloadMockFile(res.downloadFileName, res.fileContent);
																		showToast(`Descargando "${res.downloadFileName}"...`);
																	}
																}}
																className="inline-flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white rounded-lg shadow-sm transition-colors cursor-pointer w-full sm:w-auto"
															>
																<Download size={14} /> Descargar Archivo
															</button>
														)}
													</div>
												</div>
											))}
										</div>
									</div>
								)}

								{activeTab === 'community' && (
									<div className="space-y-6 animate-fade-in">
										<div>
											<h3 className="text-base font-bold text-white mb-2">Comunidad de Estudiantes</h3>
											<p className="text-slate-400 text-xs">
												Hacé tus preguntas sobre esta clase. Nuestros tutores y compañeros de cursada responden en menos de 24 horas.
											</p>
										</div>

										<form onSubmit={handleAddQuestion} className="space-y-3 bg-slate-900/80 p-4 rounded-xl border border-slate-800">
											<div className="flex gap-2">
												<input
													type="text"
													value={newQuestionText}
													onChange={(e) => setNewQuestionText(e.target.value)}
													placeholder="Escribí tu consulta sobre esta lección..."
													className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
												/>
												<button
													type="submit"
													disabled={!newQuestionText.trim()}
													className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-white font-semibold text-xs rounded-lg transition-colors shrink-0"
												>
													Publicar
												</button>
											</div>
										</form>

										<div className="space-y-4">
											{questions.length === 0 ? (
												<div className="text-center py-8 text-slate-400 text-sm">
													No hay consultas todavía en esta clase. ¡Sé el primero en preguntar!
												</div>
											) : (
												questions.map((q) => (
													<div
														key={q.id}
														className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 space-y-3"
													>
														<div className="flex items-center justify-between text-xs">
															<div className="flex items-center gap-2">
																<div className="w-6 h-6 rounded-full bg-blue-600/40 text-blue-300 font-bold flex items-center justify-center text-[10px]">
																	{q.authorName.charAt(0)}
																</div>
																<span className="font-semibold text-white">{q.authorName}</span>
															</div>
															<span className="text-slate-500">{q.createdAt}</span>
														</div>
														<p className="text-sm text-slate-200">{q.question}</p>

														{q.replies && q.replies.length > 0 && (
															<div className="mt-3 pl-4 border-l-2 border-blue-500/40 space-y-2">
																{q.replies.map((rep, rIdx) => (
																	<div key={rIdx} className="text-xs space-y-1">
																		<div className="flex items-center gap-2">
																			<span className="font-bold text-sky-400">{rep.authorName}</span>
																			<span className="text-slate-500 text-[10px]">{rep.createdAt}</span>
																		</div>
																		<p className="text-slate-300">{rep.reply}</p>
																	</div>
																))}
															</div>
														)}
													</div>
												))
											)}
										</div>
									</div>
								)}

								{activeTab === 'tutor' && (
									<div className="space-y-4 animate-fade-in bg-slate-900/70 p-6 rounded-2xl border border-slate-800">
										<div className="flex items-start gap-4">
											<img
												src={curriculum.instructor.avatar}
												alt={curriculum.instructor.name}
												className="w-16 h-16 rounded-full object-cover border-2 border-blue-500/40"
											/>
											<div>
												<h4 className="text-lg font-bold text-white">{curriculum.instructor.name}</h4>
												<p className="text-xs font-semibold text-sky-400">{curriculum.instructor.title}</p>
												<p className="text-slate-300 text-sm mt-3 leading-relaxed">
													{curriculum.instructor.bio}
												</p>
											</div>
										</div>
									</div>
								)}
							</div>
						</>
					)}
				</main>

				{/* Barra Lateral (Sidebar): Temario del Curso y Lista de Clases */}
				<aside
					className={`${
						sidebarOpen ? 'w-80 md:w-96 translate-x-0' : 'w-0 translate-x-full hidden'
					} border-l border-slate-800 bg-[#0d1424] flex flex-col shrink-0 transition-all duration-300 z-10`}
				>
					{/* Encabezado del temario */}
					<div className="p-4 border-b border-slate-800 flex items-center justify-between">
						<div>
							<h3 className="text-sm font-bold text-white">Contenido del Curso</h3>
							<p className="text-xs text-slate-400">
								{curriculum.modules.length} módulos · {allLessons.length} lecciones
							</p>
						</div>
						<div className="text-right">
							<span className="text-xs font-bold text-emerald-400">
								{completedLessons.length}/{allLessons.length}
							</span>
						</div>
					</div>

					{/* Lista de Módulos, Lecciones y Quizzes */}
					<div className="flex-1 overflow-y-auto p-3 space-y-4">
						{curriculum.modules.map((mod) => {
							const modQuiz = courseQuizzes.find((q) => q.moduleId === mod.id);
							const quizResult = modQuiz ? getStoredQuizResult(course.url_handle, modQuiz.id) : null;
							const isQuizPassed = quizResult ? quizResult.passed : false;

							return (
								<div key={mod.id} className="rounded-xl bg-slate-900/70 border border-slate-800/80 overflow-hidden">
									<div className="p-3 bg-slate-800/40 border-b border-slate-800/60">
										<h4 className="text-xs font-bold text-white uppercase tracking-wider">
											{mod.title}
										</h4>
										<p className="text-[11px] text-slate-400 mt-0.5 line-clamp-1">{mod.description}</p>
									</div>

									<div className="divide-y divide-slate-800/50">
										{mod.lessons.map((lesson) => {
											const isActive = activeTab !== 'quiz' && lesson.id === activeLesson.id;
											const isCompleted = completedLessons.includes(lesson.id);

											return (
												<button
													key={lesson.id}
													onClick={() => goToLesson(lesson)}
													className={`w-full text-left p-3 flex items-start gap-3 transition-colors ${
														isActive
															? 'bg-blue-600/15 border-l-4 border-blue-500'
															: 'hover:bg-slate-800/50'
													}`}
												>
													<div className="mt-0.5 shrink-0">
														{isCompleted ? (
															<CheckCircle2 size={16} className="text-emerald-400" />
														) : isActive ? (
															<Play size={16} className="text-blue-400 fill-blue-400" />
														) : (
															<Circle size={16} className="text-slate-600" />
														)}
													</div>

													<div className="flex-1 min-w-0">
														<p
															className={`text-xs font-medium line-clamp-2 ${
																isActive ? 'text-white font-semibold' : 'text-slate-300'
															}`}
														>
															{lesson.title}
														</p>
														<span className="text-[10px] text-slate-500 flex items-center gap-1 mt-1">
															<Clock size={11} /> {lesson.durationMinutes} min
														</span>
													</div>
												</button>
											);
										})}

										{/* Botón de Examen al final del módulo */}
										{modQuiz && (
											<button
												onClick={() => openQuiz(modQuiz)}
												className={`w-full p-3 flex items-center justify-between text-xs transition-colors border-t border-slate-800/80 ${
													activeTab === 'quiz' && activeQuiz?.id === modQuiz.id
														? 'bg-sky-600/20 text-white font-bold border-l-4 border-sky-400'
														: isQuizPassed
														? 'bg-emerald-950/20 text-emerald-300 hover:bg-emerald-950/30 font-medium'
														: 'bg-blue-950/20 text-blue-300 hover:bg-blue-950/40 font-medium'
												}`}
											>
												<div className="flex items-center gap-2">
													{isQuizPassed ? (
														<CheckCircle2 size={15} className="text-emerald-400 shrink-0" />
													) : (
														<HelpCircle size={15} className="text-sky-400 shrink-0" />
													)}
													<span className="line-clamp-1">
														{isQuizPassed ? 'Evaluación Aprobada' : 'Evaluación del Módulo'}
													</span>
												</div>
												<span
													className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
														isQuizPassed
															? 'bg-emerald-500/20 text-emerald-400'
															: 'bg-blue-500/20 text-blue-300'
													}`}
												>
													{isQuizPassed ? `${quizResult?.scorePercent}%` : `${modQuiz.questions.length} preg`}
												</span>
											</button>
										)}
									</div>
								</div>
							);
						})}
					</div>
				</aside>
			</div>
		</div>
	);
}
