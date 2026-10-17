package com.BloodDonation.repository;

import com.BloodDonation.model.DonationCamp;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface DonationCampRepository extends JpaRepository<DonationCamp, Long> {

    List<DonationCamp> findByDateAfter(LocalDate date);

    long countByDateAfter(LocalDate date);
}
