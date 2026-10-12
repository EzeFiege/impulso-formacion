import { useState, useEffect } from 'react';
import {
	type CourseQuiz,
	type QuizAttemptResult,
	getStoredQuizResult,
	saveQuizResult,
} from '@/lib/course-quizzes';
import {
	CheckCircle2,
	XCircle,
	Award,
	RotateCcw,
	ArrowRight,
	ArrowLeft,
	HelpCircle,
	Sparkles,
	Check,
	Clock,
} from 'lucide-react';

interface InteractiveQuizProps {
	quiz: CourseQuiz;
	courseHandle: string;
	onPassed?: () => void;
	onNextLesson?: () => void;
}

export function InteractiveQuiz({ quiz, courseHandle, onPassed, onNextLesson }: InteractiveQuizProps) {
	const [currentIndex, setCurrentIndex] = useState(0);
	const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
	const [submittedResult, setSubmittedResult] = useState<QuizAttemptResult | null>(null);

	// Cargar intento previo si existe
	useEffect(() => {
		const stored = getStoredQuizResult(courseHandle, quiz.id);
		if (stored) {
			setSubmittedResult(stored);
			setSelectedAnswers(stored.selectedAnswers);
		} else {
			setSubmittedResult(null);
			setSelectedAnswers({});
			setCurrentIndex(0);
		}
	}, [quiz.id, courseHandle]);

	const [timeLeftSeconds, setTimeLeftSeconds] = useState<number>(
		quiz.timeLimitMinutes ? quiz.timeLimitMinutes * 60 : 0,
	);

	// Temporizador para exámenes cronometrados
	useEffect(() => {
		if (!quiz.timeLimitMinutes || submittedResult) return;
		setTimeLeftSeconds(quiz.timeLimitMinutes * 60);
		const interval = setInterval(() => {
			setTimeLeftSeconds((prev) => {
				if (prev <= 1) {
					clearInterval(interval);
					handleSubmitQuiz();
					return 0;
				}
				return prev - 1;
			});
		}, 1000);
		return () => clearInterval(interval);
	}, [quiz.id, quiz.timeLimitMinutes, submittedResult]);

	const currentQuestion = quiz.questions[currentIndex];
	const isLastQuestion = currentIndex === quiz.questions.length - 1;
	const answeredCount = Object.keys(selectedAnswers).length;
	const allAnswered = answeredCount === quiz.questions.length;

	function handleSelectOption(optionIndex: number) {
		if (submittedResult) return; // Ya evaluado
		setSelectedAnswers((prev) => ({
			...prev,
			[currentQuestion.id]: optionIndex,
		}));
	}

	function handleSubmitQuiz() {
		let correctCount = 0;
		quiz.questions.forEach((q) => {
			if (selectedAnswers[q.id] === q.correctOptionIndex) {
				correctCount++;
			}
		});

		const scorePercent = Math.round((correctCount / quiz.questions.length) * 100);
		const passed = scorePercent >= quiz.passingScore;

		const result: QuizAttemptResult = {
			quizId: quiz.id,
			courseHandle,
			scorePercent,
			passed,
			totalQuestions: quiz.questions.length,
			correctAnswersCount: correctCount,
			selectedAnswers,
			completedAt: new Date().toISOString(),
		};

		saveQuizResult(result);
		setSubmittedResult(result);

		if (passed && quiz.isFinalExam) {
			try {
				localStorage.setItem(`impulso_honors_${courseHandle}`, 'true');
				window.dispatchEvent(new Event('impulso_honors_awarded'));
			} catch {}
		}

		if (passed && onPassed) {
			onPassed();
		}
	}

	function handleRetry() {
		setSubmittedResult(null);
		setSelectedAnswers({});
		setCurrentIndex(0);
	}

	// Vista de Resultados una vez evaluado el examen
	if (submittedResult) {
		const isPassed = submittedResult.passed;

		return (
			<div className="bg-[#0f172a] border border-slate-800 rounded-2xl p-6 md:p-8 space-y-8 animate-fade-in text-slate-100">
				{/* Encabezado del Resultado */}
				<div className="text-center space-y-3">
					<div
						className={`inline-flex p-4 rounded-2xl border ${
							isPassed
								? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
								: 'bg-amber-500/10 border-amber-500/30 text-amber-400'
						}`}
					>
						{isPassed ? <Award size={48} /> : <HelpCircle size={48} />}
					</div>

					<h3 className="text-2xl font-extrabold text-white">
						{isPassed ? '¡Felicitaciones! Has aprobado el examen' : 'Examen no superado'}
					</h3>

					<p className="text-sm text-slate-300 max-w-md mx-auto">
						{isPassed
							? `Demostraste dominio de los conceptos clave del módulo con un ${submittedResult.scorePercent}% de respuestas correctas.`
							: `Obtuviste un ${submittedResult.scorePercent}%. Se requiere al menos un ${quiz.passingScore}% para validar el módulo.`}
					</p>

					<div className="flex items-center justify-center gap-6 pt-2">
						<div className="text-center">
							<div className="text-2xl font-black text-sky-400">{submittedResult.scorePercent}%</div>
							<div className="text-[11px] text-slate-400 uppercase tracking-wider">Tu Calificación</div>
						</div>
						<div className="h-8 w-px bg-slate-800" />
						<div className="text-center">
							<div className="text-2xl font-black text-emerald-400">
								{submittedResult.correctAnswersCount} / {submittedResult.totalQuestions}
							</div>
							<div className="text-[11px] text-slate-400 uppercase tracking-wider">Correctas</div>
						</div>
					</div>
				</div>

				{/* Revisión Pregunta por Pregunta */}
				<div className="space-y-4 pt-4 border-t border-slate-800">
					<h4 className="text-sm font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
						<Sparkles size={16} className="text-sky-400" /> Revisión Pedagógica y Explicaciones
					</h4>

					<div className="space-y-4">
						{quiz.questions.map((q, qIndex) => {
							const userAnswer = submittedResult.selectedAnswers[q.id];
							const isCorrect = userAnswer === q.correctOptionIndex;

							return (
								<div
									key={q.id}
									className={`p-5 rounded-xl border ${
										isCorrect
											? 'bg-emerald-950/20 border-emerald-800/40'
											: 'bg-rose-950/20 border-rose-800/40'
									} space-y-3`}
								>
									<div className="flex items-start justify-between gap-3">
										<p className="text-sm font-semibold text-white">
											{qIndex + 1}. {q.question}
										</p>
										{isCorrect ? (
											<span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-400 shrink-0">
												<CheckCircle2 size={16} /> Correcta
											</span>
										) : (
											<span className="inline-flex items-center gap-1 text-xs font-bold text-rose-400 shrink-0">
												<XCircle size={16} /> Incorrecta
											</span>
										)}
									</div>

									<div className="space-y-1.5 text-xs">
										{q.options.map((opt, optIndex) => {
											const isUserChoice = userAnswer === optIndex;
											const isTheCorrectOne = optIndex === q.correctOptionIndex;

											return (
												<div
													key={optIndex}
													className={`p-2.5 rounded-lg flex items-center justify-between ${
														isTheCorrectOne
															? 'bg-emerald-500/20 text-emerald-200 border border-emerald-500/40 font-semibold'
															: isUserChoice
															? 'bg-rose-500/20 text-rose-200 border border-rose-500/40 line-through'
															: 'bg-slate-900/60 text-slate-400'
													}`}
												>
													<span>{opt}</span>
													{isTheCorrectOne && (
														<span className="text-[10px] font-bold text-emerald-400 uppercase">
															Respuesta Correcta
														</span>
													)}
												</div>
											);
										})}
									</div>

									{/* Explicación formativa */}
									<div className="p-3 bg-slate-900/90 rounded-lg text-xs text-slate-300 border border-slate-800 leading-relaxed">
										<strong className="text-sky-300 block mb-1">💡 ¿Por qué es así?</strong>
										{q.explanation}
									</div>
								</div>
							);
						})}
					</div>
				</div>

				{/* Botones de acción finales */}
				<div className="flex flex-wrap justify-between items-center gap-4 pt-4 border-t border-slate-800">
					<button
						onClick={handleRetry}
						className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs transition-colors border border-slate-700"
					>
						<RotateCcw size={15} /> Reintentar Evaluación
					</button>

					{onNextLesson && (
						<button
							onClick={onNextLesson}
							className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs shadow-lg shadow-blue-600/30 transition-all"
						>
							Continuar con la siguiente lección <ArrowRight size={15} />
						</button>
					)}
				</div>
			</div>
		);
	}

	// Vista interactiva para responder las preguntas
	return (
		<div className="bg-[#0f172a] border border-slate-800 rounded-2xl p-6 md:p-8 space-y-6 text-slate-100">
			{/* Encabezado del Quiz */}
			<div className="flex flex-wrap justify-between items-center gap-3 border-b border-slate-800 pb-4">
				<div>
					<div className="flex items-center gap-2">
						<span className="text-[10px] font-bold uppercase tracking-wider text-sky-400 bg-sky-950/60 px-2.5 py-1 rounded border border-sky-800/40">
							{quiz.isFinalExam ? 'EXAMEN FINAL CRONOMETRADO' : 'EVALUACIÓN DE MÓDULO'}
						</span>
						{quiz.timeLimitMinutes && !submittedResult && (
							<span
								className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold border ${
									timeLeftSeconds < 180
										? 'bg-rose-500/20 text-rose-300 border-rose-500/40 animate-pulse'
										: 'bg-amber-500/10 text-amber-300 border-amber-500/30'
								}`}
							>
								<Clock size={13} />
								{Math.floor(timeLeftSeconds / 60)}:
								{timeLeftSeconds % 60 < 10 ? '0' : ''}
								{timeLeftSeconds % 60}
							</span>
						)}
					</div>
					<h3 className="text-lg font-bold text-white mt-2">{quiz.title}</h3>
					<p className="text-xs text-slate-400 mt-0.5">{quiz.description}</p>
				</div>

				<div className="text-right">
					<div className="text-xs font-bold text-slate-300">
						Pregunta {currentIndex + 1} de {quiz.questions.length}
					</div>
					<div className="text-[11px] text-slate-500">Mínimo para aprobar: {quiz.passingScore}%</div>
				</div>
			</div>

			{/* Barra de Progreso del Quiz */}
			<div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden border border-slate-700">
				<div
					className="bg-blue-500 h-full rounded-full transition-all duration-300"
					style={{ width: `${((currentIndex + 1) / quiz.questions.length) * 100}%` }}
				/>
			</div>

			{/* Pregunta Activa */}
			<div className="space-y-4 pt-2">
				<h4 className="text-base font-bold text-white leading-snug">
					{currentIndex + 1}. {currentQuestion.question}
				</h4>

				{/* Opciones */}
				<div className="grid gap-3 pt-2">
					{currentQuestion.options.map((optionText, optIndex) => {
						const isSelected = selectedAnswers[currentQuestion.id] === optIndex;

						return (
							<button
								key={optIndex}
								onClick={() => handleSelectOption(optIndex)}
								className={`text-left p-4 rounded-xl border transition-all flex items-center justify-between group ${
									isSelected
										? 'bg-blue-600/20 border-blue-500 text-white shadow-md shadow-blue-600/10'
										: 'bg-slate-900/60 border-slate-800 text-slate-300 hover:bg-slate-800/60 hover:border-slate-700'
								}`}
							>
								<div className="flex items-center gap-3">
									<div
										className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold border transition-colors ${
											isSelected
												? 'bg-blue-600 border-blue-400 text-white'
												: 'border-slate-700 text-slate-500 group-hover:border-slate-500'
										}`}
									>
										{String.fromCharCode(65 + optIndex)}
									</div>
									<span className="text-sm font-medium">{optionText}</span>
								</div>

								{isSelected && <Check size={18} className="text-blue-400 shrink-0 ml-2" />}
							</button>
						);
					})}
				</div>
			</div>

			{/* Botones de Navegación del Test */}
			<div className="flex items-center justify-between pt-6 border-t border-slate-800">
				<button
					disabled={currentIndex === 0}
					onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
					className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-30 disabled:pointer-events-none text-xs font-semibold text-slate-300 transition-colors border border-slate-700"
				>
					<ArrowLeft size={14} /> Anterior
				</button>

				<div className="flex items-center gap-3">
					<span className="text-xs text-slate-400 hidden sm:inline">
						{answeredCount} de {quiz.questions.length} respondidas
					</span>

					{isLastQuestion ? (
						<button
							disabled={!allAnswered}
							onClick={handleSubmitQuiz}
							className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 disabled:pointer-events-none text-white text-xs font-bold transition-all shadow-lg shadow-emerald-600/30"
						>
							<CheckCircle2 size={16} /> Finalizar y Calificar Examen
						</button>
					) : (
						<button
							disabled={selectedAnswers[currentQuestion.id] === undefined}
							onClick={() => setCurrentIndex((prev) => Math.min(quiz.questions.length - 1, prev + 1))}
							className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:opacity-30 disabled:pointer-events-none text-white text-xs font-bold transition-all"
						>
							Siguiente Pregunta <ArrowRight size={14} />
						</button>
					)}
				</div>
			</div>
		</div>
	);
}
