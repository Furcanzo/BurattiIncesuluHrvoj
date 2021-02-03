package com.example.demo.services;

import com.example.demo.entities.dtos.CustomerDTO;
import com.example.demo.entities.dtos.LineNumberDTO;
import com.example.demo.exceptions.NoSuchEntityException;
import com.example.demo.exceptions.NoTimeSlotsException;
import com.example.demo.exceptions.TimeSlotFullException;
import com.example.demo.entities.Customer;
import com.example.demo.entities.LineNumber;
import com.example.demo.entities.Store;
import com.example.demo.entities.TimeSlot;
import com.example.demo.repositories.CustomerRepository;
import com.example.demo.repositories.StoreRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CustomerService {

    private final CustomerRepository customerRepository;

    private final StoreRepository storeRepository;

    @Autowired
    public CustomerService(CustomerRepository customerRepository, StoreRepository storeRepository) {
        this.customerRepository = customerRepository;
        this.storeRepository = storeRepository;
    }

    public List<Customer> findAllCustomers() {
        return customerRepository.findAll();
    }

    public List<Customer> findCustomerByName(String name) {
        return customerRepository.findByName(name);
    }

    public Customer createCustomer(Customer customer){
        return customerRepository.save(customer);
    }

    public LineNumber bookFutureLineNUmber(LineNumberDTO lineNumber, Customer customer, Store store) throws TimeSlotFullException, NoTimeSlotsException {
        //todo
        return null;
    }

    public List<Store> partnerStores(Store store) {
        //todo
        return null;
    }

    public List<TimeSlot> availableTimeSlots(Store store) {
        //todo
        return null;
    }

    public int calcETA() {
        //todo
        return 0;
    }

    public LineNumber retrieveLineNUmber(LineNumberDTO lineNumber, Customer customer) throws NoTimeSlotsException {
        //todo
        return null;
    }

    public Customer findCustomerById(int id) throws NoSuchEntityException {
        Customer customer = customerRepository.findById(id).orElse(null);
        if (customer == null){
            throw new NoSuchEntityException();
        }
        return customer;
    }

    public List<Store> getStoreList() {
        return storeRepository.findAll();
    }

    public Store getStore(int id) throws NoSuchEntityException {
        Store store = storeRepository.findById(id).orElse(null);
        if (store == null){
            throw new NoSuchEntityException();
        }
        return store;
    }

    public Customer findCustomerByEmail(String email) {
        return customerRepository.findByEmail(email);
    }

    public Customer register(CustomerDTO customer) {
        Customer created = customer.generateEntity();
        return customerRepository.save(created);
    }
}
