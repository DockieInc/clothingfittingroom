"use client";

import { useState, useRef, useCallback, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import {
	Upload,
	ImageIcon,
	Link2,
	Sparkles,
	X,
	ArrowRight,
	AlertCircle,
	Download,
	Zap,
	Bot,
	ChevronLeft,
	ChevronRight,
	Check,
	ShoppingBag,
} from "lucide-react";

type UploadMode = "file" | "url";
type AIProvider = "chatgpt" | "nanobanana";

export default function Home() {
	return (
		<Suspense fallback={<HomeLoading />}>
			<HomeContent />
		</Suspense>
	);
}

function HomeLoading() {
	return (
		<div className="max-w-3xl mx-auto px-6 sm:px-10 py-14 md:py-20 flex items-center justify-center min-h-[400px]">
			<div className="flex flex-col items-center gap-3">
				<span className="w-8 h-8 border-2 border-[var(--color-primary)]/30 border-t-[var(--color-primary)] rounded-full animate-spin" />
				<p className="text-sm text-[var(--color-muted)]">Carregando...</p>
			</div>
		</div>
	);
}

function HomeContent() {
	const searchParams = useSearchParams();

	const [productImage, setProductImage] = useState<string | null>(null);
	const [userPhoto, setUserPhoto] = useState<string | null>(null);
	const [resultImage, setResultImage] = useState<string | null>(null);
	const [isGenerating, setIsGenerating] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [productUrlInput, setProductUrlInput] = useState("");
	const [userUrlInput, setUserUrlInput] = useState("");
	const [productUploadMode, setProductUploadMode] =
		useState<UploadMode>("file");
	const [userUploadMode, setUserUploadMode] = useState<UploadMode>("file");
	const [aiProvider, setAiProvider] = useState<AIProvider>("chatgpt");

	// Imagens vindas do site externo via query params
	const [externalImages, setExternalImages] = useState<string[]>([]);
	const [productHandle, setProductHandle] = useState<string | null>(null);
	const [selectedExternalIndex, setSelectedExternalIndex] = useState<number>(0);

	// Lê os query params na montagem
	useEffect(() => {
		const handle = searchParams.get("handle");
		const imagesParam = searchParams.get("images");

		if (handle) {
			setProductHandle(handle);
		}

		if (imagesParam) {
			try {
				const parsed = JSON.parse(imagesParam);
				if (Array.isArray(parsed) && parsed.length > 0) {
					// Normaliza URLs protocol-relative (//domain/path → https://domain/path)
					const normalized = parsed.map((url: string) =>
						typeof url === "string" && url.startsWith("//")
							? `https:${url}`
							: url,
					);
					setExternalImages(normalized);
					// Auto-seleciona a primeira imagem como produto
					setProductImage(normalized[0]);
					setSelectedExternalIndex(0);
				}
			} catch {
				// JSON inválido — ignora
				console.warn("Parâmetro 'images' inválido na URL.");
			}
		}
	}, [searchParams]);

	const handleSelectExternalImage = useCallback(
		(url: string, index: number) => {
			setProductImage(url);
			setSelectedExternalIndex(index);
			setResultImage(null);
		},
		[],
	);

	const hasExternalImages = externalImages.length > 0;

	const productInputRef = useRef<HTMLInputElement>(null);
	const userInputRef = useRef<HTMLInputElement>(null);

	const handleFileUpload = useCallback(
		(setter: (url: string) => void) =>
			(e: React.ChangeEvent<HTMLInputElement>) => {
				const file = e.target.files?.[0];
				if (file) {
					const reader = new FileReader();
					reader.onload = () => setter(reader.result as string);
					reader.readAsDataURL(file);
				}
			},
		[],
	);

	const handleUrlSubmit = useCallback(
		(url: string, setter: (url: string) => void) => {
			if (url.trim()) {
				setter(url.trim());
			}
		},
		[],
	);

	const handleGenerate = useCallback(async () => {
		if (!productImage || !userPhoto) return;
		setIsGenerating(true);
		setError(null);

		try {
			const res = await fetch("/api/generate", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ productImage, userPhoto, provider: aiProvider }),
			});

			const data = await res.json();

			if (!res.ok) {
				throw new Error(data.error || "Erro ao gerar imagem.");
			}

			setResultImage(data.image);
		} catch (err: unknown) {
			const message =
				err instanceof Error
					? err.message
					: "Erro inesperado. Tente novamente.";
			setError(message);
		} finally {
			setIsGenerating(false);
		}
	}, [productImage, userPhoto, aiProvider]);

	const handleReset = useCallback(() => {
		setProductImage(null);
		setUserPhoto(null);
		setResultImage(null);
		setError(null);
		setProductUrlInput("");
		setUserUrlInput("");
	}, []);

	const handleDownload = useCallback(() => {
		if (!resultImage) return;
		const link = document.createElement("a");
		link.href = resultImage;
		link.download = `provador-virtual-${Date.now()}.png`;
		link.click();
	}, [resultImage]);

	const currentStep = resultImage ? 3 : userPhoto ? 2 : productImage ? 1 : 0;

	return (
		<div className="max-w-3xl mx-auto px-6 sm:px-10 py-14 md:py-20 justify-center items-center flex flex-col">
			{/* Header */}
			<div className="text-center mb-10 ">
				<div className="inline-flex items-center gap-2 bg-[var(--color-primary)]/10 text-[var(--color-primary)] px-4 py-1.5 rounded-full text-sm font-medium mb-4">
					<Sparkles className="w-4 h-4" />
					Provador Virtual
				</div>
				<h1 className="text-2xl md:text-3xl font-bold mb-2">
					Experimente antes de comprar
				</h1>
				<p className="text-[var(--color-muted)] text-sm max-w-md mx-auto">
					Envie a imagem do produto e sua foto para visualizar como ficaria em
					você.
				</p>
			</div>

			{/* Steps Indicator */}
			<div className="flex items-center justify-center gap-2 mb-10">
				{[1, 2, 3].map((step) => (
					<div key={step} className="flex items-center gap-2">
						<div
							className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all ${
								currentStep >= step
									? "bg-[var(--color-primary)] text-white"
									: "bg-[var(--color-border)] text-[var(--color-muted)]"
							}`}
						>
							{step}
						</div>
						{step < 3 && (
							<div
								className={`w-12 h-0.5 rounded transition-all ${
									currentStep > step
										? "bg-[var(--color-primary)]"
										: "bg-[var(--color-border)]"
								}`}
							/>
						)}
					</div>
				))}
			</div>

		{/* Cards Grid */}
		<div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 w-full ">
			{/* Step 1 — Imagem do Produto */}
			{hasExternalImages ? (
				<ProductImageSelector
					images={externalImages}
					selectedIndex={selectedExternalIndex}
					productHandle={productHandle}
					onSelect={handleSelectExternalImage}
				/>
			) : (
				<ImageUploadCard
					title="1. Imagem do Produto"
					subtitle="Adicione a peça de roupa"
					image={productImage}
					onClear={() => {
						setProductImage(null);
						setResultImage(null);
					}}
					uploadMode={productUploadMode}
					onToggleMode={(mode) => setProductUploadMode(mode)}
					inputRef={productInputRef}
					onFileChange={handleFileUpload(setProductImage)}
					urlValue={productUrlInput}
					onUrlChange={setProductUrlInput}
					onUrlSubmit={() => handleUrlSubmit(productUrlInput, setProductImage)}
				/>
			)}

			{/* Step 2 — Sua Foto */}
			<ImageUploadCard
				title="2. Sua Foto"
				subtitle="Adicione uma foto sua"
				image={userPhoto}
				onClear={() => {
					setUserPhoto(null);
					setResultImage(null);
				}}
				uploadMode={userUploadMode}
				onToggleMode={(mode) => setUserUploadMode(mode)}
				inputRef={userInputRef}
				onFileChange={handleFileUpload(setUserPhoto)}
				urlValue={userUrlInput}
				onUrlChange={setUserUrlInput}
				onUrlSubmit={() => handleUrlSubmit(userUrlInput, setUserPhoto)}
			/>
		</div>

			{/* AI Provider Selector */}
			{productImage && userPhoto && !resultImage && (
				<div className="w-full mb-6">
					<p className="block text-sm font-medium mb-3 text-center">
						Modelo de IA
					</p>
					<div className="flex gap-3 max-w-md mx-auto">
						<button
							type="button"
							onClick={() => setAiProvider("chatgpt")}
							className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl border-2 font-medium text-sm transition-all ${
								aiProvider === "chatgpt"
									? "border-[var(--color-primary)] bg-[var(--color-primary)]/10 text-[var(--color-primary)] shadow-sm"
									: "border-[var(--color-border)] bg-[var(--color-card)] text-[var(--color-muted)] hover:border-[var(--color-primary)]/40 hover:text-[var(--color-foreground)]"
							}`}
						>
							<Bot className="w-4 h-4" />
							ChatGPT
						</button>
						<button
							type="button"
							onClick={() => setAiProvider("nanobanana")}
							className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl border-2 font-medium text-sm transition-all ${
								aiProvider === "nanobanana"
									? "border-amber-500 bg-amber-500/10 text-amber-600 dark:text-amber-400 shadow-sm"
									: "border-[var(--color-border)] bg-[var(--color-card)] text-[var(--color-muted)] hover:border-amber-500/40 hover:text-[var(--color-foreground)]"
							}`}
						>
							<Zap className="w-4 h-4" />
							Nano Banana
						</button>
					</div>
					<p className="text-xs text-[var(--color-muted)] text-center mt-2">
						{aiProvider === "chatgpt"
							? "GPT-4o com geração de imagem — alta fidelidade"
							: "Nano Banana Pro — processamento rápido com IA"}
					</p>
				</div>
			)}

			{/* Error Message */}
			{error && (
				<div className="flex items-start gap-3 p-4 mb-6 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400">
					<AlertCircle className="w-5 h-5 mt-0.5 shrink-0" />
					<div>
						<p className="text-sm font-medium">Erro ao gerar imagem</p>
						<p className="text-xs mt-1 opacity-80">{error}</p>
					</div>
				</div>
			)}

			{/* Generate Button */}
			{productImage && userPhoto && !resultImage && (
				<div className="text-center mb-8">
					<button
						type="button"
						onClick={handleGenerate}
						disabled={isGenerating}
						className="inline-flex items-center gap-2 bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)] disabled:opacity-60 text-white px-8 py-3 rounded-full font-semibold transition-all shadow-lg shadow-[var(--color-primary)]/25"
					>
						{isGenerating ? (
							<>
								<span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
								Gerando... isso pode levar alguns segundos
							</>
						) : (
							<>
								<Sparkles className="w-5 h-5" />
								Gerar Resultado
							</>
						)}
					</button>
				</div>
			)}

			{/* Step 3 — Resultado */}
			{resultImage && (
				<div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-card)] p-6 mb-8">
					<div className="flex items-center justify-between mb-4">
						<div>
							<h3 className="font-semibold">3. Seu Resultado</h3>
							<p className="text-xs text-[var(--color-muted)]">
								Gerado com inteligência artificial
							</p>
						</div>
						<div className="flex items-center gap-3">
							<button
								type="button"
								onClick={handleDownload}
								className="inline-flex items-center gap-1.5 text-sm text-[var(--color-primary)] hover:underline"
							>
								<Download className="w-4 h-4" />
								Baixar
							</button>
							<button
								type="button"
								onClick={handleReset}
								className="text-sm text-[var(--color-muted)] hover:text-[var(--color-foreground)] transition-colors"
							>
								Recomeçar
							</button>
						</div>
					</div>
					<div className="rounded-xl overflow-hidden bg-[var(--color-background)] flex items-center justify-center min-h-[300px]">
						<img
							src={resultImage}
							alt="Resultado do provador virtual"
							className="max-w-full max-h-[500px] object-contain"
						/>
					</div>
				</div>
			)}
		</div>
	);
}

/* ── Seletor de Imagens do Produto (vindas do site externo) ── */

function ProductImageSelector({
	images,
	selectedIndex,
	productHandle,
	onSelect,
}: Readonly<{
	images: string[];
	selectedIndex: number;
	productHandle: string | null;
	onSelect: (url: string, index: number) => void;
}>) {
	const scrollRef = useRef<HTMLDivElement>(null);

	const scroll = (direction: "left" | "right") => {
		if (!scrollRef.current) return;
		const amount = 200;
		scrollRef.current.scrollBy({
			left: direction === "left" ? -amount : amount,
			behavior: "smooth",
		});
	};

	return (
		<div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-card)] p-4">
			{/* Header */}
			<div className="flex items-center gap-2 mb-1">
				<ShoppingBag className="w-4 h-4 text-[var(--color-primary)]" />
				<h3 className="font-semibold text-sm">1. Imagem do Produto</h3>
			</div>
			{productHandle && (
				<p className="text-xs text-[var(--color-muted)] mb-3 ml-6 truncate">
					{productHandle.replaceAll("-", " ")}
				</p>
			)}
			{!productHandle && (
				<p className="text-xs text-[var(--color-muted)] mb-3 ml-6">
					Escolha a foto do produto para experimentar
				</p>
			)}

			{/* Imagem principal selecionada */}
			<div className="rounded-xl overflow-hidden bg-[var(--color-background)] flex items-center justify-center min-h-[200px] mb-3">
				<img
					src={images[selectedIndex]}
					alt={`Produto ${productHandle || ""} - imagem ${selectedIndex + 1}`}
					className="max-w-full max-h-[240px] object-contain"
				/>
			</div>

			{/* Thumbnails com scroll horizontal */}
			{images.length > 1 && (
				<div className="relative">
					{/* Botões de navegação */}
					{images.length > 3 && (
						<>
							<button
								type="button"
								onClick={() => scroll("left")}
								className="absolute left-0 top-1/2 -translate-y-1/2 z-10 p-1 rounded-full bg-[var(--color-card)] border border-[var(--color-border)] shadow-sm hover:bg-[var(--color-background)] transition-colors"
								aria-label="Anterior"
							>
								<ChevronLeft className="w-3.5 h-3.5" />
							</button>
							<button
								type="button"
								onClick={() => scroll("right")}
								className="absolute right-0 top-1/2 -translate-y-1/2 z-10 p-1 rounded-full bg-[var(--color-card)] border border-[var(--color-border)] shadow-sm hover:bg-[var(--color-background)] transition-colors"
								aria-label="Próxima"
							>
								<ChevronRight className="w-3.5 h-3.5" />
							</button>
						</>
					)}

					<div
						ref={scrollRef}
						className="flex gap-2 overflow-x-auto scrollbar-hide px-1 py-1"
						style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
					>
						{images.map((img, i) => (
							<button
								key={`product-thumb-${img}`}
								type="button"
								onClick={() => onSelect(img, i)}
								className={`relative shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
									selectedIndex === i
										? "border-[var(--color-primary)] ring-2 ring-[var(--color-primary)]/20"
										: "border-[var(--color-border)] hover:border-[var(--color-primary)]/50"
								}`}
							>
								<img
									src={img}
									alt={`Variação ${i + 1}`}
									className="w-full h-full object-cover"
								/>
								{selectedIndex === i && (
									<div className="absolute inset-0 bg-[var(--color-primary)]/10 flex items-center justify-center">
										<div className="w-5 h-5 rounded-full bg-[var(--color-primary)] flex items-center justify-center">
											<Check className="w-3 h-3 text-white" />
										</div>
									</div>
								)}
							</button>
						))}
					</div>

					{/* Indicador de qual imagem está selecionada */}
					<p className="text-xs text-center text-[var(--color-muted)] mt-2">
						Imagem {selectedIndex + 1} de {images.length} — clique para
						trocar
					</p>
				</div>
			)}
		</div>
	);
}

/* ── Componente de Upload ── */

function ImageUploadCard({
	title,
	subtitle,
	image,
	onClear,
	uploadMode,
	onToggleMode,
	inputRef,
	onFileChange,
	urlValue,
	onUrlChange,
	onUrlSubmit,
}: Readonly<{
	title: string;
	subtitle: string;
	image: string | null;
	onClear: () => void;
	uploadMode: UploadMode;
	onToggleMode: (mode: UploadMode) => void;
	inputRef: React.RefObject<HTMLInputElement | null>;
	onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
	urlValue: string;
	onUrlChange: (val: string) => void;
	onUrlSubmit: () => void;
}>) {
	if (image) {
		return (
			<div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-card)] p-4 relative group">
				<button
					type="button"
					onClick={onClear}
					className="absolute top-3 right-3 z-10 p-1.5 rounded-full bg-black/60 text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/80"
					aria-label="Remover imagem"
				>
					<X className="w-4 h-4" />
				</button>
				<div className="rounded-xl overflow-hidden bg-[var(--color-background)] flex items-center justify-center min-h-[200px]">
					<img
						src={image}
						alt={title}
						className="max-w-full max-h-[240px] object-contain"
					/>
				</div>
				<p className="text-xs text-center text-[var(--color-muted)] mt-3">
					{title}
				</p>
			</div>
		);
	}

	return (
		<div className="rounded-2xl border border-dashed border-[var(--color-border)] bg-[var(--color-card)] p-6">
			<h3 className="font-semibold text-sm mb-1">{title}</h3>
			<p className="text-xs text-[var(--color-muted)] mb-5">{subtitle}</p>

			{/* Tabs: Arquivo / URL */}
			<div className="flex gap-1 p-1 rounded-lg bg-[var(--color-background)] mb-4">
				<button
					type="button"
					onClick={() => onToggleMode("file")}
					className={`flex-1 flex items-center justify-center gap-1.5 text-xs font-medium py-2 rounded-md transition-all ${
						uploadMode === "file"
							? "bg-[var(--color-card)] shadow-sm text-[var(--color-foreground)]"
							: "text-[var(--color-muted)] hover:text-[var(--color-foreground)]"
					}`}
				>
					<Upload className="w-3.5 h-3.5" />
					Arquivo
				</button>
				<button
					type="button"
					onClick={() => onToggleMode("url")}
					className={`flex-1 flex items-center justify-center gap-1.5 text-xs font-medium py-2 rounded-md transition-all ${
						uploadMode === "url"
							? "bg-[var(--color-card)] shadow-sm text-[var(--color-foreground)]"
							: "text-[var(--color-muted)] hover:text-[var(--color-foreground)]"
					}`}
				>
					<Link2 className="w-3.5 h-3.5" />
					URL
				</button>
			</div>

			{uploadMode === "file" ? (
				<button
					type="button"
					onClick={() => inputRef.current?.click()}
					className="w-full flex flex-col items-center justify-center gap-3 py-8 cursor-pointer rounded-xl border border-dashed border-[var(--color-border)] hover:border-[var(--color-primary)] hover:bg-[var(--color-primary)]/5 transition-all group bg-transparent"
				>
					<div className="p-3 rounded-full bg-[var(--color-primary)]/10 group-hover:bg-[var(--color-primary)]/20 transition-colors">
						<ImageIcon className="w-6 h-6 text-[var(--color-primary)]" />
					</div>
					<div className="text-center">
						<p className="text-sm font-medium">Clique para enviar</p>
						<p className="text-xs text-[var(--color-muted)]">
							PNG, JPG ou WEBP
						</p>
					</div>
					<input
						ref={inputRef}
						type="file"
						accept="image/*"
						onChange={onFileChange}
						className="hidden"
					/>
				</button>
			) : (
				<div className="flex gap-2">
					<input
						type="url"
						placeholder="https://exemplo.com/imagem.jpg"
						value={urlValue}
						onChange={(e) => onUrlChange(e.target.value)}
						onKeyDown={(e) => e.key === "Enter" && onUrlSubmit()}
						className="flex-1 px-3 py-2.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/40 focus:border-[var(--color-primary)] transition-all"
					/>
					<button
						type="button"
						onClick={onUrlSubmit}
						className="px-3 py-2.5 rounded-lg bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-dark)] transition-colors"
					>
						<ArrowRight className="w-4 h-4" />
					</button>
				</div>
			)}
		</div>
	);
}
