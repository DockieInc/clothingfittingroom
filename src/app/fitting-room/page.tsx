"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import {
	RotateCcw,
	ZoomIn,
	ZoomOut,
	ChevronLeft,
	ChevronRight,
	ShoppingBag,
	Heart,
	Ruler,
	Palette,
} from "lucide-react";
import { clothingItems } from "@/lib/data";
import Link from "next/link";
import { Suspense } from "react";

function FittingRoomContent() {
	const searchParams = useSearchParams();
	const itemIdParam = searchParams.get("item");
	const initialItemId = itemIdParam ? parseInt(itemIdParam) : 1;

	const [selectedItemId, setSelectedItemId] = useState(initialItemId);
	const [selectedSize, setSelectedSize] = useState<string | null>(null);
	const [zoom, setZoom] = useState(1);
	const [rotation, setRotation] = useState(0);

	const selectedItem =
		clothingItems.find((i) => i.id === selectedItemId) || clothingItems[0];

	const handlePrev = () => {
		const idx = clothingItems.findIndex((i) => i.id === selectedItemId);
		const prevIdx = idx <= 0 ? clothingItems.length - 1 : idx - 1;
		setSelectedItemId(clothingItems[prevIdx].id);
		setSelectedSize(null);
		setZoom(1);
		setRotation(0);
	};

	const handleNext = () => {
		const idx = clothingItems.findIndex((i) => i.id === selectedItemId);
		const nextIdx = idx >= clothingItems.length - 1 ? 0 : idx + 1;
		setSelectedItemId(clothingItems[nextIdx].id);
		setSelectedSize(null);
		setZoom(1);
		setRotation(0);
	};

	return (
		<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
			{/* Header */}
			<div className="mb-10">
				<h1 className="text-3xl md:text-4xl font-bold mb-2">
					Provador Virtual
				</h1>
				<p className="text-[var(--color-muted)]">
					Visualize como cada peça fica antes de comprar
				</p>
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
				{/* Mannequin / Preview Area */}
				<div className="lg:col-span-2">
					<div
						className={`relative ${selectedItem.gradient} rounded-3xl overflow-hidden aspect-[3/4] md:aspect-[4/3] flex items-center justify-center`}
					>
						{/* Navigation arrows */}
						<button
							onClick={handlePrev}
							className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-white/80 hover:bg-white rounded-full shadow-lg transition-all z-10"
						>
							<ChevronLeft className="w-6 h-6" />
						</button>
						<button
							onClick={handleNext}
							className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-white/80 hover:bg-white rounded-full shadow-lg transition-all z-10"
						>
							<ChevronRight className="w-6 h-6" />
						</button>

						{/* Clothing display */}
						<div
							className="transition-all duration-500 ease-out"
							style={{
								transform: `scale(${zoom}) rotate(${rotation}deg)`,
							}}
						>
							<span className="text-[12rem] md:text-[16rem] select-none drop-shadow-lg">
								{selectedItem.emoji}
							</span>
						</div>

						{/* Controls */}
						<div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-white/90 backdrop-blur-sm rounded-full px-4 py-2 shadow-lg">
							<button
								onClick={() => setZoom(Math.max(0.5, zoom - 0.1))}
								className="p-2 rounded-full hover:bg-gray-100 transition-colors"
								title="Diminuir zoom"
							>
								<ZoomOut className="w-5 h-5" />
							</button>
							<button
								onClick={() => setZoom(Math.min(2, zoom + 0.1))}
								className="p-2 rounded-full hover:bg-gray-100 transition-colors"
								title="Aumentar zoom"
							>
								<ZoomIn className="w-5 h-5" />
							</button>
							<div className="w-px h-6 bg-gray-200" />
							<button
								onClick={() => setRotation(rotation - 15)}
								className="p-2 rounded-full hover:bg-gray-100 transition-colors"
								title="Rotacionar"
							>
								<RotateCcw className="w-5 h-5" />
							</button>
							<button
								onClick={() => {
									setZoom(1);
									setRotation(0);
								}}
								className="p-2 rounded-full hover:bg-gray-100 transition-colors text-sm font-medium"
								title="Resetar"
							>
								Reset
							</button>
						</div>
					</div>
				</div>

				{/* Details Panel */}
				<div className="space-y-6">
					{/* Product info */}
					<div className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-2xl p-6">
						<p className="text-xs text-[var(--color-muted)] uppercase tracking-wider mb-1">
							{selectedItem.category}
						</p>
						<h2 className="text-2xl font-bold mb-2">{selectedItem.name}</h2>
						<div className="flex items-center gap-3 mb-6">
							<span className="text-2xl font-bold text-[var(--color-primary)]">
								R$ {selectedItem.price.toFixed(2)}
							</span>
							{selectedItem.originalPrice && (
								<span className="text-lg text-[var(--color-muted)] line-through">
									R$ {selectedItem.originalPrice.toFixed(2)}
								</span>
							)}
						</div>

						{/* Color */}
						<div className="mb-6">
							<div className="flex items-center gap-2 mb-3">
								<Palette className="w-4 h-4 text-[var(--color-muted)]" />
								<span className="text-sm font-medium">Cor</span>
							</div>
							<span className="inline-block px-3 py-1.5 bg-[var(--color-border)] rounded-lg text-sm">
								{selectedItem.color}
							</span>
						</div>

						{/* Sizes */}
						<div className="mb-6">
							<div className="flex items-center gap-2 mb-3">
								<Ruler className="w-4 h-4 text-[var(--color-muted)]" />
								<span className="text-sm font-medium">Tamanho</span>
							</div>
							<div className="flex flex-wrap gap-2">
								{selectedItem.sizes.map((size) => (
									<button
										key={size}
										onClick={() => setSelectedSize(size)}
										className={`min-w-[48px] px-3 py-2 rounded-xl text-sm font-medium transition-all ${
											selectedSize === size
												? "bg-[var(--color-primary)] text-white shadow-md shadow-[var(--color-primary)]/25"
												: "border border-[var(--color-border)] hover:border-[var(--color-primary)] text-[var(--color-muted)] hover:text-[var(--color-foreground)]"
										}`}
									>
										{size}
									</button>
								))}
							</div>
						</div>

						{/* Actions */}
						<div className="space-y-3">
							<button className="w-full flex items-center justify-center gap-2 bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)] text-white py-3.5 rounded-xl font-semibold transition-all shadow-lg shadow-[var(--color-primary)]/25">
								<ShoppingBag className="w-5 h-5" />
								Adicionar ao Carrinho
							</button>
							<button className="w-full flex items-center justify-center gap-2 border-2 border-[var(--color-border)] hover:border-[var(--color-primary)] py-3.5 rounded-xl font-semibold transition-all">
								<Heart className="w-5 h-5" />
								Adicionar aos Favoritos
							</button>
						</div>
					</div>

					{/* Quick select */}
					<div className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-2xl p-6">
						<h3 className="font-semibold mb-4">Experimentar outras peças</h3>
						<div className="grid grid-cols-4 gap-2">
							{clothingItems.slice(0, 8).map((item) => (
								<button
									key={item.id}
									onClick={() => {
										setSelectedItemId(item.id);
										setSelectedSize(null);
										setZoom(1);
										setRotation(0);
									}}
									className={`aspect-square rounded-xl flex items-center justify-center text-2xl transition-all ${
										selectedItemId === item.id
											? "ring-2 ring-[var(--color-primary)] " + item.gradient
											: item.gradient + " opacity-70 hover:opacity-100"
									}`}
									title={item.name}
								>
									{item.emoji}
								</button>
							))}
						</div>
						<Link
							href="/catalog"
							className="block text-center text-sm text-[var(--color-primary)] mt-4 hover:underline"
						>
							Ver catálogo completo
						</Link>
					</div>
				</div>
			</div>
		</div>
	);
}

export default function FittingRoomPage() {
	return (
		<Suspense
			fallback={
				<div className="max-w-7xl mx-auto px-4 py-10 text-center">
					<p className="text-[var(--color-muted)]">Carregando provador...</p>
				</div>
			}
		>
			<FittingRoomContent />
		</Suspense>
	);
}
