import { useState } from 'react';
import { Link } from 'react-router';
import {
	Compass,
	X,
	ArrowRight,
	CheckCircle2,
	Sparkles,
	Code2,
	Database,
	Palette,
	TrendingUp,
	Tag,
	ShoppingBag,
	RotateCcw,
} from 'lucide-react';
import { FALLBACK_COURSES } from '@/api/mock-courses';

type CareerQuizModalProps = {
	isOpen: boolean;
	onClose: () => void;
};

export function CareerQuizModal({ isOpen, onClose }: CareerQuizModalProps) {
	const [step, setStep] = useState(1);
	const [interest, setInterest] = useState<'web' | 'data' | 'ux' | 'marketing'>('web');
	const [experience, setExperience] = useState<'cero' | 'basico' | 'avanzado'>('cero');
	const [timeCommitment, setTimeCommitment] = useState<'3-5' | '6-10' | '10+'>('3-5');

	if (!isOpen) return null;

	// Determinar curso recomendado según intereses
	const recommendedCourse =
		interest === 'web'
			? FALLBACK_COURSES.find((c) => c.url_handle.includes('web') || c.id === 'desarrollo-web-fullstack') ||
			  FALLBACK_COURSES[0]
			: interest === 'data'
			? FALLBACK_COURSES.find((c) => c.url_handle.includes('python') || c.id === 'python-analisis-datos') ||
			  FALLBACK_COURSES[1]
			: interest === 'ux'
			? FALLBACK_COURSES.find((c) => c.url_handle.includes('ux') || c.id === 'diseno-ux-ui') ||
			  FALLBACK_COURSES[2]
			: FALLBACK_COURSES.find((c) => c.url_handle.includes('marketing') || c.id === 'marketing-digital') ||
			  FALLBACK_COURSES[3];

	function handleAddToCart() {
		try {
			const saved = JSON.parse(localStorage.getItem('e-commerce-cart') || '[]');
			const exists = saved.some((item: any) => item.id === recommendedCourse.id);
			const next = exists ? saved : [...saved, recommendedCourse];
			localStorage.setItem('e-commerce-cart', JSON.stringify(next));
			window.dispatchEvent(
				new CustomEvent('e-commerce-cart-change', { detail: { open: true } }),
			);
			onClose();
		} catch {
			onClose();
		}
	}

	function handleReset() {
		setStep(1);
		setInterest('web');
		setExperience('cero');
		setTimeCommitment('3-5');
	}

	return (
		<div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
			<div className="bg-white rounded-3xl max-w-xl w-full p-6 md:p-8 shadow-2xl border border-slate-200 relative overflow-hidden animate-scale-up">
				{/* Botón Cerrar */}
				<button
					onClick={onClose}
					className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 p-1 rounded-full hover:bg-slate-100 transition-colors"
					aria-label="Cerrar test"
				>
					<X size={20} />
				</button>

				{step <= 3 ? (
					<div>
						{/* Barra de progreso de preguntas */}
						<div className="flex items-center gap-2 mb-6">
							<div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
								<Compass size={22} />
							</div>
							<div>
								<div className="text-[10px] font-extrabold text-blue-600 uppercase tracking-widest">
									TEST DE ORIENTACIÓN VOCACIONAL · PASO {step} DE 3
								</div>
								<h3 className="text-lg md:text-xl font-extrabold text-[#102a43]">
									Descubrí tu formación ideal en 1 minuto
								</h3>
							</div>
						</div>

						<div className="w-full bg-slate-100 h-1.5 rounded-full mb-6 overflow-hidden">
							<div
								className="bg-blue-600 h-full transition-all duration-300 rounded-full"
								style={{ width: `${(step / 3) * 100}%` }}
							/>
						</div>

						{/* Pregunta 1: Área de Interés */}
						{step === 1 && (
							<div className="space-y-4">
								<h4 className="text-sm font-bold text-slate-700">
									1. ¿Qué tipo de proyectos te entusiasmaría más construir?
								</h4>

								<div className="grid gap-2.5">
									<label
										onClick={() => setInterest('web')}
										className={`p-4 rounded-xl border flex items-center gap-3 cursor-pointer transition-all ${
											interest === 'web'
												? 'border-blue-600 bg-blue-50/60 shadow-xs'
												: 'border-slate-200 hover:border-slate-300'
										}`}
									>
										<div className="p-2 rounded-lg bg-blue-100 text-blue-700">
											<Code2 size={20} />
										</div>
										<div className="flex-1">
											<div className="text-xs font-bold text-[#102a43]">Desarrollo Web & Aplicaciones</div>
											<div className="text-[11px] text-slate-500">Crear sitios modernos con React, JavaScript y APIs.</div>
										</div>
										<input type="radio" checked={interest === 'web'} readOnly className="text-blue-600" />
									</label>

									<label
										onClick={() => setInterest('data')}
										className={`p-4 rounded-xl border flex items-center gap-3 cursor-pointer transition-all ${
											interest === 'data'
												? 'border-blue-600 bg-blue-50/60 shadow-xs'
												: 'border-slate-200 hover:border-slate-300'
										}`}
									>
										<div className="p-2 rounded-lg bg-emerald-100 text-emerald-700">
											<Database size={20} />
										</div>
										<div className="flex-1">
											<div className="text-xs font-bold text-[#102a43]">Ciencia de Datos & Inteligencia Artificial</div>
											<div className="text-[11px] text-slate-500">Analizar patrones con Python, machine learning y métricas.</div>
										</div>
										<input type="radio" checked={interest === 'data'} readOnly className="text-blue-600" />
									</label>

									<label
										onClick={() => setInterest('ux')}
										className={`p-4 rounded-xl border flex items-center gap-3 cursor-pointer transition-all ${
											interest === 'ux'
												? 'border-blue-600 bg-blue-50/60 shadow-xs'
												: 'border-slate-200 hover:border-slate-300'
										}`}
									>
										<div className="p-2 rounded-lg bg-purple-100 text-purple-700">
											<Palette size={20} />
										</div>
										<div className="flex-1">
											<div className="text-xs font-bold text-[#102a43]">Diseño UX/UI & Prototipos en Figma</div>
											<div className="text-[11px] text-slate-500">Diseñar interfaces atractivas, funcionales y accesibles.</div>
										</div>
										<input type="radio" checked={interest === 'ux'} readOnly className="text-blue-600" />
									</label>

									<label
										onClick={() => setInterest('marketing')}
										className={`p-4 rounded-xl border flex items-center gap-3 cursor-pointer transition-all ${
											interest === 'marketing'
												? 'border-blue-600 bg-blue-50/60 shadow-xs'
												: 'border-slate-200 hover:border-slate-300'
										}`}
									>
										<div className="p-2 rounded-lg bg-amber-100 text-amber-700">
											<TrendingUp size={20} />
										</div>
										<div className="flex-1">
											<div className="text-xs font-bold text-[#102a43]">Marketing Digital & Crecimiento</div>
											<div className="text-[11px] text-slate-500">Escalar negocios, anuncios y estrategias en redes.</div>
										</div>
										<input type="radio" checked={interest === 'marketing'} readOnly className="text-blue-600" />
									</label>
								</div>
							</div>
						)}

						{/* Pregunta 2: Experiencia Previa */}
						{step === 2 && (
							<div className="space-y-4">
								<h4 className="text-sm font-bold text-slate-700">
									2. ¿Cuál es tu punto de partida en esta disciplina?
								</h4>

								<div className="grid gap-3">
									<label
										onClick={() => setExperience('cero')}
										className={`p-4 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
											experience === 'cero'
												? 'border-blue-600 bg-blue-50/60'
												: 'border-slate-200 hover:border-slate-300'
										}`}
									>
										<div>
											<div className="text-xs font-bold text-[#102a43]">Desde cero absoluto</div>
											<div className="text-[11px] text-slate-500">No tengo conocimientos previos y quiero una base sólida paso a paso.</div>
										</div>
										<input type="radio" checked={experience === 'cero'} readOnly className="text-blue-600" />
									</label>

									<label
										onClick={() => setExperience('basico')}
										className={`p-4 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
											experience === 'basico'
												? 'border-blue-600 bg-blue-50/60'
												: 'border-slate-200 hover:border-slate-300'
										}`}
									>
										<div>
											<div className="text-xs font-bold text-[#102a43]">Nociones intermedias</div>
											<div className="text-[11px] text-slate-500">He visto tutoriales o cursos iniciales y busco proyectos reales.</div>
										</div>
										<input type="radio" checked={experience === 'basico'} readOnly className="text-blue-600" />
									</label>

									<label
										onClick={() => setExperience('avanzado')}
										className={`p-4 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
											experience === 'avanzado'
												? 'border-blue-600 bg-blue-50/60'
												: 'border-slate-200 hover:border-slate-300'
										}`}
									>
										<div>
											<div className="text-xs font-bold text-[#102a43]">Profesional en búsqueda de especialización</div>
											<div className="text-[11px] text-slate-500">Quiero incorporar herramientas actuales para sumar al CV.</div>
										</div>
										<input type="radio" checked={experience === 'avanzado'} readOnly className="text-blue-600" />
									</label>
								</div>
							</div>
						)}

						{/* Pregunta 3: Dedicación Semanal */}
						{step === 3 && (
							<div className="space-y-4">
								<h4 className="text-sm font-bold text-slate-700">
									3. ¿Cuánto tiempo estimás dedicarle semanalmente?
								</h4>

								<div className="grid gap-3">
									<label
										onClick={() => setTimeCommitment('3-5')}
										className={`p-4 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
											timeCommitment === '3-5'
												? 'border-blue-600 bg-blue-50/60'
												: 'border-slate-200 hover:border-slate-300'
										}`}
									>
										<div>
											<div className="text-xs font-bold text-[#102a43]">3 a 5 horas semanales</div>
											<div className="text-[11px] text-slate-500">A mi propio ritmo, combinando con trabajo o estudios.</div>
										</div>
										<input type="radio" checked={timeCommitment === '3-5'} readOnly className="text-blue-600" />
									</label>

									<label
										onClick={() => setTimeCommitment('6-10')}
										className={`p-4 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
											timeCommitment === '6-10'
												? 'border-blue-600 bg-blue-50/60'
												: 'border-slate-200 hover:border-slate-300'
										}`}
									>
										<div>
											<div className="text-xs font-bold text-[#102a43]">6 a 10 horas semanales</div>
											<div className="text-[11px] text-slate-500">Ritmo acelerado con prácticas continuas.</div>
										</div>
										<input type="radio" checked={timeCommitment === '6-10'} readOnly className="text-blue-600" />
									</label>

									<label
										onClick={() => setTimeCommitment('10+')}
										className={`p-4 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
											timeCommitment === '10+'
												? 'border-blue-600 bg-blue-50/60'
												: 'border-slate-200 hover:border-slate-300'
										}`}
									>
										<div>
											<div className="text-xs font-bold text-[#102a43]">Más de 10 horas semanales</div>
											<div className="text-[11px] text-slate-500">Inmersión intensiva para inserción laboral inmediata.</div>
										</div>
										<input type="radio" checked={timeCommitment === '10+'} readOnly className="text-blue-600" />
									</label>
								</div>
							</div>
						)}

						{/* Botones de navegación */}
						<div className="flex justify-between items-center mt-8 pt-4 border-t border-slate-100">
							{step > 1 ? (
								<button
									onClick={() => setStep(step - 1)}
									className="px-4 py-2 text-xs font-bold text-slate-500 hover:text-slate-800"
								>
									Atrás
								</button>
							) : (
								<div />
							)}

							<button
								onClick={() => setStep(step + 1)}
								className="inline-flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-blue-600/20"
							>
								{step === 3 ? 'Ver Mi Recomendación' : 'Siguiente'} <ArrowRight size={14} />
							</button>
						</div>
					</div>
				) : (
					/* Resultado del Test */
					<div className="text-center space-y-6 animate-fade-in">
						<div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center">
							<CheckCircle2 size={36} />
						</div>

						<div>
							<div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-extrabold bg-blue-50 text-blue-700 border border-blue-200 uppercase tracking-wider mb-2">
								<Sparkles size={13} /> Coincidencia del 98% con tu perfil
							</div>
							<h3 className="text-xl md:text-2xl font-black text-[#102a43]">
								¡Tu formación ideal es:
							</h3>
						</div>

						{/* Tarjeta del curso recomendado */}
						<div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 text-left space-y-3">
							<span className="text-[10px] uppercase font-bold text-blue-600 tracking-wider">
								{recommendedCourse.ribbon_text || 'Especialización Profesional'}
							</span>
							<h4 className="text-base font-extrabold text-[#102a43] m-0">{recommendedCourse.title}</h4>
							<p className="text-xs text-slate-600 m-0">
								{recommendedCourse.subtitle ||
									'Aprende con proyectos reales, tutoría personalizada y certificación oficial.'}
							</p>

							<div className="flex items-center justify-between pt-2 border-t border-slate-200">
								<div>
									<span className="text-[11px] text-slate-400 block">Inversión:</span>
									<span className="text-base font-extrabold text-[#102a43]">
										{recommendedCourse.price_formatted}
									</span>
								</div>

								<div className="flex items-center gap-1.5 bg-emerald-100 text-emerald-800 px-3 py-1 rounded-lg text-xs font-bold border border-emerald-300">
									<Tag size={13} /> Cupón IMPULSO50 (50% OFF)
								</div>
							</div>
						</div>

						<div className="flex flex-col sm:flex-row gap-3 pt-2">
							<button
								onClick={handleReset}
								className="inline-flex items-center justify-center gap-1.5 px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl text-xs font-bold transition-colors cursor-pointer"
							>
								<RotateCcw size={14} /> Repetir Test
							</button>

							<button
								onClick={handleAddToCart}
								className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition-all shadow-lg shadow-blue-600/25 cursor-pointer"
							>
								<ShoppingBag size={15} /> Aplicar Descuento y Ver en Carrito
							</button>
						</div>
					</div>
				)}
			</div>
		</div>
	);
}
