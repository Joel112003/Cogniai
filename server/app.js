import express from "express";
import cors from "cors";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Routes
app.get("/", (req, res) => {
  res.json({
    message: "Hello World!",
    timestamp: new Date().toISOString(),
    version: "1.0.0",
  });
});

// app.post("/test", async (req, res) => {
//   try {
//     const response = await fetch(
//       "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=" +
//         process.env.GEMINI_API_KEY,
//       {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           contents: [
//             {
//               parts: [
//                 { text: "what is javascript" }, // you can replace with req.body.prompt
//               ],
//             },
//           ],
//         }),
//       }
//     );

//     const data = await response.json();
//     console.log(data.candidates[0].content.parts[0].text);
//     res.json(data.candidates[0].content.parts[0].text);
//   } catch (error) {
//     console.error("Error fetching from Gemini:", error);
//     res.status(500).json({ error: "Failed to fetch from Gemini" });
//   }
// });

// Graceful shutdown
app.post("/test", async (req, res) => {
  const prompt = req.body?.prompt || "What is JavaScript?";
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
      console.log("🤖 Gemini response:", text || data);

    return text
      ? res.json({ success: true, response: text })
      : res
          .status(500)
          .json({ error: "Invalid response from Gemini", raw: data });

  } catch (err) {
    console.error("Gemini error:", err);
    res.status(500).json({ error: "Request failed", message: err.message });
  }
});

process.on("SIGTERM", () => {
  console.log("SIGTERM received. Shutting down gracefully...");
  server.close(() => {
    console.log("Process terminated");
  });
});

const server = app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
  console.log(`📡 Environment: ${process.env.NODE_ENV || "development"}`);
});

export default app;
