package com.banking.service;

import com.banking.dto.request.LoginRequest;
import com.banking.dto.request.RegisterRequest;
import com.banking.dto.response.AuthResponse;
import com.banking.entity.BankAccount;
import com.banking.entity.User;
import com.banking.enums.Role;
import com.banking.repository.BankAccountRepository;
import com.banking.repository.UserRepository;
import com.banking.security.JwtTokenProvider;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import jakarta.servlet.http.HttpServletRequest;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock private UserRepository userRepository;
    @Mock private BankAccountRepository bankAccountRepository;
    @Mock private PasswordEncoder passwordEncoder;
    @Mock private JwtTokenProvider tokenProvider;
    @Mock private AuthenticationManager authenticationManager;
    @Mock private AuditService auditService;

    @InjectMocks private AuthService authService;

    @Test
    void test_register_success() {
        RegisterRequest req = new RegisterRequest();
        req.setUsername("testuser");
        req.setEmail("test@test.com");
        req.setPassword("password");

        when(userRepository.existsByUsername(anyString())).thenReturn(false);
        when(userRepository.existsByEmail(anyString())).thenReturn(false);
        
        User user = new User();
        user.setId(1L);
        user.setUsername("testuser");
        user.setRole(Role.CUSTOMER);
        
        when(userRepository.save(any(User.class))).thenReturn(user);
        when(tokenProvider.generateToken(any())).thenReturn("token123");

        AuthResponse res = authService.register(req, null);

        assertNotNull(res);
        assertEquals("token123", res.token());
        assertEquals("testuser", res.username());
        verify(bankAccountRepository, times(1)).save(any(BankAccount.class));
    }

    @Test
    void test_register_username_taken() {
        RegisterRequest req = new RegisterRequest();
        req.setUsername("testuser");
        
        when(userRepository.existsByUsername(anyString())).thenReturn(true);
        
        assertThrows(RuntimeException.class, () -> authService.register(req, null));
    }

    @Test
    void test_login_success() {
        LoginRequest req = new LoginRequest();
        req.setUsername("testuser");
        req.setPassword("password");

        User user = new User();
        user.setId(1L);
        user.setUsername("testuser");
        user.setRole(Role.CUSTOMER);

        Authentication auth = mock(Authentication.class);
        when(authenticationManager.authenticate(any())).thenReturn(auth);
        when(auth.getPrincipal()).thenReturn(user);
        when(tokenProvider.generateToken(any())).thenReturn("token123");

        AuthResponse res = authService.login(req, null);

        assertEquals("token123", res.token());
        assertEquals("testuser", res.username());
    }
}
