import { NextResponse } from "next/server";
export function GET() { return NextResponse.json({ status: "ok", service: "vip-room", timestamp: new Date().toISOString() }); }
