"use client";
import { useState } from "react";
import Link from "next/link";

export default function Home() {
    const [symptoms, setSymptoms] = useState("");
    const [response, setResponse] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setResponse(null);

        try {
            const res = await fetch("/api/chatbot", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ symptoms }),
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.error || "Failed to fetch response");
            }

            const data = await res.json();
            setResponse(data);
        } catch (err) {
            setError(err.message || "Failed to analyze symptoms. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white p-6">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold text-center mb-8 text-red-800">
                    SwiftMedic Chatbot
                </h1>
                
                <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <textarea
                            className="w-full p-4 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 resize-none bg-gray-50"
                            value={symptoms}
                            onChange={(e) => setSymptoms(e.target.value)}
                            placeholder="Please describe your symptoms in detail..."
                            rows={4}
                            required
                        />
                        <button 
                            type="submit" 
                            className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-3 px-6 rounded-lg transition duration-200 flex items-center justify-center space-x-2"
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <span className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></span>
                                    <span>Analyzing...</span>
                                </>
                            ) : (
                                <span>Analyze Symptoms</span>
                            )}
                        </button>
                    </form>
                </div>

                {error && (
                    <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-8 rounded-lg">
                        <p className="text-red-700">{error}</p>
                    </div>
                )}

                {response && (
                    <div className="space-y-6">
                        {response.greeting && (
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-blue-800">
                                {response.greeting}
                            </div>
                        )}
                        {response.sections?.map((section, index) => (
                            <ResultCard
                                key={index}
                                title={section.title}
                                icon={getIcon(section.title)}
                                content={section.content.join("\n")}
                                color={getColor(section.title)}
                            />
                        ))}
                    </div>
                )}

                <div className="mt-8 flex justify-center space-x-6">
                    <Link 
                        href="/hospital" 
                        className="flex items-center space-x-2 text-blue-600 hover:text-blue-800 transition-colors"
                    >
                        <span>🏥</span>
                        <span>Find Hospital</span>
                    </Link>
                    <Link 
                        href="/ambulance" 
                        className="flex items-center space-x-2 text-green-600 hover:text-green-800 transition-colors"
                    >
                        <span>🚑</span>
                        <span>Emergency Services</span>
                    </Link>
                </div>
            </div>
        </div>
    );
}

function ResultCard({ title, icon, content, color }) {
  const colorClasses = {
      blue: "bg-blue-50 border-blue-200",
      purple: "bg-purple-50 border-purple-200",
      red: "bg-red-50 border-red-200",
      yellow: "bg-yellow-50 border-yellow-200",
      green: "bg-green-50 border-green-200"
  };

  return (
      <div className={`rounded-lg border p-6 shadow-sm transition duration-200 hover:shadow-md ${colorClasses[color]}`}>
          <div className="flex items-center space-x-3 mb-4">
              <span className="text-2xl">{icon}</span>
              <h3 className="text-xl font-semibold text-gray-800">{title}</h3>
          </div>
          <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{content}</p>
      </div>
  );
}


function getIcon(title) {
    const icons = {
        "Disease Prediction": "🩺",
        "Self-Check Guide": "🔍",
        "First Aid": "⛑",
        "Precautions": "⚠",
        "Solutions": "💊"
    };
    return icons[title] || "ℹ";
}

function getColor(title) {
    const colors = {
        "Disease Prediction": "blue",
        "Self-Check Guide": "purple",
        "First Aid": "red",
        "Precautions": "yellow",
        "Solutions": "green"
    };
    return colors[title] || "gray";
}