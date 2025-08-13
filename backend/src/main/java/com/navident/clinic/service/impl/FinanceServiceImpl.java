package com.navident.clinic.service.impl;

import com.navident.clinic.exception.ResourceNotFoundException;
import com.navident.clinic.model.ClinicFinance;
import com.navident.clinic.repository.ClinicFinanceRepository;
import com.navident.clinic.service.FinanceService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class FinanceServiceImpl implements FinanceService {

    private final ClinicFinanceRepository repo;

    @Override
    public ClinicFinance createTransaction(ClinicFinance txn) {
        txn.setCreatedAt(LocalDateTime.now());
        txn.setUpdatedAt(LocalDateTime.now());
        return repo.save(txn);
    }

    @Override
    public ClinicFinance getTransactionById(String id) {
        return repo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Finance", "id", id));
    }

    @Override
    public List<ClinicFinance> searchTransactions(String query) {
        return repo.findAll().stream()
                .filter(t -> t.getDescription()!=null && t.getDescription().toLowerCase().contains(query.toLowerCase()))
                .collect(Collectors.toList());
    }

    @Override
    public ClinicFinance updateTransaction(String id, ClinicFinance txn) {
        ClinicFinance existing = getTransactionById(id);
        existing.setAmount(txn.getAmount());
        existing.setDescription(txn.getDescription());
        existing.setUpdatedAt(LocalDateTime.now());
        return repo.save(existing);
    }

    @Override
    public void deleteTransaction(String id) {
        repo.delete(getTransactionById(id));
    }

    @Override
    public List<ClinicFinance> listByCategory(String category) {
        return repo.findByCategory(category);
    }

    @Override
    public byte[] exportFinanceExcel(LocalDate start, LocalDate end) {
        // Delegate to ExcelUtil.financeToExcel in your actual implementation
        return new byte[0];
    }

    @Override
    public Page<ClinicFinance> getAllTransactions(Pageable pageable, String category, String type) {
        if (category != null && type != null) {
            return repo.findByCategoryAndType(category, type, pageable);
        } else if (category != null) {
            return repo.findByCategory(category, pageable);
        } else if (type != null) {
            return repo.findByType(type, pageable);
        }
        return repo.findAll(pageable);
    }

    @Override
    public List<ClinicFinance> getAllTransactions() {
        return repo.findAll();
    }

    @Override
    public List<ClinicFinance> getTransactionsByType(String type) {
        return repo.findByType(type);
    }

    @Override
    public List<ClinicFinance> getTransactionsByDateRange(LocalDate startDate, LocalDate endDate) {
        return repo.findByTransactionDateBetween(startDate, endDate);
    }

    @Override
    public Map<String, Object> getFinancialSummary(LocalDate startDate, LocalDate endDate) {
        List<ClinicFinance> list = getTransactionsByDateRange(startDate, endDate);
        BigDecimal revenue = list.stream().filter(t -> "REVENUE".equals(t.getCategory()))
                .map(ClinicFinance::getAmount).reduce(BigDecimal.ZERO, BigDecimal::add);
        BigDecimal expense = list.stream().filter(t -> "EXPENSE".equals(t.getCategory()))
                .map(ClinicFinance::getAmount).reduce(BigDecimal.ZERO, BigDecimal::add);
        Map<String,Object> map = new HashMap<>();
        map.put("totalRevenue", revenue);
        map.put("totalExpense", expense);
        map.put("profit", revenue.subtract(expense));
        return map;
    }

    @Override
    public Map<String, Object> getMonthlyFinancialSummary(int year, int month) {
        LocalDate start = LocalDate.of(year, month, 1);
        LocalDate end = start.withDayOfMonth(start.lengthOfMonth());
        return getFinancialSummary(start, end);
    }

    @Override
    public Map<String, Object> getYearlyFinancialSummary(int year) {
        LocalDate start = LocalDate.of(year, 1, 1);
        LocalDate end = LocalDate.of(year, 12, 31);
        return getFinancialSummary(start, end);
    }

    @Override
    public BigDecimal getTotalRevenue(LocalDate startDate, LocalDate endDate) {
        return getTransactionsByDateRange(startDate, endDate).stream()
                .filter(t -> "REVENUE".equals(t.getCategory()))
                .map(ClinicFinance::getAmount).reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    @Override
    public BigDecimal getTotalExpenses(LocalDate startDate, LocalDate endDate) {
        return getTransactionsByDateRange(startDate, endDate).stream()
                .filter(t -> "EXPENSE".equals(t.getCategory()))
                .map(ClinicFinance::getAmount).reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    @Override
    public BigDecimal getProfit(LocalDate startDate, LocalDate endDate) {
        return getTotalRevenue(startDate, endDate).subtract(getTotalExpenses(startDate, endDate));
    }

    @Override
    public List<String> getAllCategories() {
        return repo.findAll().stream().map(ClinicFinance::getCategory).distinct().collect(Collectors.toList());
    }

    @Override
    public List<String> getAllTypes() {
        return repo.findAll().stream().map(ClinicFinance::getType).distinct().collect(Collectors.toList());
    }

    @Override
    public List<String> getAllVendors() {
        return repo.findAll().stream().map(ClinicFinance::getVendorName).distinct().collect(Collectors.toList());
    }

    @Override
    public Map<String, BigDecimal> getCategoryWiseExpenses(LocalDate startDate, LocalDate endDate) {
        return getTransactionsByDateRange(startDate,endDate).stream()
                .filter(t -> "EXPENSE".equals(t.getCategory()))
                .collect(Collectors.groupingBy(ClinicFinance::getType,
                        Collectors.reducing(BigDecimal.ZERO, ClinicFinance::getAmount, BigDecimal::add)));
    }

    @Override
    public Map<String, Object> getMonthlyFinancialTrend(int year) {
        Map<String,Object> map = new HashMap<>();
        map.put("months", List.of("Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"));
        return map;
    }

    @Override
    public List<ClinicFinance> createBulkTransactions(List<ClinicFinance> transactions) {
        transactions.forEach(t -> { t.setCreatedAt(LocalDateTime.now()); t.setUpdatedAt(LocalDateTime.now()); });
        return repo.saveAll(transactions);
    }

    @Override
    public ClinicFinance updateTransactionStatus(String id, String status) {
        ClinicFinance txn = getTransactionById(id);
        txn.setStatus(status);
        txn.setUpdatedAt(LocalDateTime.now());
        return repo.save(txn);
    }
}
