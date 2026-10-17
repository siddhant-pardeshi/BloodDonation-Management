package com.BloodDonation.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import com.BloodDonation.enums.BloodGroup;
import com.BloodDonation.enums.RequestStatus;
import java.time.LocalDate;

/**
 * JPA Entity representing a blood request made by a hospital.
 */
@Entity
@Table(name = "blood_requests")
public class BloodRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Hospital name is required")
    @Column(name = "hospital_name", nullable = false)
    private String hospitalName;

    @Enumerated(EnumType.STRING)
    @NotNull(message = "Blood group is required")
    @Column(name = "blood_group", nullable = false)
    private BloodGroup bloodGroup;

    @Min(value = 1, message = "Units required must be at least 1")
    @Column(name = "units_required", nullable = false)
    private Integer unitsRequired;

    @Enumerated(EnumType.STRING)
    @NotNull(message = "Status is required")
    @Column(nullable = false)
    private RequestStatus status = RequestStatus.PENDING;

    @Column(name = "requested_date", nullable = false)
    private LocalDate requestedDate;

    @NotNull(message = "Receiver ID is required")
    @Column(name = "receiver_id", nullable = false)
    private Long receiverId;

    // ========== Constructors ==========

    public BloodRequest() {}

    public BloodRequest(String hospitalName, BloodGroup bloodGroup, Integer unitsRequired) {
        this.hospitalName = hospitalName;
        this.bloodGroup = bloodGroup;
        this.unitsRequired = unitsRequired;
        this.requestedDate = LocalDate.now();
    }

    // ========== Getters and Setters ==========

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getHospitalName() {
        return hospitalName;
    }

    public void setHospitalName(String hospitalName) {
        this.hospitalName = hospitalName;
    }

    public BloodGroup getBloodGroup() {
        return bloodGroup;
    }

    public void setBloodGroup(BloodGroup bloodGroup) {
        this.bloodGroup = bloodGroup;
    }

    public Integer getUnitsRequired() {
        return unitsRequired;
    }

    public void setUnitsRequired(Integer unitsRequired) {
        this.unitsRequired = unitsRequired;
    }

    public RequestStatus getStatus() {
        return status;
    }

    public void setStatus(RequestStatus status) {
        this.status = status;
    }

    public LocalDate getRequestedDate() {
        return requestedDate;
    }

    public void setRequestedDate(LocalDate requestedDate) {
        this.requestedDate = requestedDate;
    }

    public Long getReceiverId() {
        return receiverId;
    }

    public void setReceiverId(Long receiverId) {
        this.receiverId = receiverId;
    }
}
