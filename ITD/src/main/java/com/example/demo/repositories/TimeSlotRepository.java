package com.example.demo.repositories;

import com.example.demo.entities.TimeSlot;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TimeSlotRepository extends CrudRepository<TimeSlot, Integer> {

    List<TimeSlot> findAll();
}
