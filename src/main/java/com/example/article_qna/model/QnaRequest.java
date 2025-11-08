package com.example.article_qna.model;

public class QnaRequest {
    private String articleUrl;
    private String question;

    // getters & setters
    public String getArticleUrl() { return articleUrl; }
    public void setArticleUrl(String articleUrl) { this.articleUrl = articleUrl; }
    public String getQuestion() { return question; }
    public void setQuestion(String question) { this.question = question; }
}
