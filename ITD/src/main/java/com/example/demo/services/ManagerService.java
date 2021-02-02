package com.example.demo.services;

import com.example.demo.entities.Employee;
import com.example.demo.exceptions.NoSuchEntityException;
import com.example.demo.entities.Store;
import com.example.demo.repositories.EmployeeRepository;
import com.example.demo.repositories.StoreRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ManagerService {

    private final StoreRepository storeRepository;

    private final EmployeeRepository employeeRepository;

    @Autowired
    public ManagerService(StoreRepository storeRepository, EmployeeRepository employeeRepository) {
        this.storeRepository = storeRepository;
        this.employeeRepository = employeeRepository;
    }

    public Store createStore(Store store) {
        return storeRepository.save(store);
    }

    public Store updateStore(Store store) throws NoSuchEntityException {
        Store myStore = storeRepository.findById(store.getId()).orElse(null);
        if(myStore == null){
            throw new NoSuchEntityException();
        }

        //todo update
        return storeRepository.save(myStore);
    }

    public Employee findEmployeeById(int id) throws NoSuchEntityException {
        Employee employee = employeeRepository.findById(id).orElse(null);
        if (employee == null){
            throw new NoSuchEntityException();
        }
        return employee;
    }
}
