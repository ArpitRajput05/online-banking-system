package com.banking.dto.request;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;
@Data
public class BeneficiaryRequest {
    @NotBlank private String beneficiaryName;
    @NotBlank private String accountNumber;
    @NotBlank private String bankName;
}
