package com.aicontentanalyser.analysis.text.persistence;

import jakarta.persistence.*;

import java.time.Instant;

@Entity
@Table(name = "text_analyses")
public class TextAnalysisEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 10000)
    private String text;

    @Column(nullable = false)
    private String prediction;

    @Column(nullable = false)
    private double confidence;

    @Column(name = "model_version", nullable = false)
    private String modelVersion;

    @Column(name = "created_at", nullable = false)
    private Instant createdAt;

    // Required by JPA/Hibernate
    protected TextAnalysisEntity() {
    }

    public TextAnalysisEntity(
            String text,
            String prediction,
            double confidence,
            String modelVersion
    ) {
        this.text = text;
        this.prediction = prediction;
        this.confidence = confidence;
        this.modelVersion = modelVersion;
        this.createdAt = Instant.now();
    }

    public Long getId() {
        return id;
    }

    public String getText() {
        return text;
    }

    public String getPrediction() {
        return prediction;
    }

    public double getConfidence() {
        return confidence;
    }

    public String getModelVersion() {
        return modelVersion;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }
}