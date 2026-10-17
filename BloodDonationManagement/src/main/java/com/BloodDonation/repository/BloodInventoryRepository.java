package com.BloodDonation.repository;

import com.BloodDonation.enums.BloodGroup;
import com.BloodDonation.model.BloodInventory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface BloodInventoryRepository extends JpaRepository<BloodInventory, Long> {

    Optional<BloodInventory> findByBloodGroup(BloodGroup bloodGroup);
}
