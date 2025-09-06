import "dotenv/config";

const getGeminiAiResponse = async (prompt) => {
  const prompt = req.body?.prompt;
  if (typeof prompt !== "string")
    return res.status(400).json({ error: "Prompt must be a string" });
  if (!process.env.GEMINI_API_KEY)
    return res.status(500).json({ error: "Missing Gemini API key" });

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
      }
    );

    const data = await response.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    console.log("❓ User question:", prompt);
    console.log("🤖 Gemini response:", text);

    return text
      ? res.json({ success: true, response: text })
      : res
          .status(500)
          .json({ error: "Invalid response from Gemini", raw: data });
  } catch (err) {
    console.error("Gemini error:", err);
    res.status(500).json({ error: "Request failed", message: err.message });
  }
};

export default getGeminiAiResponse;
