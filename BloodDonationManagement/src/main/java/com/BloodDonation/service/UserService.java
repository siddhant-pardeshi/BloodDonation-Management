package com.BloodDonation.service;

import com.BloodDonation.enums.BloodGroup;
import com.BloodDonation.enums.Role;
import com.BloodDonation.model.User;
import com.BloodDonation.repository.UserRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Optional;

/**
 * Service layer for User-related business logic.
 * Handles registration, login validation, donor eligibility, and more.
 *
 * NOTE: Passwords are stored and compared in plain text for simplicity.
 * This is a fresher-grade project — in production you would hash passwords.
 */
@Service
public class UserService {

    private final UserRepository userRepository;
    private final BloodInventoryService bloodInventoryService;

    // How many days a donor must wait between donations (default: 90)
    @Value("${app.donation.eligibility.days:90}")
    private int eligibilityDays;

    public UserService(UserRepository userRepository, BloodInventoryService bloodInventoryService) {
        this.userRepository = userRepository;
        this.bloodInventoryService = bloodInventoryService;
    }

    // ========== Registration ==========

    /**
     * Register a brand-new user (Donor, Receiver, or Admin).
     * Throws an exception if the email is already taken.
     */
    @Transactional
    public User registerUser(User user) {
        if (userRepository.existsByEmail(user.getEmail())) {
            throw new RuntimeException("Email already registered: " + user.getEmail());
        }
        if (user.getRole() == Role.DONOR && user.getBloodGroup() == null) {
            throw new RuntimeException("Blood group is required for donors");
        }
        return userRepository.save(user);
    }

    // ========== Login ==========

    /**
     * Validate login credentials.
     * Returns the User if email + password match, otherwise throws an exception.
     */
    public User login(String email, String password, String role) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Invalid email or password"));

        // Simple plain-text password check (fresher level)
        if (!user.getPassword().equals(password)) {
            throw new RuntimeException("Invalid email or password");
        }

        if (role != null && !user.getRole().name().equals(role)) {
            throw new RuntimeException("Invalid role selected");
        }
        return user;
    }

    /**
     * Find a user by email. Used to look up the logged-in user.
     */
    public Optional<User> findByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    // ========== Basic CRUD ==========

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public User getUserById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found with ID: " + id));
    }

    public List<User> getAllDonors() {
        return userRepository.findByRole(Role.DONOR);
    }

    @Transactional
    public User createUser(User user) {
        return userRepository.save(user);
    }

    @Transactional
    public User registerDonor(User user) {
        user.setRole(Role.DONOR);
        return userRepository.save(user);
    }

    // ========== Donor Eligibility ==========

    /**
     * Check if a donor is eligible to donate based on their last donation date.
     * A donor must wait at least 90 days since their last donation.
     *
     * @param donor the donor to check eligibility for
     * @return true if eligible, false otherwise
     */
    public boolean isEligibleToDonate(User donor) {
        if (donor.getLastDonationDate() == null) {
            return true; // Never donated before
        }
        long daysSinceLastDonation = ChronoUnit.DAYS.between(
                donor.getLastDonationDate(), LocalDate.now()
        );
        return daysSinceLastDonation >= eligibilityDays;
    }

    /**
     * Update a donor's last donation date to today and save it.
     */
    @Transactional
    public User recordDonation(Long donorId) {
        User donor = getUserById(donorId);
        if (!isEligibleToDonate(donor)) {
            throw new RuntimeException("Donor is not eligible to donate. "
                    + "Must wait at least " + eligibilityDays + " days since last donation.");
        }
        donor.setLastDonationDate(LocalDate.now());

        // Add 1 unit of the donor's blood group to inventory
        if (donor.getBloodGroup() != null) {
            bloodInventoryService.addUnits(donor.getBloodGroup(), 1);
        }

        return userRepository.save(donor);
    }

    // ========== Queries ==========

    public List<User> getDonorsByBloodGroup(BloodGroup bloodGroup) {
        return userRepository.findByBloodGroup(bloodGroup);
    }

    public long countDonors() {
        return userRepository.countByRole(Role.DONOR);
    }

    @Transactional
    public void deleteUser(Long id) {
        userRepository.deleteById(id);
    }
}
