import { useState, useMemo } from 'react';
import { Link } from 'react-router';
import {
	GraduationCap,
	HelpCircle,
	Search,
	BookOpen,
	Award,
	CreditCard,
	MessageSquare,
	ChevronDown,
	ChevronUp,
	Send,
	CheckCircle2,
	Clock,
	Sparkles,
	PhoneCall,
	LifeBuoy,
	FileText,
	ShieldCheck,
} from 'lucide-react';
import { GlobalNavbar } from '@/components/global-navbar';
import { GlobalFooter } from '@/components/global-footer';

type FAQItem = {
	id: string;
	category: 'aula' | 'certificados' | 'pagos' | 'tutoria';
	question: string;
	answer: string;
};

const FAQ_LIST: FAQItem[] = [
	{
		id: 'faq-1',
		category: 'aula',
		question: '¿Cómo se guarda mi progreso en las lecciones del curso?',
		answer:
			'Tu progreso se guarda automáticamente en tiempo real. Cuando terminas de ver una clase o haces clic en "Marcar como completada", el sistema actualiza tu barra de progreso y desbloquea el siguiente contenido. Puedes cerrar tu navegador y retomar en cualquier momento desde tu Panel de Alumno.',
	},
	{
		id: 'faq-2',
		category: 'aula',
		question: '¿Qué son las notas sincronizadas con el video y cómo funcionan?',
		answer:
			'Mientras ves cualquier clase interactiva, puedes escribir apuntes en la pestaña "Mis Notas". Cada apunte registra el segundo exacto en el que estabas mirando el video. Al hacer clic sobre el tiempo de la nota, el reproductor saltará automáticamente a ese instante. Además, puedes descargar todos tus apuntes en formato Markdown (.md).',
	},
	{
		id: 'faq-3',
		category: 'certificados',
		question: '¿Qué requisitos necesito para obtener mi Certificado Oficial?',
		answer:
			'Debes completar el 100% de las clases del curso y aprobar las evaluaciones interactivas al final de cada módulo con un puntaje mínimo del 75%. Al cumplirlo, el diploma digital se genera de inmediato con tu nombre y un código único de validación pública (ej: IMP-2026-WEB-7842).',
	},
	{
		id: 'faq-4',
		category: 'certificados',
		question: '¿Cómo puede un reclutador o empleador verificar mi certificado?',
		answer:
			'Cualquier empresa puede ingresar a nuestra página pública de verificación en /verificar-certificado e ingresar el código alfanumérico impreso en tu diploma. El sistema mostrará la fecha de acreditación, horas cursadas y el aval de Impulso Formación.',
	},
	{
		id: 'faq-5',
		category: 'pagos',
		question: '¿Cómo aplico un cupón de descuento o beca?',
		answer:
			'En el carrito de compras lateral o en la pantalla de inscripción, encontrarás el casillero "¿Tenés un cupón de descuento o beca?". Puedes ingresar el código IMPULSO50 para obtener un 50% de bonificación o BECA100 para acceder de manera 100% bonificada. Haz clic en "Aplicar" para ver el descuento reflejado al instante.',
	},
	{
		id: 'faq-6',
		category: 'pagos',
		question: '¿Tengo acceso de por vida a los cursos que compro?',
		answer:
			'Sí, todos nuestros programas incluyen acceso ilimitado y de por vida al Aula Virtual, incluyendo todas las futuras actualizaciones que el equipo docente agregue a los temarios y recursos descargables.',
	},
	{
		id: 'faq-7',
		category: 'tutoria',
		question: '¿Cómo me comunico con el docente si tengo dudas con un ejercicio?',
		answer:
			'Dentro de cada lección en el Aula Virtual, dispones de la pestaña "Dudas y Comunidad". Puedes dejar tu pregunta directamente y el tutor asignado te responderá en el foro de la clase. Además, para dudas urgentes dispones de atención directa por WhatsApp.',
	},
	{
		id: 'faq-8',
		category: 'tutoria',
		question: '¿Los cursos incluyen proyectos prácticos reales para mi portafolio?',
		answer:
			'Absolutamente. En Impulso Formación cada especialización está diseñada con enfoque práctico "Aprende haciendo". Al finalizar el programa habrás desarrollado proyectos reales listos para publicar en GitHub o en tu portafolio profesional.',
	},
];

export function meta() {
	return [
		{ title: 'Centro de Ayuda y Soporte | Impulso Formación' },
		{ name: 'description', content: 'Preguntas frecuentes, asistencia técnica y contacto con el tutor en Impulso Formación.' },
	];
}

export default function HelpPage() {
	const [searchQuery, setSearchQuery] = useState('');
	const [activeCategory, setActiveCategory] = useState<string>('todos');
	const [openFaqId, setOpenFaqId] = useState<string | null>('faq-1');

	// Formulario de contacto
	const [ticketName, setTicketName] = useState('');
	const [ticketEmail, setTicketEmail] = useState('');
	const [ticketCourse, setTicketCourse] = useState('programacion-plc-siemens-tia-portal');
	const [ticketMessage, setTicketMessage] = useState('');
	const [ticketSuccess, setTicketSuccess] = useState<string | null>(null);

	const filteredFaqs = useMemo(() => {
		return FAQ_LIST.filter((f) => {
			const matchesCategory = activeCategory === 'todos' || f.category === activeCategory;
			const matchesSearch =
				f.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
				f.answer.toLowerCase().includes(searchQuery.toLowerCase());
			return matchesCategory && matchesSearch;
		});
	}, [searchQuery, activeCategory]);

	function handleSendTicket(e: React.FormEvent) {
		e.preventDefault();
		if (!ticketName.trim() || !ticketEmail.trim() || !ticketMessage.trim()) return;

		const ticketCode = 'TK-' + Math.floor(1000 + Math.random() * 9000);
		setTicketSuccess(ticketCode);
		setTicketMessage('');
		setTimeout(() => {
			// Auto scroll al mensaje de confirmación
		}, 100);
	}

	return (
		<div className="min-h-screen bg-[#f8fafc] text-slate-800 flex flex-col font-sans">
			{/* Navbar Unificada */}
			<GlobalNavbar />

			{/* Banner de Cabecera */}
			<section className="bg-gradient-to-br from-[#102a43] via-[#1e3a5f] to-[#0f172a] text-white py-16 px-6">
				<div className="max-w-4xl mx-auto text-center space-y-6">
					<div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-500/20 border border-sky-400/30 text-sky-300 text-xs font-bold uppercase tracking-wider">
						<LifeBuoy size={15} /> SOPORTE Y ASISTENCIA ESTUDIANTIL
					</div>
					<h1 className="text-3xl md:text-5xl font-extrabold tracking-tight">
						¿En qué podemos ayudarte hoy?
					</h1>
					<p className="text-slate-300 text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
						Encontrá respuestas rápidas sobre el uso del aula virtual, certificados, inscripciones y tutorías directas con nuestro equipo docente.
					</p>

					{/* Buscador de Ayuda */}
					<div className="relative max-w-xl mx-auto mt-6">
						<Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
						<input
							type="text"
							placeholder="Buscar por tema: certificado, notas, video, cupón..."
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
							className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-white text-slate-900 placeholder:text-slate-400 shadow-xl border border-slate-200 outline-none text-sm md:text-base focus:ring-2 focus:ring-blue-500"
						/>
					</div>

					<div className="flex items-center justify-center gap-6 pt-2 text-xs text-sky-200">
						<span className="flex items-center gap-1.5">
							<Clock size={14} /> Respuesta promedio &lt; 2 horas
						</span>
						<span className="flex items-center gap-1.5">
							<ShieldCheck size={14} /> Garantía académica oficial
						</span>
					</div>
				</div>
			</section>

			{/* Contenedor Principal */}
			<main className="max-w-5xl w-full mx-auto px-4 py-12 flex-1 space-y-16">
				{/* Categorías de Ayuda Rápidas */}
				<div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
					{[
						{ id: 'todos', label: 'Todas las Dudas', icon: HelpCircle, color: 'text-slate-700 bg-slate-100' },
						{ id: 'aula', label: 'Aula Virtual', icon: BookOpen, color: 'text-blue-600 bg-blue-50' },
						{ id: 'certificados', label: 'Certificados & QR', icon: Award, color: 'text-amber-600 bg-amber-50' },
						{ id: 'pagos', label: 'Pagos & Cupones', icon: CreditCard, color: 'text-emerald-600 bg-emerald-50' },
					].map((cat) => {
						const Icon = cat.icon;
						const isSelected = activeCategory === cat.id;
						return (
							<button
								key={cat.id}
								onClick={() => setActiveCategory(cat.id)}
								className={`p-5 rounded-2xl border text-left transition-all flex flex-col justify-between ${
									isSelected
										? 'border-blue-600 bg-blue-50/50 shadow-md ring-2 ring-blue-500/20'
										: 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm'
								}`}
							>
								<div className={`p-2.5 w-fit rounded-xl ${cat.color} mb-3`}>
									<Icon size={22} />
								</div>
								<div>
									<h4 className="font-bold text-sm text-[#102a43]">{cat.label}</h4>
									<p className="text-xs text-slate-500 mt-1">Preguntas y guías</p>
								</div>
							</button>
						);
					})}
				</div>

				{/* Preguntas Frecuentes (Acordeón) */}
				<section className="bg-white rounded-2xl p-6 md:p-10 border border-slate-200 shadow-sm space-y-6">
					<div className="border-b border-slate-100 pb-4">
						<h2 className="text-2xl font-bold text-[#102a43]">Preguntas Frecuentes</h2>
						<p className="text-sm text-slate-500 mt-1">
							{filteredFaqs.length} respuestas encontradas para tu consulta.
						</p>
					</div>

					{filteredFaqs.length === 0 ? (
						<div className="py-12 text-center text-slate-500">
							<HelpCircle size={40} className="mx-auto text-slate-300 mb-2" />
							<p className="text-sm font-semibold">No encontramos preguntas que coincidan con tu búsqueda.</p>
							<p className="text-xs text-slate-400 mt-1">Probá con otra palabra o envianos tu duda abajo en el formulario.</p>
						</div>
					) : (
						<div className="space-y-3">
							{filteredFaqs.map((faq) => {
								const isOpen = openFaqId === faq.id;
								return (
									<div
										key={faq.id}
										className="border border-slate-200 rounded-xl overflow-hidden transition-all"
									>
										<button
											onClick={() => setOpenFaqId(isOpen ? null : faq.id)}
											className="w-full text-left p-4 md:p-5 flex items-center justify-between gap-4 bg-white hover:bg-slate-50/80 transition-colors"
										>
											<span className="font-bold text-sm md:text-base text-[#102a43]">
												{faq.question}
											</span>
											<span className="text-slate-400 shrink-0">
												{isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
											</span>
										</button>
										{isOpen && (
											<div className="p-4 md:p-5 pt-0 text-sm text-slate-600 leading-relaxed border-t border-slate-100 bg-slate-50/50">
												{faq.answer}
											</div>
										)}
									</div>
								);
							})}
						</div>
					)}
				</section>

				{/* Formulario de Soporte y WhatsApp */}
				<section className="grid md:grid-cols-3 gap-8 items-start">
					{/* Tarjeta de Contacto Directo */}
					<div className="bg-gradient-to-br from-[#102a43] to-[#1e3a5f] text-white p-8 rounded-2xl shadow-md space-y-6">
						<div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/20 text-emerald-300 rounded-full text-xs font-bold">
							<span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" /> Tutorías en Vivo Activas
						</div>
						<div>
							<h3 className="text-xl font-bold">¿Necesitás ayuda personalizada?</h3>
							<p className="text-xs text-slate-300 mt-2 leading-relaxed">
								Nuestro equipo de soporte pedagógico y técnico está listo para ayudarte con cualquier inconveniente.
							</p>
						</div>

						<div className="space-y-4 pt-2 border-t border-slate-700/60 text-xs">
							<div className="flex items-center gap-3">
								<PhoneCall size={18} className="text-emerald-400" />
								<div>
									<div className="text-slate-400">WhatsApp de Guardia</div>
									<a
										href="https://wa.me/5491100000000?text=Hola,%20tengo%20una%20consulta%20sobre%20mi%20curso%20en%20Impulso%20Formación"
										target="_blank"
										rel="noopener noreferrer"
										className="font-bold text-emerald-300 hover:underline"
									>
										+54 9 11 0000-0000
									</a>
								</div>
							</div>
							<div className="flex items-center gap-3">
								<Clock size={18} className="text-sky-400" />
								<div>
									<div className="text-slate-400">Horario de Atención</div>
									<div className="font-semibold text-white">Lunes a Sábados de 9 a 20 hs</div>
								</div>
							</div>
						</div>
					</div>

					{/* Formulario para Enviar Ticket */}
					<div className="md:col-span-2 bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
						<div>
							<h3 className="text-xl font-bold text-[#102a43]">Enviar Consulta al Equipo Docente</h3>
							<p className="text-xs text-slate-500 mt-1">
								Completá el formulario y recibirás una respuesta detallada en tu correo electrónico.
							</p>
						</div>

						{ticketSuccess && (
							<div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm flex items-start gap-3">
								<CheckCircle2 size={20} className="text-emerald-600 shrink-0 mt-0.5" />
								<div>
									<strong>¡Ticket de consulta #{ticketSuccess} generado con éxito!</strong>
									<p className="text-xs text-emerald-700 mt-1">
										Hemos notificado a los tutores de tu curso. Te responderemos a la brevedad con la solución paso a paso.
									</p>
								</div>
							</div>
						)}

						<form onSubmit={handleSendTicket} className="space-y-4">
							<div className="grid sm:grid-cols-2 gap-4">
								<div>
									<label className="block text-xs font-bold text-slate-700 mb-1">Nombre Completo</label>
									<input
										type="text"
										required
										placeholder="Ej: Marcos Silva"
										value={ticketName}
										onChange={(e) => setTicketName(e.target.value)}
										className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm outline-none focus:border-blue-500"
									/>
								</div>
								<div>
									<label className="block text-xs font-bold text-slate-700 mb-1">Correo Electrónico</label>
									<input
										type="email"
										required
										placeholder="marcos@ejemplo.com"
										value={ticketEmail}
										onChange={(e) => setTicketEmail(e.target.value)}
										className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm outline-none focus:border-blue-500"
									/>
								</div>
							</div>

							<div>
								<label className="block text-xs font-bold text-slate-700 mb-1">Curso sobre el que consultas</label>
								<select
									value={ticketCourse}
									onChange={(e) => setTicketCourse(e.target.value)}
									className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm outline-none focus:border-blue-500 bg-white"
								>
									<option value="programacion-plc-siemens-tia-portal">Programación de PLC Siemens S7 & TIA Portal</option>
									<option value="electricidad-industrial-tableros">Electricidad Industrial, Tableros & Protecciones</option>
									<option value="instrumentacion-control-procesos">Instrumentación Industrial & Lazos de Control PID</option>
									<option value="scada-redes-industriales-ot">Sistemas SCADA, Redes Industriales & Ciberseguridad OT</option>
									<option value="general">Consulta General / Plataforma</option>
								</select>
							</div>

							<div>
								<label className="block text-xs font-bold text-slate-700 mb-1">Detalle de tu Consulta o Duda</label>
								<textarea
									required
									rows={4}
									placeholder="Describí tu consulta con el mayor detalle posible..."
									value={ticketMessage}
									onChange={(e) => setTicketMessage(e.target.value)}
									className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm outline-none focus:border-blue-500 resize-vertical"
								/>
							</div>

							<button
								type="submit"
								className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-bold text-sm transition-colors shadow-md shadow-blue-600/20"
							>
								<Send size={16} /> Enviar Consulta al Tutor
							</button>
						</form>
					</div>
				</section>
			</main>

			{/* Footer Unificado */}
			<GlobalFooter />
		</div>
	);
}
