package com.BloodDonation.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import com.BloodDonation.enums.BloodGroup;
import java.time.LocalDateTime;

/**
 * JPA Entity representing the blood inventory for a specific blood group.
 */
@Entity
@Table(name = "blood_inventory", uniqueConstraints = {
    @UniqueConstraint(columnNames = "blood_group")
})
public class BloodInventory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    @NotNull(message = "Blood group is required")
    @Column(name = "blood_group", nullable = false, unique = true)
    private BloodGroup bloodGroup;

    @Min(value = 0, message = "Units available cannot be negative")
    @Column(name = "units_available", nullable = false)
    private Integer unitsAvailable = 0;

    @Column(name = "last_updated", nullable = false)
    private LocalDateTime lastUpdated;

    // ========== Constructors ==========

    public BloodInventory() {}

    public BloodInventory(BloodGroup bloodGroup, Integer unitsAvailable) {
        this.bloodGroup = bloodGroup;
        this.unitsAvailable = unitsAvailable;
        this.lastUpdated = LocalDateTime.now();
    }

    // ========== Getters and Setters ==========

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public BloodGroup getBloodGroup() {
        return bloodGroup;
    }

    public void setBloodGroup(BloodGroup bloodGroup) {
        this.bloodGroup = bloodGroup;
    }

    public Integer getUnitsAvailable() {
        return unitsAvailable;
    }

    public void setUnitsAvailable(Integer unitsAvailable) {
        this.unitsAvailable = unitsAvailable;
    }

    public LocalDateTime getLastUpdated() {
        return lastUpdated;
    }

    public void setLastUpdated(LocalDateTime lastUpdated) {
        this.lastUpdated = lastUpdated;
    }
}
