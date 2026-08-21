package com.banking.service;

import com.banking.dto.response.AuditLogResponse;
import com.banking.dto.response.UserResponse;
import com.banking.repository.AuditLogRepository;
import com.banking.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AdminService {
    private final UserRepository userRepository;
    private final AuditLogRepository auditLogRepository;

    public List<UserResponse> getAllUsers() {
        return userRepository.findAll().stream()
                .map(u -> new UserResponse(u.getId(), u.getUsername(), u.getEmail(), u.getRole().name(), u.isEnabled(), u.getCreatedAt()))
                .collect(Collectors.toList());
    }

    public List<AuditLogResponse> getAllAuditLogs() {
        return auditLogRepository.findAllByOrderByCreatedAtDesc().stream()
                .map(a -> new AuditLogResponse(a.getId(), a.getUserId(), a.getUsername(), a.getAction(), a.getEntityType(), a.getEntityId(), a.getDetails(), a.getIpAddress(), a.getCreatedAt()))
                .collect(Collectors.toList());
    }
}
