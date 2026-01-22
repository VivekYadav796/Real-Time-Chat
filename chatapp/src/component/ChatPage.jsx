import React, { useEffect, useRef, useState } from "react";
import { BsSendFill } from "react-icons/bs";
import { ImAttachment } from "react-icons/im";
import { GiSadCrab, GiSandSnake } from "react-icons/gi";
import useChatContext from "../context/ChatContext";
import { useNavigate } from "react-router";
import SockJS from "sockjs-client";
import { Stomp } from "@stomp/stompjs";
import toast from "react-hot-toast";
import { baseURL } from "../config/AxiosHelper";
import { timeAgo } from "../config/helper";

const ChatPage = () => {
  const {
    roomId,
    currentUser,
    connected,
    setRoomId,
    setCurrentUser,
    setConnected,
  } = useChatContext();

  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const chatBoxRef = useRef(null);
  const stompClientRef = useRef(null);

  /* ================= REDIRECT ================= */
  useEffect(() => {
    if (!connected) navigate("/");
  }, [connected, navigate]);

  /* ================= AUTOSCROLL ================= */
  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  }, [messages]);

  /* ================= SOCKET ================= */
  useEffect(() => {
    if (!connected || !roomId) return;

    const sock = new SockJS(`${baseURL}/chat`);
    const client = Stomp.over(sock);

    client.connect({}, () => {
      stompClientRef.current = client;
      toast.success("Connected");

      client.subscribe(`/topic/room/${roomId}`, (msg) => {
        setMessages((prev) => [...prev, JSON.parse(msg.body)]);
      });
    });

    return () => {
      if (stompClientRef.current?.connected) {
        stompClientRef.current.disconnect();
        stompClientRef.current = null;
      }
    };
  }, [roomId, connected]);

  /* ================= SEND ================= */
  const sendMessage = () => {
    if (!input.trim() || !stompClientRef.current || !connected) return;

    stompClientRef.current.send(
      `/app/sendMessage/${roomId}`,
      {},
      JSON.stringify({
        sender: currentUser,
        content: input,
        roomId,
      })
    );
    setInput("");
  };

    //   TYPING INDICATOR..........
    // for this need a backend /app/typing/{roomId}
   /*
   const sendTyping = (typing) => {
    if (!stompClientRef.current) return;

    stompClientRef.current.send(
      `/app/typing/${roomId}`,
      {},
      JSON.stringify({
        user: currentUser,
        typing,
      })
    );
  };

  const handleTyping = (e) => {
    setInput(e.target.value);
    sendTyping(true);

    clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      sendTyping(false);
    }, 1200);
  };
   */

  /* ================= LOGOUT ================= */
  const handleLogout = () => {
    if (stompClientRef.current?.connected) {
      stompClientRef.current.disconnect();
    }
    stompClientRef.current = null;
    setConnected(false);
    setRoomId("");
    setCurrentUser("");
    navigate("/");
  };

  return (
    <div className="h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-white">
      {/* ================= HEADER ================= */}
      <header className="fixed top-0 w-full z-50 backdrop-blur bg-black/40 border-b border-white/10 px-8 py-4 flex justify-between items-center">
        <div>
          <h1 className="text-lg font-semibold">
            Room <span className="text-emerald-400">#{roomId}</span>
          </h1>
          <p className="text-sm text-gray-400">Live Chat</p>
        </div>

        <div className="flex items-center gap-6">
          <div className="text-right">
            <p className="text-sm text-gray-400">Logged in as</p>
            <p className="font-semibold">{currentUser}</p>
          </div>
          <button
            onClick={handleLogout}
            className="bg-red-500/80 hover:bg-red-600 px-4 py-2 rounded-full shadow"
          >
            Leave
          </button>
        </div>
      </header>

      {/* ================= CHAT ================= */}
      <main
        ref={chatBoxRef}
        className="pt-28 pb-28 px-6 max-w-5xl mx-auto h-full overflow-auto space-y-4"
      >
        {messages.map((msg, i) => {
          const isMe = msg.sender === currentUser;
          return (
            <div
              key={i}
              className={`flex ${isMe ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`relative max-w-md px-4 py-3 rounded-2xl shadow-lg ${
                  isMe
                    ? "bg-emerald-600 rounded-br-none"
                    : "bg-slate-700 rounded-bl-none"
                }`}
              >
                <div className="flex gap-2 items-start">
                  <div className="text-xl mt-1">
                    {isMe ? (
                      <GiSandSnake className="text-emerald-200" />
                    ) : (
                      <GiSadCrab className="text-sky-300" />
                    )}
                  </div>

                  <div>
                    <p className="text-sm ">{msg.sender}</p>
                    <p className="text-sm font-bold leading-relaxed">{msg.content}</p>
                    <p className="text-xs text-gray-300 mt-1 text-right">
                      {timeAgo(msg.timeStamp)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </main>

      {/* ================= INPUT ================= */}
      <footer className="fixed bottom-0 w-full px-6 py-4 backdrop-blur bg-black/40 border-t border-white/10">
        <div className="max-w-5xl mx-auto flex items-center gap-3">
          <button className="h-11 w-11 rounded-full bg-indigo-600/80 hover:bg-indigo-700 flex items-center justify-center">
            <ImAttachment />
          </button>

          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            placeholder="Type a message..."
            className="flex-1 h-11 px-5 rounded-full bg-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />

          <button
            onClick={sendMessage}
            className="h-11 w-11 rounded-full bg-emerald-600 hover:bg-emerald-700 flex items-center justify-center shadow-lg"
          >
            <BsSendFill />
          </button>
        </div>
      </footer>
    </div>
  );
};

export default ChatPage;
