package com.example.demo.services;

import com.example.demo.model.MonitorState;
import com.example.demo.model.entities.Employee;
import com.example.demo.model.entities.LineNumber;
import com.example.demo.model.entities.Store;
import com.example.demo.exceptions.NoSuchEntityException;
import com.example.demo.model.dtos.EmployeeDTO;
import com.example.demo.model.dtos.StoreDTO;
import com.example.demo.repositories.EmployeeRepository;
import com.example.demo.repositories.LineNumberRepository;
import com.example.demo.repositories.StoreRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;

@Service
public class EmployeeService {

    private final StoreRepository storeRepository;

    private final EmployeeRepository employeeRepository;

    private final LineNumberRepository lineNumberRepository;

    @Autowired
    public EmployeeService(StoreRepository storeRepository, EmployeeRepository employeeRepository, LineNumberRepository lineNumberRepository) {
        this.storeRepository = storeRepository;
        this.employeeRepository = employeeRepository;
        this.lineNumberRepository = lineNumberRepository;
    }

    public Store updateStore(int storeId, StoreDTO store) throws NoSuchEntityException {
        Store myStore = storeRepository.findById(storeId).orElse(null);
        if(myStore == null){
            throw new NoSuchEntityException();
        }
        myStore.setName(store.getName()!=null? store.getName() : myStore.getName());
        myStore.setDescription(store.getDescription()!= null ? store.getName() : myStore.getDescription());
        myStore.setLongitude(store.getLongitude() != 0.0 ? store.getLongitude() : myStore.getLongitude());
        myStore.setLatitude(store.getLatitude() != 0.0 ? store.getLatitude() : myStore.getLatitude());
        myStore.setMaxCustomers(store.getMaxCustomers() != 0 ? store.getMaxCustomers() : myStore.getMaxCustomers());
        myStore.setTimeOut(store.getTimeOut() != 0 ? store.getTimeOut() : myStore.getTimeOut());

        //todo update lists
        return storeRepository.save(myStore);
    }

    public Employee findEmployeeById(int id) throws NoSuchEntityException {
        Employee employee = employeeRepository.findById(id).orElse(null);
        if (employee == null){
            throw new NoSuchEntityException();
        }
        return employee;
    }

    public Employee findEmployeeByEmail(String email) {
        return employeeRepository.findByEmail(email);
    }

    public Employee addEmployee(EmployeeDTO employee) throws NoSuchEntityException {
        Employee firstEmployee = employee.generateEntity();
        Store store = storeRepository.findById(firstEmployee.getStore().getId()).orElse(null);
        if (store!= null) {
            firstEmployee.setStore(store);
            return firstEmployee;
        }
        throw new NoSuchEntityException();
    }

    @Transactional
    public boolean checkin(int lineNumberId) {
        LineNumber lineNumber = lineNumberRepository.findById(lineNumberId).orElse(null);
        if (lineNumber != null && lineNumber.getStatus().equals("WAITING")){
            lineNumber.setStatus("VISITING");
            lineNumberRepository.save(lineNumber);
            return true;
        }
        return false;
    }

    @Transactional
    public boolean checkout(int lineNumberId) {
        LineNumber lineNumber = lineNumberRepository.findById(lineNumberId).orElse(null);
        if (lineNumber != null && lineNumber.getStatus().equals("VISITING")){
            lineNumber.setStatus("VISITED");
            lineNumberRepository.save(lineNumber);
            return true;
        }
        return false;
    }

    public LineNumber findLineNumberById(int lineNumberId) throws NoSuchEntityException {
        LineNumber lineNumber = lineNumberRepository.findById(lineNumberId).orElse(null);
        if (lineNumber == null){
            throw new NoSuchEntityException();
        }
        return lineNumber;
    }

    public MonitorState monitorLive(int id) {
        long timestamp = System.currentTimeMillis();
        int numberOfCustomers = lineNumberRepository.monitor(id);
        return new MonitorState(timestamp,numberOfCustomers, id);
    }
}
