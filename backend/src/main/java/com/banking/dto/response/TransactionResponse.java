package com.banking.dto.response;
import java.math.BigDecimal;
import java.time.LocalDateTime;
public record TransactionResponse(Long id, String senderAccountNumber, String receiverAccountNumber, String type, BigDecimal amount, String description, BigDecimal balanceAfter, LocalDateTime createdAt) {}
