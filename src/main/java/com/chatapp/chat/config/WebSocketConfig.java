package com.chatapp.chat.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer{

    @Override
    public void configureMessageBroker(MessageBrokerRegistry config) {
        config.enableSimpleBroker("/topic");
        // /topic/messages

        config.setApplicationDestinationPrefixes("/app");
        // /app/chat
        // server-side: @MessagingMapping("/chat)
    }
    // Client → /app/chat → Controller → /topic/messages → Clients

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
            registry.addEndpoint("/chat")//connection establishment by the client
                .setAllowedOrigins("http://localhost:5173")
                /*Allows frontend (React/Vue) running on:
                http://localhost:5173
                Without this → browser blocks connection.*/
                
                .withSockJS();
    }
    
}

/*/Because WebSocketMessageBrokerConfigurer is NOT a normal interface.
 default void configureClientOutboundChannel(ChannelRegistration registration) {
    }
}
👉 All methods are default methods which 
Has a method body
Is optional to override

Part	Purpose
/chat	 WebSocket connection
/app	 Client → Server
/topic	 Server → Clients
@MessageMapping	Handles client messages
@SendTo	 Broadcasts messages
*/