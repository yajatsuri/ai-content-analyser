package com.aicontentanalyser.analysis.text.application;

import com.aicontentanalyser.analysis.text.api.TextAnalysisHistoryResponse;
import com.aicontentanalyser.analysis.text.api.TextAnalysisResponse;
import com.aicontentanalyser.analysis.text.domain.DetectionResult;
import com.aicontentanalyser.analysis.text.domain.TextDetector;
import com.aicontentanalyser.analysis.text.persistence.TextAnalysisEntity;
import com.aicontentanalyser.analysis.text.persistence.TextAnalysisRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TextAnalysisService {

    private final TextDetector textDetector;
    private final TextAnalysisRepository textAnalysisRepository;

    public TextAnalysisService(
            TextDetector textDetector,
            TextAnalysisRepository textAnalysisRepository
    ) {
        this.textDetector = textDetector;
        this.textAnalysisRepository = textAnalysisRepository;
    }

    public TextAnalysisResponse analyze(String text) {

        // 1. Send text to the AI detector
        DetectionResult result = textDetector.detect(text);

        // 2. Convert the result into a database entity
        TextAnalysisEntity entity = new TextAnalysisEntity(
                text,
                result.prediction(),
                result.confidence(),
                result.modelVersion()
        );

        // 3. Save analysis to PostgreSQL
        textAnalysisRepository.save(entity);

        // 4. Return result to the client
        return new TextAnalysisResponse(
                result.prediction(),
                result.confidence(),
                result.explanation(),
                result.modelVersion()
        );
    }

    // NEW: Fetch previous analyses from PostgreSQL
    public List<TextAnalysisHistoryResponse> getHistory() {

        return textAnalysisRepository.findAll()
                .stream()
                .map(entity -> new TextAnalysisHistoryResponse(
                        entity.getId(),
                        entity.getText(),
                        entity.getPrediction(),
                        entity.getConfidence(),
                        entity.getModelVersion(),
                        entity.getCreatedAt()
                ))
                .toList();
    }
}