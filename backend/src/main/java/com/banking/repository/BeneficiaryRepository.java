package com.banking.repository;
import com.banking.entity.Beneficiary;
import com.banking.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;
public interface BeneficiaryRepository extends JpaRepository<Beneficiary, Long> {
    List<Beneficiary> findByOwner(User owner);
    Optional<Beneficiary> findByOwnerAndId(User owner, Long id);
}
