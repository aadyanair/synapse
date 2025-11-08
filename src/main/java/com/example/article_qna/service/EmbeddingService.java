package com.example.article_qna.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class EmbeddingService {

    @Autowired
    private ClaudeService claudeService;

    // generate a pseudo-embedding vector as a comma-separated string
    public float[] getEmbedding(String text) {
        String prompt = "Represent the following text as a list of 10 numeric values for semantic similarity:\n" + text;
        String response = claudeService.getAnswer("", text);

        
        // parse response into float array
        String[] parts = response.replaceAll("[\\[\\]]", "").split(",");
        float[] embedding = new float[parts.length];
        for (int i = 0; i < parts.length; i++) {
            try {
                embedding[i] = Float.parseFloat(parts[i].trim());
            } catch (Exception e) {
                embedding[i] = 0f; // fallback if parsing fails
            }
        }
        return embedding;
    }

    // cosine similarity
    public float similarity(float[] a, float[] b) {
        float dot = 0f, normA = 0f, normB = 0f;
        for (int i = 0; i < a.length; i++) {
            dot += a[i] * b[i];
            normA += a[i] * a[i];
            normB += b[i] * b[i];
        }
        return dot / ((float)Math.sqrt(normA) * (float)Math.sqrt(normB) + 1e-6f);
    }
}
