module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).send('Only POST requests allowed');
  }

  try {
    const body = req.body;
    const languageCode = body.languageCode || 'en';
    const topic = body.sessionInfo?.parameters?.topic || 'friendship';

    const story = `Once upon a time, in a small village, there was a story about ${topic}, told in ${languageCode}.`;

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
