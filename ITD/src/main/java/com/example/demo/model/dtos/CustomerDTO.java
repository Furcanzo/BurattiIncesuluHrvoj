package com.example.demo.model.dtos;

public class CustomerDTO {

    private final String name;
    private final String surname;
    private final String phoneNumber;
    private final String email;

    public CustomerDTO(String name, String surname, String phoneNumber, String email) {
        this.name = name;
        this.surname = surname;
        this.phoneNumber = phoneNumber;
        this.email = email;
    }

    public String getName() {
        return name;
    }

    public String getSurname() {
        return surname;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public String getEmail() {
        return email;
    }

}
