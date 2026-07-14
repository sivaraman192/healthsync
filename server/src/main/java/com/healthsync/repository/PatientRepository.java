package com.healthsync.repository;

import com.healthsync.model.Patient;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface PatientRepository extends JpaRepository<Patient, Long> {
    Optional<Patient> findByUserId(Long userId);
    Optional<Patient> findByEmail(String email);
    List<Patient> findByFullNameContainingIgnoreCase(String fullName);
    List<Patient> findByGender(String gender);
    List<Patient> findByBloodGroup(String bloodGroup);
}
