package com.example.demo.repositories;

import com.example.demo.model.entities.Employee;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface EmployeeRepository extends CrudRepository<Employee, Integer> {

    List<Employee> findAll();

    Optional<Employee> findByEmail(String email);
}
