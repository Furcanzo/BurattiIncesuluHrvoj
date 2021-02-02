package com.example.demo.repositories;

import com.example.demo.entities.WorkingHour;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface WorkingHourRepository extends CrudRepository<WorkingHour, Integer> {

    public List<WorkingHour> findAll();
}
