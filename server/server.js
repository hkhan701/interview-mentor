import express from 'express'
import * as dotenv from 'dotenv'
import cors from 'cors'
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai';

dotenv.config() 

const MODEL_NAME = "gemini-1.0-pro";
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const safetySettings = [
  {
    category: HarmCategory.HARM_CATEGORY_HARASSMENT,
    threshold: HarmBlockThreshold.BLOCK_NONE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
    threshold: HarmBlockThreshold.BLOCK_NONE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
    threshold: HarmBlockThreshold.BLOCK_NONE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
    threshold: HarmBlockThreshold.BLOCK_NONE,
  },
];

const generationConfig = { 
  model: MODEL_NAME,
  maxTokens: 100,
  temperature: 0.5,
  topP: 1.0,
  frequencyPenalty: 0.0,
  presencePenalty: 0.0,
  stopSequences: ["\n"],
};

const model = genAI.getGenerativeModel(generationConfig, safetySettings);

const app = express()
app.use(cors())
app.use(express.json())

app.get('/', async (req, res) => {
  res.status(200).send({
    message: 'Hello from InterviewMentor'
  })
})

app.post('/', async (req, res) => {
  try {
      const prompt = req.body.prompt;
      const data = await model.generateContent(prompt);
    res.status(200).send({
      response: data.response.text()
    });
  } catch (error) {
    if (error.response && error.response.promptFeedback && error.response.promptFeedback.blockReason === 'SAFETY') {
      // Response was blocked due to safety
      console.error('Response blocked due to safety');
      res.status(200).send({
        response: "Blocked due to safety."
      });
    } else {
      // Other errors
      console.error(error);
      res.status(500).send('Error: Something went wrong');
    }
  }
})

app.listen(5000, () => console.log('AI server started on http://localhost:5000'))