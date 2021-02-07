package com.example.demo.model.entities;

import com.google.gson.annotations.Expose;

import javax.persistence.*;
import java.util.List;

@Entity
@Table(name = "timeslot")
public class TimeSlot {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "timeSlotID")
    @Expose
    private int id;

    @Column(name = "startTime")
    @Expose
    private long startTime;

    @Column(name = "endTime")
    @Expose
    private long endTime;

    @ManyToOne
    @JoinColumn(name = "storeID")
    private Store store;

    @OneToMany(mappedBy = "timeSlot", fetch = FetchType.EAGER)
    private List<LineNumber> lineNumbers;

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public long getStartTime() {
        return startTime;
    }

    public void setStartTime(long startTime) {
        this.startTime = startTime;
    }

    public long getEndTime() {
        return endTime;
    }

    public void setEndTime(long endTime) {
        this.endTime = endTime;
    }

    public Store getStore() {
        return store;
    }

    public void setStore(Store store) {
        this.store = store;
        store.addTimeSlot(this);
    }

    public List<LineNumber> getLineNumbers() {
        return lineNumbers;
    }

    public void setLineNumbers(List<LineNumber> lineNumbers) {
        for (LineNumber ln : lineNumbers){
            ln.setTimeSlot(this);
        }
        this.lineNumbers = lineNumbers;
    }
}
