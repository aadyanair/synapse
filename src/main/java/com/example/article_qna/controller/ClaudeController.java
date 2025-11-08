package com.example.article_qna.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import com.example.article_qna.model.QnaRequest;
import com.example.article_qna.model.QnaResponse;
import com.example.article_qna.service.ClaudeService;
import com.example.article_qna.service.EmbeddingService;
import com.example.article_qna.utils.TextUtils;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.TreeMap;

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
            String articleText = fetchArticle(request.getArticleUrl()); // your JSoup + cleanText
            List<String> chunks = TextUtils.chunkText(articleText, 200); // 200 words per chunk

            // store chunk embeddings
            List<float[]> embeddings = new ArrayList<>();
            for (String chunk : chunks) {
                embeddings.add(embeddingService.getEmbedding(chunk));
            }

            // embed the question
            float[] questionEmbedding = embeddingService.getEmbedding(request.getQuestion());

            // find top 3 most similar chunks
            List<String> topChunks = new ArrayList<>();
            Map<Float, String> scoreMap = new TreeMap<>(Collections.reverseOrder());
            for (int i = 0; i < chunks.size(); i++) {
                float sim = embeddingService.similarity(questionEmbedding, embeddings.get(i));
                scoreMap.put(sim, chunks.get(i));
            }
            int count = 0;
            for (String c : scoreMap.values()) {
                topChunks.add(c);
                count++;
                if (count >= 3) break;
            }

            // send top chunks + question to Claude
            String prompt = "Use the following text to answer the question:\n" +
                            String.join("\n", topChunks) +
                            "\nQuestion: " + request.getQuestion() + "\nAnswer:";

            String answer = claudeService.getAnswer(articleText, request.getQuestion());
            return new QnaResponse(answer);

        } catch (Exception e) {
            return new QnaResponse("Error: " + e.getMessage());
        }
    }


    private String fetchArticle(String url) throws IOException {
        Document doc = Jsoup.connect(url).get();
        String text = doc.body().text(); // just the visible text
        return TextUtils.cleanText(text);
    }


}
