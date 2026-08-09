package com.aicontentanalyser.analysis.image.infrastructure;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties(ignoreUnknown = true)
public record MLServiceResponse(
        String prediction,
        double confidence,
        String modelVersion
) {
}