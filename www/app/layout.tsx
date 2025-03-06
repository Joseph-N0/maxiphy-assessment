"use client"

import "./globals.css"
import { Toaster } from "@/components/ui/sonner"
import { ReactNode } from "react";


export default function RootLayout({
	children
}: Readonly<{
	children: ReactNode
}>) {

	return (
		<html
			lang="en">
			<body className="relative min-w-[360px]">
				{children}
				<Toaster position="top-right" duration={3000} />
			</body>
		</html>
	)
}
