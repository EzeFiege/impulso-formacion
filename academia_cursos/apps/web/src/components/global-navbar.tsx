import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router';
import { GraduationCap, ShoppingBag, Play, Menu, X, ShieldCheck, LifeBuoy, Sun, Moon } from 'lucide-react';
import { CartDrawer } from './cart-drawer';
import { NotificationPopover } from './notification-popover';
import { getInitialTheme, toggleTheme, type Theme } from '@/lib/theme';

export function GlobalNavbar() {
	const location = useLocation();
	const [cartCount, setCartCount] = useState(0);
	const [isCartOpen, setIsCartOpen] = useState(false);
	const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
	const [theme, setTheme] = useState<Theme>('light');

	function updateCartCount() {
		try {
			const saved = JSON.parse(localStorage.getItem('e-commerce-cart') || '[]');
			setCartCount(Array.isArray(saved) ? saved.length : 0);
		} catch {
			setCartCount(0);
		}
	}

	useEffect(() => {
		updateCartCount();
		const handleCartUpdate = (e: Event) => {
			updateCartCount();
			if (e instanceof CustomEvent && e.detail?.open) {
				setIsCartOpen(true);
			}
		};
		window.addEventListener('e-commerce-cart-change', handleCartUpdate);
		return () => window.removeEventListener('e-commerce-cart-change', handleCartUpdate);
	}, []);

	useEffect(() => {
		setTheme(getInitialTheme());
		const handleThemeChange = (e: Event) => {
			if (e instanceof CustomEvent && e.detail?.theme) {
				setTheme(e.detail.theme);
			}
		};
		window.addEventListener('impulso_theme_change', handleThemeChange);
		return () => window.removeEventListener('impulso_theme_change', handleThemeChange);
	}, []);

	// Cerrar menú móvil al navegar
	useEffect(() => {
		setMobileMenuOpen(false);
	}, [location.pathname]);

	const navLinks = [
		{ to: '/', label: 'Inicio', exact: true },
		{ to: '/cursos', label: 'Catálogo de Cursos' },
		{ to: '/dashboard', label: 'Mi Panel de Alumno' },
		{ to: '/ayuda', label: 'Centro de Ayuda' },
		{ to: '/verificar-certificado', label: 'Verificar Certificado' },
		{ to: '/admin', label: 'Admin' },
	];

	function isLinkActive(link: { to: string; exact?: boolean }) {
		if (link.exact) {
			return location.pathname === link.to;
		}
		return location.pathname.startsWith(link.to);
	}

	return (
		<>
			<header
				style={{
					background: '#ffffff',
					borderBottom: '1px solid #e2e8f0',
					padding: '0 24px',
					height: 72,
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'space-between',
					position: 'sticky',
					top: 0,
					zIndex: 50,
					boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
				}}
			>
				{/* Marca / Logo Unificado */}
				<Link
					to="/"
					style={{
						display: 'flex',
						alignItems: 'center',
						gap: 10,
						textDecoration: 'none',
						color: '#102a43',
						fontSize: 22,
						fontWeight: 800,
						letterSpacing: '-0.5px',
					}}
				>
					<div
						style={{
							width: 38,
							height: 38,
							borderRadius: 10,
							background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
							color: 'white',
							boxShadow: '0 4px 10px rgba(37,99,235,0.25)',
						}}
					>
						<GraduationCap size={22} />
					</div>
					<span>
						impulso<strong style={{ color: '#2563eb', fontWeight: 900, marginLeft: 2 }}>FORMACIÓN</strong>
					</span>
				</Link>

				{/* Enlaces Principales para Pantallas de Escritorio */}
				<nav
					style={{
						display: 'flex',
						alignItems: 'center',
						gap: 6,
					}}
					className="hidden lg:flex"
				>
					{navLinks.map((link) => {
						const active = isLinkActive(link);
						return (
							<Link
								key={link.to}
								to={link.to}
								style={{
									padding: '8px 14px',
									borderRadius: 8,
									fontSize: 13,
									fontWeight: active ? 700 : 600,
									color: active ? '#2563eb' : '#475569',
									background: active ? '#eff6ff' : 'transparent',
									textDecoration: 'none',
									transition: 'all 0.15s ease-in-out',
									display: 'flex',
									alignItems: 'center',
									gap: 6,
								}}
							>
								{link.label}
							</Link>
						);
					})}
				</nav>

				{/* Botones de Acción Derecha */}
				<div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
					{/* Selector de Modo Oscuro / Claro */}
					<button
						type="button"
						onClick={() => setTheme(toggleTheme())}
						aria-label={theme === 'dark' ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
						style={{
							background: theme === 'dark' ? '#1e293b' : '#f8fafc',
							border: '1px solid #cbd5e1',
							borderRadius: 10,
							padding: '8px 10px',
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
							cursor: 'pointer',
							color: theme === 'dark' ? '#f59e0b' : '#64748b',
						}}
					>
						{theme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}
					</button>

					{/* Centro de Notificaciones */}
					<NotificationPopover />

					{/* Botón de Carrito */}
					<button
						type="button"
						onClick={() => setIsCartOpen(true)}
						aria-label="Abrir carrito de compras"
						style={{
							background: cartCount > 0 ? '#102a43' : '#f8fafc',
							color: cartCount > 0 ? '#ffffff' : '#334155',
							border: '1px solid #cbd5e1',
							borderRadius: 10,
							padding: '8px 14px',
							display: 'flex',
							alignItems: 'center',
							gap: 8,
							cursor: 'pointer',
							fontWeight: 700,
							fontSize: 13,
							transition: 'all 0.15s ease',
						}}
					>
						<ShoppingBag size={17} color={cartCount > 0 ? '#38bdf8' : '#2563eb'} />
						<span>{cartCount}</span>
					</button>

					{/* Botón Rápido Aula Virtual */}
					<Link
						to="/curso/programacion-plc-siemens-tia-portal/aprender"
						className="hidden sm:inline-flex"
						style={{
							background: '#2563eb',
							color: 'white',
							padding: '8px 16px',
							borderRadius: 10,
							fontSize: 12,
							fontWeight: 700,
							textDecoration: 'none',
							display: 'inline-flex',
							alignItems: 'center',
							gap: 6,
							boxShadow: '0 2px 8px rgba(37,99,235,0.25)',
						}}
					>
						<Play size={13} fill="white" /> Aula Virtual
					</Link>

					{/* Botón de Menú Móvil */}
					<button
						type="button"
						onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
						className="lg:hidden"
						aria-label={mobileMenuOpen ? 'Cerrar menú' : 'Abrir menú'}
						style={{
							background: '#f8fafc',
							border: '1px solid #cbd5e1',
							borderRadius: 8,
							padding: 8,
							color: '#334155',
							cursor: 'pointer',
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
						}}
					>
						{mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
					</button>
				</div>
			</header>

			{/* Menú Desplegable Móvil */}
			{mobileMenuOpen && (
				<aside
					aria-label="Menú de navegación móvil"
					className="lg:hidden"
					style={{
						position: 'fixed',
						top: 72,
						left: 0,
						right: 0,
						background: '#ffffff',
						borderBottom: '1px solid #e2e8f0',
						padding: '16px 20px',
						zIndex: 49,
						boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
						display: 'flex',
						flexDirection: 'column',
						gap: 6,
					}}
				>
					{navLinks.map((link) => {
						const active = isLinkActive(link);
						return (
							<Link
								key={link.to}
								to={link.to}
								style={{
									padding: '12px 16px',
									borderRadius: 8,
									fontSize: 14,
									fontWeight: active ? 700 : 600,
									color: active ? '#2563eb' : '#334155',
									background: active ? '#eff6ff' : 'transparent',
									textDecoration: 'none',
								}}
							>
								{link.label}
							</Link>
						);
					})}
					<div style={{ paddingTop: 10, borderTop: '1px solid #f1f5f9' }}>
						<Link
							to="/curso/programacion-plc-siemens-tia-portal/aprender"
							style={{
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
								gap: 8,
								background: '#2563eb',
								color: 'white',
								padding: '12px',
								borderRadius: 8,
								fontSize: 13,
								fontWeight: 700,
								textDecoration: 'none',
							}}
						>
							<Play size={14} fill="white" /> Ingresar al Aula Virtual Demo
						</Link>
					</div>
				</aside>
			)}

			{/* Drawer Lateral del Carrito */}
			<CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
		</>
	);
}
