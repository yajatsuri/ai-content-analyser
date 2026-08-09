package com.aicontentanalyser.analysis.image.application;

import com.aicontentanalyser.analysis.image.api.ImageAnalysisResponse;
import com.aicontentanalyser.analysis.image.api.ImageHistoryResponse;
import com.aicontentanalyser.analysis.image.domain.ImageDetectionResult;
import com.aicontentanalyser.analysis.image.domain.ImageDetector;
import com.aicontentanalyser.analysis.image.persistence.ImageAnalysisEntity;
import com.aicontentanalyser.analysis.image.persistence.ImageAnalysisRepository;
import com.aicontentanalyser.user.User;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class ImageAnalysisService {

    private final ImageDetector imageDetector;
    private final ImageAnalysisRepository imageAnalysisRepository;
    private final FileStorageService fileStorageService;
    private final String bucketName;
    private final String s3Region;

    public ImageAnalysisService(
            ImageDetector imageDetector,
            ImageAnalysisRepository imageAnalysisRepository,
            FileStorageService fileStorageService,
            @Value("${aws.s3.bucket}") String bucketName,
            @Value("${aws.s3.region}") String s3Region
    ) {
        this.imageDetector = imageDetector;
        this.imageAnalysisRepository = imageAnalysisRepository;
        this.fileStorageService = fileStorageService;
        this.bucketName = bucketName;
        this.s3Region = s3Region;
    }

    public ImageAnalysisResponse analyze(
            MultipartFile image,
            User user
    ) throws IOException {

        String filename = image.getOriginalFilename();
        byte[] imageBytes = image.getBytes();

        ImageDetectionResult result = imageDetector.detect(imageBytes);

        String imagePath = fileStorageService.store(image, user.getId());

        ImageAnalysisEntity entity = new ImageAnalysisEntity(
                filename,
                imagePath,
                result.prediction(),
                result.confidence(),
                LocalDateTime.now()
        );

        entity.setUser(user);

        imageAnalysisRepository.save(entity);

        return new ImageAnalysisResponse(
                result.prediction(),
                result.confidence(),
                result.explanation(),
                result.modelVersion()
        );
    }

    public List<ImageHistoryResponse> getHistory(User user) {

        return imageAnalysisRepository.findByUser(user)
                .stream()
                .map(entity -> new ImageHistoryResponse(
                        entity.getId(),
                        entity.getFilename(),
                        buildS3Url(entity.getImagePath()),
                        entity.getPrediction(),
                        entity.getConfidence(),
                        entity.getCreatedAt()
                ))
                .toList();
    }

    private String buildS3Url(String objectKey) {
        return "https://" + bucketName + ".s3." + s3Region + ".amazonaws.com/" + objectKey;
    }
}
