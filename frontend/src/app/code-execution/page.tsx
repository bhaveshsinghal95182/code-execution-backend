"use client";

import { Button } from "@/components/ui/button";
import { Editor } from "@monaco-editor/react";
import { useState } from "react";

export default function Home() {
  const [language, setLanguage] = useState("javascript");
  const [code, setCode] = useState("");
  const [output, setOutput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleRun = async () => {
    try {
      setIsLoading(true);
      setOutput("");

      const response = await fetch(
        "https://server.bhaveshsinghal.xyz/api/execute",
        {
          method: "POST",
          body: JSON.stringify({ code, language }),
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        const errorMessage = data.error || "Failed to run code";
        setOutput(`Error: ${errorMessage}`);
        return;
      }

      setOutput(data.output || "No output");
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "An unexpected error occurred";
      setOutput(`Error: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="flex px-0">
        <div className="flex flex-col gap-2 items-center justify-center bg-[#1e1e1e] p-0">
          <Button
            className={`bg-white text-black hover:bg-gray-500 ${language === "javascript" ? "ring-2 ring-blue-500" : ""}`}
            onClick={() => setLanguage("javascript")}
          >
            JavaScript
          </Button>
          <Button
            className={`bg-white text-black hover:bg-gray-500 ${language === "cpp" ? "ring-2 ring-blue-500" : ""}`}
            onClick={() => setLanguage("cpp")}
          >
            C++
          </Button>
          <Button
            className={`bg-white text-black hover:bg-gray-500 ${language === "python" ? "ring-2 ring-blue-500" : ""}`}
            onClick={() => setLanguage("python")}
          >
            Python
          </Button>
          <Button
            className={`bg-white text-black hover:bg-gray-500 ${language === "java" ? "ring-2 ring-blue-500" : ""}`}
            onClick={() => setLanguage("java")}
          >
            Java
          </Button>
        </div>

        <div className="w-full bg-[#1e1e1e] relative">
          <Button
            className="bg-white text-black absolute top-2 right-32 z-50 hover:bg-gray-200"
            onClick={handleRun}
            disabled={isLoading}
          >
            {isLoading ? "Running..." : "Run"}
          </Button>
          <Editor
            height="70vh"
            width="100%"
            theme="vs-dark"
            language={language}
            value={code}
            onChange={(value) => setCode(value || "")}
            defaultValue="// some comment"
          />
          <div className="bg-[#2d2d2d] p-4 text-white min-h-[30vh]">
            <h3 className="text-lg font-semibold mb-2">Output:</h3>
            {output && <pre className="whitespace-pre-wrap">{output}</pre>}
          </div>
        </div>
      </div>
    </>
  );
}
