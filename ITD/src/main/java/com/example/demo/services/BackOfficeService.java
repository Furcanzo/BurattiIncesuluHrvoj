package com.example.demo.services;

import com.example.demo.entities.Employee;
import com.example.demo.entities.Store;
import com.example.demo.entities.WorkingHour;
import com.example.demo.entities.dtos.EmployeeDTO;
import com.example.demo.entities.dtos.StoreDTO;
import com.example.demo.exceptions.NoSuchEntityException;
import com.example.demo.repositories.StoreRepository;
import com.example.demo.repositories.WorkingHourRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.ArrayList;
import java.util.List;

@Service
public class BackOfficeService {

    private final StoreRepository storeRepository;

    private final WorkingHourRepository workingHourRepository;

    private final EmployeeService employeeService;

    @Autowired
    public BackOfficeService(StoreRepository storeRepository, WorkingHourRepository workingHourRepository, EmployeeService employeeService) {
        this.storeRepository = storeRepository;
        this.workingHourRepository = workingHourRepository;
        this.employeeService = employeeService;
    }

    @Transactional
    public Store createStore(StoreDTO store) {
        Store created = store.generateEntity();
        List<Store> partnerStores = new ArrayList<>();
        if (created.getPartnerStores() != null) {
            for (Store ps : created.getPartnerStores()) {
                partnerStores.add(storeRepository.findById(ps.getId()).orElse(null));
            }
            created.setPartnerStores(partnerStores);
        }
        Store saved = storeRepository.save(created);
        if (created.getWorkingHours() != null){
            for (WorkingHour wh : created.getWorkingHours()){
                workingHourRepository.save(wh);
            }
        }
        return saved;
    }

    public Employee addEmployee(EmployeeDTO employee) throws NoSuchEntityException {
        return employeeService.addEmployee(employee);
    }
}
