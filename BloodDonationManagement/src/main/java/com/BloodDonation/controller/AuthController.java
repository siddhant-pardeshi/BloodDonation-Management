package com.BloodDonation.controller;

import com.BloodDonation.model.User;
import com.BloodDonation.service.UserService;
import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

/**
 * REST Controller for authentication (login, register, logout, current user).
 * Uses HttpSession for session-based auth (no Spring Security needed).
 *
 * Base path: /api/v1/auth
 */
@RestController
@RequestMapping("/api/v1/auth")
@CrossOrigin(origins = "${app.cors.allowed-origins}", allowCredentials = "true")
public class AuthController {

    private final UserService userService;

    public AuthController(UserService userService) {
        this.userService = userService;
    }

    /**
     * POST /api/v1/auth/register
     * Public registration for Donors, Receivers, and Admins.
     * Request body: { name, email, password, role, bloodGroup, phone }
     */
    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody User user, HttpSession session) {
        try {
            User savedUser = userService.registerUser(user);

            // Automatically log the user in after registration
            session.setAttribute("userId", savedUser.getId());

            return new ResponseEntity<>(sanitize(savedUser), HttpStatus.CREATED);
        } catch (RuntimeException e) {
            // Email already registered, etc.
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return new ResponseEntity<>(error, HttpStatus.BAD_REQUEST);
        }
    }

    /**
     * POST /api/v1/auth/login
     * Public login endpoint. Validates email + password, starts a session.
     * Request body: { email, password }
     */
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> credentials, HttpSession session) {
        try {
            String email = credentials.get("email");
            String password = credentials.get("password");
            String role = credentials.get("role");

            User user = userService.login(email, password, role);

            // Store user ID in session so we know who's logged in
            session.setAttribute("userId", user.getId());

            return ResponseEntity.ok(sanitize(user));
        } catch (RuntimeException e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return new ResponseEntity<>(error, HttpStatus.UNAUTHORIZED);
        }
    }

    /**
     * POST /api/v1/auth/logout
     * Ends the current session.
     */
    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpSession session) {
        session.invalidate();
        Map<String, String> response = new HashMap<>();
        response.put("message", "Logged out successfully");
        return ResponseEntity.ok(response);
    }

    /**
     * GET /api/v1/auth/me
     * Returns the currently logged-in user, or 401 if no session.
     */
    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(HttpSession session) {
        Long userId = (Long) session.getAttribute("userId");

        if (userId == null) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Not logged in");
            return new ResponseEntity<>(error, HttpStatus.UNAUTHORIZED);
        }

        User user = userService.getUserById(userId);
        return ResponseEntity.ok(sanitize(user));
    }

    /**
     * Helper: returns a user object WITHOUT the password field.
     * We don't want to send passwords to the frontend.
     */
    private Map<String, Object> sanitize(User user) {
        Map<String, Object> safeUser = new HashMap<>();
        safeUser.put("id", user.getId());
        safeUser.put("name", user.getName());
        safeUser.put("email", user.getEmail());
        safeUser.put("role", user.getRole());
        safeUser.put("bloodGroup", user.getBloodGroup());
        safeUser.put("lastDonationDate", user.getLastDonationDate());
        safeUser.put("phone", user.getPhone());
        return safeUser;
    }
}
