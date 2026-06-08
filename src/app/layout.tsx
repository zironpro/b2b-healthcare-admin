import type { Metadata } from "next";
import { Inter, Outfit, Geist } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

const outfit = Outfit({
	subsets: ["latin"],
	variable: "--font-heading",
});

export const metadata: Metadata = {
	title: "B2 Pro Healthcare - Admin Console",
	description: "Clinical administrator portal for B2 Pro Healthcare.",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html
			className={cn("antialiased", outfit.variable, "font-sans", geist.variable)}
			lang="en"
		>
			<body>
				{children}
			</body>
		</html>
	);
}
