package com.healthsync.controller;

import com.healthsync.model.Department;
import com.healthsync.repository.DepartmentRepository;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping
@SuppressWarnings("null")
public class DepartmentController {

    @Autowired
    private DepartmentRepository departmentRepository;

    @GetMapping("/api/departments")
    public ResponseEntity<List<Department>> getAllDepartments() {
        return ResponseEntity.ok(departmentRepository.findAll());
    }

    @PostMapping("/api/admin/departments")
    public ResponseEntity<Department> createDepartment(@Valid @RequestBody Department department) {
        if (departmentRepository.findByName(department.getName()).isPresent()) {
            throw new RuntimeException("Department with name " + department.getName() + " already exists");
        }
        Department saved = departmentRepository.save(department);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    @PutMapping("/api/admin/departments/{id}")
    public ResponseEntity<Department> updateDepartment(@PathVariable Long id, @Valid @RequestBody Department details) {
        Department dept = departmentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Department not found with ID: " + id));

        dept.setName(details.getName());
        dept.setCode(details.getCode());
        dept.setDescription(details.getDescription());
        dept.setIcon(details.getIcon());

        Department updated = departmentRepository.save(dept);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/api/admin/departments/{id}")
    public ResponseEntity<?> deleteDepartment(@PathVariable Long id) {
        Department dept = departmentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Department not found with ID: " + id));

        departmentRepository.delete(dept);
        return ResponseEntity.ok().build();
    }
}
