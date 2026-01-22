package com.chatapp.chat.entities;

import java.util.ArrayList;
import java.util.List;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;


@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "rooms")    // It tells Spring Data that this class represents a MongoDB collection.

public class Room {
    @Id                      // uniQue mongo db identifier 
    private String id;
    private String roomId;
    private List<Message> message = new ArrayList<>();
}
