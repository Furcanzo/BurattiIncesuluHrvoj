package com.example.demo.services;

import com.example.demo.exceptions.NoSuchEntityException;
import com.example.demo.model.dtos.EmployeeDTO;
import com.example.demo.model.dtos.NewStoreDTO;
import com.example.demo.model.dtos.StoreDTO;
import com.example.demo.model.dtos.WorkingHourDTO;
import com.example.demo.model.entities.Employee;
import com.example.demo.model.entities.Store;
import com.example.demo.repositories.EmployeeRepository;
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

    private final EmployeeRepository employeeRepository;

    private final EmployeeService employeeService;

    @Autowired
    public BackOfficeService(StoreRepository storeRepository, WorkingHourRepository workingHourRepository, EmployeeRepository employeeRepository, EmployeeService employeeService) {
        this.storeRepository = storeRepository;
        this.workingHourRepository = workingHourRepository;
        this.employeeRepository = employeeRepository;
        this.employeeService = employeeService;
    }

    @Transactional
    public Store createStore(NewStoreDTO store){
        StoreDTO storeDTO = new StoreDTO(store.getName(),
                store.getDescription() != null? store.getDescription() : "",
                store.getLongitude(),
                store.getLatitude(),
                store.getMaxCustomers(),
                store.getTimeOut(),
                store.getWorkingHourDTO() != null? store.getWorkingHourDTO() : new WorkingHourDTO(0,0),
                store.getPartnerStoreIds());
        Store created = generateStore(storeDTO);
        EmployeeDTO firstManagerDTO = new EmployeeDTO(store.getFirstManagerEmail(), "manager", created.getId());
        workingHourRepository.save(created.getWorkingHour());
        Store savedStore = storeRepository.save(created);
        Employee firstManager = generateEmployeeWithStore(firstManagerDTO, savedStore);
        employeeRepository.save(firstManager);
        return savedStore;
    }

    private Employee generateEmployeeWithStore(EmployeeDTO employeeDTO, Store savedStore){
        Employee created = new Employee();
        created.setEmail(employeeDTO.getEmail());
        created.setRole(employeeDTO.getRole());
        created.setStore(savedStore);
        return created;
    }


    private Store generateStore(StoreDTO storeDTO) {
        Store created = new Store();
        created.setName(storeDTO.getName());
        created.setDescription(storeDTO.getDescription());
        created.setLongitude(storeDTO.getLongitude());
        created.setMaxCustomers(storeDTO.getMaxCustomers());
        created.setTimeOut(storeDTO.getTimeOut());
        created.setWorkingHour(employeeService.generateWorkingHour(storeDTO.getWorkingHourDTO()));
        List<Store> partnerStores = new ArrayList<>();
        if (storeDTO.getPartnerStoreIds() != null) {
            for (Integer ps : storeDTO.getPartnerStoreIds()) {
                    partnerStores.add(storeRepository.findById(ps).orElse(null));
                }
                created.setPartnerStores(partnerStores);
        }
        return created;
    }


}
