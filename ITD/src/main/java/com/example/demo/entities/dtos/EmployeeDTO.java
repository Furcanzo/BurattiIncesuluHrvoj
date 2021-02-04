package com.example.demo.entities.dtos;

import com.example.demo.entities.Employee;
import com.example.demo.entities.Store;

public class EmployeeDTO {

    private String email;
    private String role;
    private int storeId;

    public String getEmail() {
        return email;
    }

    public String getRole() {
        return role;
    }

    public int getStoreId() {
        return storeId;
    }

    public Employee generateEntity() {
        Employee created = new Employee();
        created.setEmail(this.getEmail());
        created.setRole(this.getRole());
        created.setStore(new Store(storeId));
        return created;
    }
}
