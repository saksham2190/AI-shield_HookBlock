const API_URL = "http://localhost:5000/api/analyze";

async function analyzeWebsite(url) {

    try {

        const response = await fetch(API_URL, {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                url
            })

        });

        return await response.json();

    } catch (error) {

        console.error(error);

        return null;

    }

}