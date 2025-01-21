package com.lambda.api.Utils;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
public class FunctionURL {

    @Value("${FUNCTION_URL}")
    private String functionURL;

    public String getFunctionURL() {
        return functionURL;
    }
}
