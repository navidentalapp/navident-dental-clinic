package com.navident.clinic.service;

import com.navident.clinic.model.ClinicFinance;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;

public interface FinanceService {
    ClinicFinance createTransaction(ClinicFinance txn);
    ClinicFinance getTransactionById(String id);
    List<ClinicFinance> searchTransactions(String query);
    ClinicFinance updateTransaction(String id, ClinicFinance txn);
    void deleteTransaction(String id);

    List<ClinicFinance> listByCategory(String category);
    byte[] exportFinanceExcel(LocalDate start, LocalDate end);

    Page<ClinicFinance> getAllTransactions(Pageable pageable, String category, String type);
    List<ClinicFinance> getAllTransactions();
    List<ClinicFinance> getTransactionsByType(String type);
    List<ClinicFinance> getTransactionsByDateRange(LocalDate startDate, LocalDate endDate);

    Map<String, Object> getFinancialSummary(LocalDate startDate, LocalDate endDate);
    Map<String, Object> getMonthlyFinancialSummary(int year, int month);
    Map<String, Object> getYearlyFinancialSummary(int year);

    BigDecimal getTotalRevenue(LocalDate startDate, LocalDate endDate);
    BigDecimal getTotalExpenses(LocalDate startDate, LocalDate endDate);
    BigDecimal getProfit(LocalDate startDate, LocalDate endDate);

    List<String> getAllCategories();
    List<String> getAllTypes();
    List<String> getAllVendors();

    Map<String, BigDecimal> getCategoryWiseExpenses(LocalDate startDate, LocalDate endDate);
    Map<String, Object> getMonthlyFinancialTrend(int year);

    List<ClinicFinance> createBulkTransactions(List<ClinicFinance> transactions);
    ClinicFinance updateTransactionStatus(String id, String status);
}
