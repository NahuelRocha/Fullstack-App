package com.lambda.api.Config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;

@Configuration
public class CloudinaryConfig {

    @Value("${CLOUD_API_KEY}")
    private String cloudinaryKey;
    @Value("${CLOUD_NAME}")
    private String cloudinaryName;
    @Value("${CLOUD_API_SECRET}")
    private String cloudinarySecret;

    @Value("${CLOUDINARY_URL}")
    private String cloudinaryUrl;

}
