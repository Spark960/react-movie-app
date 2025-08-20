import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const handler = async (req, res) => {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }
    try {
        const { title, overview } = req.body;

        if(!title || !overview) {
            return res.status(400).json({ message: 'Movie title & overview are required'});
        }

        const model = genAI.getGenerativeModel({ 
            model: 'gemini-2.5-flash', 
            generationConfig: { responseMimeType: "application/json" } 
        });

        const prompt = `Based on the movie "${title}" with the overview "${overview}", generate the following:
        1. A "short_review" in a casual, witty tone (2-3 sentences).
        2. A list of 3 "similar_movies" based on the mood and themes, not just the genre. Each item should have a "title" and a "reason".
        3. A list of 2-3 interesting and little-known "fun_facts" about the movie's production or impact.
        
        Provide the output as a valid JSON object with the keys "short_review", "similar_movies", and "fun_facts".`;

        const result = await model.generateContent(prompt);
        const response = result.response;
        const aiResponse = JSON.parse(response.text());

        console.log("AI Response:", aiResponse);
        
        return res.status(200).json(aiResponse);

    } catch (error) {
        console.error('Error calling Gemini API:', error);
        return res.status(500).json({ message: 'Failed to get AI companion data.' });
    }
}

export default handler;