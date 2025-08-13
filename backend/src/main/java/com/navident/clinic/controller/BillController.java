package com.navident.clinic.controller;

import com.navident.clinic.model.Bill;
import com.navident.clinic.model.dto.BillDto;
import com.navident.clinic.service.BillService;
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
@RequestMapping("/api/bills")
@RequiredArgsConstructor
@Validated
@Slf4j
@PreAuthorize("hasAnyRole('ADMINISTRATOR','CHIEF_DENTIST','CLINIC_ASSISTANT','PRINTING_ONLY')")
public class BillController {

    private final BillService billService;
    private final ModelMapper mapper;

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMINISTRATOR','CHIEF_DENTIST','CLINIC_ASSISTANT')")
    public ResponseEntity<BillDto> create(@Valid @RequestBody BillDto dto) {
        Bill saved = billService.createBill(mapper.map(dto, Bill.class));
        return ResponseEntity.status(HttpStatus.CREATED).body(mapper.map(saved, BillDto.class));
    }

    @GetMapping("/{id}")
    public ResponseEntity<BillDto> get(@PathVariable String id) {
        return ResponseEntity.ok(mapper.map(billService.getBillById(id), BillDto.class));
    }

    @GetMapping
    public Page<BillDto> list(@RequestParam(defaultValue = "0") int page,
                              @RequestParam(defaultValue = "10") int size,
                              @RequestParam(defaultValue = "billDate") String sortBy,
                              @RequestParam(defaultValue = "desc") String sortDir) {
        Sort sort = sortDir.equalsIgnoreCase("desc") ? Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
        return billService.getAllBills(PageRequest.of(page, size, sort)).map(b -> mapper.map(b, BillDto.class));
    }

    @GetMapping("/search")
    public List<BillDto> search(@RequestParam String query) {
        return billService.searchBills(query).stream().map(b -> mapper.map(b, BillDto.class)).collect(Collectors.toList());
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMINISTRATOR','CHIEF_DENTIST','CLINIC_ASSISTANT')")
    public ResponseEntity<BillDto> update(@PathVariable String id, @Valid @RequestBody BillDto dto) {
        return ResponseEntity.ok(mapper.map(billService.updateBill(id, mapper.map(dto, Bill.class)), BillDto.class));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMINISTRATOR','CHIEF_DENTIST')")
    public ResponseEntity<Void> delete(@PathVariable String id) {
        billService.deleteBill(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}/pdf")
    public ResponseEntity<byte[]> pdf(@PathVariable String id) {
        byte[] pdf = billService.generateBillPdf(id);
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=bill-" + id + ".pdf")
                .contentType(MediaType.APPLICATION_PDF).body(pdf);
    }

    @GetMapping("/patient/{patientId}/export/excel")
    public ResponseEntity<byte[]> exportForPatient(@PathVariable String patientId) {
        byte[] excel = billService.exportBillsExcel(patientId);
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=patient-bills-" + patientId + ".xlsx")
                .contentType(MediaType.APPLICATION_OCTET_STREAM).body(excel);
    }
}
