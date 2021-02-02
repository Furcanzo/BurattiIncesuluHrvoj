package com.example.demo.entities;

import com.google.gson.annotations.Expose;

import javax.persistence.*;
import java.util.Date;

@Entity
@Table(name = "linenumber")
public class LineNumber {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "lineNumberID")
    @Expose
    private int id;

    @Column(name = "status")
    @Expose
    private String status;

    @Column(name = "number")
    @Expose
    private int number;

    @Column(name = "startTime")
    @Expose
    private Date from;

    @Column(name = "endTime")
    @Expose
    private Date until;

    @ManyToOne
    @JoinColumn(name = "storeID")
    @Expose
    private Store store;

    @ManyToOne
    @JoinColumn(name = "customerID")
    private Customer customer;

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public int getNumber() {
        return number;
    }

    public void setNumber(int number) {
        this.number = number;
    }

    public Date getFrom() {
        return from;
    }

    public void setFrom(Date from) {
        this.from = from;
    }

    public Date getUntil() {
        return until;
    }

    public void setUntil(Date until) {
        this.until = until;
    }

    public Store getStore() {
        return store;
    }

    public void setStore(Store store) {
        this.store = store;
    }

    public Customer getCustomer() {
        return customer;
    }

    public void setCustomer(Customer customer) {
        this.customer = customer;
    }
}
