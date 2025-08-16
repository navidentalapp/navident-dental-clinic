package com.navident.clinic.repository;

import com.navident.clinic.model.Bill;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.time.LocalDate;
import java.util.List;

public interface BillRepository extends MongoRepository<Bill, String> {
    List<Bill> findByPatientNameContainingIgnoreCaseOrBillIdContainingIgnoreCase(String patientName, String billId);
    List<Bill> findByPatientId(String patientId);
    List<Bill> findByDentistId(String dentistId);
    List<Bill> findByPaymentStatus(String status);
    List<Bill> findByDueDateBeforeAndPaymentStatusNot(LocalDate date, String notStatus);
}
