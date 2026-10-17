package com.BloodDonation.controller;

import com.BloodDonation.model.User;
import com.BloodDonation.service.UserService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * REST Controller for managing Donors and Users.
 * Base path: /api/v1/donors
 */
@RestController
@RequestMapping("/api/v1/donors")
@CrossOrigin(origins = "${app.cors.allowed-origins}")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    /**
     * GET /api/v1/donors — Fetch all donors.
     */
    @GetMapping
    public ResponseEntity<List<User>> getAllDonors() {
        return ResponseEntity.ok(userService.getAllDonors());
    }

    /**
     * GET /api/v1/donors/{id} — Fetch a donor by ID.
     */
    @GetMapping("/{id}")
    public ResponseEntity<User> getDonorById(@PathVariable Long id) {
        return ResponseEntity.ok(userService.getUserById(id));
    }

    /**
     * POST /api/v1/donors — Register a new donor.
     */
    @PostMapping
    public ResponseEntity<User> registerDonor(@Valid @RequestBody User user) {
        User createdDonor = userService.registerDonor(user);
        return new ResponseEntity<>(createdDonor, HttpStatus.CREATED);
    }

    /**
     * PUT /api/v1/donors/{id} — Update an existing donor.
     */
    @PutMapping("/{id}")
    public ResponseEntity<User> updateDonor(@PathVariable Long id, @Valid @RequestBody User user) {
        User existingUser = userService.getUserById(id);
        existingUser.setName(user.getName());
        existingUser.setEmail(user.getEmail());
        existingUser.setBloodGroup(user.getBloodGroup());
        if (user.getPassword() != null && !user.getPassword().isBlank()) {
            existingUser.setPassword(user.getPassword());
        }
        return ResponseEntity.ok(userService.createUser(existingUser));
    }

    /**
     * DELETE /api/v1/donors/{id} — Delete a donor.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteDonor(@PathVariable Long id) {
        userService.deleteUser(id);
        return ResponseEntity.noContent().build();
    }

    /**
     * GET /api/v1/donors/{id}/eligibility — Check if a donor is eligible to donate.
     */
    @GetMapping("/{id}/eligibility")
    public ResponseEntity<Map<String, Object>> checkEligibility(@PathVariable Long id) {
        User donor = userService.getUserById(id);
        boolean eligible = userService.isEligibleToDonate(donor);
        return ResponseEntity.ok(Map.of(
                "donorId", id,
                "eligible", eligible,
                "lastDonationDate", donor.getLastDonationDate() != null
                        ? donor.getLastDonationDate().toString() : "Never donated"
        ));
    }

    /**
     * POST /api/v1/donors/{id}/donate — Record a donation for a donor.
     */
    @PostMapping("/{id}/donate")
    public ResponseEntity<User> recordDonation(@PathVariable Long id) {
        return ResponseEntity.ok(userService.recordDonation(id));
    }

    /**
     * GET /api/v1/donors/count — Get the total number of donors.
     */
    @GetMapping("/count")
    public ResponseEntity<Map<String, Long>> getDonorCount() {
        return ResponseEntity.ok(Map.of("totalDonors", userService.countDonors()));
    }
}
