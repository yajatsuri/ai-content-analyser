package com.aicontentanalyser.analysis.text.api;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record TextAnalysisRequest(
        @NotBlank(message = "text must not be blank")
        @Size(
                min = 50,
                max = 10_000,
                message = "text must be between 50 and 10000 characters"
        )
        String text
) {
}