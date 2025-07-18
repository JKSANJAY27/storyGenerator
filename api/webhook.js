const { GoogleGenerativeAI } = require('@google/generative-ai');

const MODEL_NAME = "gemini-pro";
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).send('Only POST requests allowed');
  }

  try {
    const { sessionInfo = {} } = req.body;
    const parameters = sessionInfo.parameters || {};

    const topic = parameters.topic || "friendship";
    const language = parameters.language || "en";

    const prompt = `
      Generate a short and meaningful story for children about "${topic}".
      The story should be written in "${language}" and should be suitable for primary school kids.
      Make it engaging and culturally relevant if possible.
    `;

    const model = genAI.getGenerativeModel({ model: MODEL_NAME });
    const result = await model.generateContent(prompt);
    const response = result.response;
    const story = response.text();

    res.status(200).json({
      fulfillment_response: {
        messages: [
          {
            text: {
              text: [story],
            },
          },
        ],
      },
    });
  } catch (error) {
    console.error("Webhook error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
