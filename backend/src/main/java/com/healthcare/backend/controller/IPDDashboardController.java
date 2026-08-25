package com.healthcare.backend.controller;

import com.healthcare.backend.repository.AdmissionRepository;
import com.healthcare.backend.repository.BedRepository;
import com.healthcare.backend.repository.WardRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/ipd/dashboard")
@CrossOrigin(origins = "http://localhost:5173")
public class IPDDashboardController {

    @Autowired
    private AdmissionRepository admissionRepository;

    @Autowired
    private BedRepository bedRepository;

    @Autowired
    private WardRepository wardRepository;

    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getStats() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalAdmissions", admissionRepository.count());
        stats.put("activeAdmissions", admissionRepository.findByStatus("ADMITTED").size());
        stats.put("totalBeds", bedRepository.count());
        stats.put("availableBeds", bedRepository.findByStatus("AVAILABLE").size());
        stats.put("occupiedBeds", bedRepository.findByStatus("OCCUPIED").size());
        stats.put("totalWards", wardRepository.count());
        stats.put("availableWards", wardRepository.findByAvailableBedsGreaterThan(0).size());
        return ResponseEntity.ok(stats);
    }
}