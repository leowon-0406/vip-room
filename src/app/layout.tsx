import type { Metadata } from "next";
import "./globals.css";
import { AppShell } from "@/components/app-shell";

export const metadata: Metadata = { title: "VIP ROOM | BIGBANG Fan Archive", description: "비공식 BIGBANG 팬 아카이브" };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="ko"><body><AppShell>{children}</AppShell></body></html>; }
