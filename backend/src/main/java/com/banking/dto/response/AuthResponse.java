package com.banking.dto.response;
public record AuthResponse(String token, String username, String email, String role) {}
