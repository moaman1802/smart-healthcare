package com.healthcare.backend.service;

import com.healthcare.backend.entity.Doctor;
import com.healthcare.backend.repository.DoctorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class AIAnalysisService {

    @Autowired
    private DoctorRepository doctorRepository;

    // ===== SYMPTOM TO CONDITION MAPPING =====
    private static final Map<String, List<String>> SYMPTOM_CONDITION_MAP = new HashMap<>();
    private static final Map<String, String> CONDITION_SPECIALIZATION_MAP = new HashMap<>();
    private static final Map<String, String> CONDITION_DESCRIPTION_MAP = new HashMap<>();

    static {
        // Symptoms to Conditions
        SYMPTOM_CONDITION_MAP.put("fever", Arrays.asList("Flu", "Viral Infection", "Malaria"));
        SYMPTOM_CONDITION_MAP.put("cough", Arrays.asList("Common Cold", "Bronchitis", "Asthma"));
        SYMPTOM_CONDITION_MAP.put("headache", Arrays.asList("Migraine", "Tension Headache", "Sinusitis"));
        SYMPTOM_CONDITION_MAP.put("body pain", Arrays.asList("Dengue", "Typhoid", "Viral Infection"));
        SYMPTOM_CONDITION_MAP.put("fatigue", Arrays.asList("Anemia", "Thyroid", "Depression"));
        SYMPTOM_CONDITION_MAP.put("dizziness", Arrays.asList("Low BP", "Anemia", "Vertigo"));
        SYMPTOM_CONDITION_MAP.put("nausea", Arrays.asList("Food Poisoning", "Migraine", "Pregnancy"));
        SYMPTOM_CONDITION_MAP.put("vomiting", Arrays.asList("Food Poisoning", "Gastritis", "Migraine"));
        SYMPTOM_CONDITION_MAP.put("stomach ache", Arrays.asList("Gastritis", "Food Poisoning", "Appendicitis"));
        SYMPTOM_CONDITION_MAP.put("chest pain", Arrays.asList("Heart Problem", "Acidity", "Costochondritis"));
        SYMPTOM_CONDITION_MAP.put("rash", Arrays.asList("Allergy", "Chickenpox", "Measles"));
        SYMPTOM_CONDITION_MAP.put("itching", Arrays.asList("Allergy", "Eczema", "Fungal Infection"));
        SYMPTOM_CONDITION_MAP.put("breathing difficulty", Arrays.asList("Asthma", "Pneumonia", "COPD"));
        SYMPTOM_CONDITION_MAP.put("joint pain", Arrays.asList("Arthritis", "Dengue", "Rheumatoid"));
        SYMPTOM_CONDITION_MAP.put("palpitations", Arrays.asList("Heart Problem", "Anxiety", "Hyperthyroidism"));

        // Conditions to Specialization
        CONDITION_SPECIALIZATION_MAP.put("Flu", "General Physician");
        CONDITION_SPECIALIZATION_MAP.put("Common Cold", "General Physician");
        CONDITION_SPECIALIZATION_MAP.put("Viral Infection", "General Physician");
        CONDITION_SPECIALIZATION_MAP.put("Bronchitis", "Pulmonologist");
        CONDITION_SPECIALIZATION_MAP.put("Asthma", "Pulmonologist");
        CONDITION_SPECIALIZATION_MAP.put("Pneumonia", "Pulmonologist");
        CONDITION_SPECIALIZATION_MAP.put("COPD", "Pulmonologist");
        CONDITION_SPECIALIZATION_MAP.put("Migraine", "Neurologist");
        CONDITION_SPECIALIZATION_MAP.put("Tension Headache", "Neurologist");
        CONDITION_SPECIALIZATION_MAP.put("Sinusitis", "ENT Specialist");
        CONDITION_SPECIALIZATION_MAP.put("Allergy", "Allergist");
        CONDITION_SPECIALIZATION_MAP.put("Arthritis", "Rheumatologist");
        CONDITION_SPECIALIZATION_MAP.put("Dengue", "General Physician");
        CONDITION_SPECIALIZATION_MAP.put("Malaria", "General Physician");
        CONDITION_SPECIALIZATION_MAP.put("Typhoid", "General Physician");
        CONDITION_SPECIALIZATION_MAP.put("Gastritis", "Gastroenterologist");
        CONDITION_SPECIALIZATION_MAP.put("Food Poisoning", "Gastroenterologist");
        CONDITION_SPECIALIZATION_MAP.put("Appendicitis", "Surgeon");
        CONDITION_SPECIALIZATION_MAP.put("Heart Problem", "Cardiologist");
        CONDITION_SPECIALIZATION_MAP.put("Anemia", "General Physician");
        CONDITION_SPECIALIZATION_MAP.put("Thyroid", "Endocrinologist");
        CONDITION_SPECIALIZATION_MAP.put("Covid-19", "General Physician");
        CONDITION_SPECIALIZATION_MAP.put("IBS", "Gastroenterologist");
        CONDITION_SPECIALIZATION_MAP.put("Eczema", "Dermatologist");
        CONDITION_SPECIALIZATION_MAP.put("Fungal Infection", "Dermatologist");
        CONDITION_SPECIALIZATION_MAP.put("Chickenpox", "General Physician");
        CONDITION_SPECIALIZATION_MAP.put("Measles", "General Physician");
        CONDITION_SPECIALIZATION_MAP.put("Acidity", "Gastroenterologist");
        CONDITION_SPECIALIZATION_MAP.put("Depression", "Psychiatrist");
        CONDITION_SPECIALIZATION_MAP.put("Anxiety", "Psychiatrist");
        CONDITION_SPECIALIZATION_MAP.put("Vertigo", "ENT Specialist");
        CONDITION_SPECIALIZATION_MAP.put("Pregnancy", "Gynecologist");
        CONDITION_SPECIALIZATION_MAP.put("Rheumatoid", "Rheumatologist");
        CONDITION_SPECIALIZATION_MAP.put("Cluster Headache", "Neurologist");
        CONDITION_SPECIALIZATION_MAP.put("Low BP", "General Physician");
        CONDITION_SPECIALIZATION_MAP.put("Hyperthyroidism", "Endocrinologist");
        CONDITION_SPECIALIZATION_MAP.put("Costochondritis", "General Physician");

        // Condition Descriptions
        CONDITION_DESCRIPTION_MAP.put("Flu", "Influenza is a viral infection that attacks your respiratory system.");
        CONDITION_DESCRIPTION_MAP.put("Common Cold", "A viral infection of your nose and throat (upper respiratory tract).");
        CONDITION_DESCRIPTION_MAP.put("Viral Infection", "Infection caused by a virus that affects various body parts.");
        CONDITION_DESCRIPTION_MAP.put("Bronchitis", "Inflammation of the bronchial tubes that carry air to your lungs.");
        CONDITION_DESCRIPTION_MAP.put("Asthma", "A condition in which your airways narrow and swell and produce extra mucus.");
        CONDITION_DESCRIPTION_MAP.put("Pneumonia", "Infection that inflames the air sacs in one or both lungs.");
        CONDITION_DESCRIPTION_MAP.put("COPD", "Chronic obstructive pulmonary disease, a lung disease that causes airflow blockage.");
        CONDITION_DESCRIPTION_MAP.put("Migraine", "A neurological condition that causes intense headaches and other symptoms.");
        CONDITION_DESCRIPTION_MAP.put("Tension Headache", "The most common type of headache causing mild to moderate pain.");
        CONDITION_DESCRIPTION_MAP.put("Sinusitis", "Inflammation or swelling of the tissue lining the sinuses.");
        CONDITION_DESCRIPTION_MAP.put("Allergy", "A reaction by your immune system to a foreign substance.");
        CONDITION_DESCRIPTION_MAP.put("Arthritis", "Inflammation of one or more of your joints.");
        CONDITION_DESCRIPTION_MAP.put("Dengue", "A mosquito-borne viral disease causing high fever and body pain.");
        CONDITION_DESCRIPTION_MAP.put("Malaria", "A life-threatening disease caused by parasites transmitted through mosquito bites.");
        CONDITION_DESCRIPTION_MAP.put("Typhoid", "A bacterial infection that can spread throughout the body.");
        CONDITION_DESCRIPTION_MAP.put("Gastritis", "Inflammation, irritation, or erosion of the lining of the stomach.");
        CONDITION_DESCRIPTION_MAP.put("Food Poisoning", "Illness caused by eating contaminated food.");
        CONDITION_DESCRIPTION_MAP.put("Appendicitis", "Inflammation of the appendix that requires immediate medical attention.");
        CONDITION_DESCRIPTION_MAP.put("Heart Problem", "Condition affecting the heart's function and structure.");
        CONDITION_DESCRIPTION_MAP.put("Anemia", "Condition where you lack enough healthy red blood cells to carry oxygen.");
        CONDITION_DESCRIPTION_MAP.put("Thyroid", "A condition where your thyroid gland produces too much or too little hormones.");
        CONDITION_DESCRIPTION_MAP.put("Covid-19", "Infectious disease caused by the SARS-CoV-2 virus.");
        CONDITION_DESCRIPTION_MAP.put("IBS", "Irritable bowel syndrome, affecting the large intestine.");
        CONDITION_DESCRIPTION_MAP.put("Eczema", "A condition that makes your skin red and itchy.");
        CONDITION_DESCRIPTION_MAP.put("Fungal Infection", "Skin infection caused by fungus.");
        CONDITION_DESCRIPTION_MAP.put("Chickenpox", "A viral infection causing an itchy rash with small, fluid-filled blisters.");
        CONDITION_DESCRIPTION_MAP.put("Measles", "A viral infection that's serious for small children but preventable by vaccine.");
        CONDITION_DESCRIPTION_MAP.put("Acidity", "Excess acid in the stomach causing discomfort.");
        CONDITION_DESCRIPTION_MAP.put("Depression", "A mood disorder that causes persistent sadness and loss of interest.");
        CONDITION_DESCRIPTION_MAP.put("Anxiety", "A feeling of worry, nervousness, or unease about something.");
        CONDITION_DESCRIPTION_MAP.put("Vertigo", "A sensation of feeling off-balance.");
        CONDITION_DESCRIPTION_MAP.put("Pregnancy", "State of carrying a developing embryo or fetus.");
        CONDITION_DESCRIPTION_MAP.put("Rheumatoid", "An autoimmune disease that causes joint inflammation and pain.");
        CONDITION_DESCRIPTION_MAP.put("Cluster Headache", "A rare type of headache that occurs in clusters or patterns.");
        CONDITION_DESCRIPTION_MAP.put("Low BP", "Low blood pressure condition causing dizziness and fatigue.");
        CONDITION_DESCRIPTION_MAP.put("Hyperthyroidism", "Overactive thyroid gland producing excess thyroid hormones.");
        CONDITION_DESCRIPTION_MAP.put("Costochondritis", "Inflammation of the cartilage that connects a rib to the breastbone.");
    }

    // ===== GET ALL DISEASES =====
    public List<String> getAllDiseases() {
        return new ArrayList<>(CONDITION_SPECIALIZATION_MAP.keySet());
    }

    // ===== GET ALL SYMPTOMS =====
    public List<String> getAllSymptoms() {
        return new ArrayList<>(SYMPTOM_CONDITION_MAP.keySet());
    }

    // ===== ANALYZE SYMPTOMS =====
    public Map<String, Object> analyzeSymptoms(String symptomsText) {
        Map<String, Object> result = new HashMap<>();
        
        if (symptomsText == null || symptomsText.trim().isEmpty()) {
            result.put("error", "Please enter your symptoms");
            return result;
        }

        String[] symptomArray = symptomsText.toLowerCase().split("[,\\n]+");
        List<String> symptomList = new ArrayList<>();
        for (String s : symptomArray) {
            s = s.trim();
            if (!s.isEmpty()) {
                symptomList.add(s);
            }
        }

        Map<String, Integer> conditionScore = new HashMap<>();
        
        for (String symptom : symptomList) {
            for (Map.Entry<String, List<String>> entry : SYMPTOM_CONDITION_MAP.entrySet()) {
                String key = entry.getKey();
                if (symptom.contains(key) || key.contains(symptom)) {
                    for (String condition : entry.getValue()) {
                        conditionScore.put(condition, conditionScore.getOrDefault(condition, 0) + 2);
                    }
                }
            }
        }

        if (conditionScore.isEmpty()) {
            result.put("error", "Could not match your symptoms. Please consult a doctor.");
            return result;
        }

        List<Map.Entry<String, Integer>> sorted = new ArrayList<>(conditionScore.entrySet());
        sorted.sort((a, b) -> b.getValue().compareTo(a.getValue()));

        List<Map<String, String>> topConditions = new ArrayList<>();
        for (int i = 0; i < Math.min(3, sorted.size()); i++) {
            String condition = sorted.get(i).getKey();
            Map<String, String> info = new HashMap<>();
            info.put("name", condition);
            info.put("specialization", CONDITION_SPECIALIZATION_MAP.getOrDefault(condition, "General Physician"));
            info.put("description", CONDITION_DESCRIPTION_MAP.getOrDefault(condition, "Consult a doctor for proper diagnosis."));
            info.put("score", String.valueOf(sorted.get(i).getValue()));
            topConditions.add(info);
        }

        String recommendedSpecialization = CONDITION_SPECIALIZATION_MAP.getOrDefault(
            topConditions.get(0).get("name"), "General Physician"
        );

        List<Doctor> recommendedDoctors = doctorRepository.findBySpecializationContainingIgnoreCase(recommendedSpecialization);

        result.put("symptoms", symptomList);
        result.put("possibleConditions", topConditions);
        result.put("recommendedSpecialization", recommendedSpecialization);
        result.put("recommendedDoctors", recommendedDoctors);
        result.put("isDiseaseSelected", false);
        result.put("disclaimer", "This is an AI-based preliminary analysis. Please consult a qualified doctor for accurate diagnosis.");

        return result;
    }
}