package com.example.article_qna.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import com.example.article_qna.model.QnaRequest;
import com.example.article_qna.model.QnaResponse;
import com.example.article_qna.service.ClaudeService;
import com.example.article_qna.service.EmbeddingService;
import com.example.article_qna.utils.TextUtils;

import java.util.List;

@RestController
@RequestMapping("/api/qna")
public class ClaudeController {

    @Autowired
    private ClaudeService claudeService;

    @Autowired
    private EmbeddingService embeddingService;

    @PostMapping
    public QnaResponse getAnswer(@RequestBody QnaRequest request) {
        try {
            // 1. Fetch and clean article text
            String articleContent = request.getArticleUrl(); // placeholder for URL
            // Fetch the HTML from URL
            org.jsoup.nodes.Document doc = org.jsoup.Jsoup.connect(articleContent)
                    .userAgent("Mozilla/5.0")
                    .timeout(10_000)
                    .get();
            String rawText = doc.body().text();
            String cleanedText = TextUtils.cleanText(rawText);

            // 2. Chunk the text
            List<String> chunks = TextUtils.chunkText(cleanedText, 500);

            // 3. Optionally, embed chunks (not used directly in Claude prompt here)
            for (String chunk : chunks) {
                embeddingService.getEmbedding(chunk); // store or precompute embeddings if needed
            }

            // 4. Combine chunks into one context for Claude (or select top-K later)
            StringBuilder context = new StringBuilder();
            for (String chunk : chunks) {
                context.append(chunk).append("\n");
            }

            // 5. Query Claude
            String answer = claudeService.getAnswer(context.toString(), request.getQuestion());
            return new QnaResponse(answer);

        } catch (Exception e) {
            e.printStackTrace();
            return new QnaResponse("Error fetching or processing article: " + e.getMessage());
        }
    }
}
