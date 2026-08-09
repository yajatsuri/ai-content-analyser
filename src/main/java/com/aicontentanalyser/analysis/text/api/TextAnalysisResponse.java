package com.aicontentanalyser.analysis.text.api;

public record TextAnalysisResponse(String prediction,double confidence, String explanation, String modelVersion) {

}
