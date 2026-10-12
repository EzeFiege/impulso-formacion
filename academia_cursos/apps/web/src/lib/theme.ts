export type Theme = 'light' | 'dark';

export function getInitialTheme(): Theme {
	if (typeof window === 'undefined') return 'light';
	try {
		const saved = localStorage.getItem('impulso_theme') as Theme | null;
		if (saved === 'dark' || saved === 'light') return saved;
		return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
			? 'dark'
			: 'light';
	} catch {
		return 'light';
	}
}

export function applyTheme(theme: Theme) {
	if (typeof document === 'undefined') return;
	const root = document.documentElement;
	if (theme === 'dark') {
		root.classList.add('dark');
	} else {
		root.classList.remove('dark');
	}
	try {
		localStorage.setItem('impulso_theme', theme);
	} catch {
		// Ignore local storage error
	}
	window.dispatchEvent(new CustomEvent('impulso_theme_change', { detail: { theme } }));
}

export function toggleTheme(): Theme {
	const current =
		typeof document !== 'undefined' && document.documentElement.classList.contains('dark')
			? 'dark'
			: 'light';
	const next = current === 'dark' ? 'light' : 'dark';
	applyTheme(next);
	return next;
}
