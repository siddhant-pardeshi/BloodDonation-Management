package com.BloodDonation.controller;

import com.BloodDonation.model.DonationCamp;
import com.BloodDonation.service.DonationCampService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * REST Controller for managing Donation Camps.
 * Base path: /api/v1/camps
 */
@RestController
@RequestMapping("/api/v1/camps")
@CrossOrigin(origins = "${app.cors.allowed-origins}")
public class DonationCampController {

    private final DonationCampService donationCampService;

    public DonationCampController(DonationCampService donationCampService) {
        this.donationCampService = donationCampService;
    }

    /**
     * GET /api/v1/camps — Fetch all donation camps.
     */
    @GetMapping
    public ResponseEntity<List<DonationCamp>> getAllCamps() {
        return ResponseEntity.ok(donationCampService.getAllCamps());
    }

    /**
     * GET /api/v1/camps/upcoming — Fetch upcoming (active) donation camps.
     */
    @GetMapping("/upcoming")
    public ResponseEntity<List<DonationCamp>> getUpcomingCamps() {
        return ResponseEntity.ok(donationCampService.getUpcomingCamps());
    }

    /**
     * GET /api/v1/camps/{id} — Fetch a camp by ID.
     */
    @GetMapping("/{id}")
    public ResponseEntity<DonationCamp> getCampById(@PathVariable Long id) {
        return ResponseEntity.ok(donationCampService.getCampById(id));
    }

    /**
     * POST /api/v1/camps — Create a new donation camp.
     */
    @PostMapping
    public ResponseEntity<DonationCamp> createCamp(@Valid @RequestBody DonationCamp camp) {
        DonationCamp created = donationCampService.createCamp(camp);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    /**
     * DELETE /api/v1/camps/{id} — Delete a donation camp.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCamp(@PathVariable Long id) {
        donationCampService.deleteCamp(id);
        return ResponseEntity.noContent().build();
    }

    /**
     * GET /api/v1/camps/count/active — Count active (upcoming) camps.
     */
    @GetMapping("/count/active")
    public ResponseEntity<Map<String, Long>> getActiveCampCount() {
        return ResponseEntity.ok(Map.of(
                "activeCamps", donationCampService.countActiveCamps()
        ));
    }
}
