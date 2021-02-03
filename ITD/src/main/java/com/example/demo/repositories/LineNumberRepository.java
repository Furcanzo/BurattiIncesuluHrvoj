package com.example.demo.repositories;

import com.example.demo.entities.LineNumber;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LineNumberRepository extends CrudRepository<LineNumber, Integer> {

    List<LineNumber> findAll();
}
