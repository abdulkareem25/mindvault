import { ChatMistralAI } from '@langchain/mistralai';
import { HumanMessage } from 'langchain';
import readline from 'readline/promises';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const model = new ChatMistralAI({
  model: 'mistral-small-latest',
  apiKey: process.env.MISTRAL_API_KEY
});

const messages = [];

while (true) {
  const userInput = await rl.question('You: ');
  
  if (userInput.toLowerCase() === 'exit') {
    console.log('Exiting...');
    break;
  }

  messages.push(new HumanMessage(userInput).content);

  const response = await model.invoke(messages);

  messages.push(response.text);

  console.log('MistralAI:', response.text);
}
rl.close();