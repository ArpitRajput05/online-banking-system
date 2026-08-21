package com.banking.service;

import com.banking.dto.request.LoginRequest;
import com.banking.dto.request.RegisterRequest;
import com.banking.dto.response.AuthResponse;
import com.banking.entity.BankAccount;
import com.banking.entity.User;
import com.banking.enums.AccountType;
import com.banking.enums.Role;
import com.banking.repository.BankAccountRepository;
import com.banking.repository.UserRepository;
import com.banking.security.JwtTokenProvider;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.Random;

@Service
@RequiredArgsConstructor
public class AuthService {
    private final UserRepository userRepository;
    private final BankAccountRepository bankAccountRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider tokenProvider;
    private final AuthenticationManager authenticationManager;
    private final AuditService auditService;

    @Transactional
    public AuthResponse register(RegisterRequest req, HttpServletRequest request) {
        if (userRepository.existsByUsername(req.getUsername())) throw new RuntimeException("Username is already taken");
        if (userRepository.existsByEmail(req.getEmail())) throw new RuntimeException("Email is already taken");

        User user = new User();
        user.setUsername(req.getUsername());
        user.setEmail(req.getEmail());
        user.setPassword(passwordEncoder.encode(req.getPassword()));
        user.setRole(Role.CUSTOMER);
        user = userRepository.save(user);

        BankAccount account = new BankAccount();
        account.setUser(user);
        account.setAccountNumber(generateAccountNumber());
        account.setBalance(new BigDecimal("10000.00"));
        account.setAccountType(AccountType.SAVINGS);
        bankAccountRepository.save(account);

        auditService.log(user.getId(), user.getUsername(), "REGISTER", "User", user.getId().toString(), "User registered successfully", request);

        Authentication auth = new UsernamePasswordAuthenticationToken(user, null, user.getAuthorities());
        String token = tokenProvider.generateToken(auth);

        return new AuthResponse(token, user.getUsername(), user.getEmail(), user.getRole().name());
    }

    public AuthResponse login(LoginRequest req, HttpServletRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(req.getUsername(), req.getPassword()));
        
        User user = (User) authentication.getPrincipal();
        String token = tokenProvider.generateToken(authentication);

        auditService.log(user.getId(), user.getUsername(), "LOGIN", "User", user.getId().toString(), "User logged in", request);

        return new AuthResponse(token, user.getUsername(), user.getEmail(), user.getRole().name());
    }

    private String generateAccountNumber() {
        Random rnd = new Random();
        StringBuilder sb = new StringBuilder(10);
        for(int i = 0; i < 10; i++) sb.append(rnd.nextInt(10));
        return sb.toString();
    }
}
