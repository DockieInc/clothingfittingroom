"use client";

import { Heart, Eye } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export interface ClothingItem {
	id: number;
	name: string;
	price: number;
	originalPrice?: number;
	category: string;
	color: string;
	sizes: string[];
	emoji: string;
	gradient: string;
}

export function ClothingCard({ item }: { item: ClothingItem }) {
	const [isLiked, setIsLiked] = useState(false);

	return (
		<div className="group bg-[var(--color-card)] rounded-2xl border border-[var(--color-border)] overflow-hidden hover:shadow-xl hover:shadow-[var(--color-primary)]/10 transition-all duration-300 hover:-translate-y-1">
			{/* Image placeholder with gradient */}
			<div
				className={`relative h-64 ${item.gradient} flex items-center justify-center overflow-hidden`}
			>
				<span className="text-8xl group-hover:scale-110 transition-transform duration-500">
					{item.emoji}
				</span>

				{/* Overlay actions */}
				<div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100">
					<Link
						href={`/fitting-room?item=${item.id}`}
						className="p-3 bg-white/90 rounded-full hover:bg-white transition-colors shadow-lg"
					>
						<Eye className="w-5 h-5 text-[var(--color-primary-dark)]" />
					</Link>
					<button
						onClick={() => setIsLiked(!isLiked)}
						className="p-3 bg-white/90 rounded-full hover:bg-white transition-colors shadow-lg"
					>
						<Heart
							className={`w-5 h-5 transition-colors ${
								isLiked
									? "fill-red-500 text-red-500"
									: "text-[var(--color-primary-dark)]"
							}`}
						/>
					</button>
				</div>

				{/* Badge */}
				{item.originalPrice && (
					<span className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
						-{Math.round((1 - item.price / item.originalPrice) * 100)}%
					</span>
				)}
			</div>

			{/* Info */}
			<div className="p-4">
				<p className="text-xs text-[var(--color-muted)] uppercase tracking-wider mb-1">
					{item.category}
				</p>
				<h3 className="font-semibold text-lg mb-2 group-hover:text-[var(--color-primary)] transition-colors">
					{item.name}
				</h3>
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-2">
						<span className="text-lg font-bold text-[var(--color-primary)]">
							R$ {item.price.toFixed(2)}
						</span>
						{item.originalPrice && (
							<span className="text-sm text-[var(--color-muted)] line-through">
								R$ {item.originalPrice.toFixed(2)}
							</span>
						)}
					</div>
					<div className="flex gap-1">
						{item.sizes.slice(0, 3).map((size) => (
							<span
								key={size}
								className="text-[10px] border border-[var(--color-border)] rounded px-1.5 py-0.5 text-[var(--color-muted)]"
							>
								{size}
							</span>
						))}
					</div>
				</div>
			</div>
		</div>
	);
}
