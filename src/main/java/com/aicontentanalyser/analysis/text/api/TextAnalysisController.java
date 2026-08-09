package com.aicontentanalyser.analysis.text.api;

import com.aicontentanalyser.analysis.text.application.TextAnalysisService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/analyses/text")
public class TextAnalysisController {

    private final TextAnalysisService textAnalysisService;

    public TextAnalysisController(TextAnalysisService textAnalysisService) {
        this.textAnalysisService = textAnalysisService;
    }

    // POST /api/v1/analyses/text
    // Analyze new text and save the result in PostgreSQL
    @PostMapping
    public ResponseEntity<TextAnalysisResponse> analyze(
            @Valid @RequestBody TextAnalysisRequest request
    ) {

        TextAnalysisResponse response =
                textAnalysisService.analyze(request.text());

        return ResponseEntity.ok(response);
    }

    // NEW
    // GET /api/v1/analyses/text
    // Fetch all previous analyses from PostgreSQL
    @GetMapping
    public ResponseEntity<List<TextAnalysisHistoryResponse>> getHistory() {

        List<TextAnalysisHistoryResponse> history =
                textAnalysisService.getHistory();

        return ResponseEntity.ok(history);
    }
}