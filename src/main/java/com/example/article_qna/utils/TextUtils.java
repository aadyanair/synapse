package com.example.article_qna.utils;

import java.util.ArrayList;
import java.util.List;

public class TextUtils {

    public static String cleanText(String text) {
        return text.replaceAll("\\s+", " ").replaceAll("[^\\x00-\\x7F]", "").trim();
    }

    public static List<String> chunkText(String text, int chunkSize) {
        String[] words = text.split(" ");
        List<String> chunks = new ArrayList<>();
        for (int i = 0; i < words.length; i += chunkSize) {
            int end = Math.min(words.length, i + chunkSize);
            String chunk = String.join(" ", java.util.Arrays.copyOfRange(words, i, end));
            chunks.add(chunk);
        }
        return chunks;
    }
}
