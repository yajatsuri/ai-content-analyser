package com.aicontentanalyser.analysis.image.domain;

public record ImageDetectionResult(
        String prediction,
        double confidence,
        String explanation,
        String modelVersion
) {
}