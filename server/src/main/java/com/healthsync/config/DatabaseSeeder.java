package com.healthsync.config;

import com.healthsync.model.*;
import com.healthsync.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;

@Component
public class DatabaseSeeder implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private DoctorRepository doctorRepository;

    @Autowired
    private DepartmentRepository departmentRepository;

    @Autowired
    private PatientRepository patientRepository;

    @Autowired
    private AppointmentRepository appointmentRepository;

    @Autowired
    private HospitalSettingRepository hospitalSettingRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        // 1. Create/Update Default Admin User
        String adminEmail = "admin@healthsync.com";
        User admin = userRepository.findByEmail(adminEmail).orElse(null);
        if (admin == null) {
            admin = new User();
            admin.setEmail(adminEmail);
            admin.setName("System Admin");
            admin.setRole("ADMIN");
            admin.setPhone("1234567890");
        }
        admin.setPassword(passwordEncoder.encode("Admin@123"));
        userRepository.save(admin);

        // 2. Seed Departments
        if (departmentRepository.count() == 0) {
            List<Department> depts = Arrays.asList(
                new Department(null, "Cardiology", "CARD", "Heart Care and Cardiovascular health specialists", "Heart"),
                new Department(null, "Neurology", "NEUR", "Brain, spinal cord, and nervous system specialists", "Activity"),
                new Department(null, "Orthopedics", "ORTH", "Bone, joint, ligament, and muscle specialists", "Bone"),
                new Department(null, "Pediatrics", "PEDI", "Infant, child, and adolescent healthcare specialists", "Baby"),
                new Department(null, "Gynecology", "GYNE", "Women's reproductive health and maternal specialists", "User"),
                new Department(null, "Dermatology", "DERM", "Skin, hair, and nail clinical specialists", "Sparkles"),
                new Department(null, "ENT", "ENT", "Ear, nose, throat, and related head/neck specialists", "Volume2"),
                new Department(null, "Ophthalmology", "OPHT", "Comprehensive eye care and vision specialists", "Eye"),
                new Department(null, "Dental Care", "DENT", "Oral health, teeth care, and surgery specialists", "Smile"),
                new Department(null, "General Medicine", "GMED", "Primary healthcare, internal medicine, and triage", "Stethoscope"),
                new Department(null, "Emergency Care", "EMER", "Trauma, acute conditions, and 24x7 urgency center", "Flame"),
                new Department(null, "ICU", "ICU", "Intensive care unit with advanced life support systems", "ShieldAlert"),
                new Department(null, "Radiology", "RADI", "Medical imaging, X-Ray, CT, MRI, and diagnostics", "Scan"),
                new Department(null, "Laboratory", "LABS", "Blood tests, urine analytics, pathology and research", "FlaskConical"),
                new Department(null, "Physiotherapy", "PHYS", "Physical rehabilitation, exercise, and recovery specialists", "Accessibility"),
                new Department(null, "Mental Health", "MENT", "Psychiatry, clinical therapy, and emotional wellness", "Brain")
            );
            departmentRepository.saveAll(depts);
        }

        // 3. Seed Doctors
        if (doctorRepository.count() == 0) {
            // Doctor 1: Cardiology
            createDoctorSeeded("Dr. Adrian Sterling", "adrian@healthsync.com", "doctor123", "Cardiology", 18, "Monday, Wednesday, Friday", "09:00 AM - 01:00 PM", "+1 (555) 123-4567");
            // Doctor 2: Neurology
            createDoctorSeeded("Dr. Sarah Jenkins", "sarah@healthsync.com", "doctor123", "Neurology", 15, "Tuesday, Thursday", "02:00 PM - 06:00 PM", "+1 (555) 234-5678");
            // Doctor 3: Orthopedics
            createDoctorSeeded("Dr. Rajesh Koothrapali", "rajesh@healthsync.com", "doctor123", "Orthopedics", 14, "Monday, Tuesday, Thursday", "10:00 AM - 04:00 PM", "+1 (555) 345-6789");
            // Doctor 4: General Medicine
            createDoctorSeeded("Dr. Emily Watson", "emily@healthsync.com", "doctor123", "General Medicine", 10, "Monday to Friday", "09:00 AM - 05:00 PM", "+1 (555) 456-7890");
        }

        // 4. Seed Patients
        if (patientRepository.count() == 0) {
            // Patient 1
            createPatientSeeded("Alice Johnson", "alice@healthsync.com", "patient123", 28, "Female", "1998-05-12", "O+", "+1 (555) 890-1234", "123 Main St", "Metropolis", "NY", "10001", "Seasonal asthma; no drug allergies");
            // Patient 2
            createPatientSeeded("Bob Smith", "bob@healthsync.com", "patient123", 45, "Male", "1981-11-23", "A-", "+1 (555) 901-2345", "456 Oak Rd", "Gotham", "NJ", "07001", "Hypertension managed by daily lisinopril");
        }

        // 5. Seed Appointments
        if (appointmentRepository.count() == 0) {
            Patient alice = patientRepository.findByEmail("alice@healthsync.com").orElse(null);
            Patient bob = patientRepository.findByEmail("bob@healthsync.com").orElse(null);
            Doctor adrian = doctorRepository.findByEmail("adrian@healthsync.com").orElse(null);
            Doctor sarah = doctorRepository.findByEmail("sarah@healthsync.com").orElse(null);

            if (alice != null && adrian != null) {
                Appointment appt1 = new Appointment();
                appt1.setPatientId(alice.getId());
                appt1.setPatientName(alice.getFullName());
                appt1.setPatientEmail(alice.getEmail());
                appt1.setDoctorId(adrian.getId());
                appt1.setAppointmentDate("2026-07-13");
                appt1.setAppointmentTime("10:00 AM");
                appt1.setReason("Routine cardiovascular checkup, monitoring heart rate fluctuations.");
                appt1.setStatus("ACCEPTED");
                appointmentRepository.save(appt1);

                Appointment appt2 = new Appointment();
                appt2.setPatientId(alice.getId());
                appt2.setPatientName(alice.getFullName());
                appt2.setPatientEmail(alice.getEmail());
                appt2.setDoctorId(adrian.getId());
                appt2.setAppointmentDate("2026-07-06");
                appt2.setAppointmentTime("09:30 AM");
                appt2.setReason("Followup check for treadmill ECG test.");
                appt2.setStatus("COMPLETED");
                appt2.setPrescriptionNotes("Diagnosis: Normal cardiac tolerance.\nMedicines:\n1. Aspirin 75mg - Once daily after lunch\nNotes: Reduce sodium intake.");
                appointmentRepository.save(appt2);
            }

            if (bob != null && sarah != null) {
                Appointment appt3 = new Appointment();
                appt3.setPatientId(bob.getId());
                appt3.setPatientName(bob.getFullName());
                appt3.setPatientEmail(bob.getEmail());
                appt3.setDoctorId(sarah.getId());
                appt3.setAppointmentDate("2026-07-14");
                appt3.setAppointmentTime("03:00 PM");
                appt3.setReason("Chronic migraine headaches, severe onset in morning.");
                appt3.setStatus("PENDING");
                appointmentRepository.save(appt3);
            }
        }

        // 6. Seed Hospital Settings
        if (hospitalSettingRepository.count() == 0) {
            hospitalSettingRepository.save(new HospitalSetting(null, "emergency_number", "+1 (555) 911-0000"));
            hospitalSettingRepository.save(new HospitalSetting(null, "hospital_address", "777 HealthSync Plaza, Medical District, Silicon Valley, CA 94025"));
            hospitalSettingRepository.save(new HospitalSetting(null, "working_hours", "Mon - Sun: 24 Hours Emergency Desk (Roster desks open 9:00 AM - 6:00 PM)"));
            hospitalSettingRepository.save(new HospitalSetting(null, "support_email", "support@healthsync.com"));
        }
    }

    private void createDoctorSeeded(String name, String email, String password, String spec, int exp, String days, String time, String phone) {
        String encoded = passwordEncoder.encode(password);

        User user = new User();
        user.setName(name);
        user.setEmail(email);
        user.setPassword(encoded);
        user.setRole("DOCTOR");
        user.setPhone(phone);
        User savedUser = userRepository.save(user);

        Doctor doc = new Doctor();
        doc.setUserId(savedUser.getId());
        doc.setName(name);
        doc.setEmail(email);
        doc.setPhone(phone);
        doc.setSpecialization(spec);
        doc.setExperience(exp);
        doc.setAvailableDays(days);
        doc.setAvailableTime(time);
        doc.setPassword(encoded);
        doctorRepository.save(doc);
    }

    private void createPatientSeeded(String name, String email, String password, int age, String gender, String dob, String bloodGroup, String phone, String address, String city, String state, String pincode, String history) {
        String encoded = passwordEncoder.encode(password);

        User user = new User();
        user.setName(name);
        user.setEmail(email);
        user.setPassword(encoded);
        user.setRole("PATIENT");
        user.setPhone(phone);
        User savedUser = userRepository.save(user);

        Patient patient = new Patient();
        patient.setUserId(savedUser.getId());
        patient.setFullName(name);
        patient.setEmail(email);
        patient.setPhone(phone);
        patient.setAge(age);
        patient.setGender(gender);
        patient.setDob(dob);
        patient.setBloodGroup(bloodGroup);
        patient.setAddress(address);
        patient.setCity(city);
        patient.setState(state);
        patient.setPincode(pincode);
        patient.setMedicalHistory(history);
        patientRepository.save(patient);
    }
}
