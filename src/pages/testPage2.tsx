import React, { useState, useEffect } from "react";
import axios from "axios";

interface ResponseData {
  message: string;
  generated_file?: string; // This allows us to access the generated file's URL/path
  error?: string;
}

const TestData: React.FC = () => {
  const [jsonData, setJsonData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [successMessage, setSuccessMessage] = useState<string>("");

  // Local Flask development server URL
  const BACKEND_URL = "http://localhost:8000";

  useEffect(() => {
    loadJsonData();
  }, []);

  const loadJsonData = async () => {
    try {
      const data = await import("./../generated-jsons/test.json");
      setJsonData(data.default);
      setError("");
    } catch (err) {
      setError("Failed to load JSON file");
      console.error("Error loading JSON:", err);
    }
  };

  const sendDataToBackend = async () => {
    if (!jsonData) {
      setError("No data to send");
      return;
    }

    setIsLoading(true);
    setError("");
    setSuccessMessage("");

    try {
      // Send JSON data to the backend
      const response = await fetch("http://localhost:8000/receive-data", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(jsonData),
      });

      if (!response.ok) {
        throw new Error("Failed to send data to backend");
      }

      // If the backend responds with a file, download it
      // After the backend processes the data, download the .py file
      const fileResponse = await fetch(
        "http://localhost:8000/download-sample",
        {
          method: "GET",
        }
      );
      console.log(fileResponse);
      if (!fileResponse.ok) {
        throw new Error("Failed to fetch the .py file");
      }

      const blob = await fileResponse.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "sample.py"; // Name of the file when downloaded
      link.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold mb-6">JSON Data Sender</h1>

        {/* Status Section */}
        <div className="mb-6">
          <p className="text-gray-600 mb-2">
            Status:{" "}
            {isLoading
              ? "Loading..."
              : jsonData
              ? "JSON Loaded"
              : "No data loaded"}
          </p>
        </div>

        {/* JSON Preview */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Data Preview:</h2>
          <pre className="bg-gray-100 p-4 rounded-md overflow-auto max-h-60">
            {jsonData ? JSON.stringify(jsonData, null, 2) : "No data loaded"}
          </pre>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 mb-6">
          <button
            onClick={loadJsonData}
            disabled={isLoading}
            className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 disabled:bg-gray-300"
          >
            Reload JSON
          </button>
          <button
            onClick={sendDataToBackend}
            disabled={isLoading || !jsonData}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-gray-300"
          >
            {isLoading ? "Sending..." : "Send to Backend"}
          </button>
        </div>

        {/* Messages */}
        {error && (
          <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-md">
            {error}
          </div>
        )}
        {successMessage && (
          <div className="mb-4 p-4 bg-green-100 text-green-700 rounded-md">
            {successMessage}
          </div>
        )}
      </div>
    </div>
  );
};

export default TestData;
