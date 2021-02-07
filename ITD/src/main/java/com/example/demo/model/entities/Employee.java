package com.example.demo.model.entities;

import com.google.gson.annotations.Expose;

import javax.persistence.*;

@Entity
@Table(name = "Employee")
public class Employee {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "employeeID")
    @Expose
    private int id;

    @Column(name = "email")
    @Expose
    private String email;

    @Column(name = "Role")
    @Expose
    private String role;

    @ManyToOne
    @JoinColumn(name = "storeID")
    private Store store;

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public Store getStore() {
        return store;
    }

    public void setStore(Store store) {
        this.store = store;
    }
}
