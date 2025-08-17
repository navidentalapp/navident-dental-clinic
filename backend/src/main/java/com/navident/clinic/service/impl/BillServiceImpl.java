package com.navident.clinic.service.impl;

import com.navident.clinic.exception.ResourceNotFoundException;
import com.navident.clinic.model.Bill;
import com.navident.clinic.repository.BillRepository;
import com.navident.clinic.service.BillService;
import com.navident.clinic.util.ExcelUtil;
import com.navident.clinic.util.PdfUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class BillServiceImpl implements BillService {

    private final BillRepository repo;

    @Override
    public Bill createBill(Bill bill) {
        bill.setCreatedAt(LocalDateTime.now());
        bill.setUpdatedAt(LocalDateTime.now());
        return repo.save(bill);
    }

    @Override
    public Bill getBillById(String id) {
        return repo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Bill", "id", id));
    }

    @Override
    public List<Bill> searchBills(String query) {
        return repo.findByPatientNameContainingIgnoreCaseOrBillIdContainingIgnoreCase(query, query);
    }

    @Override
    public Bill updateBill(String id, Bill bill) {
        Bill existing = getBillById(id);
        existing.setPaymentStatus(bill.getPaymentStatus());
        existing.setAmountPaid(bill.getAmountPaid());
        existing.setAmountDue(bill.getAmountDue());
        existing.setUpdatedAt(LocalDateTime.now());
        return repo.save(existing);
    }

    @Override
    public void deleteBill(String id) {
        repo.delete(getBillById(id));
    }

    @Override
    public byte[] exportBillsExcel(String patientId) {
        return ExcelUtil.billsToExcel(repo.findByPatientId(patientId));
    }

    @Override
    public byte[] generateBillPdf(String id) {
        return PdfUtil.generateBillPdf(getBillById(id));
    }

    @Override
    public Page<Bill> getAllBills(Pageable pageable) {
        return repo.findAll(pageable);
    }

    @Override
    public List<Bill> getAllBills() {
        return repo.findAll();
    }

    @Override
    public List<Bill> getBillsByPatientId(String patientId) {
        return repo.findByPatientId(patientId);
    }

    @Override
    public List<Bill> getBillsByDentistId(String dentistId) {
        return repo.findByDentistId(dentistId);
    }

    @Override
    public List<Bill> getBillsByStatus(String status) {
        return repo.findByPaymentStatus(status);
    }

    @Override
    public List<Bill> getPendingBills() {
        return repo.findByPaymentStatus("PENDING");
    }

    @Override
    public List<Bill> getOverdueBills() {
        LocalDate today = LocalDate.now();
        return repo.findByDueDateBeforeAndPaymentStatusNot(today, "PAID");
    }
}
