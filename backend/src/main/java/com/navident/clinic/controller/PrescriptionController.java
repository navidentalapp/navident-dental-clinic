package com.navident.clinic.controller;

import com.navident.clinic.model.Prescription;
import com.navident.clinic.model.dto.PrescriptionDto;
import com.navident.clinic.service.PrescriptionService;
import com.navident.clinic.util.ExcelUtil;
import com.navident.clinic.util.PdfUtil;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.*;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.*;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/prescriptions")
@RequiredArgsConstructor
@Slf4j
@PreAuthorize("hasAnyRole('ADMINISTRATOR','CHIEF_DENTIST','CLINIC_ASSISTANT','PRINTING_ONLY')")
public class PrescriptionController {

    private final PrescriptionService prescriptionService;
    private final ModelMapper mapper;

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMINISTRATOR','CHIEF_DENTIST')")
    public ResponseEntity<PrescriptionDto> create(@Valid @RequestBody PrescriptionDto dto) {
        Prescription saved = prescriptionService.createPrescription(mapper.map(dto, Prescription.class));
        return ResponseEntity.status(HttpStatus.CREATED).body(mapper.map(saved, PrescriptionDto.class));
    }

    @GetMapping("/{id}")
    public ResponseEntity<PrescriptionDto> get(@PathVariable String id) {
        return ResponseEntity.ok(mapper.map(prescriptionService.getPrescriptionById(id), PrescriptionDto.class));
    }

    @GetMapping
    public Page<PrescriptionDto> list(@RequestParam(defaultValue = "0") int page,
                                      @RequestParam(defaultValue = "10") int size,
                                      @RequestParam(defaultValue = "prescriptionDate") String sortBy,
                                      @RequestParam(defaultValue = "desc") String sortDir) {
        Sort sort = sortDir.equalsIgnoreCase("desc") ? Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
        return prescriptionService.getAllPrescriptions(PageRequest.of(page, size, sort)).map(p -> mapper.map(p, PrescriptionDto.class));
    }

    @GetMapping("/search")
    public List<PrescriptionDto> search(@RequestParam String query) {
        return prescriptionService.searchPrescriptions(query).stream().map(p -> mapper.map(p, PrescriptionDto.class)).collect(Collectors.toList());
    }

    @GetMapping("/patient/{patientId}")
    public List<PrescriptionDto> byPatient(@PathVariable String patientId) {
        return prescriptionService.getPrescriptionsByPatientId(patientId).stream().map(p -> mapper.map(p, PrescriptionDto.class)).collect(Collectors.toList());
    }

    @PutMapping("/{id}")
    public ResponseEntity<PrescriptionDto> update(@PathVariable String id, @Valid @RequestBody PrescriptionDto dto) {
        return ResponseEntity.ok(mapper.map(prescriptionService.updatePrescription(id, mapper.map(dto, Prescription.class)), PrescriptionDto.class));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable String id) {
        prescriptionService.deletePrescription(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}/pdf")
    public ResponseEntity<byte[]> pdf(@PathVariable String id) {
        byte[] pdf = prescriptionService.generatePrescriptionPdf(id);
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=prescription-" + id + ".pdf")
                .contentType(MediaType.APPLICATION_PDF).body(pdf);
    }

    @GetMapping("/export/excel")
    public ResponseEntity<byte[]> exportExcel(@RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate start,
                                              @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate end) {
        byte[] excel = prescriptionService.exportAllPrescriptionsExcel(start, end);
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=prescriptions.xlsx")
                .contentType(MediaType.APPLICATION_OCTET_STREAM)
                .body(excel);
    }
}
