const { GoogleGenAI } = require('@google/genai');

const analyzeCommit = async (message, diff) => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    const prompt = `Analyze this commit. 
Message: ${message}
Diff: ${diff ? diff.substring(0, 2000) : 'None'}

Return ONLY a JSON object with the following keys:
- "classification": one of ["Feature", "Bug Fix", "Refactor", "Docs", "Chore", "Other"]
- "impactScore": an integer from 1 to 100 based on the complexity and impact of the diff.
- "summary": A short 1-sentence summary of what this code change achieves.

Ensure the output is pure JSON without markdown backticks.`;

    const response = await ai.models.generateContent({
        model: 'gemini-3.1-flash',
        contents: prompt
    });
    
    let text = response.text;
    text = text.replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(text);
  } catch (error) {
    console.error('Gemini Analysis Error:', error.message);
    // Fallback heuristic if API fails or parsing fails
    return {
      classification: message.toLowerCase().includes('fix') ? 'Bug Fix' : 'Feature',
      impactScore: 10,
      summary: message
    };
  }
};

const summarizeRepo = async (commitsInfo) => {
  try {
     const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
     const prompt = `Based on the following recent commits, write a 2-3 sentence summary of the engineering focus of this repository: ${commitsInfo.substring(0, 3000)}`;
     const response = await ai.models.generateContent({
        model: 'gemini-3.1-flash-lite-preview',
        contents: prompt
     });
     return response.text;
  } catch (error) {
     return "Engineering summary unavailable.";
  }
};

const summarizeContributor = async (username, commitsInfo) => {
  try {
     if (!commitsInfo || commitsInfo.trim().length < 5) return `${username} is a contributor to this repository.`;
     
     const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
     const prompt = `Based on these commit messages for developer "${username}", write a 1-sentence professional summary of their main contributions and impact on this repository. Be specific about features or modules they worked on.
     
     Commits:
     ${commitsInfo.substring(0, 2000)}
     
     Summary (1 sentence):`;
     
     const response = await ai.models.generateContent({
        model: 'gemini-3.1-flash-lite-preview',
        contents: prompt
     });

     if (response && response.text) {
       return response.text.trim();
     }
     throw new Error('Empty AI response');
  } catch (error) {
     console.error(`Gemini Error for ${username}:`, error.message);
     return `${username} contributed to the repository's codebase and development.`;
  }
};

const heuristicAnalyze = (message) => {
  const msg = message.toLowerCase();
  if (msg.includes('feat') || msg.includes('add') || msg.includes('implement')) return 'Feature';
  if (msg.includes('fix') || msg.includes('bug') || msg.includes('hotfix')) return 'Bug Fix';
  if (msg.includes('refactor') || msg.includes('clean') || msg.includes('move')) return 'Refactor';
  if (msg.includes('docs') || msg.includes('readme') || msg.includes('documentation')) return 'Docs';
  if (msg.includes('test') || msg.includes('spec')) return 'Test';
  if (msg.includes('chore') || msg.includes('build') || msg.includes('ci') || msg.includes('config')) return 'Chore';
  return 'Other';
};

module.exports = { analyzeCommit, summarizeRepo, summarizeContributor, heuristicAnalyze };