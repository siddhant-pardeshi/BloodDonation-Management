package com.BloodDonation.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;

/**
 * JPA Entity representing a blood donation camp event.
 */
@Entity
@Table(name = "donation_camps")
public class DonationCamp {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Camp name is required")
    @Column(name = "camp_name", nullable = false)
    private String campName;

    @NotBlank(message = "Location is required")
    @Column(nullable = false)
    private String location;

    @NotNull(message = "Camp date is required")
    @Column(nullable = false)
    private LocalDate date;

    @NotBlank(message = "Organizer is required")
    @Column(nullable = false)
    private String organizer;

    // ========== Constructors ==========

    public DonationCamp() {}

    public DonationCamp(String campName, String location, LocalDate date, String organizer) {
        this.campName = campName;
        this.location = location;
        this.date = date;
        this.organizer = organizer;
    }

    // ========== Getters and Setters ==========

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getCampName() {
        return campName;
    }

    public void setCampName(String campName) {
        this.campName = campName;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public LocalDate getDate() {
        return date;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }

    public String getOrganizer() {
        return organizer;
    }

    public void setOrganizer(String organizer) {
        this.organizer = organizer;
    }
}
