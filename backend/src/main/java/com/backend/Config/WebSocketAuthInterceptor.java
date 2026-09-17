package com.backend.Config;

import com.backend.Service.JwtService;
import lombok.RequiredArgsConstructor;

import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.simp.stomp.StompCommand;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.MessageHeaderAccessor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.stereotype.Component;
import org.springframework.messaging.support.ChannelInterceptor;

import java.util.Collections;

@Component
@RequiredArgsConstructor
public class WebSocketAuthInterceptor
        implements ChannelInterceptor {

    private final JwtService jwtService;

    @Override
    public Message<?> preSend(
            Message<?> message,
            MessageChannel channel) {

        StompHeaderAccessor accessor =
                MessageHeaderAccessor.getAccessor(
                        message,
                        StompHeaderAccessor.class
                );

        if (accessor == null) {
            return message;
        }

        System.out.println(
                "STOMP COMMAND: "
                        + accessor.getCommand()
        );

        if (StompCommand.CONNECT.equals(
                accessor.getCommand())) {

            String authHeader =
                    accessor.getFirstNativeHeader(
                            "Authorization"
                    );

            System.out.println(
                    "AUTH HEADER: "
                            + authHeader
            );

            if (authHeader == null ||
                    !authHeader.startsWith("Bearer ")) {

                throw new IllegalArgumentException(
                        "Missing Authorization header"
                );
            }

            String token =
                    authHeader.substring(7);

            if (!jwtService.isValid(token)) {

                System.out.println(
                        "JWT INVALID"
                );

                throw new IllegalArgumentException(
                        "Invalid JWT"
                );
            }

            String username =
                    jwtService.extractUsername(token);

            System.out.println(
                    "WEBSOCKET USER: "
                            + username
            );

            UsernamePasswordAuthenticationToken authentication =
                    new UsernamePasswordAuthenticationToken(
                            username,
                            null,
                            Collections.emptyList()
                    );

            accessor.setUser(authentication);

            System.out.println(
                    "WEBSOCKET AUTHENTICATED"
            );

            System.out.println(
                    "PRINCIPAL SET: "
                            + accessor.getUser()
            );
        }

        return message;
    }
}