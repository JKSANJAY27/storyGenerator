module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).send('Only POST requests allowed');
  }

  try {
    console.log('REQUEST BODY:', JSON.stringify(req.body, null, 2));

    const body = req.body;
    const languageCode = body.sessionInfo?.parameters?.language || 'en';
    const topic = body.sessionInfo?.parameters?.topic || 'kindness';

    // Replace with Gemini API generation
    const story = `Here is a short story about ${topic}, in ${languageCode} language.`;

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
    res.status(500).json({ error: 'Internal server error' });
  }
};
