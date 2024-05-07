import { NextApiRequest, NextApiResponse } from 'next';
import { OpenAIStream, StreamingTextResponse,streamToResponse } from 'ai';
import OpenAI from 'openai';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

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

    const openai = new OpenAI({
        apiKey:String(process.env.NEXT_PUBLIC_DEEPSEEK_API_KEY),
        baseURL:"https://api.deepseek.com/v1"
    });

    console.log(`request : ${req.headers['content-type']}`)
    if (req.method === 'POST') {
        const { content } = req.body;
        console.log('Source code in api:', content);
        try {    
            const chatCompletion = await openai.chat.completions.create({
            model:'deepseek-chat',
            messages:[
                {"role": "system", "content": systemPrompt},
                {"role": "user", "content": content},
            ],
            frequency_penalty: 0,
            max_tokens: 2048,
            presence_penalty: 0,
            stop: null,
            stream: true,
            temperature: 0.1,
            top_p: 1,
        })
    
        //Convert the response into a friendly text-stream
        //console.log('Chat Completion:',chatCompletion);
        const stream = OpenAIStream(chatCompletion);
        //console.log('Stream:',stream);
        // Respond with the stream
        return streamToResponse(stream, res);
        } 
        catch (error) {
            console.log('In api',error);
        }
    } 
}