package com.example.demo.model.dtos;

public class EmployeeDTO {

    private final String email;
    private final String role;
    private final int storeId;

    public EmployeeDTO(String email, String role, int storeId) {
        this.email = email;
        this.role = role;
        this.storeId = storeId;
    }

    public String getEmail() {
        return email;
    }

    public String getRole() {
        return role;
    }

    public int getStoreId() {
        return storeId;
    }

}
