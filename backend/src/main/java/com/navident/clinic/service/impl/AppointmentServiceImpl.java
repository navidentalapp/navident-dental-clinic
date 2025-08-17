package com.navident.clinic.service.impl;

import com.navident.clinic.exception.ResourceNotFoundException;
import com.navident.clinic.model.Appointment;
import com.navident.clinic.repository.AppointmentRepository;
import com.navident.clinic.service.AppointmentService;
import com.navident.clinic.util.ExcelUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class AppointmentServiceImpl implements AppointmentService {

    private final AppointmentRepository repo;

    @Override
    public Appointment createAppointment(Appointment appointment) {
        appointment.setCreatedAt(LocalDateTime.now());
        appointment.setUpdatedAt(LocalDateTime.now());
        return repo.save(appointment);
    }

    @Override
    public Appointment getAppointmentById(String id) {
        return repo.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Appointment", "id", id));
    }

    @Override
    public List<Appointment> searchAppointments(String query) {
        return repo.findByPatientNameContainingIgnoreCaseOrDentistNameContainingIgnoreCase(query, query);
    }

    @Override
    public Appointment updateAppointment(String id, Appointment appointment) {
        Appointment existing = getAppointmentById(id);
        existing.setAppointmentDate(appointment.getAppointmentDate());
        existing.setAppointmentTime(appointment.getAppointmentTime());
        existing.setStatus(appointment.getStatus());
        existing.setNotes(appointment.getNotes());
        existing.setUpdatedAt(LocalDateTime.now());
        return repo.save(existing);
    }

    @Override
    public void deleteAppointment(String id) {
        repo.delete(getAppointmentById(id));
    }

    @Override
    public List<Appointment> listAppointmentsByDate(LocalDate date) {
        return repo.findByAppointmentDateBetween(date, date);
    }

    @Override
    public byte[] exportAppointmentsExcel(LocalDate start, LocalDate end) {
        return ExcelUtil.appointmentsToExcel(repo.findByAppointmentDateBetween(start, end));
    }

    @Override
    public Page<Appointment> getAllAppointments(Pageable pageable) {
        return repo.findAll(pageable);
    }

    @Override
    public List<Appointment> getAllAppointments() {
        return repo.findAll();
    }

    @Override
    public List<Appointment> getTodayAppointments() {
        LocalDate today = LocalDate.now();
        return repo.findByAppointmentDateBetween(today, today);
    }

    @Override
    public List<Appointment> getAppointmentsByPatientId(String patientId) {
        return repo.findByPatientId(patientId);
    }

    @Override
    public List<Appointment> getAppointmentsByDentistId(String dentistId) {
        return repo.findByDentistId(dentistId);
    }

    @Override
    public List<Appointment> getAppointmentsByStatus(String status) {
        return repo.findByStatus(status);
    }

    @Override
    public List<Appointment> getUpcomingAppointments() {
        return repo.findByAppointmentDateGreaterThanEqualAndStatusIn(
            LocalDate.now(), Arrays.asList("SCHEDULED","CONFIRMED")
        );
    }

    @Override
    public List<Appointment> getCompletedAppointments() {
        return repo.findByStatus("COMPLETED");
    }
}
