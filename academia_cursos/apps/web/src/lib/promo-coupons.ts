export type PromoCoupon = {
	id: string;
	code: string;
	discountPercent: number;
	description: string;
	active: boolean;
	usesCount: number;
	createdAt: string;
};

const STORAGE_KEY = 'impulso_promo_coupons';

export const DEFAULT_COUPONS: PromoCoupon[] = [
	{
		id: 'coup-1',
		code: 'IMPULSO50',
		discountPercent: 50,
		description: 'Beca parcial de lanzamiento para nuevos estudiantes (50% OFF)',
		active: true,
		usesCount: 52,
		createdAt: '2026-10-01',
	},
	{
		id: 'coup-2',
		code: 'BECA100',
		discountPercent: 100,
		description: 'Beca de mérito académico 100% bonificada',
		active: true,
		usesCount: 14,
		createdAt: '2026-10-05',
	},
	{
		id: 'coup-3',
		code: 'GRATIS',
		discountPercent: 100,
		description: 'Pase libre de prueba para talleres prácticos',
		active: true,
		usesCount: 9,
		createdAt: '2026-10-08',
	},
	{
		id: 'coup-4',
		code: 'PROMO30',
		discountPercent: 30,
		description: 'Descuento para exalumnos y referidos (30% OFF)',
		active: true,
		usesCount: 28,
		createdAt: '2026-10-10',
	},
];

export function getStoredCoupons(): PromoCoupon[] {
	if (typeof window === 'undefined') return DEFAULT_COUPONS;
	try {
		const raw = localStorage.getItem(STORAGE_KEY);
		if (!raw) {
			localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_COUPONS));
			return DEFAULT_COUPONS;
		}
		const parsed = JSON.parse(raw);
		return Array.isArray(parsed) && parsed.length > 0 ? parsed : DEFAULT_COUPONS;
	} catch {
		return DEFAULT_COUPONS;
	}
}

export function saveCoupons(coupons: PromoCoupon[]) {
	localStorage.setItem(STORAGE_KEY, JSON.stringify(coupons));
	window.dispatchEvent(new Event('impulso_coupons_change'));
}

export function addPromoCoupon(data: {
	code: string;
	discountPercent: number;
	description: string;
}): PromoCoupon[] {
	const current = getStoredCoupons();
	const newCoupon: PromoCoupon = {
		id: `coup-${Date.now()}`,
		code: data.code.trim().toUpperCase(),
		discountPercent: Math.min(100, Math.max(1, data.discountPercent)),
		description: data.description.trim(),
		active: true,
		usesCount: 0,
		createdAt: new Date().toISOString().split('T')[0],
	};
	const next = [newCoupon, ...current];
	saveCoupons(next);
	return next;
}

export function toggleCouponActive(id: string): PromoCoupon[] {
	const current = getStoredCoupons();
	const next = current.map((c) => (c.id === id ? { ...c, active: !c.active } : c));
	saveCoupons(next);
	return next;
}

export function deleteCoupon(id: string): PromoCoupon[] {
	const current = getStoredCoupons();
	const next = current.filter((c) => c.id !== id);
	saveCoupons(next);
	return next;
}

export function validateCouponCode(inputCode: string): {
	valid: boolean;
	coupon?: PromoCoupon;
	discountPercent: number;
	message: string;
} {
	const clean = inputCode.trim().toUpperCase();
	if (!clean) {
		return { valid: false, discountPercent: 0, message: 'Ingresá un código de cupón.' };
	}

	const coupons = getStoredCoupons();
	const match = coupons.find((c) => c.code === clean);

	if (!match) {
		return {
			valid: false,
			discountPercent: 0,
			message: 'Código de cupón no válido. Probá con IMPULSO50 o BECA100.',
		};
	}

	if (!match.active) {
		return {
			valid: false,
			discountPercent: 0,
			message: 'Este cupón se encuentra inactivo o expiró.',
		};
	}

	// Incrementar contador de usos
	const next = coupons.map((c) => (c.id === match.id ? { ...c, usesCount: c.usesCount + 1 } : c));
	saveCoupons(next);

	return {
		valid: true,
		coupon: match,
		discountPercent: match.discountPercent,
		message: `¡Cupón ${match.code} aplicado con éxito! (${match.discountPercent}% OFF)`,
	};
}
