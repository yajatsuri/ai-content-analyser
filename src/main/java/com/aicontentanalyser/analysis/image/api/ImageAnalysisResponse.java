package com.aicontentanalyser.analysis.image.api;

public record ImageAnalysisResponse(
        String prediction,
        double confidence,
        String explanation,
        String modelVersion
) {
}