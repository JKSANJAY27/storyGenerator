const fetch = (...args) =>
  import('node-fetch').then(({ default: fetch }) => fetch(...args));

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || 'YOUR_GEMINI_API_KEY';

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).send('Only POST requests allowed');
  }

  try {
    const body = req.body;
    const languageCode = body.sessionInfo?.parameters?.language || 'en';
    const topic = body.sessionInfo?.parameters?.topic || 'friendship';

    // Construct the prompt for Gemini
    const prompt = `You are a storytelling assistant. Create a short, engaging, and age-appropriate story for kids about "${topic}". 
Make sure the story has a simple moral value and is suitable for primary school students. 
Respond in language: ${languageCode}.`;

    // Call Gemini API
    const geminiResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
        }),
      }
    );

    const geminiData = await geminiResponse.json();
    const story =
      geminiData?.candidates?.[0]?.content?.parts?.[0]?.text ||
      'Sorry, I could not generate a story at this moment.';

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
    console.error('Webhook error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
