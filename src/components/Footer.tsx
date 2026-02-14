import { Shirt, Instagram, Twitter, Facebook } from "lucide-react";
import Link from "next/link";

export function Footer() {
	return (
		<footer className="bg-[var(--color-card)] border-t border-[var(--color-border)] mt-20">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
				<div className="grid grid-cols-1 md:grid-cols-4 gap-8">
					{/* Brand */}
					<div className="md:col-span-1">
						<Link href="/" className="flex items-center gap-2 mb-4">
							<Shirt className="w-7 h-7 text-[var(--color-primary)]" />
							<span className="text-lg font-bold bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-accent)] bg-clip-text text-transparent">
								FittingRoom
							</span>
						</Link>
						<p className="text-[var(--color-muted)] text-sm leading-relaxed">
							Experimente roupas virtualmente e encontre o look perfeito sem
							sair de casa.
						</p>
					</div>

					{/* Links */}
					<div>
						<h3 className="font-semibold mb-4">Navegação</h3>
						<ul className="space-y-2 text-sm text-[var(--color-muted)]">
							<li>
								<Link
									href="/"
									className="hover:text-[var(--color-foreground)] transition-colors"
								>
									Início
								</Link>
							</li>
							<li>
								<Link
									href="/catalog"
									className="hover:text-[var(--color-foreground)] transition-colors"
								>
									Catálogo
								</Link>
							</li>
							<li>
								<Link
									href="/fitting-room"
									className="hover:text-[var(--color-foreground)] transition-colors"
								>
									Provador Virtual
								</Link>
							</li>
						</ul>
					</div>

					{/* Categorias */}
					<div>
						<h3 className="font-semibold mb-4">Categorias</h3>
						<ul className="space-y-2 text-sm text-[var(--color-muted)]">
							<li>
								<Link
									href="/catalog"
									className="hover:text-[var(--color-foreground)] transition-colors"
								>
									Camisetas
								</Link>
							</li>
							<li>
								<Link
									href="/catalog"
									className="hover:text-[var(--color-foreground)] transition-colors"
								>
									Calças
								</Link>
							</li>
							<li>
								<Link
									href="/catalog"
									className="hover:text-[var(--color-foreground)] transition-colors"
								>
									Vestidos
								</Link>
							</li>
							<li>
								<Link
									href="/catalog"
									className="hover:text-[var(--color-foreground)] transition-colors"
								>
									Jaquetas
								</Link>
							</li>
						</ul>
					</div>

					{/* Social */}
					<div>
						<h3 className="font-semibold mb-4">Redes Sociais</h3>
						<div className="flex gap-3">
							<a
								href="#"
								className="p-2 rounded-full bg-[var(--color-border)] hover:bg-[var(--color-primary)] hover:text-white transition-all"
							>
								<Instagram className="w-5 h-5" />
							</a>
							<a
								href="#"
								className="p-2 rounded-full bg-[var(--color-border)] hover:bg-[var(--color-primary)] hover:text-white transition-all"
							>
								<Twitter className="w-5 h-5" />
							</a>
							<a
								href="#"
								className="p-2 rounded-full bg-[var(--color-border)] hover:bg-[var(--color-primary)] hover:text-white transition-all"
							>
								<Facebook className="w-5 h-5" />
							</a>
						</div>
					</div>
				</div>

				<div className="border-t border-[var(--color-border)] mt-8 pt-8 text-center text-sm text-[var(--color-muted)]">
					<p>&copy; 2026 FittingRoom. Todos os direitos reservados.</p>
				</div>
			</div>
		</footer>
	);
}
