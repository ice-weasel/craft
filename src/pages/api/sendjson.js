// Frontend: API to send JSON to the Render server
export default async function handler(req, res) {
    if (req.method !== "POST") {
      return res.status(405).end(); // Method not allowed
    }
  
    const { jsonString } = req.body;
  
    if (!jsonString) {
      return res.status(400).json({ error: "Missing JSON" });
    }
  
    try {
      // Send the JSON string to the Render server
      const renderServerUrl = "https://your-render-server-url.com/api/receive-json"; // Replace with your Render server URL
      const response = await fetch(renderServerUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ jsonString }),
      });
  
      if (!response.ok) {
        throw new Error(`Error from Render server: ${response.statusText}`);
      }
  
      const responseData = await response.json();
      return res.status(200).json({ message: "JSON sent successfully", data: responseData });
    } catch (error) {
      return res.status(500).json({ error: "Failed to send JSON", details: error.message });
    }
  }
  