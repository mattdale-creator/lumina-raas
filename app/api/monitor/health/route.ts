import { NextResponse } from "next/server";

// PRD 12: Health check endpoint for uptime monitoring
export async function GET() {
  return NextResponse.json({
    status: "healthy",
    service: "lumina-raas",
    timestamp: new Date().toISOString(),
    version: "1.0.0",
  });
}
