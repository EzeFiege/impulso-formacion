import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import type { Route } from './+types/admin';
import { FALLBACK_COURSES } from '@/api/mock-courses';
import {
	GraduationCap,
	Users,
	BookOpen,
	DollarSign,
	TrendingUp,
	PlusCircle,
	Search,
	Edit,
	CheckCircle2,
	AlertCircle,
	ArrowLeft,
	Sparkles,
	X,
	Award,
	Layers,
	Tag,
	Trash2,
	Power,
} from 'lucide-react';
import { GlobalNavbar } from '@/components/global-navbar';
import { GlobalFooter } from '@/components/global-footer';
import {
	getStoredCoupons,
	addPromoCoupon,
	toggleCouponActive,
	deleteCoupon,
	type PromoCoupon,
} from '@/lib/promo-coupons';

export function meta() {
	return [
		{ title: 'Panel de Administración | Impulso Formación' },
		{ name: 'description', content: 'Gestión académica de cursos, instructores y métricas de estudiantes.' },
	];
}

type AdminCourse = {
	id: string;
	title: string;
	category: string;
	price: string;
	enrolledCount: number;
	status: 'Publicado' | 'Borrador';
};

const INITIAL_ADMIN_COURSES: AdminCourse[] = [
	{
		id: 'c1',
		title: 'Programación de PLC Siemens S7-1200 / S7-1500 & TIA Portal',
		category: 'Automatización & PLC',
		price: '$ 34.900',
		enrolledCount: 780,
		status: 'Publicado',
	},
	{
		id: 'c2',
		title: 'Electricidad Industrial, Tableros de Control & Protecciones',
		category: 'Electricidad Industrial',
		price: '$ 28.500',
		enrolledCount: 540,
		status: 'Publicado',
	},
	{
		id: 'c3',
		title: 'Instrumentación Industrial & Lazos de Control PID',
		category: 'Instrumentación & Control',
		price: '$ 29.900',
		enrolledCount: 390,
		status: 'Publicado',
	},
	{
		id: 'c4',
		title: 'Sistemas SCADA, Redes Industriales & Ciberseguridad OT',
		category: 'Redes Industriales & OT',
		price: '$ 36.000',
		enrolledCount: 310,
		status: 'Publicado',
	},
];

const RECENT_STUDENTS = [
	{ id: 's1', name: 'Alex González', email: 'alex.gonzalez@impulso.edu', course: 'Programación de PLC Siemens S7', progress: 100, date: 'Hoy' },
	{ id: 's2', name: 'Ing. Javier Morales', email: 'j.morales@planta.com', course: 'Programación de PLC Siemens S7', progress: 85, date: 'Ayer' },
	{ id: 's3', name: 'Marcelo Peralta', email: 'm.peralta@taller.com', course: 'Electricidad Industrial & Tableros', progress: 70, date: 'Hace 2 días' },
	{ id: 's4', name: 'Laura Domínguez', email: 'laura.d@refineria.com', course: 'Instrumentación Industrial & PID', progress: 55, date: 'Hace 3 días' },
	{ id: 's5', name: 'Valentina Castro', email: 'valen.castro@gmail.com', course: 'Marketing Digital', progress: 90, date: 'Hace 4 días' },
];
export default function AdminDashboard() {
	const [courses, setCourses] = useState<AdminCourse[]>(INITIAL_ADMIN_COURSES);
	const [activeSection, setActiveSection] = useState<'courses' | 'coupons' | 'students'>('courses');
	const [searchQuery, setSearchQuery] = useState('');
	const [newCourseModal, setNewCourseModal] = useState(false);
	const [notification, setNotification] = useState<string | null>(null);

	// Estado de cupones
	const [coupons, setCoupons] = useState<PromoCoupon[]>([]);
	const [newCouponModal, setNewCouponModal] = useState(false);
	const [couponCodeInput, setCouponCodeInput] = useState('');
	const [couponDiscountInput, setCouponDiscountInput] = useState(30);
	const [couponDescInput, setCouponDescInput] = useState('');

	useEffect(() => {
		setCoupons(getStoredCoupons());
		const handler = () => setCoupons(getStoredCoupons());
		window.addEventListener('impulso_coupons_change', handler);
		return () => window.removeEventListener('impulso_coupons_change', handler);
	}, []);

	// Formulario de nuevo curso
	const [newTitle, setNewTitle] = useState('');
	const [newCategory, setNewCategory] = useState('Programación');
	const [newPrice, setNewPrice] = useState('$ 19.900');

	function showToast(msg: string) {
		setNotification(msg);
		setTimeout(() => setNotification(null), 3500);
	}

	function handleCreateCourse(e: React.FormEvent) {
		e.preventDefault();
		if (!newTitle.trim()) return;

		const created: AdminCourse = {
			id: 'c_' + Date.now(),
			title: newTitle.trim(),
			category: newCategory,
			price: newPrice.trim(),
			enrolledCount: 0,
			status: 'Publicado',
		};

		setCourses([created, ...courses]);
		setNewTitle('');
		setNewCourseModal(false);
		showToast(`Curso "${created.title}" creado y publicado exitosamente.`);
	}

	function toggleCourseStatus(courseId: string) {
		setCourses((prev) =>
			prev.map((c) =>
				c.id === courseId
					? { ...c, status: c.status === 'Publicado' ? 'Borrador' : 'Publicado' }
					: c,
			),
		);
		showToast('Estado del curso actualizado.');
	}

	function handleCreateCoupon(e: React.FormEvent) {
		e.preventDefault();
		if (!couponCodeInput.trim()) return;
		const updated = addPromoCoupon({
			code: couponCodeInput.trim(),
			discountPercent: Number(couponDiscountInput) || 10,
			description: couponDescInput.trim() || 'Descuento promocional',
		});
		setCoupons(updated);
		setCouponCodeInput('');
		setCouponDescInput('');
		setNewCouponModal(false);
		showToast(`Cupón "${couponCodeInput.toUpperCase()}" creado y activado.`);
	}

	function handleToggleCoupon(id: string) {
		const updated = toggleCouponActive(id);
		setCoupons(updated);
		showToast('Estado del cupón actualizado.');
	}

	function handleDeleteCoupon(id: string) {
		const updated = deleteCoupon(id);
		setCoupons(updated);
		showToast('Cupón eliminado correctamente.');
	}

	const filteredCourses = courses.filter((c) =>
		c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
		c.category.toLowerCase().includes(searchQuery.toLowerCase()),
	);

	return (
		<div className="min-h-screen bg-[#f8fafc] text-[#102a43] flex flex-col font-sans">
			{/* Toast */}
			{notification && (
				<div className="fixed bottom-6 right-6 z-50 bg-[#102a43] text-white px-5 py-3 rounded-xl shadow-2xl border border-sky-400/40 text-sm flex items-center gap-3 animate-fade-in">
					<Sparkles size={18} className="text-sky-400" />
					<span>{notification}</span>
				</div>
			)}

			{/* Modal Crear Curso */}
			{newCourseModal && (
				<div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
					<div className="bg-white rounded-2xl max-w-lg w-full p-6 md:p-8 shadow-2xl border border-slate-200">
						<div className="flex justify-between items-center mb-6">
							<div>
								<h3 className="text-lg font-bold text-[#102a43]">Crear Nuevo Curso Académico</h3>
								<p className="text-xs text-slate-500">Agregá una nueva formación a la plataforma.</p>
							</div>
							<button onClick={() => setNewCourseModal(false)} className="p-1 text-slate-400 hover:text-slate-700">
								<X size={20} />
							</button>
						</div>

						<form onSubmit={handleCreateCourse} className="space-y-4">
							<div>
								<label className="block text-xs font-semibold text-slate-700 mb-1">Título del Curso</label>
								<input
									type="text"
									value={newTitle}
									onChange={(e) => setNewTitle(e.target.value)}
									placeholder="Ej: Ciberseguridad & Redes Defensivas"
									className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-blue-500"
									required
								/>
							</div>

							<div className="grid grid-cols-2 gap-4">
								<div>
									<label className="block text-xs font-semibold text-slate-700 mb-1">Categoría</label>
									<select
										value={newCategory}
										onChange={(e) => setNewCategory(e.target.value)}
										className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-blue-500 bg-white"
									>
										<option value="Programación">Programación</option>
										<option value="Ciencia de Datos">Ciencia de Datos</option>
										<option value="Diseño">Diseño UX/UI</option>
										<option value="Marketing">Marketing Digital</option>
										<option value="Ciberseguridad">Ciberseguridad</option>
									</select>
								</div>
								<div>
									<label className="block text-xs font-semibold text-slate-700 mb-1">Precio</label>
									<input
										type="text"
										value={newPrice}
										onChange={(e) => setNewPrice(e.target.value)}
										placeholder="$ 22.000"
										className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-blue-500"
										required
									/>
								</div>
							</div>

							<div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
								<button
									type="button"
									onClick={() => setNewCourseModal(false)}
									className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
								>
									Cancelar
								</button>
								<button
									type="submit"
									className="px-5 py-2 text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white rounded-lg shadow-sm"
								>
									Publicar Curso
								</button>
							</div>
						</form>
					</div>
				</div>
			)}

			{/* Modal Crear Cupón */}
			{newCouponModal && (
				<div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
					<div className="bg-white rounded-2xl max-w-md w-full p-6 md:p-8 shadow-2xl border border-slate-200">
						<div className="flex justify-between items-center mb-6">
							<div>
								<h3 className="text-lg font-bold text-[#102a43]">Crear Cupón o Beca</h3>
								<p className="text-xs text-slate-500">Configurá un código de descuento para los estudiantes.</p>
							</div>
							<button onClick={() => setNewCouponModal(false)} className="p-1 text-slate-400 hover:text-slate-700">
								<X size={20} />
							</button>
						</div>

						<form onSubmit={handleCreateCoupon} className="space-y-4">
							<div>
								<label className="block text-xs font-semibold text-slate-700 mb-1">Código del Cupón</label>
								<input
									type="text"
									value={couponCodeInput}
									onChange={(e) => setCouponCodeInput(e.target.value.toUpperCase())}
									placeholder="Ej: ESPECIAL40"
									className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm uppercase focus:outline-none focus:border-blue-500 font-mono"
									required
								/>
							</div>

							<div>
								<label className="block text-xs font-semibold text-slate-700 mb-1">Porcentaje de Descuento (%)</label>
								<input
									type="number"
									min={1}
									max={100}
									value={couponDiscountInput}
									onChange={(e) => setCouponDiscountInput(Number(e.target.value))}
									className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-blue-500"
									required
								/>
							</div>

							<div>
								<label className="block text-xs font-semibold text-slate-700 mb-1">Descripción / Motivo</label>
								<input
									type="text"
									value={couponDescInput}
									onChange={(e) => setCouponDescInput(e.target.value)}
									placeholder="Ej: Beca del 40% para exalumnos de diseño"
									className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-blue-500"
									required
								/>
							</div>

							<div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
								<button
									type="button"
									onClick={() => setNewCouponModal(false)}
									className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
								>
									Cancelar
								</button>
								<button
									type="submit"
									className="px-5 py-2 text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white rounded-lg shadow-sm"
								>
									Crear Cupón Activo
								</button>
							</div>
						</form>
					</div>
				</div>
			)}

			{/* Navbar Unificada */}
			<GlobalNavbar />

			{/* Sub-banner indicador de modo administrador */}
			<div className="bg-amber-50 border-b border-amber-200 px-6 py-2.5 flex items-center justify-between text-xs text-amber-900">
				<div className="flex items-center gap-2">
					<span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
					<span className="font-bold">Modo Administrador:</span>
					<span className="text-amber-800">Panel de control de cursos, estudiantes y métricas</span>
				</div>
				<span className="text-[11px] font-semibold text-amber-700 bg-amber-100 px-2 py-0.5 rounded border border-amber-300">
					Acceso Privilegiado
				</span>
			</div>

			<main className="flex-1 max-w-6xl w-full mx-auto px-4 py-8 md:py-12 space-y-8">
				<div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
					<div>
						<h1 className="text-2xl font-bold text-[#102a43]">Panel de Control de la Academia</h1>
						<p className="text-xs text-slate-500">Supervisá cursos, estudiantes y desempeño académico.</p>
					</div>

					<button
						onClick={() => setNewCourseModal(true)}
						className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold shadow-sm transition-colors"
					>
						<PlusCircle size={16} /> Crear Nuevo Curso
					</button>
				</div>

				{/* KPIs Principales */}
				<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
					<div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
						<div className="p-2 w-fit rounded-lg bg-blue-50 text-blue-600 mb-2">
							<Users size={20} />
						</div>
						<div className="text-2xl font-extrabold text-[#102a43]">1.420</div>
						<div className="text-xs text-slate-500 font-medium">Estudiantes Activos</div>
					</div>

					<div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
						<div className="p-2 w-fit rounded-lg bg-emerald-50 text-emerald-600 mb-2">
							<BookOpen size={20} />
						</div>
						<div className="text-2xl font-extrabold text-[#102a43]">{courses.length}</div>
						<div className="text-xs text-slate-500 font-medium">Cursos en Catálogo</div>
					</div>

					<div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
						<div className="p-2 w-fit rounded-lg bg-amber-50 text-amber-600 mb-2">
							<Award size={20} />
						</div>
						<div className="text-2xl font-extrabold text-[#102a43]">348</div>
						<div className="text-xs text-slate-500 font-medium">Certificados Emitidos</div>
					</div>

					<div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
						<div className="p-2 w-fit rounded-lg bg-sky-50 text-sky-600 mb-2">
							<Tag size={20} />
						</div>
						<div className="text-2xl font-extrabold text-[#102a43]">{coupons.filter((c) => c.active).length}</div>
						<div className="text-xs text-slate-500 font-medium">Cupones y Becas Activas</div>
					</div>
				</div>

				{/* Pestañas de Gestión del Administrador */}
				<div className="flex border-b border-slate-200 gap-4 text-xs font-bold">
					<button
						type="button"
						onClick={() => setActiveSection('courses')}
						className={`pb-3 border-b-2 transition-colors flex items-center gap-2 cursor-pointer ${
							activeSection === 'courses'
								? 'border-blue-600 text-blue-600'
								: 'border-transparent text-slate-500 hover:text-slate-800'
						}`}
					>
						<BookOpen size={16} /> Cursos Académicos ({courses.length})
					</button>

					<button
						type="button"
						onClick={() => setActiveSection('coupons')}
						className={`pb-3 border-b-2 transition-colors flex items-center gap-2 cursor-pointer ${
							activeSection === 'coupons'
								? 'border-blue-600 text-blue-600'
								: 'border-transparent text-slate-500 hover:text-slate-800'
						}`}
					>
						<Tag size={16} /> Cupones y Becas ({coupons.length})
					</button>

					<button
						type="button"
						onClick={() => setActiveSection('students')}
						className={`pb-3 border-b-2 transition-colors flex items-center gap-2 cursor-pointer ${
							activeSection === 'students'
								? 'border-blue-600 text-blue-600'
								: 'border-transparent text-slate-500 hover:text-slate-800'
						}`}
					>
						<Users size={16} /> Estudiantes Recientes ({RECENT_STUDENTS.length})
					</button>
				</div>

				{/* 1. SECCIÓN DE CURSOS */}
				{activeSection === 'courses' && (
					<div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden space-y-4 p-6 animate-fade-in">
						<div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
							<div>
								<h2 className="text-base font-bold text-[#102a43]">Cursos Publicados y Gestión</h2>
								<p className="text-xs text-slate-500">Habilitá o pausá cursos del catálogo público.</p>
							</div>

							<input
								type="text"
								placeholder="Buscar curso..."
								value={searchQuery}
								onChange={(e) => setSearchQuery(e.target.value)}
								className="px-3 py-1.5 border border-slate-300 rounded-lg text-xs w-full sm:w-60 focus:outline-none focus:border-blue-500"
							/>
						</div>

						<div className="overflow-x-auto">
							<table className="w-full text-left text-xs">
								<thead>
									<tr className="border-b border-slate-200 text-slate-400 uppercase tracking-wider text-[10px]">
										<th className="pb-3 font-semibold">Curso</th>
										<th className="pb-3 font-semibold">Categoría</th>
										<th className="pb-3 font-semibold">Precio</th>
										<th className="pb-3 font-semibold">Alumnos</th>
										<th className="pb-3 font-semibold">Estado</th>
										<th className="pb-3 font-semibold text-right">Acción</th>
									</tr>
								</thead>
								<tbody className="divide-y divide-slate-100">
									{filteredCourses.map((c) => (
										<tr key={c.id} className="hover:bg-slate-50/60 transition-colors">
											<td className="py-3 font-bold text-[#102a43] max-w-xs truncate">{c.title}</td>
											<td className="py-3 text-slate-500">{c.category}</td>
											<td className="py-3 font-semibold text-slate-800">{c.price}</td>
											<td className="py-3 text-slate-600 font-medium">{c.enrolledCount} matriculados</td>
											<td className="py-3">
												<span
													className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
														c.status === 'Publicado'
															? 'bg-emerald-100 text-emerald-800'
															: 'bg-amber-100 text-amber-800'
													}`}
												>
													{c.status}
												</span>
											</td>
											<td className="py-3 text-right">
												<button
													onClick={() => toggleCourseStatus(c.id)}
													className="text-xs font-semibold text-blue-600 hover:text-blue-800 cursor-pointer"
												>
													{c.status === 'Publicado' ? 'Pausar' : 'Activar'}
												</button>
											</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
					</div>
				)}

				{/* 2. SECCIÓN DE CUPONES Y BECAS */}
				{activeSection === 'coupons' && (
					<div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden space-y-4 p-6 animate-fade-in">
						<div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
							<div>
								<h2 className="text-base font-bold text-[#102a43]">Cupones de Descuento y Becas</h2>
								<p className="text-xs text-slate-500">Creá códigos promocionales que los alumnos pueden aplicar en el carrito.</p>
							</div>

							<button
								type="button"
								onClick={() => setNewCouponModal(true)}
								className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold shadow-sm transition-colors cursor-pointer"
							>
								<PlusCircle size={15} /> Crear Nuevo Cupón
							</button>
						</div>

						<div className="overflow-x-auto">
							<table className="w-full text-left text-xs">
								<thead>
									<tr className="border-b border-slate-200 text-slate-400 uppercase tracking-wider text-[10px]">
										<th className="pb-3 font-semibold">Código</th>
										<th className="pb-3 font-semibold">Descuento</th>
										<th className="pb-3 font-semibold">Descripción</th>
										<th className="pb-3 font-semibold">Usos</th>
										<th className="pb-3 font-semibold">Estado</th>
										<th className="pb-3 font-semibold text-right">Acciones</th>
									</tr>
								</thead>
								<tbody className="divide-y divide-slate-100">
									{coupons.map((c) => (
										<tr key={c.id} className="hover:bg-slate-50/60 transition-colors">
											<td className="py-3 font-mono font-bold text-blue-600 text-sm">{c.code}</td>
											<td className="py-3">
												<span className="px-2 py-0.5 rounded-full font-bold text-[11px] bg-emerald-100 text-emerald-800 border border-emerald-300">
													{c.discountPercent}% OFF
												</span>
											</td>
											<td className="py-3 text-slate-600 max-w-xs">{c.description}</td>
											<td className="py-3 font-bold text-slate-700">{c.usesCount} canjes</td>
											<td className="py-3">
												<span
													className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
														c.active
															? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
															: 'bg-slate-100 text-slate-500 border border-slate-200'
													}`}
												>
													{c.active ? 'Activo' : 'Pausado'}
												</span>
											</td>
											<td className="py-3 text-right">
												<div className="flex items-center justify-end gap-2">
													<button
														type="button"
														onClick={() => handleToggleCoupon(c.id)}
														className={`p-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
															c.active
																? 'bg-amber-50 hover:bg-amber-100 text-amber-700'
																: 'bg-emerald-50 hover:bg-emerald-100 text-emerald-700'
														}`}
														title={c.active ? 'Pausar cupón' : 'Activar cupón'}
													>
														<Power size={14} />
													</button>
													<button
														type="button"
														onClick={() => handleDeleteCoupon(c.id)}
														className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 text-xs font-semibold transition-colors cursor-pointer"
														title="Eliminar cupón"
													>
														<Trash2 size={14} />
													</button>
												</div>
											</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
					</div>
				)}

				{/* 3. SECCIÓN DE ESTUDIANTES */}
				{activeSection === 'students' && (
					<div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4 animate-fade-in">
						<div>
							<h2 className="text-base font-bold text-[#102a43]">Estudiantes Recientes</h2>
							<p className="text-xs text-slate-500">Seguimiento en tiempo real del progreso de los alumnos.</p>
						</div>

						<div className="overflow-x-auto">
							<table className="w-full text-left text-xs">
								<thead>
									<tr className="border-b border-slate-200 text-slate-400 uppercase tracking-wider text-[10px]">
										<th className="pb-3 font-semibold">Estudiante</th>
										<th className="pb-3 font-semibold">Curso Matriculado</th>
										<th className="pb-3 font-semibold">Progreso</th>
										<th className="pb-3 font-semibold text-right">Fecha</th>
									</tr>
								</thead>
								<tbody className="divide-y divide-slate-100">
									{RECENT_STUDENTS.map((s) => (
										<tr key={s.id} className="hover:bg-slate-50/60 transition-colors">
											<td className="py-3">
												<div className="font-bold text-[#102a43]">{s.name}</div>
												<div className="text-[11px] text-slate-400">{s.email}</div>
											</td>
											<td className="py-3 text-slate-700 font-medium">{s.course}</td>
											<td className="py-3">
												<div className="flex items-center gap-2">
													<div className="w-16 bg-slate-100 h-1.5 rounded-full overflow-hidden">
														<div className="bg-blue-600 h-full rounded-full" style={{ width: `${s.progress}%` }} />
													</div>
													<span className="font-bold text-[11px] text-slate-600">{s.progress}%</span>
												</div>
											</td>
											<td className="py-3 text-right text-slate-500">{s.date}</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
					</div>
				)}
			</main>
			<GlobalFooter />
		</div>
	);
}
