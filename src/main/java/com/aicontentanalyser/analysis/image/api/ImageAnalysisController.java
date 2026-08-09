package com.aicontentanalyser.analysis.image.api;

import com.aicontentanalyser.analysis.image.application.ImageAnalysisService;
import com.aicontentanalyser.user.User;
import org.springframework.http.MediaType;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/v1/analyses/image")
public class ImageAnalysisController {

    private final ImageAnalysisService imageAnalysisService;

    public ImageAnalysisController(ImageAnalysisService imageAnalysisService) {
        this.imageAnalysisService = imageAnalysisService;
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ImageAnalysisResponse analyze(

            @RequestParam("image") MultipartFile image,
            @AuthenticationPrincipal User user
    ) throws IOException {
        System.out.println("===========");
System.out.println("Authenticated user: " + user);
System.out.println("===========");
        return imageAnalysisService.analyze(image, user);
    }

    @GetMapping
    public List<ImageHistoryResponse> getHistory(
            @AuthenticationPrincipal User user
    ) {
        return imageAnalysisService.getHistory(user);
    }
}
