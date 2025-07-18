const { GoogleGenerativeAI } = require('@google/generative-ai');

if (!process.env.GEMINI_API_KEY) {
  throw new Error('GEMINI_API_KEY environment variable is not set');
}
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).send('Only POST requests allowed');
  }

  try {
    const body = req.body;

    // Debug log (for Vercel logs)
    console.log("Incoming request:", JSON.stringify(body, null, 2));

    const tag = body.fulfillmentInfo?.tag;
    if (tag !== 'story_generation') {
      return res.status(400).json({ error: 'Invalid webhook tag' });
    }

    // Extract parameters from Dialogflow CX
    const topic = body.sessionInfo?.parameters?.topic || 'friendship';
    const language = body.sessionInfo?.parameters?.language || 'en';

    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    const prompt = `Generate a short, simple, engaging story suitable for young children on the topic of "${topic}". The story should be in ${language} language and must convey a positive value or lesson.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const storyText = response.text();

    console.log("Generated story:", storyText);

    // Respond to Dialogflow CX
    res.status(200).json({
      fulfillment_response: {
        messages: [
          {
            text: {
              text: [storyText],
            },
          },
        ],
      },
    });

  } catch (error) {
    console.error('Webhook error:', error);
    res.status(500).json({
      fulfillment_response: {
        messages: [
          {
            text: {
              text: [
                'Oops! Something went wrong while generating the story. Please try again later.',
              ],
            },
          },
        ],
      },
    });
  }
};
