import type { Route } from './+types/home';
import { seo } from '@/lib/seo';
import { getProducts, getProductByHandle } from '@/api/ecommerce-api';
import { FALLBACK_COURSES } from '@/api/mock-courses';
import { Store } from '@/components/store';

export async function loader({ params }: Route.LoaderArgs) {
	if (params.handle) {
		try {
			const product = await getProductByHandle(params.handle);
			return { products: [product], detail: true };
		} catch (error) {
			console.warn(`[Ecommerce API] No se pudo cargar el curso "${params.handle}", usando catalogo local:`, error);
			const fallback =
				FALLBACK_COURSES.find((c) => c.url_handle === params.handle || c.id === params.handle) ||
				FALLBACK_COURSES[0];
			return { products: [fallback], detail: true };
		}
	}

	try {
		const res = await getProducts({ limit: 12, exclude_types: 'subscription' });
		if (res.products && res.products.length > 0) {
			return { ...res, detail: false };
		}
		return { products: FALLBACK_COURSES, detail: false };
	} catch (error) {
		console.warn('[Ecommerce API] Tienda no conectada o canal inexistente, usando catalogo local:', error);
		return { products: FALLBACK_COURSES, detail: false };
	}
}

export function meta({ matches, location, loaderData }: Route.MetaArgs) {
	const p = loaderData?.detail ? loaderData.products[0] : null;
	return seo(
		{ matches, location },
		{
			title: p?.seo.title || 'Impulso Formacion | Aprende y avanza',
			description: p?.seo.description || 'Explora formacion tecnica y profesional online en Impulso.',
			noindex: p?.seo.noindex,
			image: p?.seo.image,
		},
	);
}

export default function Home({ loaderData }: Route.ComponentProps) {
	return <Store products={loaderData.products} detail={loaderData.detail} />;
}

