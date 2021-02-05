package com.example.demo.repositories;

import com.example.demo.model.entities.WorkingHour;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface WorkingHourRepository extends CrudRepository<WorkingHour, Integer> {

    List<WorkingHour> findAll();
}
