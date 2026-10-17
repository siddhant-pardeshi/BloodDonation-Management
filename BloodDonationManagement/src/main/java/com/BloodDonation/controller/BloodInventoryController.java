package com.BloodDonation.controller;

import com.BloodDonation.model.BloodInventory;
import com.BloodDonation.service.BloodInventoryService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * REST Controller for managing Blood Inventory.
 * Base path: /api/v1/inventory
 */
@RestController
@RequestMapping("/api/v1/inventory")
@CrossOrigin(origins = "${app.cors.allowed-origins}")
public class BloodInventoryController {

    private final BloodInventoryService bloodInventoryService;

    public BloodInventoryController(BloodInventoryService bloodInventoryService) {
        this.bloodInventoryService = bloodInventoryService;
    }

    /**
     * GET /api/v1/inventory — Fetch all blood inventory records.
     */
    @GetMapping
    public ResponseEntity<List<BloodInventory>> getAllInventory() {
        return ResponseEntity.ok(bloodInventoryService.getAllInventory());
    }

    /**
     * GET /api/v1/inventory/total — Get total units available across all blood groups.
     */
    @GetMapping("/total")
    public ResponseEntity<Map<String, Long>> getTotalUnits() {
        return ResponseEntity.ok(Map.of(
                "totalUnitsAvailable", bloodInventoryService.getTotalUnitsAvailable()
        ));
    }

    /**
     * GET /api/v1/inventory/{bloodGroup} — Fetch inventory for a specific blood group.
     */
    @GetMapping("/{bloodGroup}")
    public ResponseEntity<BloodInventory> getInventoryByBloodGroup(
            @PathVariable String bloodGroup) {
        BloodInventory inventory = bloodInventoryService
                .getInventoryByBloodGroup(com.BloodDonation.enums.BloodGroup.valueOf(bloodGroup.toUpperCase()));
        return ResponseEntity.ok(inventory);
    }

    /**
     * POST /api/v1/inventory/add — Add units to a blood group (after donation).
     * Body: { "bloodGroup": "A_POSITIVE", "units": 2 }
     */
    @PostMapping("/add")
    public ResponseEntity<BloodInventory> addUnits(
            @RequestParam String bloodGroup,
            @RequestParam int units) {
        BloodInventory updated = bloodInventoryService.addUnits(
                com.BloodDonation.enums.BloodGroup.valueOf(bloodGroup.toUpperCase()), units);
        return ResponseEntity.ok(updated);
    }

    /**
     * POST /api/v1/inventory/initialize — Initialize inventory for all blood groups.
     */
    @PostMapping("/initialize")
    public ResponseEntity<String> initializeInventory() {
        bloodInventoryService.initializeInventory();
        return ResponseEntity.ok("Blood inventory initialized for all blood groups.");
    }
}
