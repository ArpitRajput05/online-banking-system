package com.banking.dto.response;
import java.time.LocalDateTime;
public record BeneficiaryResponse(Long id, String beneficiaryName, String accountNumber, String bankName, LocalDateTime createdAt) {}
