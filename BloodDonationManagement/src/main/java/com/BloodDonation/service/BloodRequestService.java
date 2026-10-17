package com.BloodDonation.service;

import com.BloodDonation.enums.RequestStatus;
import com.BloodDonation.model.BloodRequest;
import com.BloodDonation.repository.BloodRequestRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class BloodRequestService {

    private final BloodRequestRepository bloodRequestRepository;
    private final BloodInventoryService bloodInventoryService;
    private final UserService userService;

    public BloodRequestService(BloodRequestRepository bloodRequestRepository,
                               BloodInventoryService bloodInventoryService,
                               UserService userService) {
        this.bloodRequestRepository = bloodRequestRepository;
        this.bloodInventoryService = bloodInventoryService;
        this.userService = userService;
    }

    /**
     * Retrieve all blood requests.
     */
    public List<BloodRequest> getAllRequests() {
        return bloodRequestRepository.findAll();
    }

    /**
     * Fetch all PENDING blood requests.
     */
    public List<BloodRequest> getPendingRequests() {
        return bloodRequestRepository.findByStatus(RequestStatus.PENDING);
    }

    /**
     * Retrieve all blood requests for a specific receiver.
     */
    public List<BloodRequest> getRequestsByReceiver(Long receiverId) {
        return bloodRequestRepository.findByReceiverId(receiverId);
    }

    /**
     * Create a new blood request.
     */
    @Transactional
    public BloodRequest createRequest(BloodRequest request) {
        request.setStatus(RequestStatus.PENDING);
        request.setRequestedDate(java.time.LocalDate.now());
        return bloodRequestRepository.save(request);
    }

    /**
     * Approve a pending blood request.
     */
    @Transactional
    public BloodRequest approveRequest(Long requestId) {
        BloodRequest request = getRequestById(requestId);
        if (request.getStatus() != RequestStatus.PENDING) {
            throw new RuntimeException("Only PENDING requests can be approved.");
        }
        request.setStatus(RequestStatus.APPROVED);
        return bloodRequestRepository.save(request);
    }

    /**
     * Fulfill an approved blood request — deducts units from inventory.
     */
    @Transactional
    public BloodRequest fulfillRequest(Long requestId) {
        BloodRequest request = getRequestById(requestId);
        if (request.getStatus() != RequestStatus.APPROVED) {
            throw new RuntimeException("Only APPROVED requests can be fulfilled.");
        }

        // Deduct units from blood inventory
        bloodInventoryService.deductUnits(request.getBloodGroup(), request.getUnitsRequired());

        request.setStatus(RequestStatus.FULFILLED);
        return bloodRequestRepository.save(request);
    }

    /**
     * Retrieve a blood request by ID.
     */
    public BloodRequest getRequestById(Long id) {
        return bloodRequestRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Blood request not found with ID: " + id));
    }

    /**
     * Count the total number of pending requests.
     */
    public long countPendingRequests() {
        return bloodRequestRepository.countByStatus(RequestStatus.PENDING);
    }

    /**
     * Delete a blood request by ID, enforcing ownership or admin privileges.
     */
    @Transactional
    public void deleteRequest(Long id, Long userId) {
        BloodRequest request = getRequestById(id);
        com.BloodDonation.model.User user = userService.getUserById(userId);

        if (user.getRole() == com.BloodDonation.enums.Role.ADMIN || request.getReceiverId().equals(userId)) {
            bloodRequestRepository.deleteById(id);
        } else {
            throw new RuntimeException("Unauthorized: You do not have permission to delete this request.");
        }
    }
}
