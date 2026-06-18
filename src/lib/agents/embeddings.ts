/**
 * Utility for generating and comparing Vector Embeddings using the local Ollama instance.
 */

const OLLAMA_URL = process.env.LOCAL_LLM_URL 
  ? process.env.LOCAL_LLM_URL.replace('/v1', '/api/embeddings') 
  : 'http://localhost:11434/api/embeddings';

/**
 * Calls the local Ollama instance to generate an embedding for the given text
 * using the nomic-embed-text model.
 */
export async function generateEmbedding(text: string): Promise<number[]> {
  try {
    const response = await fetch(OLLAMA_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'nomic-embed-text',
        prompt: text,
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error('Ollama Embedding Error:', errText);
      throw new Error(`Failed to generate embedding: ${response.statusText}`);
    }

    const data = await response.json();
    return data.embedding;
  } catch (error) {
    console.error('Error generating embedding:', error);
    // Return empty array as fallback if ollama is not running
    // so the app doesn't completely crash for non-essential memory operations
    return [];
  }
}

/**
 * Computes the cosine similarity between two vector arrays.
 * Returns a value between -1 and 1, where 1 means perfectly similar.
 */
export function cosineSimilarity(vecA: number[], vecB: number[]): number {
  if (!vecA || !vecB || vecA.length === 0 || vecB.length === 0) return 0;
  if (vecA.length !== vecB.length) return 0;

  let dotProduct = 0;
  let normA = 0;
  let normB = 0;

  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
    normA += vecA[i] * vecA[i];
    normB += vecB[i] * vecB[i];
  }

  if (normA === 0 || normB === 0) return 0;
  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}
