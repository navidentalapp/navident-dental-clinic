package com.navident.clinic.controller;

import com.navident.clinic.model.ConsultantDentist;
import com.navident.clinic.model.dto.DentistDto;
import com.navident.clinic.service.DentistService;
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
@RequestMapping("/api/dentists")
@RequiredArgsConstructor
@Validated
@Slf4j
@PreAuthorize("hasAnyRole('ADMINISTRATOR','CHIEF_DENTIST','CLINIC_ASSISTANT','PRINTING_ONLY')")
public class DentistController {

    private final DentistService dentistService;
    private final ModelMapper mapper;

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMINISTRATOR','CHIEF_DENTIST')")
    public ResponseEntity<DentistDto> create(@Valid @RequestBody DentistDto dto) {
        ConsultantDentist entity = mapper.map(dto, ConsultantDentist.class);
        ConsultantDentist saved = dentistService.createDentist(entity);
        return ResponseEntity.status(HttpStatus.CREATED).body(mapper.map(saved, DentistDto.class));
    }

    @GetMapping("/{id}")
    public ResponseEntity<DentistDto> get(@PathVariable String id) {
        ConsultantDentist dentist = dentistService.getDentistById(id);
        return ResponseEntity.ok(mapper.map(dentist, DentistDto.class));
    }

    @GetMapping
    public ResponseEntity<Page<DentistDto>> list(@RequestParam(defaultValue = "0") int page,
                                                 @RequestParam(defaultValue = "10") int size,
                                                 @RequestParam(defaultValue = "createdAt") String sortBy,
                                                 @RequestParam(defaultValue = "desc") String sortDir) {
        Sort sort = sortDir.equalsIgnoreCase("desc") ? Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
        Page<ConsultantDentist> result = dentistService.getAllDentists(PageRequest.of(page, size, sort));
        return ResponseEntity.ok(result.map(d -> mapper.map(d, DentistDto.class)));
    }

    @GetMapping("/search")
    public List<DentistDto> search(@RequestParam String query) {
        return dentistService.searchDentists(query)
                .stream().map(d -> mapper.map(d, DentistDto.class)).collect(Collectors.toList());
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMINISTRATOR','CHIEF_DENTIST')")
    public ResponseEntity<DentistDto> update(@PathVariable String id, @Valid @RequestBody DentistDto dto) {
        ConsultantDentist entity = mapper.map(dto, ConsultantDentist.class);
        ConsultantDentist updated = dentistService.updateDentist(id, entity);
        return ResponseEntity.ok(mapper.map(updated, DentistDto.class));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMINISTRATOR','CHIEF_DENTIST')")
    public ResponseEntity<Void> delete(@PathVariable String id) {
        dentistService.deleteDentist(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/active")
    public List<DentistDto> getActiveDentists() {
        return dentistService.getActiveDentists()
                .stream().map(d -> mapper.map(d, DentistDto.class)).collect(Collectors.toList());
    }

    @GetMapping("/{id}/pdf")
    public ResponseEntity<byte[]> pdf(@PathVariable String id) {
        ConsultantDentist dentist = dentistService.getDentistById(id);
        byte[] pdf = PdfUtil.generateDentistPdf(dentist);
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=dentist-" + id + ".pdf")
                .contentType(MediaType.APPLICATION_PDF).body(pdf);
    }

    @GetMapping("/export/excel")
    public ResponseEntity<byte[]> exportExcel() {
        byte[] excelBytes = ExcelUtil.dentistsToExcel(dentistService.getAllDentists());
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=dentists.xlsx")
                .contentType(MediaType.APPLICATION_OCTET_STREAM)
                .body(excelBytes);
    }
}
