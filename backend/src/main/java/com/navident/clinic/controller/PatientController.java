package com.navident.clinic.controller;

import com.navident.clinic.model.Patient;
import com.navident.clinic.model.dto.PatientDto;
import com.navident.clinic.service.PatientService;
import com.navident.clinic.util.ExcelUtil;
import com.navident.clinic.util.PdfUtil;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.*;
import org.springframework.http.*;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/patients")
@RequiredArgsConstructor
@Validated
@Slf4j
@PreAuthorize("hasAnyRole('ADMINISTRATOR','CHIEF_DENTIST','CLINIC_ASSISTANT','PRINTING_ONLY')")
public class PatientController {

    private final PatientService patientService;
    private final ModelMapper mapper;

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMINISTRATOR','CHIEF_DENTIST','CLINIC_ASSISTANT')")
    public ResponseEntity<PatientDto> create(@Valid @RequestBody PatientDto dto) {
        Patient entity = mapper.map(dto, Patient.class);
        Patient saved = patientService.createPatient(entity);
        return ResponseEntity.status(HttpStatus.CREATED).body(mapper.map(saved, PatientDto.class));
    }

    @GetMapping("/{id}")
    public ResponseEntity<PatientDto> get(@PathVariable String id) {
        Patient patient = patientService.getPatientById(id);
        return ResponseEntity.ok(mapper.map(patient, PatientDto.class));
    }

    @GetMapping
    public ResponseEntity<Page<PatientDto>> list(@RequestParam(defaultValue = "0") int page,
                                                 @RequestParam(defaultValue = "10") int size,
                                                 @RequestParam(defaultValue = "createdAt") String sortBy,
                                                 @RequestParam(defaultValue = "desc") String sortDir) {
        Sort sort = sortDir.equalsIgnoreCase("desc") ? Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
        Page<Patient> result = patientService.getAllPatients(PageRequest.of(page, size, sort));
        return ResponseEntity.ok(result.map(p -> mapper.map(p, PatientDto.class)));
    }

    @GetMapping("/search")
    public List<PatientDto> search(@RequestParam String query) {
        return patientService.searchPatients(query)
                .stream().map(p -> mapper.map(p, PatientDto.class)).collect(Collectors.toList());
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMINISTRATOR','CHIEF_DENTIST','CLINIC_ASSISTANT')")
    public ResponseEntity<PatientDto> update(@PathVariable String id, @Valid @RequestBody PatientDto dto) {
        Patient entity = mapper.map(dto, Patient.class);
        Patient updated = patientService.updatePatient(id, entity);
        return ResponseEntity.ok(mapper.map(updated, PatientDto.class));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMINISTRATOR','CHIEF_DENTIST')")
    public ResponseEntity<Void> delete(@PathVariable String id) {
        patientService.deletePatient(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}/pdf")
    public ResponseEntity<byte[]> pdf(@PathVariable String id) {
        Patient patient = patientService.getPatientById(id);
        byte[] pdf = PdfUtil.generatePatientPdf(patient);
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=patient-" + id + ".pdf")
                .contentType(MediaType.APPLICATION_PDF).body(pdf);
    }

    @GetMapping("/export/excel")
    public ResponseEntity<byte[]> exportExcel() {
        byte[] excelBytes = ExcelUtil.patientsToExcel(patientService.getAllPatients());
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=patients.xlsx")
                .contentType(MediaType.APPLICATION_OCTET_STREAM)
                .body(excelBytes);
    }
}
