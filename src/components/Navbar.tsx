"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X, Shirt, ShoppingBag, Heart } from "lucide-react";

export function Navbar() {
	const [isOpen, setIsOpen] = useState(false);

	return (
		<nav className="sticky top-0 z-50 bg-[var(--color-card)]/80 backdrop-blur-md border-b border-[var(--color-border)]">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="flex items-center justify-between h-16">
					{/* Logo */}
					<Link href="/" className="flex items-center gap-2 group">
						<Shirt className="w-8 h-8 text-[var(--color-primary)] group-hover:scale-110 transition-transform" />
						<span className="text-xl font-bold bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-accent)] bg-clip-text text-transparent">
							FittingRoom
						</span>
					</Link>

					{/* Desktop Navigation */}
					<div className="hidden md:flex items-center gap-8">
						<Link
							href="/"
							className="text-[var(--color-muted)] hover:text-[var(--color-foreground)] transition-colors font-medium"
						>
							Início
						</Link>
						<Link
							href="/catalog"
							className="text-[var(--color-muted)] hover:text-[var(--color-foreground)] transition-colors font-medium"
						>
							Catálogo
						</Link>
						<Link
							href="/fitting-room"
							className="text-[var(--color-muted)] hover:text-[var(--color-foreground)] transition-colors font-medium"
						>
							Provador Virtual
						</Link>
					</div>

					{/* Desktop Actions */}
					<div className="hidden md:flex items-center gap-4">
						<button className="p-2 rounded-full hover:bg-[var(--color-border)] transition-colors relative">
							<Heart className="w-5 h-5" />
							<span className="absolute -top-1 -right-1 w-4 h-4 bg-[var(--color-primary)] text-white text-[10px] rounded-full flex items-center justify-center">
								3
							</span>
						</button>
						<button className="p-2 rounded-full hover:bg-[var(--color-border)] transition-colors relative">
							<ShoppingBag className="w-5 h-5" />
							<span className="absolute -top-1 -right-1 w-4 h-4 bg-[var(--color-accent)] text-white text-[10px] rounded-full flex items-center justify-center">
								2
							</span>
						</button>
					</div>

					{/* Mobile Menu Button */}
					<button
						className="md:hidden p-2 rounded-lg hover:bg-[var(--color-border)] transition-colors"
						onClick={() => setIsOpen(!isOpen)}
					>
						{isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
					</button>
				</div>

				{/* Mobile Navigation */}
				{isOpen && (
					<div className="md:hidden pb-4 border-t border-[var(--color-border)] mt-2 pt-4 space-y-3">
						<Link
							href="/"
							className="block px-3 py-2 rounded-lg hover:bg-[var(--color-border)] transition-colors font-medium"
							onClick={() => setIsOpen(false)}
						>
							Início
						</Link>
						<Link
							href="/catalog"
							className="block px-3 py-2 rounded-lg hover:bg-[var(--color-border)] transition-colors font-medium"
							onClick={() => setIsOpen(false)}
						>
							Catálogo
						</Link>
						<Link
							href="/fitting-room"
							className="block px-3 py-2 rounded-lg hover:bg-[var(--color-border)] transition-colors font-medium"
							onClick={() => setIsOpen(false)}
						>
							Provador Virtual
						</Link>
					</div>
				)}
			</div>
		</nav>
	);
}
