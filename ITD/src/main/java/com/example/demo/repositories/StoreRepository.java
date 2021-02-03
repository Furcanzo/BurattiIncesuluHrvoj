package com.example.demo.repositories;

import com.example.demo.entities.Store;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface StoreRepository extends CrudRepository<Store, Integer> {

    List<Store> findAll();

}
