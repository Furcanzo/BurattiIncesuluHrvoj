package com.example.demo.services;

import com.example.demo.model.entities.Employee;
import org.springframework.stereotype.Service;

@Service
public class SecurityService {

    public boolean managerCheck(Employee employee, int storeId) {
        return employee.getRole().equals("manager") && employee.getStore().getId() == storeId;
    }

    public boolean backOffice(String bearer) {
        //todo
        return true;
    }

    public boolean checkClerk(Employee employee, int storeId) {
        return employee.getStore().getId() == storeId;
    }
}
