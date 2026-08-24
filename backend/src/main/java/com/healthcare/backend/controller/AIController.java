package com.healthcare.backend.controller;

import com.healthcare.backend.service.AIAnalysisService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/ai")
@CrossOrigin(origins = "http://localhost:5173")
public class AIController {

    @Autowired
    private AIAnalysisService aiAnalysisService;

    @PostMapping("/analyze")
    public ResponseEntity<?> analyze(@RequestBody Map<String, String> request) {
        String symptoms = request.get("symptoms");
        String disease = request.get("disease");
        
        Map<String, Object> result;
        
        if (disease != null && !disease.trim().isEmpty()) {
            result = aiAnalysisService.analyzeSymptoms(disease);
        } else if (symptoms != null && !symptoms.trim().isEmpty()) {
            result = aiAnalysisService.analyzeSymptoms(symptoms);
        } else {
            return ResponseEntity.badRequest().body(Map.of("error", "Please enter symptoms or select a disease"));
        }
        
        if (result.containsKey("error")) {
            return ResponseEntity.badRequest().body(result);
        }
        
        return ResponseEntity.ok(result);
    }

    @GetMapping("/symptoms")
    public ResponseEntity<?> getAllSymptoms() {
        return ResponseEntity.ok(aiAnalysisService.getAllSymptoms());
    }

    @GetMapping("/diseases")
    public ResponseEntity<?> getAllDiseases() {
        return ResponseEntity.ok(aiAnalysisService.getAllDiseases());
    }
}