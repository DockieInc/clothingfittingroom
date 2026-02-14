import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
	title: "Provador Virtual",
	description:
		"Experimente roupas virtualmente. Envie a imagem do produto e sua foto.",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="pt-BR">
			<body className="min-h-screen flex items-center justify-center">
				<main className="w-full justify-center items-center flex">
					{children}
				</main>
			</body>
		</html>
	);
}
