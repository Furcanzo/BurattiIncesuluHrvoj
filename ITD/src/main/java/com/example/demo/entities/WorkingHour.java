package com.example.demo.entities;

import com.google.gson.annotations.Expose;

import javax.persistence.*;
import java.util.Date;

@Entity
@Table(name = "workingHours")
public class WorkingHour {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "workingHoursID")
    @Expose
    private int id;

    @Column(name = "startTime")
    @Expose
    private Date from;

    @Column(name = "endTime")
    @Expose
    private Date until;

    @ManyToOne
    @JoinColumn(name = "storeID")
    private Store store;

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
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
}
