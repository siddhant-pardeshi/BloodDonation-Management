package com.BloodDonation.controller;

import com.BloodDonation.model.BloodRequest;
import com.BloodDonation.service.BloodRequestService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * REST Controller for managing Blood Requests and Donation Camps.
 * Base path: /api/v1/requests
 */
@RestController
@RequestMapping("/api/v1/requests")
@CrossOrigin(origins = "${app.cors.allowed-origins}")
public class BloodRequestController {

    private final BloodRequestService bloodRequestService;

    public BloodRequestController(BloodRequestService bloodRequestService) {
        this.bloodRequestService = bloodRequestService;
    }

    /**
     * GET /api/v1/requests — Fetch all blood requests.
     */
    @GetMapping
    public ResponseEntity<List<BloodRequest>> getAllRequests() {
        return ResponseEntity.ok(bloodRequestService.getAllRequests());
    }

    /**
     * GET /api/v1/requests/pending — Fetch all PENDING blood requests.
     */
    @GetMapping("/pending")
    public ResponseEntity<List<BloodRequest>> getPendingRequests() {
        return ResponseEntity.ok(bloodRequestService.getPendingRequests());
    }

    /**
     * GET /api/v1/requests/receiver/{receiverId} — Fetch requests for a specific receiver.
     */
    @GetMapping("/receiver/{receiverId}")
    public ResponseEntity<List<BloodRequest>> getRequestsByReceiver(@PathVariable Long receiverId) {
        return ResponseEntity.ok(bloodRequestService.getRequestsByReceiver(receiverId));
    }

    /**
     * GET /api/v1/requests/{id} — Fetch a request by ID.
     */
    @GetMapping("/{id}")
    public ResponseEntity<BloodRequest> getRequestById(@PathVariable Long id) {
        return ResponseEntity.ok(bloodRequestService.getRequestById(id));
    }

    /**
     * POST /api/v1/requests — Create a new blood request.
     */
    @PostMapping
    public ResponseEntity<BloodRequest> createRequest(@Valid @RequestBody BloodRequest request) {
        BloodRequest created = bloodRequestService.createRequest(request);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    /**
     * PUT /api/v1/requests/{id}/approve — Approve a pending request.
     */
    @PutMapping("/{id}/approve")
    public ResponseEntity<BloodRequest> approveRequest(@PathVariable Long id) {
        return ResponseEntity.ok(bloodRequestService.approveRequest(id));
    }

    /**
     * PUT /api/v1/requests/{id}/fulfill — Fulfill an approved request.
     */
    @PutMapping("/{id}/fulfill")
    public ResponseEntity<BloodRequest> fulfillRequest(@PathVariable Long id) {
        return ResponseEntity.ok(bloodRequestService.fulfillRequest(id));
    }

    /**
     * DELETE /api/v1/requests/{id} — Delete a blood request.
     * Enforces that only the owner or an admin can delete it.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteRequest(@PathVariable Long id, @RequestParam Long userId) {
        bloodRequestService.deleteRequest(id, userId);
        return ResponseEntity.noContent().build();
    }

    /**
     * GET /api/v1/requests/count/pending — Count pending requests.
     */
    @GetMapping("/count/pending")
    public ResponseEntity<Map<String, Long>> getPendingCount() {
        return ResponseEntity.ok(Map.of(
                "pendingRequests", bloodRequestService.countPendingRequests()
        ));
    }
}
