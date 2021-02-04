package com.example.demo.services;

import com.example.demo.entities.Customer;
import com.example.demo.entities.Employee;
import com.example.demo.entities.LineNumber;
import com.example.demo.entities.Store;
import com.example.demo.entities.dtos.StoreDTO;
import org.springframework.stereotype.Service;

@Service
public class SecurityService {

    public boolean managerCheck(Employee employee, int storeId) {
        return employee.getRole().equals("manager") && employee.getStore().getId() == storeId;
    }

    public boolean checkLineNumberStealing(LineNumber lineNumber, Customer customer){
        if (lineNumber.getCustomer() == null){
            lineNumber.setCustomer(customer);
            return false;
        } else return !lineNumber.getCustomer().equals(customer);
    }

    public boolean backOffice(String bearer) {
        //todo
        return true;
    }

    public boolean checkClerk(Employee employee, int storeId) {
        return employee.getStore().getId() == storeId;
    }
}
