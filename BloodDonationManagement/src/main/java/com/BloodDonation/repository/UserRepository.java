package com.BloodDonation.repository;

import com.BloodDonation.enums.BloodGroup;
import com.BloodDonation.enums.Role;
import com.BloodDonation.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    // Find a user by their email — used during login
    Optional<User> findByEmail(String email);

    // Check if an email is already registered
    boolean existsByEmail(String email);

    List<User> findByRole(Role role);

    List<User> findByBloodGroup(BloodGroup bloodGroup);

    List<User> findByLastDonationDateBefore(LocalDate date);

    long countByRole(Role role);
}
