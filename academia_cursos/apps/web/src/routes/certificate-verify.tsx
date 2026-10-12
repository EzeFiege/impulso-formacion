import { useState } from 'react';
import { Link, useParams } from 'react-router';
import type { Route } from './+types/certificate-verify';
import { COURSES_CURRICULA } from '@/lib/course-curricula';
import {
	GraduationCap,
	CheckCircle2,
	Award,
	ShieldCheck,
	Printer,
	Share2,
	Search,
	ArrowLeft,
	ExternalLink,
	Copy,
	Check,
} from 'lucide-react';
import { GlobalNavbar } from '@/components/global-navbar';
import { GlobalFooter } from '@/components/global-footer';

export function meta() {
	return [
		{ title: 'Verificación Oficial de Certificados | Impulso Formación' },
		{ name: 'description', content: 'Consulta y valida la autenticidad de diplomas y credenciales emitidas por Impulso.' },
	];
}

export default function CertificateVerify() {
	const params = useParams();
	const initialCode = params.code || 'IMP-2026-DEV-8492';
	const [searchCode, setSearchCode] = useState(initialCode);
	const [activeCode, setActiveCode] = useState(initialCode);
	const [copied, setCopied] = useState(false);

	// Generar datos consistentes según el código
	const isWeb = activeCode.includes('DEV') || activeCode.includes('WEB') || activeCode.includes('8492');
	const isPython = activeCode.includes('PY') || activeCode.includes('DATA');
	const isUx = activeCode.includes('UX') || activeCode.includes('FIGMA');

	const courseData = isWeb
		? {
				title: 'Desarrollo Web Full Stack con React & Node.js',
				instructor: 'Ing. Lucas Ferrero',
				hours: 36,
				skills: ['React 19', 'Node.js', 'Express', 'JWT Auth', 'HTML5 Semántico', 'CSS Grid', 'Git & CI/CD'],
		  }
		: isPython
		? {
				title: 'Python para Análisis de Datos & Inteligencia Artificial',
				instructor: 'Dra. Mariana Gómez',
				hours: 32,
				skills: ['Python 3', 'NumPy', 'Pandas', 'Google Colab', 'Visualización de Datos', 'Machine Learning'],
		  }
		: isUx
		? {
				title: 'Diseño UX/UI & Prototipado Profesional en Figma',
				instructor: 'Tomás Valenzuela',
				hours: 28,
				skills: ['Figma Avanzado', 'Auto Layout', 'Design Systems', 'User Research', 'Wireframing'],
		  }
		: {
				title: 'Marketing Digital & Estrategia de Crecimiento',
				instructor: 'Camila Morales',
				hours: 24,
				skills: ['Meta Ads', 'Google Ads', 'Funnel Strategy', 'SEO', 'Email Marketing', 'ROAS Optimization'],
		  };

	function handleSearch(e: React.FormEvent) {
		e.preventDefault();
		if (!searchCode.trim()) return;
		setActiveCode(searchCode.trim().toUpperCase());
	}

	function handleCopyLink() {
		navigator.clipboard.writeText(window.location.href);
		setCopied(true);
		setTimeout(() => setCopied(false), 3000);
	}

	return (
		<div className="min-h-screen bg-[#0a0f1d] text-slate-100 flex flex-col font-sans">
			{/* Navbar Unificada */}
			<GlobalNavbar />

			<main className="flex-1 max-w-4xl w-full mx-auto px-4 py-8 md:py-12 space-y-8">
				<div className="flex items-center justify-between">
					<Link
						to="/dashboard"
						className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
					>
						<ArrowLeft size={16} /> Volver al panel de alumno
					</Link>
					<span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
						<ShieldCheck size={14} /> Credencial Oficial Verificada
					</span>
				</div>

				{/* Buscador de código de certificado */}
				<form onSubmit={handleSearch} className="bg-slate-900/80 p-4 rounded-xl border border-slate-800 flex gap-3">
					<div className="relative flex-1">
						<Search className="absolute left-3.5 top-3 text-slate-500" size={16} />
						<input
							type="text"
							value={searchCode}
							onChange={(e) => setSearchCode(e.target.value)}
							placeholder="Ingresá código de certificado (ej: IMP-2026-DEV-8492)"
							className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-10 pr-4 py-2 text-xs text-white uppercase placeholder:text-slate-500 focus:outline-none focus:border-blue-500"
						/>
					</div>
					<button
						type="submit"
						className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold transition-colors"
					>
						Verificar
					</button>
				</form>

				{/* Diploma Digital Oficial */}
				<div className="bg-gradient-to-br from-[#101828] to-[#0a0f1d] border-2 border-amber-500/40 rounded-2xl p-6 md:p-10 shadow-2xl relative overflow-hidden">
					<div className="absolute top-0 right-0 transform translate-x-12 -translate-y-12 w-48 h-48 bg-amber-500/5 rounded-full blur-2xl" />

					{/* Encabezado del Certificado */}
					<div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-800/80 pb-6">
						<div className="flex items-center gap-3">
							<div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl text-amber-400">
								<Award size={36} />
							</div>
							<div>
								<div className="text-[10px] uppercase tracking-widest text-amber-400 font-bold">
									IMPULSO FORMACIÓN · CREDENCIAL DIGITAL
								</div>
								<h1 className="text-xl md:text-2xl font-black text-white mt-0.5">Certificado de Finalización</h1>
							</div>
						</div>

						<div className="text-right">
							<div className="text-[11px] text-slate-400">ID de Validación:</div>
							<div className="text-sm font-mono font-bold text-sky-400 tracking-wider">{activeCode}</div>
						</div>
					</div>

					{/* Cuerpo del Certificado */}
					<div className="py-8 space-y-6 text-center">
						<p className="text-xs text-slate-400 uppercase tracking-widest">Se otorga la presente distinción a:</p>
						<h2 className="text-3xl md:text-4xl font-extrabold text-amber-400 tracking-wide">Alex González</h2>
						<p className="text-xs text-slate-300 max-w-lg mx-auto">
							Por haber cursado, aprobado todas las evaluaciones formativas y completado satisfactoriamente el programa
							profesional de:
						</p>

						<div className="text-xl md:text-2xl font-bold text-white bg-slate-900/60 py-3 px-6 rounded-xl border border-slate-800/80 max-w-xl mx-auto">
							{courseData.title}
						</div>

						<div className="flex flex-wrap justify-center gap-6 text-xs text-slate-400 pt-2">
							<div>
								<span className="block text-slate-500 text-[10px] uppercase">Carga Horaria</span>
								<strong className="text-white">{courseData.hours} Horas Lectivas</strong>
							</div>
							<div className="h-8 w-px bg-slate-800 hidden sm:block" />
							<div>
								<span className="block text-slate-500 text-[10px] uppercase">Instructor Principal</span>
								<strong className="text-white">{courseData.instructor}</strong>
							</div>
							<div className="h-8 w-px bg-slate-800 hidden sm:block" />
							<div>
								<span className="block text-slate-500 text-[10px] uppercase">Fecha de Emisión</span>
								<strong className="text-emerald-400">12 de Octubre de 2026</strong>
							</div>
						</div>
					</div>

					{/* Competencias acreditadas */}
					<div className="border-t border-slate-800/80 pt-6 space-y-3">
						<h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
							<CheckCircle2 size={15} className="text-emerald-400" /> Competencias y Habilidades Verificadas
						</h4>
						<div className="flex flex-wrap gap-2">
							{courseData.skills.map((skill, idx) => (
								<span
									key={idx}
									className="px-2.5 py-1 rounded-md text-xs font-semibold bg-slate-800 text-slate-200 border border-slate-700/60"
								>
									{skill}
								</span>
							))}
						</div>
					</div>
				</div>

				{/* Acciones para Compartir / Imprimir */}
				<div className="flex flex-wrap justify-between items-center gap-4 bg-slate-900/60 p-4 rounded-xl border border-slate-800">
					<div className="text-xs text-slate-400">
						Esta credencial es de acceso público y puede compartirse en CVs o perfiles de LinkedIn.
					</div>

					<div className="flex items-center gap-3">
						<button
							onClick={handleCopyLink}
							className="inline-flex items-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold border border-slate-700 transition-colors"
						>
							{copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
							{copied ? '¡Enlace copiado!' : 'Copiar Enlace'}
						</button>

						<button
							onClick={() => window.print()}
							className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold transition-all shadow-md shadow-blue-600/30"
						>
							<Printer size={14} /> Imprimir / PDF
						</button>
					</div>
				</div>
			</main>
			<GlobalFooter />
		</div>
	);
}
