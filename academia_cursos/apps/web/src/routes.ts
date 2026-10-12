import { type RouteConfig, index, route } from '@react-router/dev/routes';

export default [
	index('routes/home.tsx'),
	route('cursos', 'routes/home.tsx', { id: 'catalog' }),
	route('dashboard', 'routes/dashboard.tsx', { id: 'dashboard' }),
	route('mis-cursos', 'routes/dashboard.tsx', { id: 'my-courses' }),
	route('admin', 'routes/admin.tsx', { id: 'admin' }),
	route('certificado/:code', 'routes/certificate-verify.tsx', { id: 'certificate-detail' }),
	route('verificar-certificado', 'routes/certificate-verify.tsx', { id: 'certificate-search' }),
	route('curso/:handle', 'routes/home.tsx', { id: 'course' }),
	route('curso/:handle/aprender', 'routes/classroom.tsx', { id: 'classroom' }),
	route('curso/:handle/aprender/:lessonId', 'routes/classroom.tsx', { id: 'classroom-lesson' }),
	route('ayuda', 'routes/help.tsx', { id: 'help' }),
	route('checkout/success', 'routes/home.tsx', { id: 'success' }),
 route('checkout/cancelled', 'routes/home.tsx', { id: 'cancelled' }),
 route('cart', 'routes/home.tsx', { id: 'cart' }),
 route('llms.txt', 'routes/llms.ts'),
	route('sitemap.xml', 'routes/sitemap.xml.ts'),
	route('robots.txt', 'routes/robots.txt.ts'),
	route('api/health', 'routes/api.health.ts'),
	route('api/*', 'routes/api.$.ts'),
] satisfies RouteConfig;
