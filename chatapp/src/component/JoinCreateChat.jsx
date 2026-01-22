import React, { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router";
import { BsWechat } from "react-icons/bs";
import { createRoomApi, joinChatApi } from "../services/RoomService";
import useChatContext from "../context/ChatContext";

const JoinCreateChat = () => {
  const [detail, setDetail] = useState({
    roomId: "",
    userName: "",
  });

  const { setRoomId, setCurrentUser, setConnected } = useChatContext();
  const navigate = useNavigate();

  function handleFormInputChange(event) {
    setDetail({
      ...detail,
      [event.target.name]: event.target.value,
    });
  }

  function validateForm() {
    if (detail.roomId === "" || detail.userName === "") {
      toast.error("Invalid Input !!");
      return false;
    }
    return true;
  }

  async function joinChat() {
    if (validateForm()) {
      try {
        const room = await joinChatApi(detail.roomId);
        toast.success("Joined successfully");
        setCurrentUser(detail.userName);
        setRoomId(room.roomId);
        setConnected(true);
        navigate("/chat");
      } catch (error) {
        if (error.status === 400) {
          toast.error(error.response.data);
        } else {
          toast.error("Error in joining room");
        }
      }
    }
  }

  async function createRoom() {
    if (validateForm()) {
      try {
        const response = await createRoomApi(detail.roomId);
        toast.success("Room Created Successfully");
        setCurrentUser(detail.userName);
        setRoomId(response.roomId);
        setConnected(true);
        navigate("/chat");
      } catch (error) {
        if (error.status === 400) {
          toast.error("Room already exists");
        } else {
          toast.error("Something went wrong");
        }
      }
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 px-4">
      <div className="w-full max-w-md p-8 rounded-2xl shadow-2xl backdrop-blur bg-white/5 border border-white/10">

        {/* ICON */}
        <div className="flex justify-center mb-6">
          <div className="h-20 w-20 rounded-full bg-emerald-500/10 flex items-center justify-center shadow-lg">
            <BsWechat className="text-5xl text-emerald-400" />
          </div>
        </div>

        {/* TITLE */}
        <h1 className="text-2xl font-bold text-center text-white mb-2">
          Join or Create Room
        </h1>
        <p className="text-center text-gray-400 text-sm mb-8">
          Connect instantly with your friends
        </p>

        {/* USER NAME */}
        <div className="mb-5">
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Your Name
          </label>
          <input
            onChange={handleFormInputChange}
            value={detail.userName}
            name="userName"
            type="text"
            placeholder="Enter your name"
            className="w-full px-4 py-2 rounded-full bg-slate-800 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        {/* ROOM ID */}
        <div className="mb-8">
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Room ID
          </label>
          <input
            onChange={handleFormInputChange}
            value={detail.roomId}
            name="roomId"
            type="text"
            placeholder="Enter room id"
            className="w-full px-4 py-2 rounded-full bg-slate-800 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        {/* BUTTONS */}
        <div className="flex gap-4">
          <button
            onClick={joinChat}
            className="flex-1 py-2 rounded-full bg-emerald-600 hover:bg-emerald-700 transition transform hover:scale-105 font-semibold"
          >
            Join Room
          </button>

          <button
            onClick={createRoom}
            className="flex-1 py-2 rounded-full bg-indigo-600 hover:bg-indigo-700 transition transform hover:scale-105 font-semibold"
          >
            Create Room
          </button>
        </div>
      </div>
    </div>
  );
};

export default JoinCreateChat;
