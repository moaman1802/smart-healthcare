import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/api";
import "./AISymptomChecker.css";

function AISymptomChecker() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const [symptoms, setSymptoms] = useState("");
  const [selectedDiseases, setSelectedDiseases] = useState([]);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [symptomSuggestions, setSymptomSuggestions] = useState([]);
  const [diseaseList, setDiseaseList] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoadingData(true);
    try {
      console.log("🔄 Fetching data from backend...");
      
      // Fetch diseases and symptoms
      const [diseasesRes, symptomsRes] = await Promise.all([
        API.get("/ai/diseases"),
        API.get("/ai/symptoms")
      ]);
      
      console.log("✅ Diseases response:", diseasesRes.data);
      console.log("✅ Symptoms response:", symptomsRes.data);
      
      // Set data
      setDiseaseList(diseasesRes.data || []);
      setSymptomSuggestions(symptomsRes.data || []);
      
      if (diseasesRes.data.length === 0) {
        setError("No diseases found in database. Please check backend.");
      }
      
    } catch (error) {
      console.error("❌ Error fetching data:", error);
      console.error("❌ Error response:", error.response);
      setError("Failed to load data. Please check backend connection.");
    } finally {
      setIsLoadingData(false);
    }
  };

  const toggleDisease = (disease) => {
    if (selectedDiseases.includes(disease)) {
      const newSelected = selectedDiseases.filter(d => d !== disease);
      setSelectedDiseases(newSelected);
      // Update symptoms if needed
    } else {
      const newSelected = [...selectedDiseases, disease];
      setSelectedDiseases(newSelected);
      // You can auto-fill symptoms here if needed
    }
  };

  const handleAnalyze = async (e) => {
    e.preventDefault();
    
    if (!symptoms.trim() && selectedDiseases.length === 0) {
      setError("Please enter symptoms or select a disease");
      return;
    }

    // Use symptoms or combine from selected diseases
    let symptomsToSend = symptoms.trim();
    
    if (!symptomsToSend && selectedDiseases.length > 0) {
      // Send selected disease as symptoms (or combine)
      symptomsToSend = selectedDiseases.join(", ");
    }

    if (!symptomsToSend) {
      setError("Please enter symptoms");
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const response = await API.post("/ai/analyze", {
        symptoms: symptomsToSend
      });
      console.log("✅ Analysis response:", response.data);
      setResult(response.data);
    } catch (error) {
      console.error("❌ Analysis error:", error);
      setError(error.response?.data?.error || "Analysis failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSymptoms(value);
    if (value.length > 0) {
      setSelectedDiseases([]);
    }
    if (value.length > 1) {
      const filtered = symptomSuggestions.filter(s => 
        s.toLowerCase().includes(value.toLowerCase())
      );
      setShowSuggestions(filtered.length > 0);
    } else {
      setShowSuggestions(false);
    }
  };

  const selectSuggestion = (suggestion) => {
    const current = symptoms ? symptoms + ", " : "";
    setSymptoms(current + suggestion);
    setShowSuggestions(false);
  };

  const resetSelection = () => {
    setSelectedDiseases([]);
    setSymptoms("");
    setResult(null);
    setError("");
  };

  return (
    <div className="ai-symptom-checker">
      <div className="ai-header">
        <h2>🤖 AI Symptom Checker</h2>
        <p>Select diseases OR describe your symptoms for AI-powered preliminary analysis</p>
      </div>

      <div className="ai-form-container">
        <div className="form-group">
          <label>🩺 Select Diseases (Click to select multiple)</label>
          <div className="disease-grid-scroll">
            {isLoadingData ? (
              <div className="loading-state">Loading diseases...</div>
            ) : diseaseList.length === 0 ? (
              <div className="empty-state">No diseases found. Please check backend.</div>
            ) : (
              <div className="disease-grid">
                {diseaseList.map((disease, i) => (
                  <button
                    key={i}
                    className={`disease-btn ${selectedDiseases.includes(disease) ? "selected" : ""}`}
                    onClick={() => toggleDisease(disease)}
                    type="button"
                  >
                    {selectedDiseases.includes(disease) ? "✅" : ""} {disease}
                  </button>
                ))}
              </div>
            )}
          </div>
          {selectedDiseases.length > 0 && (
            <div className="selected-diseases">
              <span>✅ Selected: <strong>{selectedDiseases.join(", ")}</strong></span>
              <button className="btn-change" onClick={resetSelection} type="button">
                🔄 Clear All
              </button>
            </div>
          )}
        </div>

        <div className="divider">OR</div>

        <form onSubmit={handleAnalyze}>
          <div className="form-group">
            <label>Enter your symptoms (separate with commas)</label>
            <div className="input-wrapper">
              <textarea
                value={symptoms}
                onChange={handleInputChange}
                placeholder="e.g. fever, cough, headache, body pain..."
                rows="4"
              />
              {showSuggestions && selectedDiseases.length === 0 && (
                <div className="suggestions-dropdown">
                  {symptomSuggestions
                    .filter(s => s.toLowerCase().includes(symptoms.toLowerCase()))
                    .slice(0, 5)
                    .map((s, i) => (
                      <div 
                        key={i} 
                        className="suggestion-item"
                        onClick={() => selectSuggestion(s)}
                      >
                        {s}
                      </div>
                    ))}
                </div>
              )}
            </div>
          </div>

          {error && <div className="error-message">{error}</div>}

          <button type="submit" disabled={loading}>
            {loading ? "Analyzing..." : "🔍 Analyze"}
          </button>
        </form>
      </div>

      {result && (
        <div className="ai-result">
          <h3>📊 Analysis Results</h3>
          
          {selectedDiseases.length > 0 && (
            <div className="result-badge">
              ✅ Diseases Selected: <strong>{selectedDiseases.join(", ")}</strong>
            </div>
          )}
          
          <div className="result-section">
            <h4>🩺 Possible Conditions</h4>
            <div className="conditions-list">
              {result.possibleConditions.map((condition, i) => (
                <div key={i} className="condition-card">
                  <div className="condition-name">
                    {i === 0 && <span className="top-badge">⭐ Most Likely</span>}
                    <strong>{condition.name}</strong>
                  </div>
                  <p className="condition-specialization">
                    Recommended: {condition.specialization}
                  </p>
                  <p className="condition-description">{condition.description}</p>
                  <div className="condition-score">
                    Match Score: {condition.score}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {result.symptoms && result.symptoms.length > 0 && (
            <div className="result-section">
              <h4>📝 Symptoms Considered</h4>
              <div className="symptoms-tags">
                {result.symptoms.map((s, i) => (
                  <span key={i} className="symptom-tag">{s}</span>
                ))}
              </div>
            </div>
          )}

          <div className="result-section">
            <h4>👨‍⚕️ Recommended Specialist</h4>
            <p><strong>{result.recommendedSpecialization}</strong></p>
          </div>

          {result.recommendedDoctors && result.recommendedDoctors.length > 0 && (
            <div className="result-section">
              <h4>👨‍⚕️ Available Doctors</h4>
              <div className="doctors-list">
                {result.recommendedDoctors.map((doctor) => (
                  <div key={doctor.id} className="doctor-card">
                    <h5>{doctor.name}</h5>
                    <p>Specialization: {doctor.specialization}</p>
                    <p>Experience: {doctor.experience}</p>
                    <p>Qualification: {doctor.qualification}</p>
                    <span className={`status ${doctor.available ? "available" : "unavailable"}`}>
                      {doctor.available ? "✅ Available" : "❌ Unavailable"}
                    </span>
                    <button 
                      className="btn-book"
                      onClick={() => {
                        if (doctor.available) {
                          navigate("/book-appointment");
                        } else {
                          alert("Doctor is not available right now");
                        }
                      }}
                    >
                      Book Appointment
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="disclaimer">
            <p>⚠️ <strong>Disclaimer:</strong> {result.disclaimer}</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default AISymptomChecker;