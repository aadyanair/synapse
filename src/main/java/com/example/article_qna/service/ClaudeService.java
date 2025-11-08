package com.example.article_qna.service;

import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.*;

import java.util.HashMap;
import java.util.Map;

@Service
public class ClaudeService {

    private static final String CLAUDE_API_URL = "https://api.anthropic.com/v1/complete";
    private static final String API_KEY = "REPLACE_ME";

    public String getAnswer(String articleContent, String question) {
        RestTemplate restTemplate = new RestTemplate();

        Map<String, Object> body = new HashMap<>();
        body.put("model", "claude-v1");
        body.put("prompt", "Article: " + articleContent + "\nQuestion: " + question + "\nAnswer:");
        body.put("max_tokens_to_sample", 500);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("Authorization", "Bearer " + API_KEY);

        HttpEntity<Map<String, Object>> request = new HttpEntity<>(body, headers);
        ResponseEntity<Map> response = restTemplate.postForEntity(CLAUDE_API_URL, request, Map.class);

        return (String) response.getBody().get("completion");
    }
}
