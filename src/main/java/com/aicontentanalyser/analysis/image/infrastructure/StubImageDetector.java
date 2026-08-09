package com.aicontentanalyser.analysis.image.infrastructure;

import com.aicontentanalyser.analysis.image.domain.ImageDetectionResult;
import com.aicontentanalyser.analysis.image.domain.ImageDetector;

public class StubImageDetector implements ImageDetector {

    @Override
    public ImageDetectionResult detect(byte[] image) {

        return new ImageDetectionResult(
                "HUMAN",
                0.95,
                "Stub image detection result used during development.",
                "stub-image-model-v1"
        );
    }
}
