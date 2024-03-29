package com.example.demo.services;

import com.example.demo.exceptions.MailAlreadyUsedException;
import com.example.demo.model.MonitorState;
import com.example.demo.model.dtos.WorkingHourDTO;
import com.example.demo.model.entities.*;
import com.example.demo.exceptions.NoSuchEntityException;
import com.example.demo.model.dtos.EmployeeDTO;
import com.example.demo.model.dtos.StoreDTO;
import com.example.demo.repositories.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.ArrayList;
import java.util.List;

@Service
public class EmployeeService {

    private final StoreRepository storeRepository;

    private final EmployeeRepository employeeRepository;

    private final LineNumberRepository lineNumberRepository;

    private final TimeSlotRepository timeSlotRepository;

    private final WorkingHourRepository workingHourRepository;

    @Autowired
    public EmployeeService(StoreRepository storeRepository, EmployeeRepository employeeRepository, LineNumberRepository lineNumberRepository, TimeSlotRepository timeSlotRepository, WorkingHourRepository workingHourRepository) {
        this.storeRepository = storeRepository;
        this.employeeRepository = employeeRepository;
        this.lineNumberRepository = lineNumberRepository;
        this.timeSlotRepository = timeSlotRepository;
        this.workingHourRepository = workingHourRepository;
    }

    @Transactional
    public Store updateStore(int storeId, StoreDTO store) throws NoSuchEntityException {
        Store myStore = storeRepository.findById(storeId).orElse(null);
        if(myStore == null){
            throw new NoSuchEntityException();
        }
        myStore.setName(store.getName()!=null? store.getName() : myStore.getName());
        myStore.setDescription(store.getDescription()!= null ? store.getDescription() : myStore.getDescription());
        myStore.setLongitude(store.getLongitude() != 0.0 ? store.getLongitude() : myStore.getLongitude());
        myStore.setLatitude(store.getLatitude() != 0.0 ? store.getLatitude() : myStore.getLatitude());
        myStore.setMaxCustomers(store.getMaxCustomers() != 0 ? store.getMaxCustomers() : myStore.getMaxCustomers());
        myStore.setTimeOut(store.getTimeOut() != 0 ? store.getTimeOut() : myStore.getTimeOut());
        if (store.getWorkingHourDTO() != null) {
            WorkingHour workingHour = generateWorkingHour(store.getWorkingHourDTO());
            workingHourRepository.delete(myStore.getWorkingHour());
            workingHourRepository.save(workingHour);
            myStore.setWorkingHour(workingHour);
        }
        if (store.getPartnerStoreIds() != null){
            List<Store> newPartnerStores =  new ArrayList<>();
            for( int i : store.getPartnerStoreIds()){
                newPartnerStores.add(storeRepository.findById(i).orElse(null));
            }
            myStore.setPartnerStores(newPartnerStores);
        }
        return storeRepository.save(myStore);
    }

    public Employee findEmployeeById(int id) throws NoSuchEntityException {
        Employee employee = employeeRepository.findById(id).orElse(null);
        if (employee == null){
            throw new NoSuchEntityException();
        }
        return employee;
    }

    public Employee findEmployeeByEmail(String email) throws NoSuchEntityException {
        Employee employee = employeeRepository.findByEmail(email).orElse(null);
        if (employee == null){
            throw new NoSuchEntityException();
        }
        return employee;
    }

    public Employee addEmployee(EmployeeDTO employeeDTO, int storeId) throws NoSuchEntityException, MailAlreadyUsedException {
        Employee employee = generateEmployee(employeeDTO, storeId);
        Employee error = employeeRepository.findByEmail(employee.getEmail()).orElse(null);
        if (error == null) {
            return employeeRepository.save(employee);
        }
        throw new MailAlreadyUsedException();
    }

    @Transactional
    public boolean checkInOut(int lineNumberId) {
        LineNumber lineNumber = lineNumberRepository.findById(lineNumberId).orElse(null);
        if (lineNumber != null){
            if (lineNumber.getStatus().equals("WAITING")) {

                lineNumber.setStatus("VISITING");
            } else if (lineNumber.getStatus().equals("VISITING")) {
                lineNumber.setStatus("VISITED");
            } else {
                return false;
            }
            lineNumberRepository.save(lineNumber);
            return true;
        }
        return false;
    }
    private TimeSlot getActualTimeSlot(int storeId) {
        return timeSlotRepository.findActual(storeId);
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

    private Employee generateEmployee(EmployeeDTO employeeDTO, int storeId) throws NoSuchEntityException {
        Employee created = new Employee();
        Store store = storeRepository.findById(storeId).orElse(null);
        if (store != null) {
            created.setEmail(employeeDTO.getEmail());
            created.setRole(employeeDTO.getRole());
            created.setStore(store);
            return created;
        }
        throw new NoSuchEntityException();
    }

    WorkingHour generateWorkingHour( WorkingHourDTO workingHourDTO) {
        WorkingHour workingHour = new WorkingHour();
        workingHour.setFrom(workingHourDTO.getFrom());
        workingHour.setUntil(workingHourDTO.getUntil());
        return workingHour;
    }

    public Employee changeRole(Employee employee, String role) {
        employee.setRole(role);
        return employeeRepository.save(employee);
    }
}
