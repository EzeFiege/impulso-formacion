import { Link } from 'react-router';
import { GraduationCap, ShieldCheck, Award, BookOpen } from 'lucide-react';

export function GlobalFooter() {
	return (
		<footer
			style={{
				background: '#0f172a',
				color: '#f8fafc',
				padding: '48px 24px 32px',
				borderTop: '1px solid #1e293b',
				marginTop: 'auto',
			}}
		>
			<div
				style={{
					maxWidth: 1180,
					margin: '0 auto',
					display: 'flex',
					flexDirection: 'column',
					gap: 32,
				}}
			>
				{/* Fila Principal */}
				<div
					style={{
						display: 'flex',
						justifyContent: 'space-between',
						alignItems: 'flex-start',
						flexWrap: 'wrap',
						gap: 32,
					}}
				>
					{/* Marca y Misión */}
					<div style={{ maxWidth: 360 }}>
						<Link
							to="/"
							style={{
								display: 'inline-flex',
								alignItems: 'center',
								gap: 10,
								color: 'white',
								textDecoration: 'none',
								fontSize: 20,
								fontWeight: 800,
								marginBottom: 12,
							}}
						>
							<div
								style={{
									width: 32,
									height: 32,
									borderRadius: 8,
									background: '#2563eb',
									display: 'flex',
									alignItems: 'center',
									justifyContent: 'center',
									color: 'white',
								}}
							>
								<GraduationCap size={18} />
							</div>
							<span>
								impulso<strong style={{ color: '#38bdf8' }}>FORMACIÓN</strong>
							</span>
						</Link>
						<p style={{ margin: 0, fontSize: 13, color: '#94a3b8', lineHeight: 1.7 }}>
							Formación técnica y profesional online. Aprendé habilidades digitales con proyectos reales, aula virtual interactiva y certificación oficial verificable.
						</p>
					</div>

					{/* Enlaces Rápidos de Navegación */}
					<div style={{ display: 'flex', gap: 48, flexWrap: 'wrap' }}>
						<div>
							<h4 style={{ margin: '0 0 14px', fontSize: 13, color: '#f1f5f9', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5 }}>
								Academia
							</h4>
							<ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 10, fontSize: 13 }}>
								<li>
									<Link to="/" style={{ color: '#94a3b8', textDecoration: 'none' }}>
										Inicio
									</Link>
								</li>
								<li>
									<Link to="/cursos" style={{ color: '#94a3b8', textDecoration: 'none' }}>
										Catálogo de Cursos
									</Link>
								</li>
								<li>
									<Link to="/curso/desarrollo-web-fullstack/aprender" style={{ color: '#94a3b8', textDecoration: 'none' }}>
										Aula Virtual Demo
									</Link>
								</li>
							</ul>
						</div>

						<div>
							<h4 style={{ margin: '0 0 14px', fontSize: 13, color: '#f1f5f9', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5 }}>
								Estudiantes
							</h4>
							<ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 10, fontSize: 13 }}>
								<li>
									<Link to="/dashboard" style={{ color: '#94a3b8', textDecoration: 'none' }}>
										Mi Panel de Alumno
									</Link>
								</li>
								<li>
									<Link to="/ayuda" style={{ color: '#94a3b8', textDecoration: 'none' }}>
										Centro de Ayuda & FAQs
									</Link>
								</li>
								<li>
									<Link to="/verificar-certificado" style={{ color: '#94a3b8', textDecoration: 'none' }}>
										Verificar Certificado Oficial
									</Link>
								</li>
								<li>
									<Link to="/admin" style={{ color: '#64748b', textDecoration: 'none' }}>
										Panel de Administración
									</Link>
								</li>
							</ul>
						</div>
					</div>
				</div>

				{/* Fila Inferior con Copyright */}
				<div
					style={{
						borderTop: '1px solid #1e293b',
						paddingTop: 24,
						display: 'flex',
						justifyContent: 'space-between',
						alignItems: 'center',
						flexWrap: 'wrap',
						gap: 16,
						fontSize: 12,
						color: '#64748b',
					}}
				>
					<div>© 2026 Impulso Formación · Plataforma Educativa Online. Todos los derechos reservados.</div>
					<div style={{ display: 'flex', gap: 20 }}>
						<span style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#94a3b8' }}>
							<ShieldCheck size={14} color="#10b981" /> Formación Segura
						</span>
						<span style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#94a3b8' }}>
							<Award size={14} color="#f59e0b" /> Certificación con Código QR
						</span>
					</div>
				</div>
			</div>
		</footer>
	);
}
