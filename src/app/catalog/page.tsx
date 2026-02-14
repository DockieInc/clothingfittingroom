"use client";

import { useState } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import { ClothingCard } from "@/components/ClothingCard";
import { clothingItems } from "@/lib/data";

const categories = [
	"Todos",
	"Camisetas",
	"Jaquetas",
	"Vestidos",
	"Calças",
	"Moletons",
	"Blazers",
	"Camisas",
	"Shorts",
	"Casacos",
];

export default function CatalogPage() {
	const [search, setSearch] = useState("");
	const [selectedCategory, setSelectedCategory] = useState("Todos");
	const [showFilters, setShowFilters] = useState(false);

	const filtered = clothingItems.filter((item) => {
		const matchesSearch = item.name
			.toLowerCase()
			.includes(search.toLowerCase());
		const matchesCategory =
			selectedCategory === "Todos" || item.category === selectedCategory;
		return matchesSearch && matchesCategory;
	});

	return (
		<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
			{/* Header */}
			<div className="mb-10">
				<h1 className="text-3xl md:text-4xl font-bold mb-2">Catálogo</h1>
				<p className="text-[var(--color-muted)]">
					Explore nossa coleção completa de roupas
				</p>
			</div>

			{/* Search & Filters */}
			<div className="flex flex-col sm:flex-row gap-4 mb-8">
				<div className="relative flex-1">
					<Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--color-muted)]" />
					<input
						type="text"
						placeholder="Buscar roupas..."
						value={search}
						onChange={(e) => setSearch(e.target.value)}
						className="w-full pl-12 pr-4 py-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/50 focus:border-[var(--color-primary)] transition-all"
					/>
				</div>
				<button
					onClick={() => setShowFilters(!showFilters)}
					className="sm:hidden flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-card)]"
				>
					<SlidersHorizontal className="w-5 h-5" />
					Filtros
				</button>
			</div>

			{/* Category filters */}
			<div
				className={`${
					showFilters ? "flex" : "hidden"
				} sm:flex flex-wrap gap-2 mb-8`}
			>
				{categories.map((cat) => (
					<button
						key={cat}
						onClick={() => setSelectedCategory(cat)}
						className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
							selectedCategory === cat
								? "bg-[var(--color-primary)] text-white shadow-md shadow-[var(--color-primary)]/25"
								: "bg-[var(--color-card)] border border-[var(--color-border)] hover:border-[var(--color-primary)] text-[var(--color-muted)] hover:text-[var(--color-foreground)]"
						}`}
					>
						{cat}
					</button>
				))}
			</div>

			{/* Results count */}
			<p className="text-sm text-[var(--color-muted)] mb-6">
				{filtered.length}{" "}
				{filtered.length === 1 ? "produto encontrado" : "produtos encontrados"}
			</p>

			{/* Grid */}
			{filtered.length > 0 ? (
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
					{filtered.map((item) => (
						<ClothingCard key={item.id} item={item} />
					))}
				</div>
			) : (
				<div className="text-center py-20">
					<p className="text-6xl mb-4">🔍</p>
					<h3 className="text-xl font-semibold mb-2">
						Nenhum produto encontrado
					</h3>
					<p className="text-[var(--color-muted)]">
						Tente ajustar seus filtros ou buscar por outro termo
					</p>
				</div>
			)}
		</div>
	);
}
