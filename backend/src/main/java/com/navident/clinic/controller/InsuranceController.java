package com.navident.clinic.controller;

import com.navident.clinic.model.Insurance;
import com.navident.clinic.model.dto.InsuranceDto;
import com.navident.clinic.service.InsuranceService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.*;
import org.springframework.http.*;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/insurance")
@RequiredArgsConstructor
@Slf4j
@PreAuthorize("hasAnyRole('ADMINISTRATOR','CHIEF_DENTIST','CLINIC_ASSISTANT')")
public class InsuranceController {

    private final InsuranceService insuranceService;
    private final ModelMapper mapper;

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMINISTRATOR','CHIEF_DENTIST')")
    public ResponseEntity<InsuranceDto> create(@Valid @RequestBody InsuranceDto dto) {
        Insurance saved = insuranceService.createInsurance(mapper.map(dto, Insurance.class));
        return ResponseEntity.status(HttpStatus.CREATED).body(mapper.map(saved, InsuranceDto.class));
    }

    @GetMapping("/{id}")
    public ResponseEntity<InsuranceDto> get(@PathVariable String id) {
        return ResponseEntity.ok(mapper.map(insuranceService.getInsuranceById(id), InsuranceDto.class));
    }

    @GetMapping
    public Page<InsuranceDto> list(@RequestParam(defaultValue = "0") int page,
                                   @RequestParam(defaultValue = "10") int size,
                                   @RequestParam(defaultValue = "createdAt") String sortBy,
                                   @RequestParam(defaultValue = "desc") String sortDir) {
        Sort sort = sortDir.equalsIgnoreCase("desc") ? Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
        return insuranceService.getAllInsurance(PageRequest.of(page, size, sort))
                .map(i -> mapper.map(i, InsuranceDto.class));
    }

    @GetMapping("/search")
    public List<InsuranceDto> search(@RequestParam String query) {
        return insuranceService.searchInsurance(query).stream().map(i -> mapper.map(i, InsuranceDto.class)).collect(Collectors.toList());
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMINISTRATOR','CHIEF_DENTIST')")
    public ResponseEntity<InsuranceDto> update(@PathVariable String id, @Valid @RequestBody InsuranceDto dto) {
        return ResponseEntity.ok(mapper.map(insuranceService.updateInsurance(id, mapper.map(dto, Insurance.class)), InsuranceDto.class));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMINISTRATOR','CHIEF_DENTIST')")
    public ResponseEntity<Void> delete(@PathVariable String id) {
        insuranceService.deleteInsurance(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/patient/{patientId}/export/excel")
    public ResponseEntity<byte[]> exportExcel(@PathVariable String patientId) {
        byte[] excel = insuranceService.exportInsuranceExcel(patientId);
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=insurance-" + patientId + ".xlsx")
                .contentType(MediaType.APPLICATION_OCTET_STREAM).body(excel);
    }
}
