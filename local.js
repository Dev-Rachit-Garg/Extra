const { YoutubeTranscript } = require('youtube-transcript');
const { OpenAI } = require('openai');
const readline = require('readline');

// Setup OpenAI (v4 style)
const openai = new OpenAI({
  apiKey: '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',  // <--- Put your new key here
});

// Setup readline for console input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Fetch YouTube transcript
async function fetchTranscript(videoId) {
  try {
    const transcript = await YoutubeTranscript.fetchTranscript(videoId);
    return transcript.map(item => item.text).join(' ');
  } catch (error) {
    console.error('Error fetching transcript:', error);
    throw error;
  }
}

// Chat with the video based on its transcript
async function chatWithVideo(videoId, userMessage) {
  try {
    // Fetch the transcript
    const fullText = await fetchTranscript(videoId);

    // Send the user's message along with the transcript for context
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo', // or 'gpt-4' if available
      messages: [
        {
          role: 'system',
          content: 'You are an assistant that can chat based on YouTube video transcripts.',
        },
        {
          role: 'user',
          content: `This is the transcript of a YouTube video. Please answer the following question based on it.\n\nTranscript:\n${fullText}\n\nQuestion: ${userMessage}`,
        },
      ],
      temperature: 0.7,
    });

    const chatResponse = response.choices[0].message.content;
    console.log('\n🤖 Chat Response:\n', chatResponse);
  } catch (error) {
    console.error('Error in chatWithVideo:', error);
  }
}

// Prompt the user for a question and call the chatWithVideo function
function askQuestion(videoId) {
  rl.question('Ask a question about the video: ', (userMessage) => {
    chatWithVideo(videoId, userMessage).then(() => {
      // After answering, ask the user if they want to ask another question
      rl.question('Would you like to ask another question? (yes/no): ', (answer) => {
        if (answer.toLowerCase() === 'yes') {
          askQuestion(videoId); // Recursively ask another question
        } else {
          console.log('Goodbye!');
          rl.close(); // Close the readline interface
        }
      });
    });
  });
}

// Example usage: start by asking a question on a specific video
const videoId = 'U0Ow1KIAMQ8'; // Replace with your desired video ID
askQuestion(videoId);
