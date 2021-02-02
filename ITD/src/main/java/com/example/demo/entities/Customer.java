package com.example.demo.entities;

import com.google.gson.annotations.Expose;

import javax.persistence.*;
import java.util.List;

@Entity
@Table(name = "customer")
public class Customer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "customerID")
    @Expose
    private int id;

    @Column(name = "name")
    @Expose
    private String name;

    @Column(name = "surname")
    @Expose
    private String surname;

    @Column(name = "phoneNumber")
    @Expose
    private String phoneNumber;

    @Column(name = "email")
    @Expose
    private String email;

    @OneToMany(mappedBy = "customer")
    private List<LineNumber> lineNumbers;

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getSurname() {
        return surname;
    }

    public void setSurname(String surname) {
        this.surname = surname;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public List<LineNumber> getLineNumbers() {
        return lineNumbers;
    }

    public void setLineNumbers(List<LineNumber> lineNumbers) {
        for (LineNumber ln : lineNumbers){
            ln.setCustomer(this);
        }
        this.lineNumbers = lineNumbers;
    }
}
