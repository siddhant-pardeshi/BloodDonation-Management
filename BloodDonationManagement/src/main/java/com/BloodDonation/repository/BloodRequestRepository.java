package com.BloodDonation.repository;

import com.BloodDonation.enums.RequestStatus;
import com.BloodDonation.model.BloodRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BloodRequestRepository extends JpaRepository<BloodRequest, Long> {

    List<BloodRequest> findByStatus(RequestStatus status);

    List<BloodRequest> findByReceiverId(Long receiverId);

    long countByStatus(RequestStatus status);
}
