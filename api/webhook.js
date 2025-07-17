export default async function handler(req, res) {
  const body = req.body;
  const languageCode = body.languageCode || 'en';

  const storyTopic = body.sessionInfo?.parameters?.topic || 'friendship';

  const story = `Once upon a time in a peaceful village, there lived two best friends... (story about ${storyTopic} in ${languageCode})`;

  return res.status(200).json({
    fulfillment_response: {
      messages: [
        {
          text: {
            text: [story]
          }
        }
      ]
    }
  });
}
