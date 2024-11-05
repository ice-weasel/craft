import React, { useState, useEffect } from "react";
import axios from "axios";

interface ResponseData {
  message: string;
  data?: any;
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
      // Create axios instance with default config
      const axiosInstance = axios.create({
        baseURL: BACKEND_URL,
        headers: {
          "Content-Type": "application/json",
        },
        // Enable CORS credentials if your Flask backend requires it
        withCredentials: true,
      });

      // Make the request
      const response = await axiosInstance.post<ResponseData>(
        "/receive-data",
        jsonData
      );

      setSuccessMessage(response.data.message || "Data sent successfully!");
      console.log("Backend response:", response.data);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const errorMessage =
          err.response?.data?.error || err.message || "Failed to send data";
        setError(`Error: ${errorMessage}`);

        // Detailed error logging
        console.error("Request failed:", {
          status: err.response?.status,
          statusText: err.response?.statusText,
          data: err.response?.data,
          headers: err.response?.headers,
          config: {
            url: err.config?.url,
            method: err.config?.method,
            headers: err.config?.headers,
          },
        });
      } else {
        setError("An unexpected error occurred");
        console.error("Non-Axios error:", err);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold mb-6">JSON Data Sender</h1>

        {/* Backend URL Display */}
        <div className="mb-4 p-4 bg-gray-100 rounded-md">
          <p className="text-sm text-gray-600">Backend URL: {BACKEND_URL}</p>
        </div>

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
