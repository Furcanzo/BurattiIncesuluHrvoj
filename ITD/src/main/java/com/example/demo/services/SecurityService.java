package com.example.demo.services;

import com.example.demo.entities.Customer;
import com.example.demo.entities.Employee;
import com.example.demo.entities.LineNumber;
import com.example.demo.entities.Store;
import org.springframework.stereotype.Service;

@Service
public class SecurityService {

    public boolean managerCheck(Employee employee, Store store) {
        return employee.getRole().equals("manager") && employee.getStore().equals(store);
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
}
