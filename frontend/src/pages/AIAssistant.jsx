import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/api";
import "./AIAssistant.css";

function AIAssistant() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }
    fetchSuggestions();
    // Add welcome message
    setMessages([
      {
        id: 1,
        sender: "bot",
        text: "👋 Hello! I'm your AI Healthcare Assistant. I can help you with:\n- 📅 Appointments\n- 📋 Reports\n- 💰 Billing\n- 🏥 Hospital Services\n- 🔐 Account help\n\nAsk me anything!",
        timestamp: new Date().toLocaleTimeString(),
      },
    ]);
  }, []);

  const fetchSuggestions = async () => {
    try {
      const res = await API.get("/ai-assistant/suggestions");
      setSuggestions(res.data || []);
    } catch (error) {
      console.error("Error fetching suggestions:", error);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    // Add user message
    const userMessage = {
      id: Date.now(),
      sender: "user",
      text: input.trim(),
      timestamp: new Date().toLocaleTimeString(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const response = await API.post("/ai-assistant/ask", {
        query: input.trim(),
      });

      const botMessage = {
        id: Date.now() + 1,
        sender: "bot",
        text: response.data.answer || "I couldn't process your request.",
        timestamp: new Date().toLocaleTimeString(),
        disclaimer: response.data.disclaimer,
      };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Error:", error);
      const errorMessage = {
        id: Date.now() + 1,
        sender: "bot",
        text: "❌ Sorry, I'm having trouble connecting. Please try again later.",
        timestamp: new Date().toLocaleTimeString(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setInput(suggestion);
    // Auto-send after a small delay
    setTimeout(() => {
      handleSend();
    }, 100);
  };

  return (
    <div className="ai-assistant">
      <div className="ai-header">
        <h2>🤖 AI Healthcare Assistant</h2>
        <p>Get instant answers to your healthcare questions</p>
      </div>

      <div className="ai-chat-container">
        <div className="chat-messages">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`message ${msg.sender === "user" ? "user-message" : "bot-message"}`}
            >
              <div className="message-bubble">
                <div className="message-text">{msg.text}</div>
                {msg.disclaimer && (
                  <div className="message-disclaimer">{msg.disclaimer}</div>
                )}
                <div className="message-time">{msg.timestamp}</div>
              </div>
            </div>
          ))}
          {loading && (
            <div className="message bot-message">
              <div className="message-bubble">
                <div className="message-text typing-indicator">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Suggestions */}
        <div className="suggestions-section">
          <p className="suggestions-label">💡 Suggested Questions:</p>
          <div className="suggestions-list">
            {suggestions.map((suggestion, index) => (
              <button
                key={index}
                className="suggestion-chip"
                onClick={() => handleSuggestionClick(suggestion)}
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>

        {/* Input */}
        <div className="chat-input-container">
          <textarea
            className="chat-input"
            placeholder="Ask me anything about hospital services..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyPress}
            rows="2"
            disabled={loading}
          />
          <button
            className="chat-send-btn"
            onClick={handleSend}
            disabled={loading || !input.trim()}
          >
            {loading ? "⏳" : "➤"}
          </button>
        </div>
      </div>

      <div className="ai-footer">
        <p>
          ⚠️ <strong>Medical Disclaimer:</strong> This AI assistant is for general guidance and informational purposes only. 
          It is not a substitute for professional medical advice, diagnosis, or treatment. 
          Always consult a qualified healthcare provider for medical concerns.
        </p>
      </div>
    </div>
  );
}

export default AIAssistant;