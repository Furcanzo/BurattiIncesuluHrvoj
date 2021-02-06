package com.example.demo.services;

import com.example.demo.exceptions.MailAlreadyUsedException;
import com.example.demo.model.dtos.CustomerDTO;
import com.example.demo.model.dtos.LineNumberDTO;
import com.example.demo.exceptions.NoSuchEntityException;
import com.example.demo.exceptions.NoTimeSlotsException;
import com.example.demo.exceptions.TimeSlotFullException;
import com.example.demo.model.entities.Customer;
import com.example.demo.model.entities.LineNumber;
import com.example.demo.model.entities.Store;
import com.example.demo.model.entities.TimeSlot;
import com.example.demo.repositories.CustomerRepository;
import com.example.demo.repositories.StoreRepository;
import com.example.demo.repositories.TimeSlotRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CustomerService {

    private final CustomerRepository customerRepository;

    private final StoreRepository storeRepository;

    private final TimeSlotRepository timeSlotRepository;

    @Autowired
    public CustomerService(CustomerRepository customerRepository, StoreRepository storeRepository, TimeSlotRepository timeSlotRepository) {
        this.customerRepository = customerRepository;
        this.storeRepository = storeRepository;
        this.timeSlotRepository = timeSlotRepository;
    }

    public LineNumber bookFutureLineNUmber(LineNumberDTO lineNumber, Customer customer, Store store) throws TimeSlotFullException, NoTimeSlotsException {
        //todo
        return null;
    }

    public List<TimeSlot> availableTimeSlots(int storeId) {
        //todo
        return null;
    }

    public int calcETA(LineNumberDTO lineNumber) {
        //todo
        return 0;
    }

    public LineNumber retrieveLineNumber(LineNumberDTO lineNumber, Customer customer) throws NoTimeSlotsException {
        //todo
        return null;
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

    public Customer findCustomerByEmail(String email) throws NoSuchEntityException {
        Customer customer = customerRepository.findByEmail(email).orElse(null);
        if (customer == null){
            throw new NoSuchEntityException();
        }
        return customer;
    }

    public Customer register(CustomerDTO customer) throws MailAlreadyUsedException {
        Customer created = generateCustomer(customer);
        Customer error = customerRepository.findByEmail(created.getEmail()).orElse(null);
        if (error == null) {
            return customerRepository.save(created);
        }
        throw new MailAlreadyUsedException();
    }

    private Customer generateCustomer(CustomerDTO customerDTO) {
        Customer customer = new Customer();
        customer.setName(customerDTO.getName());
        customer.setSurname(customerDTO.getSurname());
        customer.setPhoneNumber(customerDTO.getPhoneNumber());
        customer.setEmail(customerDTO.getEmail());
        return customer;
    }
}
