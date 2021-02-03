package com.example.demo.entities.dtos;

import com.example.demo.entities.Customer;

public class CustomerDTO {

    private String name;
    private String surname;
    private String phoneNumber;
    private String email;

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

    public Customer generateEntity() {
        Customer customer = new Customer();
        customer.setName(this.name);
        customer.setSurname(this.surname);
        customer.setPhoneNumber(this.phoneNumber);
        customer.setEmail(this.email);
        return customer;
    }
}
