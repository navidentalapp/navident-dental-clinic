package com.navident.clinic.repository;

import com.navident.clinic.model.Appointment;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.time.LocalDate;
import java.util.List;

public interface AppointmentRepository extends MongoRepository<Appointment, String> {
    List<Appointment> findByPatientNameContainingIgnoreCaseOrDentistNameContainingIgnoreCase(String patientName, String dentistName);
    List<Appointment> findByAppointmentDateBetween(LocalDate start, LocalDate end);
    List<Appointment> findByPatientId(String patientId);
    List<Appointment> findByDentistId(String dentistId);
    List<Appointment> findByStatus(String status);
    List<Appointment> findByAppointmentDateGreaterThanEqualAndStatusIn(LocalDate date, List<String> status);
}
