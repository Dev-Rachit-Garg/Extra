const { YoutubeTranscript } = require('youtube-transcript');
const { OpenAI } = require('openai');

// Setup OpenAI (v4 style)
const openai = new OpenAI({
  apiKey: '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',  // <--- Put your new key here
});

// Fetch YouTube transcript and summarize
async function summarizeYoutubeVideo(videoId) {
  try {
    // 1. Fetch the transcript
    const transcript = await YoutubeTranscript.fetchTranscript(videoId);

    // 2. Combine all transcript texts into one big string
    const fullText = transcript.map(item => item.text).join(' ');

    // 3. Send to OpenAI for summarization
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo', // or 'gpt-4' if available
      messages: [
        {
          role: 'system',
          content: 'You are an assistant that summarizes YouTube transcripts into short and clear  english for summaries.',
        },
        {
          role: 'user',
          content: `Please summarize this transcript in Hindi:\n\n${fullText}`,
        },
      ],
      temperature: 0.5,
    });

    const summary = response.choices[0].message.content;
    console.log('\n🎯 Summary:\n', summary);
  } catch (error) {
    console.error('Error:', error);
  }
}

// Call the function
summarizeYoutubeVideo('U0Ow1KIAMQ8');  // <-- Your YouTube video ID
