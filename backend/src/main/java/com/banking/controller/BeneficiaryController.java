package com.banking.controller;

import com.banking.dto.request.BeneficiaryRequest;
import com.banking.dto.response.ApiResponse;
import com.banking.dto.response.BeneficiaryResponse;
import com.banking.service.BeneficiaryService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/beneficiaries")
@RequiredArgsConstructor
public class BeneficiaryController {
    private final BeneficiaryService beneficiaryService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<BeneficiaryResponse>>> getAll(@AuthenticationPrincipal UserDetails user) {
        return ResponseEntity.ok(new ApiResponse<>(true, "Beneficiaries retrieved", beneficiaryService.getAll(user.getUsername())));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<BeneficiaryResponse>> add(@Valid @RequestBody BeneficiaryRequest req, @AuthenticationPrincipal UserDetails user) {
        return ResponseEntity.ok(new ApiResponse<>(true, "Beneficiary added", beneficiaryService.add(req, user.getUsername())));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable Long id, @AuthenticationPrincipal UserDetails user) {
        beneficiaryService.delete(id, user.getUsername());
        return ResponseEntity.ok(new ApiResponse<>(true, "Beneficiary deleted", null));
    }
}
