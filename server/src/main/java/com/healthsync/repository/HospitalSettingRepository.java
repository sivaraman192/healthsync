package com.healthsync.repository;

import com.healthsync.model.HospitalSetting;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface HospitalSettingRepository extends JpaRepository<HospitalSetting, Long> {
    Optional<HospitalSetting> findBySettingKey(String key);
}
