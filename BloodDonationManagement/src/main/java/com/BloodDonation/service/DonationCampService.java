package com.BloodDonation.service;

import com.BloodDonation.model.DonationCamp;
import com.BloodDonation.repository.DonationCampRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
public class DonationCampService {

    private final DonationCampRepository donationCampRepository;

    public DonationCampService(DonationCampRepository donationCampRepository) {
        this.donationCampRepository = donationCampRepository;
    }

    /**
     * Retrieve all donation camps.
     */
    public List<DonationCamp> getAllCamps() {
        return donationCampRepository.findAll();
    }

    /**
     * Retrieve upcoming donation camps (date is today or in the future).
     */
    public List<DonationCamp> getUpcomingCamps() {
        return donationCampRepository.findByDateAfter(LocalDate.now().minusDays(1));
    }

    /**
     * Create a new donation camp.
     */
    @Transactional
    public DonationCamp createCamp(DonationCamp camp) {
        return donationCampRepository.save(camp);
    }

    /**
     * Retrieve a donation camp by ID.
     */
    public DonationCamp getCampById(Long id) {
        return donationCampRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Donation camp not found with ID: " + id));
    }

    /**
     * Count the total number of active (upcoming) camps.
     */
    public long countActiveCamps() {
        return donationCampRepository.countByDateAfter(LocalDate.now().minusDays(1));
    }

    /**
     * Delete a donation camp by ID.
     */
    @Transactional
    public void deleteCamp(Long id) {
        donationCampRepository.deleteById(id);
    }
}
