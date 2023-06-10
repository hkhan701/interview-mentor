import Express from 'express';
import * as dotenv from 'dotenv';
import cors from 'cors';
import { Configuration, OpenAIApi} from 'openai';

dotenv.config();

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

const app = Express();
app.use(cors());
app.use(Express.json());

app.get('/', async (req, res) => {
    res.status(200).send({message: 'Hello from InterviewMentor!'});
});

app.post('/', async (req, res) => {
    try {
        const prompt = req.body.prompt;
        const response = await openai.createCompletion({
            model: "gpt-3.5-turbo",
            prompt: prompt,
            temperature: 0.9,
            max_tokens: 1000,
            top_p: 1,
            frequency_penalty: 0.5,
            presence_penalty: 0,
        });
        
        res.status(200).send({
            bot: response.data.choices[0].text
        });

    } catch (error) {
        console.log(error);
        res.status(500).send({ error });
    }

});

app.listen(5000, () => console.log('Server running on port http://localhost:5000'));