package com.banking.dto.response;
import java.time.LocalDateTime;
public record AuditLogResponse(Long id, Long userId, String username, String action, String entityType, String entityId, String details, String ipAddress, LocalDateTime createdAt) {}
