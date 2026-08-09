package com.aicontentanalyser.analysis.image.api;

import java.time.LocalDateTime;

public record ImageHistoryResponse(
        Long id,
        String filename,
        String imageUrl,
        String prediction,
        Double confidence,
        LocalDateTime createdAt
) {
}