package com.banking.service;

import com.banking.dto.request.BeneficiaryRequest;
import com.banking.dto.response.BeneficiaryResponse;
import com.banking.entity.Beneficiary;
import com.banking.entity.User;
import com.banking.exception.ResourceNotFoundException;
import com.banking.repository.BeneficiaryRepository;
import com.banking.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BeneficiaryService {
    private final BeneficiaryRepository beneficiaryRepository;
    private final UserRepository userRepository;

    public List<BeneficiaryResponse> getAll(String username) {
        User user = userRepository.findByUsername(username).orElseThrow();
        return beneficiaryRepository.findByOwner(user).stream()
                .map(b -> new BeneficiaryResponse(b.getId(), b.getBeneficiaryName(), b.getAccountNumber(), b.getBankName(), b.getCreatedAt()))
                .collect(Collectors.toList());
    }

    @Transactional
    public BeneficiaryResponse add(BeneficiaryRequest req, String username) {
        User user = userRepository.findByUsername(username).orElseThrow();
        Beneficiary b = new Beneficiary();
        b.setOwner(user);
        b.setBeneficiaryName(req.getBeneficiaryName());
        b.setAccountNumber(req.getAccountNumber());
        b.setBankName(req.getBankName());
        b = beneficiaryRepository.save(b);
        return new BeneficiaryResponse(b.getId(), b.getBeneficiaryName(), b.getAccountNumber(), b.getBankName(), b.getCreatedAt());
    }

    @Transactional
    public void delete(Long id, String username) {
        User user = userRepository.findByUsername(username).orElseThrow();
        Beneficiary b = beneficiaryRepository.findByOwnerAndId(user, id)
                .orElseThrow(() -> new ResourceNotFoundException("Beneficiary not found"));
        beneficiaryRepository.delete(b);
    }
}
