package com.aicontentanalyser.analysis.image.persistence;

import com.aicontentanalyser.user.User;
import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "image_analysis")
public class ImageAnalysisEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String filename;

    private String imagePath;

    private String prediction;

    private Double confidence;

    private LocalDateTime createdAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    public ImageAnalysisEntity() {
    }

    public ImageAnalysisEntity(
            String filename,
            String imagePath,
            String prediction,
            Double confidence,
            LocalDateTime createdAt
    ) {
        this.filename = filename;
        this.imagePath = imagePath;
        this.prediction = prediction;
        this.confidence = confidence;
        this.createdAt = createdAt;
    }

    public Long getId() {
        return id;
    }

    public String getFilename() {
        return filename;
    }

    public String getImagePath() {
        return imagePath;
    }

    public String getPrediction() {
        return prediction;
    }

    public Double getConfidence() {
        return confidence;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public User getUser() {
        return user;
    }

    public void setFilename(String filename) {
        this.filename = filename;
    }

    public void setImagePath(String imagePath) {
        this.imagePath = imagePath;
    }

    public void setPrediction(String prediction) {
        this.prediction = prediction;
    }

    public void setConfidence(Double confidence) {
        this.confidence = confidence;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public void setUser(User user) {
        this.user = user;
    }
}