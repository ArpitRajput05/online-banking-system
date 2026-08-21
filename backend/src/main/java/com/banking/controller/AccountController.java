package com.banking.controller;

import com.banking.dto.response.AccountResponse;
import com.banking.dto.response.ApiResponse;
import com.banking.service.AccountService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/accounts")
@PreAuthorize("isAuthenticated()")
@RequiredArgsConstructor
public class AccountController {
    private final AccountService accountService;

    @GetMapping("/my")
    public ResponseEntity<ApiResponse<AccountResponse>> getMyAccount(@AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(new ApiResponse<>(true, "Account retrieved", accountService.getMyAccount(userDetails.getUsername())));
    }
}
