import { NextResponse } from "next/server";

const BACKEND_URL = "http://localhost:8000/chatbot"; // Update this if backend URL changes

export async function POST(req) {
    try {
        const body = await req.json();

        if (!body.symptoms || body.symptoms.trim() === "") {
            return NextResponse.json(
                { error: "Symptoms are required" },
                { status: 400 }
            );
        }

        const response = await fetch(BACKEND_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ symptoms: body.symptoms }),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => null);
            return NextResponse.json(
                { error: errorData?.detail || "An error occurred while processing your request" },
                { status: response.status }
            );
        }

        const data = await response.json();
        return NextResponse.json(data);

    } catch (error) {
        console.error("API Route Error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
