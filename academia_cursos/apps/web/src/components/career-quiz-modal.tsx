import { useState } from 'react';
import {
	Compass,
	X,
	ArrowRight,
	CheckCircle2,
	Sparkles,
	Cpu,
	Zap,
	Gauge,
	Network,
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
	const [interest, setInterest] = useState<'plc' | 'electricidad' | 'instrumentacion' | 'scada'>('plc');
	const [experience, setExperience] = useState<'cero' | 'basico' | 'avanzado'>('cero');
	const [timeCommitment, setTimeCommitment] = useState<'3-5' | '6-10' | '10+'>('3-5');

	if (!isOpen) return null;

	// Determinar curso recomendado según perfil técnico OT
	const recommendedCourse =
		interest === 'plc'
			? FALLBACK_COURSES[0]
			: interest === 'electricidad'
			? FALLBACK_COURSES[1]
			: interest === 'instrumentacion'
			? FALLBACK_COURSES[2]
			: FALLBACK_COURSES[3];

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
		setInterest('plc');
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
									TEST DE ORIENTACIÓN TÉCNICA · PASO {step} DE 3
								</div>
								<h3 className="text-lg md:text-xl font-extrabold text-[#102a43]">
									Descubrí tu especialización industrial en 1 minuto
								</h3>
							</div>
						</div>

						<div className="w-full bg-slate-100 h-1.5 rounded-full mb-6 overflow-hidden">
							<div
								className="bg-blue-600 h-full transition-all duration-300 rounded-full"
								style={{ width: `${(step / 3) * 100}%` }}
							/>
						</div>

						{/* Pregunta 1: Área de Interés OT */}
						{step === 1 && (
							<div className="space-y-4">
								<h4 className="text-sm font-bold text-slate-700">
									1. ¿Qué área técnica te gustaría dominar o profundizar en planta?
								</h4>

								<div className="grid gap-2.5">
									<label
										onClick={() => setInterest('plc')}
										className={`p-4 rounded-xl border flex items-center gap-3 cursor-pointer transition-all ${
											interest === 'plc'
												? 'border-blue-600 bg-blue-50/60 shadow-xs'
												: 'border-slate-200 hover:border-slate-300'
										}`}
									>
										<div className="p-2 rounded-lg bg-blue-100 text-blue-700">
											<Cpu size={20} />
										</div>
										<div className="flex-1">
											<div className="text-xs font-bold text-[#102a43]">Programación de PLC & Automatización</div>
											<div className="text-[11px] text-slate-500">Lógica Ladder, Siemens S7-1200/1500, TIA Portal y pantallas HMI.</div>
										</div>
										<input type="radio" checked={interest === 'plc'} readOnly className="text-blue-600" />
									</label>

									<label
										onClick={() => setInterest('electricidad')}
										className={`p-4 rounded-xl border flex items-center gap-3 cursor-pointer transition-all ${
											interest === 'electricidad'
												? 'border-blue-600 bg-blue-50/60 shadow-xs'
												: 'border-slate-200 hover:border-slate-300'
										}`}
									>
										<div className="p-2 rounded-lg bg-amber-100 text-amber-700">
											<Zap size={20} />
										</div>
										<div className="flex-1">
											<div className="text-xs font-bold text-[#102a43]">Electricidad Industrial & Tableros de Control</div>
											<div className="text-[11px] text-slate-500">Planos bajo norma IEC, protecciones termomagnéticas, contactores y variadores VFD.</div>
										</div>
										<input type="radio" checked={interest === 'electricidad'} readOnly className="text-blue-600" />
									</label>

									<label
										onClick={() => setInterest('instrumentacion')}
										className={`p-4 rounded-xl border flex items-center gap-3 cursor-pointer transition-all ${
											interest === 'instrumentacion'
												? 'border-blue-600 bg-blue-50/60 shadow-xs'
												: 'border-slate-200 hover:border-slate-300'
										}`}
									>
										<div className="p-2 rounded-lg bg-emerald-100 text-emerald-700">
											<Gauge size={20} />
										</div>
										<div className="flex-1">
											<div className="text-xs font-bold text-[#102a43]">Instrumentación Industrial & Lazos PID</div>
											<div className="text-[11px] text-slate-500">Transmisores 4-20mA, termocuplas PT100, válvulas de control y sintonía en lazo cerrado.</div>
										</div>
										<input type="radio" checked={interest === 'instrumentacion'} readOnly className="text-blue-600" />
									</label>

									<label
										onClick={() => setInterest('scada')}
										className={`p-4 rounded-xl border flex items-center gap-3 cursor-pointer transition-all ${
											interest === 'scada'
												? 'border-blue-600 bg-blue-50/60 shadow-xs'
												: 'border-slate-200 hover:border-slate-300'
										}`}
									>
										<div className="p-2 rounded-lg bg-purple-100 text-purple-700">
											<Network size={20} />
										</div>
										<div className="flex-1">
											<div className="text-xs font-bold text-[#102a43]">Sistemas SCADA, Redes Industriales & OT</div>
											<div className="text-[11px] text-slate-500">Ignition, redes Profinet/Modbus, servidores OPC UA y ciberseguridad IEC 62443.</div>
										</div>
										<input type="radio" checked={interest === 'scada'} readOnly className="text-blue-600" />
									</label>
								</div>
							</div>
						)}

						{/* Pregunta 2: Nivel previo */}
						{step === 2 && (
							<div className="space-y-4">
								<h4 className="text-sm font-bold text-slate-700">
									2. ¿Cuál es tu experiencia técnica actual?
								</h4>

								<div className="grid gap-2.5">
									<label
										onClick={() => setExperience('cero')}
										className={`p-4 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
											experience === 'cero'
												? 'border-blue-600 bg-blue-50/60 shadow-xs'
												: 'border-slate-200 hover:border-slate-300'
										}`}
									>
										<div>
											<div className="text-xs font-bold text-[#102a43]">Principiante o estudiante técnico</div>
											<div className="text-[11px] text-slate-500">Quiero aprender desde los fundamentos teóricos y prácticos.</div>
										</div>
										<input type="radio" checked={experience === 'cero'} readOnly className="text-blue-600" />
									</label>

									<label
										onClick={() => setExperience('basico')}
										className={`p-4 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
											experience === 'basico'
												? 'border-blue-600 bg-blue-50/60 shadow-xs'
												: 'border-slate-200 hover:border-slate-300'
										}`}
									>
										<div>
											<div className="text-xs font-bold text-[#102a43]">Técnico de mantenimiento / Electricista</div>
											<div className="text-[11px] text-slate-500">Trabajo en planta o taller y quiero dar el salto a la automatización.</div>
										</div>
										<input type="radio" checked={experience === 'basico'} readOnly className="text-blue-600" />
									</label>

									<label
										onClick={() => setExperience('avanzado')}
										className={`p-4 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
											experience === 'avanzado'
												? 'border-blue-600 bg-blue-50/60 shadow-xs'
												: 'border-slate-200 hover:border-slate-300'
										}`}
									>
										<div>
											<div className="text-xs font-bold text-[#102a43]">Profesional / Ingeniero de planta</div>
											<div className="text-[11px] text-slate-500">Busco certificar mis conocimientos y dominar arquitecturas complejas.</div>
										</div>
										<input type="radio" checked={experience === 'avanzado'} readOnly className="text-blue-600" />
									</label>
								</div>
							</div>
						)}

						{/* Pregunta 3: Disponibilidad semanal */}
						{step === 3 && (
							<div className="space-y-4">
								<h4 className="text-sm font-bold text-slate-700">
									3. ¿Cuánto tiempo podés dedicarle al estudio por semana?
								</h4>

								<div className="grid gap-2.5">
									<label
										onClick={() => setTimeCommitment('3-5')}
										className={`p-4 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
											timeCommitment === '3-5'
												? 'border-blue-600 bg-blue-50/60 shadow-xs'
												: 'border-slate-200 hover:border-slate-300'
										}`}
									>
										<div>
											<div className="text-xs font-bold text-[#102a43]">3 a 5 horas semanales</div>
											<div className="text-[11px] text-slate-500">Ritmo flexible para compatibilizar con jornadas de trabajo.</div>
										</div>
										<input type="radio" checked={timeCommitment === '3-5'} readOnly className="text-blue-600" />
									</label>

									<label
										onClick={() => setTimeCommitment('6-10')}
										className={`p-4 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
											timeCommitment === '6-10'
												? 'border-blue-600 bg-blue-50/60 shadow-xs'
												: 'border-slate-200 hover:border-slate-300'
										}`}
									>
										<div>
											<div className="text-xs font-bold text-[#102a43]">6 a 10 horas semanales</div>
											<div className="text-[11px] text-slate-500">Avance constante y prácticas con simuladores en paralelo.</div>
										</div>
										<input type="radio" checked={timeCommitment === '6-10'} readOnly className="text-blue-600" />
									</label>

									<label
										onClick={() => timeCommitment === '10+' ? null : setTimeCommitment('10+')}
										className={`p-4 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
											timeCommitment === '10+'
												? 'border-blue-600 bg-blue-50/60 shadow-xs'
												: 'border-slate-200 hover:border-slate-300'
										}`}
									>
										<div>
											<div className="text-xs font-bold text-[#102a43]">Más de 10 horas semanales</div>
											<div className="text-[11px] text-slate-500">Modo inmersivo para certificar en tiempo récord.</div>
										</div>
										<input type="radio" checked={timeCommitment === '10+'} readOnly className="text-blue-600" />
									</label>
								</div>
							</div>
						)}

						{/* Botones de Navegación del Test */}
						<div className="flex items-center justify-between mt-8 pt-4 border-t border-slate-100">
							{step > 1 ? (
								<button
									onClick={() => setStep(step - 1)}
									className="px-4 py-2 text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors"
								>
									Atrás
								</button>
							) : (
								<div />
							)}

							<button
								onClick={() => setStep(step + 1)}
								className="inline-flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-extrabold shadow-md shadow-blue-600/30 transition-all"
							>
								{step === 3 ? 'Ver Mi Recomendación Técnica' : 'Siguiente'} <ArrowRight size={15} />
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
								<Sparkles size={13} /> Coincidencia del 98% con tu perfil técnico
							</div>
							<h3 className="text-xl md:text-2xl font-black text-[#102a43]">
								¡Tu formación ideal es:
							</h3>
						</div>

						{/* Tarjeta del curso recomendado */}
						<div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 text-left space-y-3">
							<span className="text-[10px] uppercase font-bold text-blue-600 tracking-wider">
								{recommendedCourse.ribbon_text || 'Especialización Industrial'}
							</span>
							<h4 className="text-base font-extrabold text-[#102a43] m-0">{recommendedCourse.title}</h4>
							<p className="text-xs text-slate-600 m-0">
								{recommendedCourse.subtitle ||
									'Aprende con simulaciones de planta, proyectos prácticos y certificación oficial.'}
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

						<div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
							<button
								onClick={handleAddToCart}
								className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-blue-600/30 transition-all cursor-pointer"
							>
								<ShoppingBag size={16} /> Inscribirme con 50% de Descuento
							</button>

							<button
								onClick={handleReset}
								className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-3 text-slate-500 hover:text-slate-800 text-xs font-bold transition-colors"
							>
								<RotateCcw size={14} /> Repetir Test
							</button>
						</div>
					</div>
				)}
			</div>
		</div>
	);
}
