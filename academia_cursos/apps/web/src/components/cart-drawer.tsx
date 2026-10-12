import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { ShoppingBag, X, CheckCircle2 } from 'lucide-react';
import { initializeCheckout, type ProductListItem } from '@/api/ecommerce-api';
import { enrollStudentInCourses } from '@/lib/student-auth';
import { validateCouponCode } from '@/lib/promo-coupons';

export function CartDrawer({
	isOpen,
	onClose,
}: {
	isOpen: boolean;
	onClose: () => void;
}) {
	const navigate = useNavigate();
	const [cart, setCart] = useState<ProductListItem[]>([]);
	const [couponCode, setCouponCode] = useState('');
	const [discount, setDiscount] = useState(0);
	const [couponApplied, setCouponApplied] = useState('');
	const [message, setMessage] = useState('');
	const [busy, setBusy] = useState(false);

	function refreshCart() {
		try {
			const saved = JSON.parse(localStorage.getItem('e-commerce-cart') || '[]');
			setCart(saved);
		} catch {
			setCart([]);
		}
	}

	useEffect(() => {
		refreshCart();
		const handleCartUpdate = () => refreshCart();
		window.addEventListener('e-commerce-cart-change', handleCartUpdate);
		return () => window.removeEventListener('e-commerce-cart-change', handleCartUpdate);
	}, []);

	useEffect(() => {
		if (isOpen) {
			refreshCart();
			document.body.style.overflow = 'hidden';
		} else {
			document.body.style.overflow = '';
		}
		return () => {
			document.body.style.overflow = '';
		};
	}, [isOpen]);

	function removeItem(id: string) {
		const next = cart.filter((item) => item.id !== id);
		setCart(next);
		localStorage.setItem('e-commerce-cart', JSON.stringify(next));
		window.dispatchEvent(new Event('e-commerce-cart-change'));
	}

	function applyCoupon() {
		const res = validateCouponCode(couponCode);
		if (res.valid) {
			setDiscount(res.discountPercent);
			setCouponApplied(`${res.coupon?.code} (${res.discountPercent}% OFF)`);
			setMessage(res.message);
		} else {
			setMessage(res.message);
		}
	}

	function handleInstantEnrollment() {
		if (cart.length === 0) return;
		enrollStudentInCourses(cart.map((p) => p.url_handle || p.id));
		localStorage.removeItem('e-commerce-cart');
		setCart([]);
		window.dispatchEvent(new Event('e-commerce-cart-change'));
		onClose();
		navigate('/dashboard');
	}

	async function checkout() {
		setBusy(true);
		try {
			const { url } = await initializeCheckout({
				items: cart.map((p) => ({ variant_id: p.variants?.[0]?.id || p.id, quantity: 1 })),
				locale: 'es',
				successUrl: window.location.origin + '/checkout/success',
				cancelUrl: window.location.origin + '/checkout/cancelled',
			});
			window.location.href = url;
		} catch {
			setMessage('No se pudo conectar con la pasarela externa. Podés inscribirte con el botón verde.');
			setBusy(false);
		}
	}

	if (!isOpen) return null;

	return (
		<div
			style={{
				position: 'fixed',
				inset: 0,
				zIndex: 9999,
				background: 'rgba(15, 23, 42, 0.65)',
				backdropFilter: 'blur(4px)',
				display: 'flex',
				justifyContent: 'flex-end',
				animation: 'fade-in 0.2s ease-out',
			}}
			onClick={onClose}
		>
			<div
				style={{
					width: '100%',
					maxWidth: 440,
					background: '#ffffff',
					height: '100%',
					boxShadow: '-12px 0 32px rgba(0,0,0,0.25)',
					display: 'flex',
					flexDirection: 'column',
					padding: '28px 24px',
					overflowY: 'auto',
				}}
				onClick={(e) => e.stopPropagation()}
			>
				{/* Encabezado del Carrito */}
				<div
					style={{
						display: 'flex',
						justifyContent: 'space-between',
						alignItems: 'center',
						borderBottom: '1px solid #e2e8f0',
						paddingBottom: 16,
					}}
				>
					<div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
						<div
							style={{
								padding: 8,
								borderRadius: 10,
								background: '#eff6ff',
								color: '#2563eb',
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
							}}
						>
							<ShoppingBag size={20} />
						</div>
						<div>
							<h3 style={{ margin: 0, fontSize: 18, color: '#102a43', fontWeight: 800 }}>
								Tu Carrito de Cursos
							</h3>
							<span style={{ fontSize: 12, color: '#64748b' }}>
								{cart.length} {cart.length === 1 ? 'curso seleccionado' : 'cursos seleccionados'}
							</span>
						</div>
					</div>
					<button
						onClick={onClose}
						style={{
							background: '#f1f5f9',
							border: 'none',
							cursor: 'pointer',
							color: '#64748b',
							padding: 8,
							borderRadius: '50%',
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
						}}
						aria-label="Cerrar carrito"
					>
						<X size={18} />
					</button>
				</div>

				{/* Notificación interna si aplica */}
				{message && (
					<div
						style={{
							margin: '16px 0 0',
							padding: '10px 14px',
							borderRadius: 8,
							background: '#eff6ff',
							border: '1px solid #bfdbfe',
							color: '#1e40af',
							fontSize: 12,
							fontWeight: 600,
						}}
					>
						{message}
					</div>
				)}

				{/* Lista de Cursos */}
				<div style={{ flex: 1, padding: '20px 0', overflowY: 'auto' }}>
					{cart.length === 0 ? (
						<div style={{ textAlign: 'center', padding: '60px 10px', color: '#64748b' }}>
							<div
								style={{
									width: 64,
									height: 64,
									borderRadius: '50%',
									background: '#f1f5f9',
									display: 'flex',
									alignItems: 'center',
									justifyContent: 'center',
									margin: '0 auto 16px',
									color: '#94a3b8',
								}}
							>
								<ShoppingBag size={30} />
							</div>
							<h4 style={{ margin: '0 0 6px', fontSize: 16, color: '#102a43', fontWeight: 700 }}>
								Tu carrito está vacío
							</h4>
							<p style={{ fontSize: 13, color: '#64748b', margin: 0 }}>
								Elegí un programa del catálogo para comenzar a aprender.
							</p>
							<Link
								to="/cursos"
								onClick={onClose}
								style={{
									display: 'inline-block',
									marginTop: 20,
									padding: '10px 22px',
									background: '#2563eb',
									color: 'white',
									borderRadius: 8,
									fontWeight: 700,
									fontSize: 13,
									textDecoration: 'none',
								}}
							>
								Explorar catálogo de cursos
							</Link>
						</div>
					) : (
						<div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
							{cart.map((item) => (
								<div
									key={item.id}
									style={{
										display: 'flex',
										justifyContent: 'space-between',
										alignItems: 'center',
										padding: 14,
										background: '#f8fafc',
										borderRadius: 12,
										border: '1px solid #e2e8f0',
									}}
								>
									<div style={{ flex: 1, paddingRight: 10 }}>
										<h4 style={{ margin: '0 0 4px', fontSize: 14, color: '#102a43', fontWeight: 700 }}>
											{item.title}
										</h4>
										<span style={{ fontSize: 13, fontWeight: 800, color: '#2563eb' }}>
											{item.price_formatted}
										</span>
									</div>
									<button
										onClick={() => removeItem(item.id)}
										style={{
											background: '#fee2e2',
											color: '#dc2626',
											border: 'none',
											padding: '6px 10px',
											borderRadius: 6,
											cursor: 'pointer',
											fontSize: 11,
											fontWeight: 700,
										}}
									>
										Quitar
									</button>
								</div>
							))}
						</div>
					)}
				</div>

				{/* Pie del Carrito */}
				{cart.length > 0 && (
					<div style={{ borderTop: '1px solid #e2e8f0', paddingTop: 20 }}>
						{/* Cupón */}
						<div style={{ marginBottom: 16 }}>
							<label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#475569', marginBottom: 6 }}>
								¿Tenés un cupón o beca?
							</label>
							<div style={{ display: 'flex', gap: 6 }}>
								<input
									type="text"
									placeholder="IMPULSO50 o BECA100"
									value={couponCode}
									onChange={(e) => setCouponCode(e.target.value)}
									style={{
										flex: 1,
										padding: '9px 12px',
										borderRadius: 8,
										border: '1px solid #cbd5e1',
										fontSize: 12,
										textTransform: 'uppercase',
										outline: 'none',
									}}
								/>
								<button
									type="button"
									onClick={applyCoupon}
									style={{
										padding: '9px 16px',
										background: '#102a43',
										color: 'white',
										border: 'none',
										borderRadius: 8,
										fontSize: 12,
										fontWeight: 700,
										cursor: 'pointer',
									}}
								>
									Aplicar
								</button>
							</div>
							{couponApplied && (
								<p style={{ margin: '6px 0 0', fontSize: 11, color: '#16a34a', fontWeight: 700 }}>
									✓ {couponApplied}
								</p>
							)}
						</div>

						{/* Resumen */}
						<div style={{ marginBottom: 16, fontSize: 13, color: '#64748b', display: 'flex', flexDirection: 'column', gap: 6 }}>
							<div style={{ display: 'flex', justifyContent: 'space-between' }}>
								<span>Cursos incluidos:</span>
								<strong style={{ color: '#102a43' }}>{cart.length}</strong>
							</div>
							{discount > 0 && (
								<div style={{ display: 'flex', justifyContent: 'space-between', color: '#16a34a', fontWeight: 700 }}>
									<span>Descuento aplicado:</span>
									<span>-{discount}%</span>
								</div>
							)}
						</div>

						{/* Botones de Confirmación */}
						<div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
							<button
								onClick={handleInstantEnrollment}
								style={{
									width: '100%',
									background: '#16a34a',
									color: 'white',
									border: 'none',
									borderRadius: 10,
									padding: '14px',
									fontWeight: 800,
									fontSize: 14,
									cursor: 'pointer',
									display: 'flex',
									alignItems: 'center',
									justifyContent: 'center',
									gap: 8,
									boxShadow: '0 4px 14px rgba(22, 163, 74, 0.3)',
								}}
							>
								<CheckCircle2 size={18} /> Confirmar Inscripción y Acceder
							</button>

							<button
								disabled={busy}
								onClick={checkout}
								style={{
									width: '100%',
									background: '#f8fafc',
									color: '#334155',
									border: '1px solid #cbd5e1',
									borderRadius: 10,
									padding: '12px',
									fontWeight: 700,
									fontSize: 12,
									cursor: busy ? 'wait' : 'pointer',
								}}
							>
								{busy ? 'Conectando con pasarela…' : 'Pagar con Pasarela Externa'}
							</button>
						</div>
					</div>
				)}
			</div>
		</div>
	);
}
