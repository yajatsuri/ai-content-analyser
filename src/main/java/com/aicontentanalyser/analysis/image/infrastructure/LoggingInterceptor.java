package com.aicontentanalyser.analysis.image.infrastructure;

import org.springframework.http.HttpRequest;
import org.springframework.http.client.ClientHttpRequestExecution;
import org.springframework.http.client.ClientHttpRequestInterceptor;
import org.springframework.http.client.ClientHttpResponse;

import java.io.IOException;

public class LoggingInterceptor implements ClientHttpRequestInterceptor {

    @Override
    public ClientHttpResponse intercept(
            HttpRequest request,
            byte[] body,
            ClientHttpRequestExecution execution
    ) throws IOException {

        System.out.println("\n========== OUTGOING REQUEST ==========");
        System.out.println("URI: " + request.getURI());
        System.out.println("Method: " + request.getMethod());
        System.out.println("Headers: " + request.getHeaders());
        System.out.println("RAW Content-Type: " + request.getHeaders().getContentType());
        System.out.println("Body length: " + body.length);
        System.out.println("======================================\n");

        return execution.execute(request, body);
    }
}