package com.aicontentanalyser.analysis.text.api;

public record ApiErrorResponse(
        int status,
        String message
) {
}