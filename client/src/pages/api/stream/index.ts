// pages/api/stream.ts

import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'GET' || req.method === 'POST') {
        const content = `tell me bout c++ in 20 words`
        const systemPrompt = `Evaluation Criteria:
        Correctness: Ensure the code correctly solves the given problem statement without any logical or syntactic errors.
        Efficiency: Assess the algorithm's time and space complexity. The code should employ the most efficient algorithms and data structures for the problem, optimizing for execution speed and memory usage.
        Competitive Coding Standards: Since comments, try-catch statements, and descriptive variable naming are not priorities in this context, they should not negatively impact the evaluation. Focus on the algorithmic efficiency and correctness.
        Error Identification: Clearly identify and explain any errors or inefficiencies in the code. Provide constructive feedback on how to address these issues.
        Evaluation Response:
        Important Note: The feedback SHOULD NOT CONTAIN ANY CODE SNIPPETS OR CODE SUGGESTIONS. It should be pure text response evaluating the code based on the criteria above.
        Correctness:[Provide observations on the correctness of the solution, noting any logical errors or misinterpretations of the problem statement.]
        Efficiency:[Analyze the efficiency of the code, commenting on the choice of algorithms and data structures. Offer suggestions for more efficient solutions if applicable.]
        Error Identification and Suggestions:[List specific errors found in the code, categorizing them as syntax errors, logical errors, or inefficiencies. For each identified issue, provide a  brief explanation. YOU SHOULD NEVER PROVIDE CODE AS OUTPUT.]
        Score: _/10 [Assign a score out of 10 based on the criteria above, taking into account the severity and number of issues found. A higher score indicates a more efficient, correct, and well-structured solution ]
        The score should be the final sentence in the output. There shouldnt be anything after the score.
        `
        const apiKey = String(process.env.NEXT_PUBLIC_DEEPSEEK_API_KEY);
        if (!apiKey) {
            return res.status(500).send('OPENAI_API_KEY is not provided');
        }
        try {
            const fetch = require('node-fetch');

            // Establish the stream to OpenAI
            const openaiResponse = await fetch('https://api.deepseek.com/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`,
                },
                body: JSON.stringify({
                    messages:[
                        {"role": "system", "content": systemPrompt},
                        {"role": "user", "content": content},
                    ],
                    model: 'deepseek-chat',
                    frequency_penalty: 0,
                    max_tokens: 2048,
                    presence_penalty: 0,
                    stop: null,
                    stream: true,
                    temperature: 0.2,
                    top_p: 1,
                }),
            });

            if (!openaiResponse.body) {
                res.status(500).send('Failed to stream response from OpenAI');
                return;
            }

            // Set headers for streaming response
            res.setHeader('Content-Type', 'text/event-stream');
            res.setHeader('Cache-Control', 'no-cache');
            res.setHeader('Connection', 'keep-alive');
            res.status(200);

            console.log("response from model: ", openaiResponse.body)

            openaiResponse.body.on('data', (chunk: Buffer) => { // Explicitly specify the type as Buffer
                res.write(chunk);
            });

            openaiResponse.body.on('end', () => {
                res.end();
            });

            openaiResponse.body.on('error', (error: any) => { // Explicitly specify the type as any
                console.error('Error streaming response:', error);
                res.end();
            });

        } catch (error) {
            console.error('Error in API route:', error);
            res.status(500).send('Internal server error');
        }
    } else {
            res.setHeader('Allow', 'GET, POST');
            res.status(405).end('Method Not Allowed');
    }
}

