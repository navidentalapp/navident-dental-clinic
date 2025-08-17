package com.navident.clinic.service;

import com.navident.clinic.model.Appointment;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import java.time.LocalDate;
import java.util.List;

public interface AppointmentService {
    Appointment createAppointment(Appointment appointment);
    Appointment getAppointmentById(String id);
    List<Appointment> searchAppointments(String query);
    Appointment updateAppointment(String id, Appointment appointment);
    void deleteAppointment(String id);

    List<Appointment> listAppointmentsByDate(LocalDate date);
    byte[] exportAppointmentsExcel(LocalDate start, LocalDate end);

    Page<Appointment> getAllAppointments(Pageable pageable);
    List<Appointment> getAllAppointments();
    List<Appointment> getTodayAppointments();
    List<Appointment> getAppointmentsByPatientId(String patientId);
    List<Appointment> getAppointmentsByDentistId(String dentistId);
    List<Appointment> getAppointmentsByStatus(String status);
    List<Appointment> getUpcomingAppointments();
    List<Appointment> getCompletedAppointments();
}
