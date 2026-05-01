import { useState, useRef, useEffect } from 'react';
import EmojiPicker from "emoji-picker-react";
import "./kk.css";
const Chat = () => {
  const end = useRef(null);
  const [text, setText] = useState("");
  const [hidden, sethidden] = useState(false);
  const [Reply, setReply] = useState([]);

  useEffect(() => {
    end.current?.scrollIntoView({ behavior: "smooth" });
  }, [Reply]);

  const Msg = () => {
    if (text.trim() === "") return;
    setReply((prev) => [...prev, { text: text, sender: "user" }]);
    fun();
    fetchMsg(text);
    setText("");
  };

  const onEmojiClick = (emojiData) => {
    setText((prev) => prev + emojiData.emoji);
  };

  const fun = () => sethidden(!hidden);

  async function fetchMsg() {
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ Text: text })
    });

    const data = await res.json();

    setReply((prev) => [
      ...prev,
      { text: data.text, sender: "bot" }
    ]);
  }

  return (
    <div style={{
      height: "100vh",
      background: "linear-gradient(135deg,#0f0f1a,#1a1a2e)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center"
    }}>

      {/* Main Chat Container */}
      <div style={{
        width: "590px",
        height: "90vh",
        display: "flex",
        flexDirection: "column",
        borderRadius: "20px",
        
        background: "rgba(255,255,255,0.05)",
        backdropFilter: "blur(10px)",
        boxShadow: "0 8px 30px rgba(0,0,0,0.5)",
        overflow: "auto",
        scrollbarWidth:"none"
      }} className="div">

        {/* Header */}
        <div style={{
          padding: "15px",
          textAlign: "center",
          color: "white",
          fontWeight: "600",
          borderBottom: "1px solid rgba(255,255,255,0.1)"
        }}>
          AI Assistant 🤖
        </div>

        {/* Messages */}
        <div style={{
          flex: 1,
          overflowY: "auto",
          padding: "15px",
           overflow: "auto",
        scrollbarWidth:"none"
        }}>
          {Reply.map((item, index) => (
            <div key={index} style={{
              display: "flex",
              justifyContent: item.sender === "user" ? "flex-end" : "flex-start",
              marginBottom: "12px",
               overflow: "auto",
        scrollbarWidth:"none"
            }}>
              <div style={{
                background: item.sender === "user"
                  ? "#4f46e5"
                  : "rgba(255,255,255,0.1)",
                color: "white",
                padding: "10px 14px",
                borderRadius: "16px",
                maxWidth: "60%",
                fontSize: "18px",
                lineHeight: "1.5",
                 overflow: "auto",
        scrollbarWidth:"none"
              }}>
                {item.text}
              </div>
            </div>
          ))}
          <div ref={end}></div>
        </div>

        {/* Input */}
        <div style={{
          padding: "10px",
          borderTop: "1px solid rgba(255,255,255,0.1)",
          display: "flex",
          alignItems: "center",
          gap: "8px"
        }}>
          <i
            className="bi bi-emoji-smile"
            onClick={fun}
            style={{ color: "white", cursor: "pointer", fontSize: "18px" }}
          ></i>

          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type a message..."
            style={{
              flex: 1,
              padding: "10px",
              borderRadius: "20px",
              border: "none",
              outline: "none",
              background: "rgba(255,255,255,0.1)",
              color: "white"
            }}
          />

          <button
            onClick={Msg}
            style={{
              background: "#4f46e5",
              color: "white",
              border: "none",
              padding: "8px 14px",
              borderRadius: "20px",
              cursor: "pointer"
            }}
          >
            Send
          </button>

          {hidden && (
            <div style={{
              position: "absolute",
              bottom: "70px",
              left: "10px"
            }}>
              <EmojiPicker onEmojiClick={onEmojiClick} />
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default Chat;