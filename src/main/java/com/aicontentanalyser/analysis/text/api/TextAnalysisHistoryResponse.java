package com.aicontentanalyser.analysis.text.api;

import java.time.Instant;

public record TextAnalysisHistoryResponse(
        Long id,
        String text,
        String prediction,
        double confidence,
        String modelVersion,
        Instant createdAt
) {
}