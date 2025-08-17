package com.navident.clinic.controller;

import com.navident.clinic.model.ClinicFinance;
import com.navident.clinic.model.dto.FinanceDto;
import com.navident.clinic.service.FinanceService;
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
@RequestMapping("/api/finance")
@RequiredArgsConstructor
@Slf4j
@PreAuthorize("hasAnyRole('ADMINISTRATOR','CHIEF_DENTIST')")
public class FinanceController {

    private final FinanceService financeService;
    private final ModelMapper mapper;

    @PostMapping
    public ResponseEntity<FinanceDto> create(@Valid @RequestBody FinanceDto dto) {
        ClinicFinance saved = financeService.createTransaction(mapper.map(dto, ClinicFinance.class));
        return ResponseEntity.status(HttpStatus.CREATED).body(mapper.map(saved, FinanceDto.class));
    }

    @GetMapping("/{id}")
    public ResponseEntity<FinanceDto> get(@PathVariable String id) {
        return ResponseEntity.ok(mapper.map(financeService.getTransactionById(id), FinanceDto.class));
    }

    @GetMapping
    public Page<FinanceDto> list(@RequestParam(defaultValue = "0") int page,
                                 @RequestParam(defaultValue = "10") int size,
                                 @RequestParam(defaultValue = "transactionDate") String sortBy,
                                 @RequestParam(defaultValue = "desc") String sortDir) {
        Sort sort = sortDir.equalsIgnoreCase("desc") ? Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
        return financeService.getAllTransactions(PageRequest.of(page, size, sort), null, null)
                .map(f -> mapper.map(f, FinanceDto.class));
    }

    @GetMapping("/search")
    public List<FinanceDto> search(@RequestParam String query) {
        return financeService.searchTransactions(query).stream().map(f -> mapper.map(f, FinanceDto.class)).collect(Collectors.toList());
    }

    @GetMapping("/export/excel")
    public ResponseEntity<byte[]> exportExcel(@RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate start,
                                              @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate end) {
        byte[] excel = financeService.exportFinanceExcel(start, end);
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=finance.xlsx")
                .contentType(MediaType.APPLICATION_OCTET_STREAM).body(excel);
    }
}
