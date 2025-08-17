package com.navident.clinic.service;

import com.navident.clinic.model.Bill;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import java.util.List;

public interface BillService {
    Bill createBill(Bill bill);
    Bill getBillById(String id);
    List<Bill> searchBills(String query);
    Bill updateBill(String id, Bill bill);
    void deleteBill(String id);

    byte[] exportBillsExcel(String patientId);
    byte[] generateBillPdf(String id);

    Page<Bill> getAllBills(Pageable pageable);
    List<Bill> getAllBills();
    List<Bill> getBillsByPatientId(String patientId);
    List<Bill> getBillsByDentistId(String dentistId);
    List<Bill> getBillsByStatus(String status);
    List<Bill> getPendingBills();
    List<Bill> getOverdueBills();
}
