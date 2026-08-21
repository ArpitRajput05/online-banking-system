package com.banking.service;

import com.banking.dto.response.AccountResponse;
import com.banking.entity.BankAccount;
import com.banking.entity.User;
import com.banking.exception.ResourceNotFoundException;
import com.banking.repository.BankAccountRepository;
import com.banking.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AccountService {
    private final UserRepository userRepository;
    private final BankAccountRepository bankAccountRepository;

    public AccountResponse getMyAccount(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        BankAccount account = bankAccountRepository.findByUser(user)
                .orElseThrow(() -> new ResourceNotFoundException("Account not found"));
        
        return new AccountResponse(account.getId(), account.getAccountNumber(), account.getBalance(), account.getAccountType().name(), user.getUsername(), account.getCreatedAt());
    }
}
