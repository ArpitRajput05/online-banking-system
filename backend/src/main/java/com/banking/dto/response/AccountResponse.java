package com.banking.dto.response;
import java.math.BigDecimal;
import java.time.LocalDateTime;
public record AccountResponse(Long id, String accountNumber, BigDecimal balance, String accountType, String ownerUsername, LocalDateTime createdAt) {}
