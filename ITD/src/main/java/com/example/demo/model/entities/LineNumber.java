package com.example.demo.model.entities;

import com.google.gson.annotations.Expose;

import javax.persistence.*;

@Entity
@Table(name = "LineNumber")
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
    private long from;

    @Column(name = "endTime")
    @Expose
    private long until;

    @ManyToOne
    @JoinColumn(name = "timeSlotID")
    private TimeSlot timeSlot;

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

    public long getFrom() {
        return from;
    }

    public void setFrom(long from) {
        this.from = from;
    }

    public long getUntil() {
        return until;
    }

    public void setUntil(long until) {
        this.until = until;
    }

    public TimeSlot getTimeSlot() {
        return timeSlot;
    }

    public void setTimeSlot(TimeSlot timeSlot) {
        this.timeSlot = timeSlot;
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
