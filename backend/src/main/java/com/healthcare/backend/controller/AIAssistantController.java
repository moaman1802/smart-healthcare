package com.healthcare.backend.controller;

import com.healthcare.backend.service.AIAssistantService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/ai-assistant")
@CrossOrigin(origins = "http://localhost:5173")
public class AIAssistantController {

    @Autowired
    private AIAssistantService aiAssistantService;

    @PostMapping("/ask")
    public ResponseEntity<?> askQuestion(@RequestBody Map<String, String> request) {
        String query = request.get("query");
        Map<String, Object> response = aiAssistantService.processQuery(query);
        
        if (response.containsKey("error")) {
            return ResponseEntity.badRequest().body(response);
        }
        
        return ResponseEntity.ok(response);
    }

    @GetMapping("/suggestions")
    public ResponseEntity<String[]> getSuggestions() {
        return ResponseEntity.ok(aiAssistantService.getSuggestedQuestions());
    }
}