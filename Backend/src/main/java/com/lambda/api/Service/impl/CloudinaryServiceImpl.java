package com.lambda.api.Service.impl;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.lambda.api.Exceptions.ImageException;
import com.lambda.api.Service.CloudinaryService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.net.URI;
import java.net.URLEncoder;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.util.Base64;
import java.util.HashMap;
import java.util.Map;

@Service
public class CloudinaryServiceImpl implements CloudinaryService {
    @Value("${CLOUD_API_KEY}")
    private String cloudinaryKey;
    @Value("${CLOUD_NAME}")
    private String cloudinaryName;
    @Value("${CLOUD_API_SECRET}")
    private String cloudinarySecret;

    @Override
    public Map<String, Object> upload(MultipartFile file) {
        try {
            // Validación de archivo
            validateFile(file);
            String CLOUDINARY_URL = "https://api.cloudinary.com/v1_1/" + cloudinaryName + "/image/upload";

            // Construcción de parámetros para la solicitud de carga
            String timestamp = String.valueOf(System.currentTimeMillis() / 1000);
            String signature = generateSignature(timestamp);

            Map<String, Object> uploadParams = new HashMap<>();
            uploadParams.put("file", "data:image/png;base64," + Base64.getEncoder().encodeToString(file.getBytes()));
            uploadParams.put("timestamp", timestamp);
            uploadParams.put("api_key", cloudinaryKey);
            uploadParams.put("signature", signature);

            // Crear solicitud HTTP para subir el archivo
            HttpClient client = HttpClient.newHttpClient();
            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(CLOUDINARY_URL))
                    .header("Content-Type", "application/x-www-form-urlencoded")
                    .POST(buildFormData(uploadParams))
                    .build();

            HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());

            if (response.statusCode() == 200) {
                // Respuesta exitosa, analizar los datos
                return parseUploadResponse(response.body());
            } else {
                throw new RuntimeException("Error uploading file to Cloudinary: " + response.body());
            }
        } catch (Exception e) {
            throw new RuntimeException("Image uploading failed!", e);
        }
    }

    @Override
    @Async("asyncTaskExecutor")
    public void delete(String public_id) {
        try {
            String CLOUDINARY_URL = "https://api.cloudinary.com/v1_1/" + cloudinaryName + "/image/destroy";

            // Generar timestamp y firma
            String timestamp = String.valueOf(System.currentTimeMillis() / 1000);
            String signature = generateSignatureForDeletion(public_id, timestamp);

            // Parámetros para la solicitud de eliminación
            Map<String, Object> deleteParams = new HashMap<>();
            deleteParams.put("public_id", public_id);
            deleteParams.put("timestamp", timestamp);
            deleteParams.put("api_key", cloudinaryKey);
            deleteParams.put("signature", signature);

            // Crear solicitud HTTP para eliminar el archivo
            HttpClient client = HttpClient.newHttpClient();
            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(CLOUDINARY_URL))
                    .header("Content-Type", "application/x-www-form-urlencoded")
                    .POST(buildFormData(deleteParams))
                    .build();

            HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());

            if (response.statusCode() != 200) {
                throw new RuntimeException("Error deleting file from Cloudinary: " + response.body());
            }
        } catch (Exception e) {
            throw new RuntimeException("Image deletion failed!", e);
        }
    }

    private String generateSignatureForDeletion(String publicId, String timestamp) throws Exception {
        String toSign = "public_id=" + publicId + "&timestamp=" + timestamp + cloudinarySecret;
        MessageDigest digest = MessageDigest.getInstance("SHA-1");
        byte[] hash = digest.digest(toSign.getBytes(StandardCharsets.UTF_8));
        return bytesToHex(hash);
    }

    private void validateFile(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("File cannot be null or empty");
        }

        if (file.getSize() > 3 * 1024 * 1024) {
            throw new ImageException("File too large. Max size is 10MB");
        }
    }

    private String generateSignature(String timestamp) throws Exception {
        String toSign = "timestamp=" + timestamp + cloudinarySecret; // Solo incluir parámetros ordenados.
        MessageDigest digest = MessageDigest.getInstance("SHA-1");
        byte[] hash = digest.digest(toSign.getBytes(StandardCharsets.UTF_8));
        return bytesToHex(hash);
    }

    private String bytesToHex(byte[] bytes) {
        StringBuilder result = new StringBuilder();
        for (byte b : bytes) {
            result.append(String.format("%02x", b));
        }
        return result.toString();
    }
    private HttpRequest.BodyPublisher buildFormData(Map<String, Object> params) {
        StringBuilder form = new StringBuilder();
        for (Map.Entry<String, Object> entry : params.entrySet()) {
            if (form.length() > 0) {
                form.append("&");
            }
            form.append(URLEncoder.encode(entry.getKey(), StandardCharsets.UTF_8));
            form.append("=");
            form.append(URLEncoder.encode(entry.getValue().toString(), StandardCharsets.UTF_8));
        }
        return HttpRequest.BodyPublishers.ofString(form.toString());
    }

    private Map<String, Object> parseUploadResponse(String responseBody) {
        // Analizar la respuesta JSON de la API de Cloudinary
        // Se devolvería un Map con los datos relevantes (ejemplo: URL, public_id)
        Map<String, Object> responseMap = new HashMap<>();
        try {
            ObjectMapper objectMapper = new ObjectMapper();
            JsonNode jsonNode = objectMapper.readTree(responseBody);

            responseMap.put("url", jsonNode.get("secure_url").textValue());
            responseMap.put("public_id", jsonNode.get("public_id").textValue());
        } catch (Exception e) {
            throw new RuntimeException("Error parsing Cloudinary response", e);
        }
        return responseMap;
    }
}
