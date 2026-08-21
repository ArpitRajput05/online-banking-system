package com.banking.controller;

import com.banking.dto.request.LoginRequest;
import com.banking.dto.request.RegisterRequest;
import com.banking.dto.response.ApiResponse;
import com.banking.dto.response.AuthResponse;
import com.banking.service.AuthService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {
    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<AuthResponse>> register(@Valid @RequestBody RegisterRequest req, HttpServletRequest request) {
        AuthResponse res = authService.register(req, request);
        return ResponseEntity.ok(new ApiResponse<>(true, "Registered successfully", res));
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<AuthResponse>> login(@Valid @RequestBody LoginRequest req, HttpServletRequest request) {
        AuthResponse res = authService.login(req, request);
        return ResponseEntity.ok(new ApiResponse<>(true, "Logged in successfully", res));
    }
}
