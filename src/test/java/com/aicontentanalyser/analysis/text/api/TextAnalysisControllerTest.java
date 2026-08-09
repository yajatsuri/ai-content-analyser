package com.aicontentanalyser.analysis.text.api;

import com.aicontentanalyser.analysis.text.domain.DetectionResult;
import com.aicontentanalyser.analysis.text.domain.TextDetector;
import com.aicontentanalyser.analysis.text.persistence.TextAnalysisRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.test.context.bean.override.mockito.MockitoBean;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
class TextAnalysisControllerTest {

    @Autowired
    private TestRestTemplate restTemplate;

    @MockitoBean
    private TextDetector textDetector;

    @MockitoBean
    private TextAnalysisRepository textAnalysisRepository;

    @BeforeEach
    void setUp() {

        when(textDetector.detect(anyString()))
                .thenReturn(new DetectionResult(
                        "HUMAN",
                        0.95,
                        "Test prediction",
                        "test-model-v1"
                ));
    }

    @Test
    void shouldAnalyzeValidText() {

        TextAnalysisRequest request = new TextAnalysisRequest(
                "This is a sufficiently long sample text that should pass our validation rules."
        );

        ResponseEntity<TextAnalysisResponse> response =
                restTemplate.postForEntity(
                        "/api/v1/analyses/text",
                        request,
                        TextAnalysisResponse.class
                );

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());

        assertEquals("HUMAN", response.getBody().prediction());
        assertEquals(0.95, response.getBody().confidence());
        assertEquals("Test prediction", response.getBody().explanation());
        assertEquals("test-model-v1", response.getBody().modelVersion());
    }

    @Test
    void shouldRejectTextThatIsTooShort() {

        TextAnalysisRequest request = new TextAnalysisRequest("Too short");

        ResponseEntity<String> response =
                restTemplate.postForEntity(
                        "/api/v1/analyses/text",
                        request,
                        String.class
                );

        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
    }

    @Test
    void shouldRejectBlankText() {

        TextAnalysisRequest request = new TextAnalysisRequest("   ");

        ResponseEntity<String> response =
                restTemplate.postForEntity(
                        "/api/v1/analyses/text",
                        request,
                        String.class
                );

        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
    }

    @Test
    void shouldRejectTextThatIsTooLong() {

        String longText = "a".repeat(10_001);

        TextAnalysisRequest request = new TextAnalysisRequest(longText);

        ResponseEntity<String> response =
                restTemplate.postForEntity(
                        "/api/v1/analyses/text",
                        request,
                        String.class
                );

        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
    }
}