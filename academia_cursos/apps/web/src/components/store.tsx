import { Link, useNavigate, useLocation } from 'react-router';
import { useEffect, useState, useMemo } from 'react';
import {
	GraduationCap,
	ArrowRight,
	ShoppingBag,
	Code2,
	BookOpen,
	ShieldCheck,
	Play,
	Clock,
	Award,
	Sparkles,
	CheckCircle2,
	User,
	ChevronDown,
	ChevronUp,
	Check,
	Tag,
	Star,
	MessageSquare,
	X,
	Compass,
} from 'lucide-react';
import { type ProductListItem } from '@/api/ecommerce-api';
import { getCourseCurriculum, getAllLessons } from '@/lib/course-curricula';
import { getStoredProgress } from '@/lib/course-progress';
import {
	getCourseReviews,
	addCourseReview,
	getCourseRatingSummary,
	type CourseReview,
} from '@/lib/course-reviews';
import { GlobalNavbar } from './global-navbar';
import { GlobalFooter } from './global-footer';
import { CareerQuizModal } from './career-quiz-modal';

export function Store({ products, detail = false }: { products: ProductListItem[]; detail?: boolean }) {
	const navigate = useNavigate();
	const location = useLocation();
	const isCatalogPage = location.pathname.startsWith('/cursos');
	const isHomePage = location.pathname === '/';

	const [cart, setCart] = useState<ProductListItem[]>([]);
	const [ready, setReady] = useState(false);
	const [message, setMessage] = useState('');
	const [isCareerQuizOpen, setIsCareerQuizOpen] = useState(false);
	const [selectedCategory, setSelectedCategory] = useState<string>('todos');
	const [searchQuery, setSearchQuery] = useState<string>('');
	const [expandedModule, setExpandedModule] = useState<string | null>(null);

	// Reseñas del curso activo
	const [reviewsList, setReviewsList] = useState<CourseReview[]>([]);
	const [reviewerName, setReviewerName] = useState('');
	const [reviewerRating, setReviewerRating] = useState(5);
	const [reviewerComment, setReviewerComment] = useState('');
	const [reviewSuccess, setReviewSuccess] = useState(false);

	// Detectar producto activo en vista de detalle
	const activeProduct = detail && products.length > 0 ? products[0] : null;
	const activeCurriculum = activeProduct ? getCourseCurriculum(activeProduct.url_handle) : null;
	const activeLessons = activeCurriculum ? getAllLessons(activeCurriculum) : [];

	// Progreso del curso si ya fue iniciado
	const [courseProgress, setCourseProgress] = useState<{ completed: number; total: number; percent: number }>({
		completed: 0,
		total: 0,
		percent: 0,
	});

	useEffect(() => {
		try {
			setCart(JSON.parse(localStorage.getItem('e-commerce-cart') || '[]'));
		} catch {
			setCart([]);
		}
		setReady(true);

		if (window.location.pathname === '/checkout/success') {
			localStorage.removeItem('e-commerce-cart');
			setCart([]);
			setMessage('¡Gracias por tu inscripción! Consultá la confirmación enviada a tu email.');
		}
		if (window.location.pathname === '/checkout/cancelled') {
			setMessage('No se realizó el pago. Tu selección de cursos se conserva.');
		}

		if (activeProduct) {
			const prog = getStoredProgress(activeProduct.url_handle);
			const total = activeLessons.length;
			const completed = prog.completedLessons.length;
			setCourseProgress({
				completed,
				total,
				percent: total > 0 ? Math.round((completed / total) * 100) : 0,
			});
			if (activeCurriculum && activeCurriculum.modules.length > 0) {
				setExpandedModule(activeCurriculum.modules[0].id);
			}
			setReviewsList(getCourseReviews(activeProduct.url_handle));
		}
	}, [activeProduct, activeCurriculum, activeLessons.length]);

	useEffect(() => {
		if (typeof window !== 'undefined' && !window.location.hash) {
			window.scrollTo({ top: 0, behavior: 'instant' });
		}
	}, [location.pathname]);

	function handleSubmitReview(e: React.FormEvent) {
		e.preventDefault();
		if (!activeProduct || !reviewerName.trim() || !reviewerComment.trim()) return;
		const newRev = addCourseReview(activeProduct.url_handle, {
			authorName: reviewerName.trim(),
			rating: reviewerRating,
			comment: reviewerComment.trim(),
		});
		setReviewsList((prev) => [newRev, ...prev]);
		setReviewerComment('');
		setReviewSuccess(true);
		setTimeout(() => setReviewSuccess(false), 4000);
	}

	function add(p: ProductListItem) {
		const next = cart.some((x) => x.id === p.id) ? cart : [...cart, p];
		setCart(next);
		localStorage.setItem('e-commerce-cart', JSON.stringify(next));
		window.dispatchEvent(new CustomEvent('e-commerce-cart-change', { detail: { open: true } }));
		setMessage(`"${p.title}" fue agregado al carrito.`);
		setTimeout(() => setMessage(''), 4000);
	}

	// Filtro de cursos para el catálogo
	const filteredProducts = useMemo(() => {
		return products.filter((p) => {
			const matchesSearch =
				p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
				p.description.toLowerCase().includes(searchQuery.toLowerCase());
			if (selectedCategory === 'todos') return matchesSearch;
			if (selectedCategory === 'programacion')
				return matchesSearch && (p.url_handle.includes('web') || p.url_handle.includes('python'));
			if (selectedCategory === 'diseno') return matchesSearch && p.url_handle.includes('figma');
			if (selectedCategory === 'marketing') return matchesSearch && p.url_handle.includes('marketing');
			return matchesSearch;
		});
	}, [products, searchQuery, selectedCategory]);

	return (
		<>
			{/* Notificación flotante */}
			{message && (
				<aside
					aria-label="Notificaciones del sistema"
					className="fixed top-20 right-6 z-50 bg-[#102a43] text-white px-5 py-3 rounded-xl shadow-2xl border border-sky-400/40 text-sm flex items-center gap-3 animate-fade-in"
				>
					<Sparkles size={18} className="text-sky-400" />
					<span>{message}</span>
				</aside>
			)}

			<GlobalNavbar />

			<main>
				{/* Vista de Detalle de Curso con Aula Virtual y Temario */}
				{detail && activeProduct && activeCurriculum ? (
					<section className="catalog" style={{ maxWidth: 1180, margin: '0 auto', padding: '40px 24px' }}>
						{/* Breadcrumbs en Vista de Detalle */}
						<div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#64748b', marginBottom: 20 }}>
							<Link to="/" style={{ color: '#2563eb', textDecoration: 'none' }}>Inicio</Link>
							<span>/</span>
							<Link to="/cursos" style={{ color: '#2563eb', textDecoration: 'none' }}>Catálogo de Cursos</Link>
							<span>/</span>
							<span style={{ color: '#0f172a', fontWeight: 600, maxWidth: 360, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
								{activeProduct.title}
							</span>
						</div>

						{/* Banner Superior del Curso */}
						<div
							style={{
								background: 'linear-gradient(135deg, #102a43 0%, #1e3a5f 100%)',
								color: 'white',
								borderRadius: 20,
								padding: '48px 36px',
								boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
								marginBottom: 40,
							}}
						>
							<div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 16 }}>
								<span
									style={{
										background: 'rgba(56,189,248,0.2)',
										color: '#38bdf8',
										padding: '4px 12px',
										borderRadius: 20,
										fontSize: 11,
										fontWeight: 700,
										textTransform: 'uppercase',
										letterSpacing: 1,
									}}
								>
									{activeCurriculum.level}
								</span>
								<span style={{ fontSize: 13, color: '#b7c8d8', display: 'flex', alignItems: 'center', gap: 6 }}>
									<Clock size={15} /> {activeCurriculum.totalHours} horas lectivas
								</span>
								<span style={{ fontSize: 13, color: '#82d8bd', display: 'flex', alignItems: 'center', gap: 6 }}>
									<Award size={15} /> Certificado Oficial
								</span>
							</div>

							<h1 style={{ margin: '0 0 16px', fontSize: 'clamp(28px, 3.5vw, 42px)', lineHeight: 1.2 }}>
								{activeProduct.title}
							</h1>
							<p style={{ color: '#cbd5e1', fontSize: 16, lineHeight: 1.7, maxWidth: 780, margin: '0 0 28px' }}>
								{activeProduct.subtitle || 'Formación profesional online con proyectos prácticos y mentoría personalizada.'}
							</p>

							{/* Progreso si ya empezó */}
							{courseProgress.completed > 0 && (
								<div
									style={{
										background: 'rgba(255,255,255,0.08)',
										padding: '16px 20px',
										borderRadius: 12,
										maxWidth: 480,
										marginBottom: 28,
										border: '1px solid rgba(255,255,255,0.15)',
									}}
								>
									<div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 8 }}>
										<span>Tu progreso actual:</span>
										<strong style={{ color: '#38bdf8' }}>
											{courseProgress.completed} de {courseProgress.total} clases ({courseProgress.percent}%)
										</strong>
									</div>
									<div style={{ height: 6, background: 'rgba(255,255,255,0.2)', borderRadius: 10, overflow: 'hidden' }}>
										<div
											style={{
												width: `${courseProgress.percent}%`,
												height: '100%',
												background: '#38bdf8',
												borderRadius: 10,
											}}
										/>
									</div>
								</div>
							)}

							{/* Botones de Acción Principales */}
							<div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'center' }}>
								<Link
									to={`/curso/${activeProduct.url_handle}/aprender`}
									className="primary"
									style={{
										margin: 0,
										padding: '16px 32px',
										fontSize: 15,
										display: 'inline-flex',
										alignItems: 'center',
										gap: 10,
										boxShadow: '0 10px 25px rgba(37,99,235,0.4)',
									}}
								>
									<Play size={20} fill="white" />
									{courseProgress.completed > 0 ? 'Continuar en el Aula Virtual' : 'Ingresar al Aula Virtual'}
								</Link>

								<button
									onClick={() => add(activeProduct)}
									style={{
										background: 'rgba(255,255,255,0.12)',
										border: '1px solid rgba(255,255,255,0.3)',
										color: 'white',
										padding: '16px 24px',
										borderRadius: 7,
										fontWeight: 700,
										fontSize: 14,
										cursor: 'pointer',
									}}
								>
									Comprar ({activeProduct.price_formatted})
								</button>
							</div>
						</div>

						{/* Grilla de Contenido: Temario a la izquierda, Instructor a la derecha */}
						<div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 40 }}>
							{/* Temario del Curso (Syllabus) */}
							<div>
								<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 20 }}>
									<h2 style={{ fontSize: 24, margin: 0 }}>Temario y Clases</h2>
									<span style={{ fontSize: 13, color: '#64748b' }}>
										{activeCurriculum.modules.length} módulos · {activeLessons.length} lecciones
									</span>
								</div>

								<div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
									{activeCurriculum.modules.map((mod) => {
										const isExpanded = expandedModule === mod.id;
										return (
											<div
												key={mod.id}
												style={{
													border: '1px solid #e2e8f0',
													borderRadius: 12,
													overflow: 'hidden',
													background: 'white',
												}}
											>
												<button
													onClick={() => setExpandedModule(isExpanded ? null : mod.id)}
													style={{
														width: '100%',
														textAlign: 'left',
														padding: '16px 20px',
														background: isExpanded ? '#f8fafc' : 'white',
														border: 'none',
														borderBottom: isExpanded ? '1px solid #e2e8f0' : 'none',
														display: 'flex',
														justifyContent: 'space-between',
														alignItems: 'center',
														cursor: 'pointer',
													}}
												>
													<div>
														<strong style={{ fontSize: 14, color: '#102a43' }}>{mod.title}</strong>
														<p style={{ margin: '4px 0 0', fontSize: 12, color: '#64748b' }}>
															{mod.lessons.length} clases
														</p>
													</div>
													{isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
												</button>

												{isExpanded && (
													<div style={{ padding: '8px 0' }}>
														{mod.lessons.map((lesson) => (
															<Link
																key={lesson.id}
																to={`/curso/${activeProduct.url_handle}/aprender/${lesson.id}`}
																style={{
																	display: 'flex',
																	alignItems: 'center',
																	justifyContent: 'space-between',
																	padding: '12px 20px',
																	borderBottom: '1px solid #f1f5f9',
																	color: '#334155',
																	fontSize: 13,
																	textDecoration: 'none',
																}}
																onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = '#f8fafc')}
																onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = 'transparent')}
															>
																<div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
																	<Play size={14} color="#2563eb" />
																	<span>{lesson.title}</span>
																</div>
																<span style={{ fontSize: 11, color: '#94a3b8' }}>{lesson.durationMinutes} min</span>
															</Link>
														))}
													</div>
												)}
											</div>
										);
									})}
								</div>
							</div>

							{/* Columna Derecha: Instructor y Beneficios */}
							<div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
								{/* Tarjeta del Instructor */}
								<div
									style={{
										padding: 24,
										background: '#f8fafc',
										borderRadius: 16,
										border: '1px solid #e2e8f0',
									}}
								>
									<small style={{ color: '#2563eb', fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase' }}>
										INSTRUCTOR DEL CURSO
									</small>
									<div style={{ display: 'flex', gap: 16, alignItems: 'center', marginTop: 16 }}>
										<img
											src={activeCurriculum.instructor.avatar}
											alt={activeCurriculum.instructor.name}
											style={{ width: 64, height: 64, borderRadius: '50%', objectFit: 'cover' }}
										/>
										<div>
											<h3 style={{ margin: 0, fontSize: 17, color: '#102a43' }}>
												{activeCurriculum.instructor.name}
											</h3>
											<p style={{ margin: '4px 0 0', fontSize: 12, color: '#2563eb', fontWeight: 600 }}>
												{activeCurriculum.instructor.title}
											</p>
										</div>
									</div>
									<p style={{ fontSize: 13, color: '#475569', lineHeight: 1.6, marginTop: 16 }}>
										{activeCurriculum.instructor.bio}
									</p>
								</div>

								{/* Lo que incluye el curso */}
								<div
									style={{
										padding: 24,
										background: 'white',
										borderRadius: 16,
										border: '1px solid #e2e8f0',
									}}
								>
									<h4 style={{ margin: '0 0 16px', fontSize: 15, color: '#102a43' }}>Este curso incluye:</h4>
									<ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 12 }}>
										<li style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13, color: '#334155' }}>
											<Check size={16} color="#16a34a" /> Acceso ilimitado de por vida al aula virtual
										</li>
										<li style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13, color: '#16a34a' }}>
											<Check size={16} color="#16a34a" /> {activeCurriculum.totalHours} horas de video interactivo HD
										</li>
										<li style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13, color: '#16a34a' }}>
											<Check size={16} color="#16a34a" /> Recursos y código fuente descargable
										</li>
										<li style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13, color: '#16a34a' }}>
											<Check size={16} color="#16a34a" /> Foro de dudas con respuestas del tutor
										</li>
										<li style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13, color: '#16a34a' }}>
											<Check size={16} color="#16a34a" /> Certificado oficial al completar el 100%
										</li>
									</ul>
								</div>
							</div>
						</div>

						{/* Sección Completa de Reseñas y Valoraciones del Curso */}
						<section
							style={{
								marginTop: 48,
								background: 'white',
								borderRadius: 20,
								border: '1px solid #e2e8f0',
								padding: '36px 32px',
								boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
							}}
						>
							<div
								style={{
									display: 'flex',
									justifyContent: 'space-between',
									alignItems: 'center',
									flexWrap: 'wrap',
									gap: 20,
									borderBottom: '1px solid #f1f5f9',
									paddingBottom: 24,
									marginBottom: 32,
								}}
							>
								<div>
									<div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
										<MessageSquare size={22} color="#2563eb" />
										<h2 style={{ margin: 0, fontSize: 22, color: '#102a43' }}>Opiniones y Valoraciones</h2>
									</div>
									<p style={{ margin: 0, fontSize: 14, color: '#64748b' }}>
										Experiencias de estudiantes reales que completaron este curso.
									</p>
								</div>

								{(() => {
									const summary = getCourseRatingSummary(activeProduct.url_handle);
									return (
										<div
											style={{
												display: 'flex',
												alignItems: 'center',
												gap: 16,
												background: '#f8fafc',
												padding: '12px 20px',
												borderRadius: 14,
												border: '1px solid #e2e8f0',
											}}
										>
											<div style={{ fontSize: 32, fontWeight: 900, color: '#102a43', lineHeight: 1 }}>
												{summary.average}
											</div>
											<div>
												<div style={{ display: 'flex', gap: 2, marginBottom: 4 }}>
													{[1, 2, 3, 4, 5].map((s) => (
														<Star
															key={s}
															size={16}
															fill={s <= Math.round(summary.average) ? '#f59e0b' : 'none'}
															color="#f59e0b"
														/>
													))}
												</div>
												<span style={{ fontSize: 12, color: '#64748b' }}>
													{summary.count} opiniones de alumnos
												</span>
											</div>
										</div>
									);
								})()}
							</div>

							<div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 36 }}>
								{/* Lista de Reseñas */}
								<div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
									<h3 style={{ fontSize: 16, margin: 0, color: '#102a43' }}>
										Lo que opinan nuestros alumnos ({reviewsList.length})
									</h3>

									{reviewsList.length === 0 ? (
										<p style={{ fontSize: 14, color: '#94a3b8' }}>Sé el primero en dejar tu valoración sobre este curso.</p>
									) : (
										reviewsList.map((rev) => (
											<div
												key={rev.id}
												style={{
													padding: 20,
													borderRadius: 14,
													border: '1px solid #f1f5f9',
													background: '#fafbfc',
												}}
											>
												<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
													<div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
														{rev.avatar ? (
															<img
																src={rev.avatar}
																alt={rev.authorName}
																style={{ width: 36, height: 36, borderRadius: '50%', objectFit: 'cover' }}
															/>
														) : (
															<div
																style={{
																	width: 36,
																	height: 36,
																	borderRadius: '50%',
																	background: '#2563eb',
																	color: 'white',
																	display: 'flex',
																	alignItems: 'center',
																	justifyContent: 'center',
																	fontWeight: 700,
																	fontSize: 14,
																}}
															>
																{rev.authorName.charAt(0).toUpperCase()}
															</div>
														)}
														<div>
															<strong style={{ fontSize: 14, color: '#102a43' }}>{rev.authorName}</strong>
															{rev.verifiedBuyer && (
																<span
																	style={{
																		marginLeft: 8,
																		fontSize: 10,
																		color: '#16a34a',
																		background: '#dcfce7',
																		padding: '2px 6px',
																		borderRadius: 8,
																		fontWeight: 700,
																	}}
																>
																	Alumno verificado
																</span>
															)}
														</div>
													</div>
													<span style={{ fontSize: 11, color: '#94a3b8' }}>{rev.date}</span>
												</div>

												<div style={{ display: 'flex', gap: 2, marginBottom: 8 }}>
													{[1, 2, 3, 4, 5].map((s) => (
														<Star
															key={s}
															size={14}
															fill={s <= rev.rating ? '#f59e0b' : 'none'}
															color="#f59e0b"
														/>
													))}
												</div>

												<p style={{ margin: 0, fontSize: 13, color: '#475569', lineHeight: 1.6 }}>
													"{rev.comment}"
												</p>
											</div>
										))
									)}
								</div>

								{/* Formulario para Dejar Reseña */}
								<div
									style={{
										padding: 24,
										background: '#f8fafc',
										borderRadius: 16,
										border: '1px solid #e2e8f0',
										height: 'fit-content',
									}}
								>
									<h3 style={{ margin: '0 0 8px', fontSize: 16, color: '#102a43' }}>
										¿Hiciste este curso? Dejá tu reseña
									</h3>
									<p style={{ margin: '0 0 20px', fontSize: 13, color: '#64748b' }}>
										Tu experiencia ayuda a futuros estudiantes a tomar la mejor decisión para su carrera.
									</p>

									{reviewSuccess && (
										<div
											style={{
												padding: '12px 16px',
												background: '#dcfce7',
												color: '#15803d',
												borderRadius: 10,
												fontSize: 13,
												fontWeight: 600,
												marginBottom: 16,
												display: 'flex',
												alignItems: 'center',
												gap: 8,
											}}
										>
											<CheckCircle2 size={16} /> ¡Muchas gracias! Tu opinión fue publicada con éxito.
										</div>
									)}

									<form onSubmit={handleSubmitReview} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
										<div>
											<label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#475569', marginBottom: 6 }}>
												Tu Nombre completo
											</label>
											<input
												type="text"
												required
												placeholder="Ej: Lucía Gómez"
												value={reviewerName}
												onChange={(e) => setReviewerName(e.target.value)}
												style={{
													width: '100%',
													padding: '10px 14px',
													borderRadius: 8,
													border: '1px solid #cbd5e1',
													fontSize: 13,
													outline: 'none',
													background: 'white',
												}}
											/>
										</div>

										<div>
											<label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#475569', marginBottom: 6 }}>
												Puntuación del curso
											</label>
											<div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
												{[1, 2, 3, 4, 5].map((s) => (
													<button
														key={s}
														type="button"
														onClick={() => setReviewerRating(s)}
														style={{
															background: 'transparent',
															border: 'none',
															cursor: 'pointer',
															padding: 2,
														}}
													>
														<Star
															size={24}
															fill={s <= reviewerRating ? '#f59e0b' : 'none'}
															color="#f59e0b"
														/>
													</button>
												))}
												<span style={{ fontSize: 13, fontWeight: 700, color: '#f59e0b', marginLeft: 8 }}>
													{reviewerRating} de 5 estrellas
												</span>
											</div>
										</div>

										<div>
											<label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#475569', marginBottom: 6 }}>
												Tu Comentario o Testimonio
											</label>
											<textarea
												required
												rows={4}
												placeholder="Contanos qué te pareció el contenido, la claridad del docente y los ejercicios..."
												value={reviewerComment}
												onChange={(e) => setReviewerComment(e.target.value)}
												style={{
													width: '100%',
													padding: '10px 14px',
													borderRadius: 8,
													border: '1px solid #cbd5e1',
													fontSize: 13,
													outline: 'none',
													resize: 'vertical',
													background: 'white',
													fontFamily: 'inherit',
												}}
											/>
										</div>

										<button
											type="submit"
											style={{
												padding: '12px 20px',
												background: '#2563eb',
												color: 'white',
												border: 'none',
												borderRadius: 8,
												fontWeight: 700,
												fontSize: 14,
												cursor: 'pointer',
												display: 'flex',
												alignItems: 'center',
												justifyContent: 'center',
												gap: 8,
												marginTop: 6,
											}}
										>
											Publicar mi opinión <ArrowRight size={16} />
										</button>
									</form>
								</div>
							</div>
						</section>
					</section>
				) : isCatalogPage ? (
					/* Vista Dedicada: Catálogo de Cursos */
					<section className="catalog" style={{ maxWidth: 1180, margin: '0 auto', padding: '36px 24px' }}>
						{/* Breadcrumbs */}
						<div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#64748b', marginBottom: 20 }}>
							<Link to="/" style={{ color: '#2563eb', textDecoration: 'none' }}>Inicio</Link>
							<span>/</span>
							<span style={{ color: '#0f172a', fontWeight: 600 }}>Catálogo de Cursos</span>
						</div>

						{/* Banner de Cabecera del Catálogo */}
						<div
							style={{
								background: 'linear-gradient(135deg, #0f172a 0%, #1e3a8a 100%)',
								color: 'white',
								borderRadius: 20,
								padding: '40px 36px',
								marginBottom: 36,
								boxShadow: '0 10px 30px rgba(0,0,0,0.08)',
							}}
						>
							<div
								style={{
									display: 'inline-flex',
									alignItems: 'center',
									gap: 6,
									background: 'rgba(56,189,248,0.2)',
									color: '#38bdf8',
									padding: '4px 14px',
									borderRadius: 20,
									fontSize: 11,
									fontWeight: 700,
									letterSpacing: 1,
									textTransform: 'uppercase',
									marginBottom: 16,
								}}
							>
								<Sparkles size={14} /> CATÁLOGO ACADÉMICO 2026
							</div>
							<h1 style={{ margin: '0 0 12px', fontSize: 'clamp(28px, 4vw, 38px)', fontWeight: 800 }}>
								Todos los Cursos y Especializaciones
							</h1>
							<p style={{ margin: 0, fontSize: 15, color: '#cbd5e1', maxWidth: 740, lineHeight: 1.6 }}>
								Programas de formación 100% online y a tu propio ritmo. Cada curso incluye acceso inmediato al Aula Virtual interactiva, proyectos prácticos aplicados y certificado oficial verificable.
							</p>
							<div style={{ display: 'flex', gap: 20, flexWrap: 'wrap', marginTop: 24, fontSize: 13, color: '#93c5fd' }}>
								<span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
									<BookOpen size={16} /> {products.length} Programas intensivos
								</span>
								<span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
									<Star size={16} fill="#f59e0b" color="#f59e0b" /> 4.9 Valoración media de estudiantes
								</span>
								<span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
									<Award size={16} /> Certificados con código QR único
								</span>
							</div>
						</div>

						{/* Banner interactivo de Orientación Vocacional */}
						<div
							style={{
								background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
								borderRadius: 16,
								padding: '20px 24px',
								color: 'white',
								marginBottom: 28,
								display: 'flex',
								justifyContent: 'space-between',
								alignItems: 'center',
								flexWrap: 'wrap',
								gap: 16,
								border: '1px solid #334155',
							}}
						>
							<div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
								<div
									style={{
										width: 44,
										height: 44,
										borderRadius: 12,
										background: 'rgba(56,189,248,0.15)',
										display: 'flex',
										alignItems: 'center',
										justifyContent: 'center',
										color: '#38bdf8',
										flexShrink: 0,
									}}
								>
									<Compass size={22} />
								</div>
								<div>
									<h3 style={{ margin: 0, fontSize: 15, fontWeight: 800 }}>¿No sabés qué curso elegir?</h3>
									<p style={{ margin: '2px 0 0', fontSize: 12, color: '#94a3b8' }}>
										Respondé 3 preguntas en nuestro test vocacional y te recomendamos tu formación ideal con un 50% OFF.
									</p>
								</div>
							</div>
							<button
								type="button"
								onClick={() => setIsCareerQuizOpen(true)}
								style={{
									background: '#2563eb',
									color: 'white',
									border: 'none',
									padding: '10px 18px',
									borderRadius: 8,
									fontWeight: 700,
									fontSize: 12,
									cursor: 'pointer',
									display: 'flex',
									alignItems: 'center',
									gap: 6,
									boxShadow: '0 4px 12px rgba(37,99,235,0.3)',
								}}
							>
								<Sparkles size={14} /> Hacer Test de 1 Minuto
							</button>
						</div>

						{/* Barra de Filtros y Categorías */}
						<div
							style={{
								display: 'flex',
								justifyContent: 'space-between',
								alignItems: 'center',
								flexWrap: 'wrap',
								gap: 16,
								marginBottom: 28,
								paddingBottom: 20,
								borderBottom: '1px solid #e2e8f0',
							}}
						>
							<div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
								{[
									{ id: 'todos', label: 'Todos los cursos' },
									{ id: 'programacion', label: 'Desarrollo & Datos' },
									{ id: 'diseno', label: 'Diseño UX/UI' },
									{ id: 'marketing', label: 'Marketing Digital' },
								].map((cat) => (
									<button
										key={cat.id}
										onClick={() => setSelectedCategory(cat.id)}
										style={{
											padding: '8px 16px',
											borderRadius: 20,
											fontSize: 12,
											fontWeight: 700,
											border: 'none',
											cursor: 'pointer',
											background: selectedCategory === cat.id ? '#102a43' : '#f1f5f9',
											color: selectedCategory === cat.id ? 'white' : '#475569',
											transition: 'all 0.2s',
										}}
									>
										{cat.label}
									</button>
								))}
							</div>

							<input
								type="text"
								placeholder="Buscar curso por tema..."
								value={searchQuery}
								onChange={(e) => setSearchQuery(e.target.value)}
								style={{
									padding: '8px 16px',
									borderRadius: 20,
									border: '1px solid #cbd5e1',
									fontSize: 13,
									minWidth: 240,
									outline: 'none',
								}}
							/>
						</div>

						{/* Grilla de Cursos */}
						<div className="grid">
							{filteredProducts.map((p, i) => {
								const curr = getCourseCurriculum(p.url_handle);
								const lessons = getAllLessons(curr);
								const ratingSummary = getCourseRatingSummary(p.url_handle);

								return (
									<article key={p.id}>
										<div className={'cover cover-' + (i % 4)}>
											<Code2 size={48} />
											<span>IMPULSO / FORMACIÓN DIGITAL</span>
										</div>
										<div className="card-body">
											<div
												style={{
													display: 'flex',
													justifyContent: 'space-between',
													alignItems: 'center',
													marginBottom: 6,
												}}
											>
												<small style={{ color: '#2563eb', fontWeight: 700 }}>{curr.level.toUpperCase()}</small>
												<span style={{ fontSize: 10, color: '#64748b' }}>{curr.totalHours}h · {lessons.length} clases</span>
											</div>
											<div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
												<div style={{ display: 'flex', alignItems: 'center', gap: 3, fontSize: 12, color: '#f59e0b', fontWeight: 700 }}>
													<Star size={13} fill="#f59e0b" color="#f59e0b" />
													<span>{ratingSummary.average}</span>
												</div>
												<span style={{ fontSize: 11, color: '#94a3b8' }}>({ratingSummary.count} reseñas)</span>
											</div>
											<h3 style={{ margin: '4px 0 12px' }}>{p.title}</h3>
											<p style={{ fontSize: 12, color: '#64748b', lineHeight: 1.6, minHeight: 38 }}>
												{p.subtitle || 'Aprende con proyectos reales y tutoría en vivo.'}
											</p>

											<div className="card-foot" style={{ marginTop: 16 }}>
												<strong style={{ fontSize: 15 }}>{p.price_formatted}</strong>
												<div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
													<button
														onClick={() => add(p)}
														title="Agregar al carrito"
														style={{
															padding: '8px 10px',
															background: '#eff6ff',
															border: '1px solid #bfdbfe',
															borderRadius: 6,
															color: '#1d4ed8',
															fontWeight: 700,
															cursor: 'pointer',
															display: 'flex',
															alignItems: 'center',
															gap: 4,
															fontSize: 12,
														}}
													>
														<ShoppingBag size={13} />
													</button>
													<Link
														to={`/curso/${p.url_handle}/aprender`}
														title="Ingresar directamente al Aula Virtual"
														style={{
															padding: '8px 10px',
															background: '#f1f5f9',
															borderRadius: 6,
															color: '#102a43',
															fontWeight: 700,
															display: 'flex',
															alignItems: 'center',
															gap: 4,
														}}
													>
														<Play size={13} fill="#102a43" /> Aula
													</Link>
													<Link
														to={'/curso/' + p.url_handle}
														style={{
															padding: '8px 12px',
															background: '#2563eb',
															color: 'white',
															borderRadius: 6,
															fontWeight: 700,
															display: 'flex',
															alignItems: 'center',
															gap: 4,
														}}
													>
														Ver curso <ArrowRight size={14} />
													</Link>
												</div>
											</div>
										</div>
									</article>
								);
							})}
						</div>

						{!filteredProducts.length && (
							<p style={{ textAlign: 'center', padding: '40px 0', color: '#64748b' }}>
								No se encontraron cursos que coincidan con tu búsqueda.
							</p>
						)}
					</section>
				) : (
					/* Vista de Inicio / Landing Page */
					<>
						<section className="hero">
							<div className="eyebrow">
								<span /> FORMACIÓN PARA TU PRÓXIMO PASO
							</div>
							<h1>
								Tu futuro empieza
								<br />
								con lo que <em>aprendés hoy.</em>
							</h1>
							<p>
								Aprendé nuevas habilidades. Desarrollá tu potencial.
								<br />
								Formación técnica y profesional, a tu ritmo y desde donde estés con nuestra Aula Virtual interactiva.
							</p>
							<div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', alignItems: 'center' }}>
								<Link className="primary" to="/cursos">
									Explorar catálogo de cursos <ArrowRight size={18} />
								</Link>
								<Link
									to="/curso/desarrollo-web-fullstack/aprender"
									className="secondary"
									style={{
										background: 'rgba(255,255,255,0.12)',
										color: 'white',
										padding: '17px 22px',
										borderRadius: 7,
										fontWeight: 700,
										border: '1px solid rgba(255,255,255,0.25)',
										display: 'inline-flex',
										alignItems: 'center',
										gap: 8,
										margin: 0,
									}}
								>
									<Play size={16} fill="white" /> Probar Aula Virtual Demo
								</Link>
								<button
									type="button"
									onClick={() => setIsCareerQuizOpen(true)}
									style={{
										background: 'rgba(56,189,248,0.15)',
										color: '#38bdf8',
										padding: '17px 22px',
										borderRadius: 7,
										fontWeight: 700,
										border: '1px solid rgba(56,189,248,0.4)',
										display: 'inline-flex',
										alignItems: 'center',
										gap: 8,
										cursor: 'pointer',
										margin: 0,
										fontSize: 13,
									}}
								>
									<Compass size={18} /> Test de Orientación (1 min)
								</button>
							</div>

							<div className="hero-bottom">
								<span>
									<BookOpen size={18} /> Aula virtual 100% interactiva
								</span>
								<span>
									<Award size={18} /> Certificados oficiales de logro
								</span>
								<span>
									<ShieldCheck size={18} /> Inscripción segura
								</span>
							</div>
							<div className="graphic">
								<Code2 size={75} />
								<span>APRENDÉ. APLICÁ. AVANZÁ.</span>
								<div className="graphic-line" />
							</div>
						</section>

						{/* Cursos Destacados en Portada */}
						<section className="catalog" style={{ maxWidth: 1180, margin: '0 auto', padding: '40px 24px' }}>
							<div className="section-head" style={{ marginBottom: 28 }}>
								<div>
									<small>PROGRAMAS RECOMENDADOS</small>
									<h2>Cursos Destacados</h2>
								</div>
								<Link
									to="/cursos"
									style={{
										display: 'inline-flex',
										alignItems: 'center',
										gap: 6,
										color: '#2563eb',
										fontWeight: 700,
										fontSize: 14,
										textDecoration: 'none',
									}}
								>
									Ver todos los cursos ({products.length}) <ArrowRight size={16} />
								</Link>
							</div>

							<div className="grid">
								{products.slice(0, 3).map((p, i) => {
									const curr = getCourseCurriculum(p.url_handle);
									const lessons = getAllLessons(curr);
									const ratingSummary = getCourseRatingSummary(p.url_handle);

									return (
										<article key={p.id}>
											<div className={'cover cover-' + (i % 4)}>
												<Code2 size={48} />
												<span>IMPULSO / FORMACIÓN DIGITAL</span>
											</div>
											<div className="card-body">
												<div
													style={{
														display: 'flex',
														justifyContent: 'space-between',
														alignItems: 'center',
														marginBottom: 6,
													}}
												>
													<small style={{ color: '#2563eb', fontWeight: 700 }}>{curr.level.toUpperCase()}</small>
													<span style={{ fontSize: 10, color: '#64748b' }}>{curr.totalHours}h · {lessons.length} clases</span>
												</div>
												<div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
													<div style={{ display: 'flex', alignItems: 'center', gap: 3, fontSize: 12, color: '#f59e0b', fontWeight: 700 }}>
														<Star size={13} fill="#f59e0b" color="#f59e0b" />
														<span>{ratingSummary.average}</span>
													</div>
													<span style={{ fontSize: 11, color: '#94a3b8' }}>({ratingSummary.count} reseñas)</span>
												</div>
												<h3 style={{ margin: '4px 0 12px' }}>{p.title}</h3>
												<p style={{ fontSize: 12, color: '#64748b', lineHeight: 1.6, minHeight: 38 }}>
													{p.subtitle || 'Aprende con proyectos reales y tutoría en vivo.'}
												</p>

												<div className="card-foot" style={{ marginTop: 16 }}>
													<strong style={{ fontSize: 15 }}>{p.price_formatted}</strong>
													<div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
														<button
															onClick={() => add(p)}
															title="Agregar al carrito"
															style={{
																padding: '8px 10px',
																background: '#eff6ff',
																border: '1px solid #bfdbfe',
																borderRadius: 6,
																color: '#1d4ed8',
																fontWeight: 700,
																cursor: 'pointer',
																display: 'flex',
																alignItems: 'center',
																gap: 4,
																fontSize: 12,
															}}
														>
															<ShoppingBag size={13} />
														</button>
														<Link
															to={`/curso/${p.url_handle}/aprender`}
															title="Ingresar directamente al Aula Virtual"
															style={{
																padding: '8px 10px',
																background: '#f1f5f9',
																borderRadius: 6,
																color: '#102a43',
																fontWeight: 700,
																display: 'flex',
																alignItems: 'center',
																gap: 4,
															}}
														>
															<Play size={13} fill="#102a43" /> Aula
														</Link>
														<Link
															to={'/curso/' + p.url_handle}
															style={{
																padding: '8px 12px',
																background: '#2563eb',
																color: 'white',
																borderRadius: 6,
																fontWeight: 700,
																display: 'flex',
																alignItems: 'center',
																gap: 4,
															}}
														>
															Ver curso <ArrowRight size={14} />
														</Link>
													</div>
												</div>
											</div>
										</article>
									);
								})}
							</div>

							<div style={{ textAlign: 'center', marginTop: 32 }}>
								<Link
									to="/cursos"
									style={{
										display: 'inline-flex',
										alignItems: 'center',
										gap: 8,
										background: '#102a43',
										color: 'white',
										padding: '14px 28px',
										borderRadius: 10,
										fontWeight: 700,
										fontSize: 14,
										textDecoration: 'none',
									}}
								>
									Explorar todos los cursos en el Catálogo <ArrowRight size={16} />
								</Link>
							</div>
						</section>

						<section id="beneficios" className="benefits">
							<small>UN NUEVO CAMINO PROFESIONAL</small>
							<h2>
								El conocimiento abre puertas.
								<br />
								Vos decidís cuál es la próxima.
							</h2>
							<p>
								Formate con contenidos actualizados, diseñados por expertos de la industria. Cada curso incluye
								acceso ilimitado a nuestra <strong>Aula Virtual</strong>, temarios por módulos, videos explicativos,
								material descargable y certificado oficial al completar todas las clases.
							</p>
						</section>

						<section id="preguntas" className="catalog">
							<h2>Preguntas frecuentes</h2>
							<details>
								<summary>¿Cómo accedo a las clases del curso?</summary>
								<p>
									Podés ingresar directamente a nuestra <strong>Aula Virtual</strong> haciendo clic en "Ingresar al Aula
									Virtual" en cualquier curso. Todas las clases están organizadas por módulos temáticos con videos y
									material práctico.
								</p>
							</details>
							<details>
								<summary>¿Cómo se entrega el certificado?</summary>
								<p>
									A medida que completás cada lección, tu barra de progreso avanzará. Al llegar al 100%, se habilitará de
									forma automática tu certificado oficial personalizado con tu nombre para que lo descargues o
									imprimas en PDF.
								</p>
							</details>
							<details>
								<summary>¿Cómo se realiza el pago?</summary>
								<p>
									Agregá el curso al carrito y continuá al checkout para completar tu inscripción segura con los métodos
									de pago disponibles.
								</p>
							</details>
						</section>
					</>
				)}
			</main>

			<CareerQuizModal
				isOpen={isCareerQuizOpen}
				onClose={() => setIsCareerQuizOpen(false)}
			/>

			<GlobalFooter />
		</>
	);
}
