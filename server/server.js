import express from 'express'
import * as dotenv from 'dotenv'
import cors from 'cors'
import { Groq } from 'groq-sdk';

dotenv.config() 

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

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
    const chatCompletion = await groq.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "llama-3.3-70b-versatile",
      temperature: 1,
      max_completion_tokens: 8192,
      top_p: 1,
      stream: true,
    });

    let fullResponse = '';
    for await (const chunk of chatCompletion) {
      fullResponse += chunk.choices[0]?.delta?.content || '';
    }

    res.status(200).send({
      response: fullResponse
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error: Something went wrong');
  }
})

app.listen(5000, () => console.log('AI server started on http://localhost:5000'))