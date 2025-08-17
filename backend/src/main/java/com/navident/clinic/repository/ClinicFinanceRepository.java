package com.navident.clinic.repository;

import com.navident.clinic.model.ClinicFinance;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.time.LocalDate;
import java.util.List;

public interface ClinicFinanceRepository extends MongoRepository<ClinicFinance, String> {
    Page<ClinicFinance> findByCategory(String category, Pageable pageable);
    Page<ClinicFinance> findByType(String type, Pageable pageable);
    Page<ClinicFinance> findByCategoryAndType(String category, String type, Pageable pageable);
    List<ClinicFinance> findByType(String type);
    List<ClinicFinance> findByCategory(String category);
    List<ClinicFinance> findByTransactionDateBetween(LocalDate start, LocalDate end);
}
