package com.example.demo.model.entities;

import com.google.gson.annotations.Expose;

import javax.persistence.*;

@Entity
@Table(name = "workingHours")
public class WorkingHour {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "workingHoursID")
    @Expose
    private int id;

    @Column(name = "openingTime")
    @Expose
    private int from;

    @Column(name = "closingTime")
    @Expose
    private int until;

    @OneToOne(mappedBy = "workingHour")
    private Store store;

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public int getFrom() {
        return from;
    }

    public void setFrom(int from) {
        this.from = from;
    }

    public int getUntil() {
        return until;
    }

    public void setUntil(int until) {
        this.until = until;
    }

    public Store getStore() {
        return store;
    }

    public void setStore(Store store) {
        this.store = store;
    }
}
