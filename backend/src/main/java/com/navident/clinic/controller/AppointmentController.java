package com.navident.clinic.controller;

import com.navident.clinic.model.Appointment;
import com.navident.clinic.model.dto.AppointmentDto;
import com.navident.clinic.service.AppointmentService;
import com.navident.clinic.util.ExcelUtil;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.*;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/appointments")
@RequiredArgsConstructor
@Validated
@Slf4j
@PreAuthorize("hasAnyRole('ADMINISTRATOR','CHIEF_DENTIST','CLINIC_ASSISTANT','PRINTING_ONLY')")
public class AppointmentController {

    private final AppointmentService appointmentService;
    private final ModelMapper mapper;

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMINISTRATOR','CHIEF_DENTIST','CLINIC_ASSISTANT')")
    public ResponseEntity<AppointmentDto> createAppointment(@Valid @RequestBody AppointmentDto dto) {
        log.info("Creating appointment for patient: {}", dto.getPatientName());
        Appointment entity = mapper.map(dto, Appointment.class);
        Appointment saved = appointmentService.createAppointment(entity);
        return ResponseEntity.status(HttpStatus.CREATED).body(mapper.map(saved, AppointmentDto.class));
    }

    @GetMapping("/{id}")
    public ResponseEntity<AppointmentDto> getAppointmentById(@PathVariable String id) {
        log.info("Fetching appointment ID {}", id);
        Appointment appt = appointmentService.getAppointmentById(id);
        return ResponseEntity.ok(mapper.map(appt, AppointmentDto.class));
    }

    @GetMapping
    public ResponseEntity<Page<AppointmentDto>> getAppointments(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "appointmentDate") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir) {

        log.info("Listing appointments page {} size {}", page, size);
        Sort sort = sortDir.equalsIgnoreCase("desc")
                ? Sort.by(sortBy).descending()
                : Sort.by(sortBy).ascending();

        Page<Appointment> result = appointmentService.getAllAppointments(PageRequest.of(page, size, sort));
        return ResponseEntity.ok(result.map(a -> mapper.map(a, AppointmentDto.class)));
    }

    @GetMapping("/search")
    public ResponseEntity<List<AppointmentDto>> searchAppointments(@RequestParam String query) {
        log.info("Searching appointments with query: {}", query);
        List<AppointmentDto> list = appointmentService.searchAppointments(query)
                .stream().map(a -> mapper.map(a, AppointmentDto.class)).collect(Collectors.toList());
        return ResponseEntity.ok(list);
    }

    @GetMapping("/date/{date}")
    public ResponseEntity<List<AppointmentDto>> getByDate(
            @PathVariable @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        log.info("Listing appointments for date: {}", date);
        List<AppointmentDto> list = appointmentService.listAppointmentsByDate(date)
                .stream().map(a -> mapper.map(a, AppointmentDto.class)).collect(Collectors.toList());
        return ResponseEntity.ok(list);
    }

    @GetMapping("/today")
    public ResponseEntity<List<AppointmentDto>> getToday() {
        log.info("Listing today's appointments");
        List<AppointmentDto> list = appointmentService.getTodayAppointments()
                .stream().map(a -> mapper.map(a, AppointmentDto.class)).collect(Collectors.toList());
        return ResponseEntity.ok(list);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMINISTRATOR','CHIEF_DENTIST','CLINIC_ASSISTANT')")
    public ResponseEntity<AppointmentDto> updateAppointment(
            @PathVariable String id,
            @Valid @RequestBody AppointmentDto dto) {
        log.info("Updating appointment ID {}", id);
        Appointment entity = mapper.map(dto, Appointment.class);
        Appointment updated = appointmentService.updateAppointment(id, entity);
        return ResponseEntity.ok(mapper.map(updated, AppointmentDto.class));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMINISTRATOR','CHIEF_DENTIST')")
    public ResponseEntity<Void> deleteAppointment(@PathVariable String id) {
        log.info("Deleting appointment ID {}", id);
        appointmentService.deleteAppointment(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/export/excel")
    public ResponseEntity<byte[]> exportExcel(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {

        log.info("Exporting appointments from {} to {}", startDate, endDate);
        byte[] file = appointmentService.exportAppointmentsExcel(startDate, endDate);
        HttpHeaders headers = new HttpHeaders();
        headers.setContentDisposition(ContentDisposition.builder("attachment")
                .filename("appointments-" + startDate + "_to_" + endDate + ".xlsx")
                .build());
        headers.setContentType(MediaType.APPLICATION_OCTET_STREAM);
        return ResponseEntity.ok().headers(headers).body(file);
    }
}
