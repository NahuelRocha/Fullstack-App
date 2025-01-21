package com.lambda.api.Utils;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
public class FrontendURL {

    @Value("${FRONTEND_URL}")
    private String frontendURL;

    public String getFrontendURL() {
        return frontendURL;
    }
}
