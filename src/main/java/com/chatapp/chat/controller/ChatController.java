package com.chatapp.chat.controller;

import java.time.LocalDateTime;

import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestBody;

import com.chatapp.chat.entities.Message;
import com.chatapp.chat.entities.Room;
import com.chatapp.chat.payload.MessageRequest;
import com.chatapp.chat.repository.RoomRepository;

@Controller
@CrossOrigin("http://localhost:5173")
public class ChatController {
    private RoomRepository roomRepository;

    public ChatController(RoomRepository roomRepository) {
        this.roomRepository = roomRepository;
    }
    
    @MessageMapping("/sendMessage/{roomId}")   //  app/sendMessage/{roomId}
    @SendTo("/topic/room/{roomId}")  // message publish here / client subscribe here
    public Message sendMessage(
        @DestinationVariable String roomId,
        @RequestBody MessageRequest request
    ){
        Room room = roomRepository.findByRoomId(request.getRoomId());
        Message message = new Message();

        message.setContent(request.getContent());
        message.setSender(request.getSender());
        message.setTimeStamp(LocalDateTime.now());

        if(room != null){
            room.getMessage().add(message);
            roomRepository.save(room);
        }else{
            throw new RuntimeException("Room not found");
        }

        return message;
    }

}
