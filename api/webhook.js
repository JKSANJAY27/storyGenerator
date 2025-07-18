const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).send('Only POST requests allowed');
  }

  try {
    const body = req.body;
    const topic = body.sessionInfo?.parameters?.topic || 'kindness';
    const languageCode = body.sessionInfo?.parameters?.language || 'en';

    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    const prompt = `
      Write a short, engaging, and age-appropriate story for primary school children on the topic "${topic}".
      The story should have a clear moral or value, and should be written in ${languageCode} language.
      Keep the story simple and easy to understand, suitable for a multi-grade classroom.
    `;

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
      sessionInfo: {
        parameters: {
          topic,
          language: languageCode,
        },
      },
    });
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(500).json({
      fulfillment_response: {
        messages: [
          {
            text: {
              text: ['Sorry, I had trouble generating the story. Please try again.'],
            },
          },
        ],
      },
    });
  }
};
