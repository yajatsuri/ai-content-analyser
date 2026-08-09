package com.aicontentanalyser.analysis.text.persistence;

import org.springframework.data.jpa.repository.JpaRepository;

public interface TextAnalysisRepository
        extends JpaRepository<TextAnalysisEntity, Long> {
}