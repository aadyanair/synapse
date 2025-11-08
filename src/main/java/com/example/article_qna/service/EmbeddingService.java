package com.example.article_qna.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class EmbeddingService {

    @Autowired
    private ClaudeService claudeService;

    /**
     * Returns a pseudo-embedding vector from Claude.
     * Since Claude doesn’t provide direct embeddings like OpenAI,
     * we can use a textual representation or hash-based approach for demo purposes.
     */
    public float[] getEmbedding(String text) {
        // Ask Claude to summarize or encode text into numbers
        String prompt = "Generate a numeric embedding for the following text (comma-separated floats, 10 numbers):\n" + text;
        String response = claudeService.getAnswer(prompt, "Provide numbers only, comma-separated");

        // Parse response into float array
        String[] parts = response.replaceAll("[^0-9,.-]", "").split(",");
        float[] embedding = new float[parts.length];
        for (int i = 0; i < parts.length; i++) {
            try {
                embedding[i] = Float.parseFloat(parts[i]);
            } catch (NumberFormatException e) {
                embedding[i] = 0f;
            }
        }
        return embedding;
    }
}
