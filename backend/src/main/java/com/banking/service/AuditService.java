package com.banking.service;

import com.banking.entity.AuditLog;
import com.banking.repository.AuditLogRepository;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuditService {
    private final AuditLogRepository auditLogRepository;

    public void log(Long userId, String username, String action, String entityType, String entityId, String details, HttpServletRequest request) {
        AuditLog audit = new AuditLog();
        audit.setUserId(userId);
        audit.setUsername(username);
        audit.setAction(action);
        audit.setEntityType(entityType);
        audit.setEntityId(entityId);
        audit.setDetails(details);
        audit.setIpAddress(request != null ? request.getRemoteAddr() : "unknown");
        auditLogRepository.save(audit);
    }
}
