package com.banking.dto.request;
import jakarta.validation.constraints.*;
import lombok.Data;
import java.math.BigDecimal;
@Data
public class TransferRequest {
    @NotBlank private String receiverAccountNumber;
    @NotNull @DecimalMin("0.01") private BigDecimal amount;
    private String description;
}
