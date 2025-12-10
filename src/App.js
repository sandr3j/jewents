import React from "react";
import "./App.css";

/**
 * Uses Tailwind CSS for styling
 * Tailwind file is imported in App.css
 */

export default function App() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="space-y-4 text-center">
        <h1 className="text-3xl font-bold text-purple-700">Welcome</h1>
        <Button text="Click Me" url="#" />
      </div>
    </div>
  );
}

function Button({ className = "", text, url = "#" }) {
  return (
    <a
      href={url}
      className={`${className} py-3 px-6 bg-purple-400 hover:bg-purple-300 text-purple-800 hover:text-purple-900 block rounded text-center shadow flex items-center justify-center leading-snug text-xs transition ease-in duration-150`}
    >
      {text}
    </a>
  );
}
