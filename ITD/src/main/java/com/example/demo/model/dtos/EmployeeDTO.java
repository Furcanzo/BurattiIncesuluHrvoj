package com.example.demo.model.dtos;

public class EmployeeDTO {

    private final String email;
    private final String role;


    public EmployeeDTO(String email, String role) {
        this.email = email;
        this.role = role;
    }

    public String getEmail() {
        return email;
    }

    public String getRole() {
        return role;
    }

}
