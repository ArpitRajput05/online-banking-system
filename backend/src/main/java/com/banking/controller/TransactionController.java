package com.banking.controller;

import com.banking.dto.request.TransferRequest;
import com.banking.dto.response.ApiResponse;
import com.banking.dto.response.TransactionResponse;
import com.banking.service.TransactionService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/transactions")
@RequiredArgsConstructor
public class TransactionController {
    private final TransactionService transactionService;

    @PostMapping("/transfer")
    public ResponseEntity<ApiResponse<TransactionResponse>> transfer(@Valid @RequestBody TransferRequest req, @AuthenticationPrincipal UserDetails user, HttpServletRequest request) {
        return ResponseEntity.ok(new ApiResponse<>(true, "Transfer successful", transactionService.transfer(req, user.getUsername(), request)));
    }

    @GetMapping("/my")
    public ResponseEntity<ApiResponse<List<TransactionResponse>>> getMyTransactions(@AuthenticationPrincipal UserDetails user) {
        return ResponseEntity.ok(new ApiResponse<>(true, "Transactions retrieved", transactionService.getMyTransactions(user.getUsername())));
    }
}
