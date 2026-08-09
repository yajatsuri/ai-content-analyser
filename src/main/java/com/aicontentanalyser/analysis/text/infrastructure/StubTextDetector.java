package com.aicontentanalyser.analysis.text.infrastructure;

import com.aicontentanalyser.analysis.text.domain.DetectionResult;
import com.aicontentanalyser.analysis.text.domain.TextDetector;
import org.springframework.stereotype.Component;


public class StubTextDetector implements TextDetector {

    @Override
    public DetectionResult detect(String text) {
        return new DetectionResult(
                "HUMAN",
                0.50,
                "Temporary placeholder; no ML model is connected yet.",
                "phase1-stub-v1"
        );
    }
}