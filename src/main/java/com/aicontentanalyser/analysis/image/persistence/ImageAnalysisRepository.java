package com.aicontentanalyser.analysis.image.persistence;

import com.aicontentanalyser.user.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ImageAnalysisRepository
        extends JpaRepository<ImageAnalysisEntity, Long> {

    List<ImageAnalysisEntity> findByUser(User user);
}
