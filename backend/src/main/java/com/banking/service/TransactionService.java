package com.banking.service;

import com.banking.dto.request.TransferRequest;
import com.banking.dto.response.TransactionResponse;
import com.banking.entity.BankAccount;
import com.banking.entity.Transaction;
import com.banking.entity.User;
import com.banking.enums.TransactionType;
import com.banking.exception.InsufficientBalanceException;
import com.banking.exception.ResourceNotFoundException;
import com.banking.repository.BankAccountRepository;
import com.banking.repository.TransactionRepository;
import com.banking.repository.UserRepository;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TransactionService {
    private final TransactionRepository transactionRepository;
    private final BankAccountRepository bankAccountRepository;
    private final UserRepository userRepository;
    private final AuditService auditService;

    @Transactional
    public TransactionResponse transfer(TransferRequest req, String username, HttpServletRequest request) {
        User user = userRepository.findByUsername(username).orElseThrow();
        BankAccount sender = bankAccountRepository.findByUser(user).orElseThrow();

        if (sender.getBalance().compareTo(req.getAmount()) < 0) {
            throw new InsufficientBalanceException("Insufficient funds");
        }

        sender.setBalance(sender.getBalance().subtract(req.getAmount()));
        bankAccountRepository.save(sender);

        Transaction t = new Transaction();
        t.setSenderAccount(sender);
        t.setReceiverAccountNumber(req.getReceiverAccountNumber());
        t.setType(TransactionType.TRANSFER);
        t.setAmount(req.getAmount());
        t.setDescription(req.getDescription());
        t.setBalanceAfter(sender.getBalance());
        t = transactionRepository.save(t);

        Optional<BankAccount> receiverOpt = bankAccountRepository.findByAccountNumber(req.getReceiverAccountNumber());
        if (receiverOpt.isPresent()) {
            BankAccount receiver = receiverOpt.get();
            receiver.setBalance(receiver.getBalance().add(req.getAmount()));
            bankAccountRepository.save(receiver);

            Transaction rt = new Transaction();
            rt.setSenderAccount(receiver); // Receiver's own perspective of account
            rt.setReceiverAccountNumber(sender.getAccountNumber());
            rt.setType(TransactionType.CREDIT);
            rt.setAmount(req.getAmount());
            rt.setDescription("Transfer from " + sender.getAccountNumber());
            rt.setBalanceAfter(receiver.getBalance());
            transactionRepository.save(rt);
        }

        auditService.log(user.getId(), username, "TRANSFER", "Transaction", t.getId().toString(), "Amount: " + req.getAmount(), request);

        return new TransactionResponse(t.getId(), sender.getAccountNumber(), t.getReceiverAccountNumber(), t.getType().name(), t.getAmount(), t.getDescription(), t.getBalanceAfter(), t.getCreatedAt());
    }

    public List<TransactionResponse> getMyTransactions(String username) {
        User user = userRepository.findByUsername(username).orElseThrow();
        BankAccount sender = bankAccountRepository.findByUser(user).orElseThrow();
        return transactionRepository.findBySenderAccountOrderByCreatedAtDesc(sender).stream()
                .map(t -> new TransactionResponse(t.getId(), t.getSenderAccount().getAccountNumber(), t.getReceiverAccountNumber(), t.getType().name(), t.getAmount(), t.getDescription(), t.getBalanceAfter(), t.getCreatedAt()))
                .collect(Collectors.toList());
    }
}
