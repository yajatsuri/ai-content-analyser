package com.aicontentanalyser.analysis.image.domain;

public interface ImageDetector {

    ImageDetectionResult detect(byte[] image);
}