package com.chatapp.chat.controller;

import java.util.List;

import com.chatapp.chat.entities.Message;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.chatapp.chat.entities.Room;
import com.chatapp.chat.repository.RoomRepository;

@RestController
@RequestMapping("/api/v1/rooms")
@CrossOrigin("http://localhost:5173")  //It is used to allow your frontend (running on a different origin) to access your backend APIs.
public class RoomController {

    private RoomRepository roomRepository;

    public RoomController(RoomRepository roomRepository){
        this.roomRepository = roomRepository;
    }

    // create room
    @PostMapping
    public ResponseEntity<?> createRoom(@RequestBody String roomId) {

        if (roomRepository.findByRoomId(roomId) != null) {
            //room is already there
            return ResponseEntity.badRequest().body("Room already exists!");

        }

        //create new room

        Room room = new Room();
        room.setRoomId(roomId);
        Room savedRoom = roomRepository.save(room);
        return ResponseEntity.status(HttpStatus.CREATED).body(room);
    }

    // get room 
    @GetMapping("/{roomId}")
    public ResponseEntity<?> joinRoom(@PathVariable String roomId){

        Room room = roomRepository.findByRoomId(roomId);

        if(room == null){
            return ResponseEntity.badRequest().body("Room not found");
        }
        return ResponseEntity.ok(room);
    }

    // get messages of room 
    @GetMapping("/{roomId}/message")
    public ResponseEntity<List<Message>> getMessage(
        @PathVariable String roomId,
        @RequestParam(value = "page", defaultValue = "0", required = false) int page,
        @RequestParam(value = "size", defaultValue = "20",required = false) int size
    ){
        Room room = roomRepository.findByRoomId(roomId);
        if(room == null){
            return ResponseEntity.badRequest().build();
            // build gives HTTP Status only like 404
        }
        // get messages 
        // paging bcz we don't want all the above msg 

        List<Message> message = room.getMessage();

        int start = Math.max(0, message.size() - (page + 1) * size);
        int end = Math.min(message.size(), start + size);

        List<Message> paginatedMessage = message.subList(start, end);

        return ResponseEntity.ok(paginatedMessage);
    }

}
