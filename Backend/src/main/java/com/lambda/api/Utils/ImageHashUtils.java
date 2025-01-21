package com.lambda.api.Utils;

import org.springframework.web.multipart.MultipartFile;

import java.security.MessageDigest;
import java.util.Base64;

public class ImageHashUtils {
    public static String calculateHash(MultipartFile file) throws Exception {
        MessageDigest digest = MessageDigest.getInstance("SHA-256");
        byte[] hashBytes = digest.digest(file.getBytes());
        return Base64.getEncoder().encodeToString(hashBytes);
    }
}
