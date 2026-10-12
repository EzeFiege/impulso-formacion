export type LessonResource = {
	id: string;
	title: string;
	description: string;
	type: 'code' | 'pdf' | 'template' | 'link';
	size?: string;
	downloadFileName?: string;
	fileContent?: string;
	externalUrl?: string;
};

export function getLessonResources(courseHandle: string, lessonId: string, lessonTitle?: string): LessonResource[] {
	const title = lessonTitle || 'Lección';

	return [
		{
			id: `res-${lessonId}-code`,
			title: `Código Fuente de la Clase: ${title}`,
			description: 'Proyecto comprimido con la solución completa y dependencias configuradas.',
			type: 'code',
			size: '1.8 MB',
			downloadFileName: `codigo-${courseHandle}-${lessonId}.js`,
			fileContent: `// Impulso Formación - Código oficial de la clase: ${title}\n// Curso: ${courseHandle}\n\nexport function main() {\n  console.log("¡Proyecto inicializado con éxito!");\n}\n\nmain();\n`,
		},
		{
			id: `res-${lessonId}-cheat`,
			title: 'Cheat Sheet & Resumen Teórico (Markdown/PDF)',
			description: 'Resumen ejecutivo con sintaxis, mejores prácticas y atajos esenciales.',
			type: 'pdf',
			size: '420 KB',
			downloadFileName: `guia-resumen-${lessonId}.md`,
			fileContent: `# Guía de Estudio Oficial · Impulso Formación\n## Clase: ${title}\n\n### Puntos Clave:\n1. Comprensión de la arquitectura del componente.\n2. Manejo de estado inmutable y efectos secundarios.\n3. Optimización de rendimiento.\n\n*Material elaborado por el equipo docente de Impulso Formación.*`,
		},
		{
			id: `res-${lessonId}-repo`,
			title: 'Repositorio GitHub Oficial con Ramas',
			description: 'Commits paso a paso para comparar tu código con la versión del tutor.',
			type: 'link',
			externalUrl: 'https://github.com',
		},
		{
			id: `res-${lessonId}-template`,
			title: 'Plantilla de Ejercicios & Test Cases',
			description: 'Casos de prueba para verificar que tu implementación cumple los requisitos.',
			type: 'template',
			size: '340 KB',
			downloadFileName: `tests-${lessonId}.txt`,
			fileContent: `TEST SUITE: ${title}\n[OK] Requisito 1: Entrada validada\n[OK] Requisito 2: Renderizado condicional\n[OK] Requisito 3: Manejo de errores 404/500\n`,
		},
	];
}

export function downloadMockFile(fileName: string, content: string) {
	const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
	const url = URL.createObjectURL(blob);
	const link = document.createElement('a');
	link.href = url;
	link.download = fileName;
	document.body.appendChild(link);
	link.click();
	document.body.removeChild(link);
	URL.revokeObjectURL(url);
}
