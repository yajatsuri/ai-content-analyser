package com.aicontentanalyser.analysis.text.domain;

public record DetectionResult(String prediction, double confidence, String explanation, String modelVersion) {

}
