package com.example.demo.repositories;

import com.example.demo.model.entities.TimeSlot;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TimeSlotRepository extends CrudRepository<TimeSlot, Integer> {

    List<TimeSlot> findAll();

    @Query("select ts FROM TimeSlot ts WHERE current_timestamp between ts.startTime and ts.endTime and ts.store.id = :storeId")
    TimeSlot findActual(@Param("storeId")int storeId);

}
