package com.aicontentanalyser.analysis.text.infrastructure;

import com.aicontentanalyser.analysis.text.domain.DetectionResult;
import com.aicontentanalyser.analysis.text.domain.TextDetector;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;

@Component
public class HuggingFaceTextDetector implements TextDetector {

    // Use the official Hugging Face Inference API
    private static final String MODEL_URL =
            "https://api-inference.huggingface.co/models/Hello-SimpleAI/chatgpt-detector-roberta";

    private final RestClient restClient;
    private final String token;

    public HuggingFaceTextDetector(
            @Value("${huggingface.token}") String token
    ) {
        this.restClient = RestClient.create();
        this.token = token;

        // Debug (safe)
        if (token == null || token.isBlank()) {
            System.out.println("❌ Hugging Face token is EMPTY");
        } else {
            System.out.println("✅ Hugging Face token loaded.");
            System.out.println("Token starts with: "
                    + token.substring(0, Math.min(10, token.length())));
        }
    }

    @Override
    public DetectionResult detect(String text) {

        HuggingFaceRequest request = new HuggingFaceRequest(text);

        HuggingFacePrediction[][] response =
                restClient.post()
                        .uri(MODEL_URL)
                        .header("Authorization", "Bearer " + token)
                        .header("Content-Type", "application/json")
                        .body(request)
                        .retrieve()
                        .body(HuggingFacePrediction[][].class);

        if (response == null ||
                response.length == 0 ||
                response[0].length == 0) {

            throw new IllegalStateException(
                    "Hugging Face returned an empty response."
            );
        }

        HuggingFacePrediction bestPrediction = response[0][0];

        String prediction =
                bestPrediction.label().equalsIgnoreCase("ChatGPT")
                        ? "AI"
                        : "HUMAN";

        return new DetectionResult(
                prediction,
                bestPrediction.score(),
                "Prediction generated using Hugging Face.",
                "Hello-SimpleAI/chatgpt-detector-roberta"
        );
    }

    private record HuggingFaceRequest(String inputs) {
    }

    private record HuggingFacePrediction(
            String label,
            double score
    ) {
    }
}