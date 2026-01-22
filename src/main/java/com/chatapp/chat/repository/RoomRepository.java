package com.chatapp.chat.repository;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.chatapp.chat.entities.Room;

public interface RoomRepository extends MongoRepository<Room,String>{
    // <Room,String> -> <Document class name , type of id field>
    Room findByRoomId(String roomId);
} 

