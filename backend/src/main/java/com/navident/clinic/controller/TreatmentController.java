package com.navident.clinic.controller;

import com.navident.clinic.model.Treatment;
import com.navident.clinic.model.dto.TreatmentDto;
import com.navident.clinic.service.TreatmentService;
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
@RequestMapping("/api/treatments")
@RequiredArgsConstructor
@Slf4j
@PreAuthorize("hasAnyRole('ADMINISTRATOR','CHIEF_DENTIST')")
public class TreatmentController {

    private final TreatmentService treatmentService;
    private final ModelMapper mapper;

    @PostMapping
    public ResponseEntity<TreatmentDto> create(@Valid @RequestBody TreatmentDto dto) {
        Treatment saved = treatmentService.createTreatment(mapper.map(dto, Treatment.class));
        return ResponseEntity.status(HttpStatus.CREATED).body(mapper.map(saved, TreatmentDto.class));
    }

    @GetMapping("/{id}")
    public ResponseEntity<TreatmentDto> get(@PathVariable String id) {
        return ResponseEntity.ok(mapper.map(treatmentService.getTreatmentById(id), TreatmentDto.class));
    }

    @GetMapping
    public Page<TreatmentDto> list(@RequestParam(defaultValue = "0") int page,
                                   @RequestParam(defaultValue = "10") int size,
                                   @RequestParam(defaultValue = "treatmentName") String sortBy,
                                   @RequestParam(defaultValue = "asc") String sortDir) {
        Sort sort = sortDir.equalsIgnoreCase("desc") ? Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
        return treatmentService.getAllTreatments(PageRequest.of(page, size, sort))
                .map(t -> mapper.map(t, TreatmentDto.class));
    }

    @GetMapping("/search")
    public List<TreatmentDto> search(@RequestParam String query) {
        return treatmentService.searchTreatments(query).stream().map(t -> mapper.map(t, TreatmentDto.class)).collect(Collectors.toList());
    }

    @GetMapping("/active")
    public List<TreatmentDto> active() {
        return treatmentService.listActiveTreatments().stream().map(t -> mapper.map(t, TreatmentDto.class)).collect(Collectors.toList());
    }

    @PutMapping("/{id}")
    public ResponseEntity<TreatmentDto> update(@PathVariable String id, @Valid @RequestBody TreatmentDto dto) {
        return ResponseEntity.ok(mapper.map(treatmentService.updateTreatment(id, mapper.map(dto, Treatment.class)), TreatmentDto.class));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable String id) {
        treatmentService.deleteTreatment(id);
        return ResponseEntity.noContent().build();
    }
}
