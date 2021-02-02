package com.example.demo.repositories;

import com.example.demo.entities.Customer;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CustomerRepository extends CrudRepository<Customer, Integer> {

    public List<Customer> findAll();

    public List<Customer> findByName(String name);

}
