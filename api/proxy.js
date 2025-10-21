export default async function handler(req, res) {
    const targetUrl = "https://api.openai.com/v1/chat/completions";
    const apiKey = process.env.OPENAI_API_KEY;
  
    const response = await fetch(targetUrl, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(req.body)
    });
  
    const data = await response.json();
    res.status(response.status).json(data);
  }
  