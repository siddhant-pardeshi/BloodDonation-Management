package com.BloodDonation.service;

import com.BloodDonation.enums.BloodGroup;
import com.BloodDonation.model.BloodInventory;
import com.BloodDonation.repository.BloodInventoryRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class BloodInventoryService {

    private final BloodInventoryRepository bloodInventoryRepository;

    public BloodInventoryService(BloodInventoryRepository bloodInventoryRepository) {
        this.bloodInventoryRepository = bloodInventoryRepository;
    }

    /**
     * Retrieve all blood inventory records.
     */
    public List<BloodInventory> getAllInventory() {
        return bloodInventoryRepository.findAll();
    }

    /**
     * Retrieve inventory for a specific blood group.
     */
    public BloodInventory getInventoryByBloodGroup(BloodGroup bloodGroup) {
        return bloodInventoryRepository.findByBloodGroup(bloodGroup)
                .orElseThrow(() -> new RuntimeException(
                        "Inventory not found for blood group: " + bloodGroup));
    }

    /**
     * Initialize inventory for all blood groups if not already present.
     */
    @Transactional
    public void initializeInventory() {
        for (BloodGroup group : BloodGroup.values()) {
            if (bloodInventoryRepository.findByBloodGroup(group).isEmpty()) {
                BloodInventory inventory = new BloodInventory(group, 0);
                bloodInventoryRepository.save(inventory);
            }
        }
    }

    /**
     * Add units to the blood inventory after a donation is completed.
     *
     * @param bloodGroup the blood group of the donated blood
     * @param units      the number of units donated
     */
    @Transactional
    public BloodInventory addUnits(BloodGroup bloodGroup, int units) {
        BloodInventory inventory = bloodInventoryRepository
                .findByBloodGroup(bloodGroup)
                .orElseGet(() -> {
                    BloodInventory newInventory = new BloodInventory(bloodGroup, 0);
                    return bloodInventoryRepository.save(newInventory);
                });
        inventory.setUnitsAvailable(inventory.getUnitsAvailable() + units);
        inventory.setLastUpdated(LocalDateTime.now());
        return bloodInventoryRepository.save(inventory);
    }

    /**
     * Deduct units from the blood inventory when fulfilling a request.
     *
     * @param bloodGroup the blood group to deduct from
     * @param units      the number of units to deduct
     */
    @Transactional
    public BloodInventory deductUnits(BloodGroup bloodGroup, int units) {
        BloodInventory inventory = getInventoryByBloodGroup(bloodGroup);
        if (inventory.getUnitsAvailable() < units) {
            throw new RuntimeException("Insufficient units available for " + bloodGroup
                    + ". Required: " + units + ", Available: " + inventory.getUnitsAvailable());
        }
        inventory.setUnitsAvailable(inventory.getUnitsAvailable() - units);
        inventory.setLastUpdated(LocalDateTime.now());
        return bloodInventoryRepository.save(inventory);
    }

    /**
     * Get the total number of available units across all blood groups.
     */
    public long getTotalUnitsAvailable() {
        return bloodInventoryRepository.findAll().stream()
                .mapToInt(BloodInventory::getUnitsAvailable)
                .sum();
    }
}
