package com.banking.service;

import com.banking.dto.request.TransferRequest;
import com.banking.dto.response.TransactionResponse;
import com.banking.entity.BankAccount;
import com.banking.entity.Transaction;
import com.banking.entity.User;
import com.banking.enums.TransactionType;
import com.banking.exception.InsufficientBalanceException;
import com.banking.repository.BankAccountRepository;
import com.banking.repository.TransactionRepository;
import com.banking.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class TransactionServiceTest {

    @Mock private TransactionRepository transactionRepository;
    @Mock private BankAccountRepository bankAccountRepository;
    @Mock private UserRepository userRepository;
    @Mock private AuditService auditService;

    @InjectMocks private TransactionService transactionService;

    @Test
    void test_transfer_success() {
        User user = new User();
        user.setId(1L);
        user.setUsername("test");

        BankAccount sender = new BankAccount();
        sender.setId(1L);
        sender.setAccountNumber("1234567890");
        sender.setBalance(new BigDecimal("1000.00"));

        TransferRequest req = new TransferRequest();
        req.setReceiverAccountNumber("0987654321");
        req.setAmount(new BigDecimal("100.00"));
        req.setDescription("Test transfer");

        // Stub save to return a fully populated Transaction entity with ID
        Transaction savedTx = new Transaction();
        savedTx.setId(1L);
        savedTx.setSenderAccount(sender);
        savedTx.setReceiverAccountNumber("0987654321");
        savedTx.setType(TransactionType.TRANSFER);
        savedTx.setAmount(new BigDecimal("100.00"));
        savedTx.setDescription("Test transfer");
        savedTx.setBalanceAfter(new BigDecimal("900.00"));
        savedTx.setCreatedAt(LocalDateTime.now());

        when(userRepository.findByUsername(anyString())).thenReturn(Optional.of(user));
        when(bankAccountRepository.findByUser(user)).thenReturn(Optional.of(sender));
        when(bankAccountRepository.findByAccountNumber(anyString())).thenReturn(Optional.empty());
        when(transactionRepository.save(any())).thenReturn(savedTx);
        doNothing().when(auditService).log(any(), any(), any(), any(), any(), any(), any());

        TransactionResponse res = transactionService.transfer(req, "test", null);

        assertNotNull(res);
        assertEquals(new BigDecimal("900.00"), sender.getBalance());
        verify(transactionRepository, times(1)).save(any());
    }

    @Test
    void test_transfer_insufficientBalance() {
        User user = new User();
        user.setId(1L);

        BankAccount sender = new BankAccount();
        sender.setBalance(new BigDecimal("50.00"));

        TransferRequest req = new TransferRequest();
        req.setAmount(new BigDecimal("100.00"));
        req.setReceiverAccountNumber("9999999999");

        when(userRepository.findByUsername(anyString())).thenReturn(Optional.of(user));
        when(bankAccountRepository.findByUser(user)).thenReturn(Optional.of(sender));

        assertThrows(InsufficientBalanceException.class,
                () -> transactionService.transfer(req, "test", null));
    }
}
