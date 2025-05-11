'use client'

import { useState } from "react";


export default function Home() {

    const [prompt, setPrompt] = useState("");
  const [image, setImage] = useState("");
  const [loading, setLoading] = useState(false);
  const generateImage = async () =>{
    setLoading(true);
    const res = await fetch("/api",{
       method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt }),
    });
     const data = await res.json();
    setImage(data.image || "");
    setLoading(false);
  }
  return (
    <main className="min-h-screen p-4 flex flex-col items-center">
      <h1 className="text-2xl font-bold mb-4">Image Generator</h1>
      <textarea
        className="w-full max-w-md border p-2 rounded mb-2"
        rows={3}
        placeholder="Enter prompt..."
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
      />
      <button
        onClick={generateImage}
        className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
        disabled={loading}
      >
        {loading ? "Generating..." : "Generate Image"}
      </button>

      {image && (
        <img
          src={image}
          alt="Generated"
          className="mt-6 max-w-md w-full border rounded"
        />
      )}
    </main>
  );
}
