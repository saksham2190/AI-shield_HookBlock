const LOCAL_API_URL = "http://localhost:5000/api/analyze";
const REMOTE_API_URL = "https://ai-shield-hookblock.onrender.com/api/analyze";

async function postRequest(endpoint, url) {
    const response = await fetch(endpoint, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ url })
    });
    return await response.json();
}

async function analyzeWebsite(url) {
    try {
        const localResult = await postRequest(LOCAL_API_URL, url);
        if (localResult && localResult.success) {
            return localResult;
        }
    } catch {
        // Fallback to remote backend
    }

    try {
        return await postRequest(REMOTE_API_URL, url);
    } catch (error) {
        console.error("API error:", error);
        return null;
    }
}