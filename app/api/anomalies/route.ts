import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";


export async function POST(request: Request) {
  try {
    const { userId, type, status } = await request.json();

    if (!userId || !type) {
      return NextResponse.json(
        { error: "userId and type are required" },
        { status: 400 }
      );
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        anomalies: {
          push: {
            type,
            severity: status,
            timeDetected: new Date()
          }
        }
      }
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error("Error adding anomaly:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
