package com.example.demo.model.entities;

import com.google.gson.annotations.Expose;

import javax.persistence.*;
import java.util.List;

@Entity
@Table(name = "Store")
public class Store {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "storeID")
    @Expose
    private int id;

    @Column(name = "name")
    @Expose
    private String name;

    @Column(name = "description")
    @Expose
    private String description;

    @Column(name = "longitude")
    @Expose
    private double longitude;

    @Column(name = "latitude")
    @Expose
    private double latitude;

    @Column(name = "maxCustomers")
    @Expose
    private int maxCustomers;

    @Column(name = "timeOut")
    @Expose
    private int timeOut;

    @OneToMany(mappedBy = "store")
    private List<LineNumber> lineNumbers;

    @OneToOne
    @JoinColumn(name = "workingHourID")
    @Expose
    private WorkingHour workingHour;

    @OneToMany(mappedBy = "store")
    private List<Employee> employees;

    @OneToMany(mappedBy = "store")
    private List<TimeSlot> timeSlots;

    @ManyToMany
    @JoinTable(name = "PartnerStore",
            joinColumns = @JoinColumn(name = "primaryStoreID"),
            inverseJoinColumns = @JoinColumn(name = "partnerStoreID"))
    @Expose
    private List<Store> partnerStores;

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

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public double getLongitude() {
        return longitude;
    }

    public void setLongitude(double longitude) {
        this.longitude = longitude;
    }

    public double getLatitude() {
        return latitude;
    }

    public void setLatitude(double latitude) {
        this.latitude = latitude;
    }

    public int getMaxCustomers() {
        return maxCustomers;
    }

    public void setMaxCustomers(int maxCustomers) {
        this.maxCustomers = maxCustomers;
    }

    public int getTimeOut() {
        return timeOut;
    }

    public void setTimeOut(int timeOut) {
        this.timeOut = timeOut;
    }

    public List<LineNumber> getLineNumbers() {
        return lineNumbers;
    }

    public void setLineNumbers(List<LineNumber> lineNumbers) {
        for (LineNumber ln : lineNumbers){
            ln.setStore(this);
        }
        this.lineNumbers = lineNumbers;
    }

    public WorkingHour getWorkingHour() {
        return workingHour;
    }

    public void setWorkingHour(WorkingHour workingHour) {
        workingHour.setStore(this);
        this.workingHour = workingHour;
    }

    public List<Employee> getEmployees() {
        return employees;
    }

    public void setEmployees(List<Employee> employees) {
        for (Employee e : employees){
            e.setStore(this);
        }
        this.employees = employees;
    }

    public List<TimeSlot> getTimeSlots() {
        return timeSlots;
    }

    public void setTimeSlots(List<TimeSlot> timeSlots) {
        for (TimeSlot ts : timeSlots){
            ts.setStore(this);
        }
        this.timeSlots = timeSlots;
    }

    public List<Store> getPartnerStores() {
        return partnerStores;
    }

    public void setPartnerStores(List<Store> partnerStores) {
        this.partnerStores = partnerStores;
    }
}
