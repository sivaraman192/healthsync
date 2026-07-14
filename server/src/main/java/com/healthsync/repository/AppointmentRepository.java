package com.healthsync.repository;

import com.healthsync.model.Appointment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

public interface AppointmentRepository extends JpaRepository<Appointment, Long> {
    List<Appointment> findByPatientEmail(String patientEmail);
    List<Appointment> findByPatientId(Long patientId);
    List<Appointment> findByDoctorId(Long doctorId);
    long countByStatus(String status);
    
    long countByAppointmentDate(String appointmentDate);

    @Query("SELECT COUNT(a) FROM Appointment a WHERE LOWER(a.reason) LIKE %:kw1% OR LOWER(a.reason) LIKE %:kw2% OR LOWER(a.reason) LIKE %:kw3%")
    long countEmergencies(@Param("kw1") String kw1, @Param("kw2") String kw2, @Param("kw3") String kw3);
}
