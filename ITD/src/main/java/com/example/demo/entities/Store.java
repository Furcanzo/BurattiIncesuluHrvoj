package com.example.demo.entities;

import com.google.gson.annotations.Expose;

import javax.persistence.*;
import java.util.List;

@Entity
@Table(name = "store")
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

    @Column(name = "maxCustomenrs")
    @Expose
    private int maxCustomers;

    @Column(name = "timeOut")
    @Expose
    private int timeOut;

    @OneToMany(mappedBy = "store")
    private List<LineNumber> lineNumbers;

    @OneToMany(mappedBy = "store")
    @Expose
    private List<WorkingHour> workingHours;

    @OneToMany(mappedBy = "store")
    private List<Employee> employees;

    //TODO check
    @ManyToMany
    @JoinTable(name = "PartnerStore",
            joinColumns = @JoinColumn(name = "primaryStoreID"),
            inverseJoinColumns = @JoinColumn(name = "partnerStoreID"))
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

    public List<WorkingHour> getWorkingHours() {
        return workingHours;
    }

    public void setWorkingHours(List<WorkingHour> workingHours) {
        for (WorkingHour wh : workingHours){
            wh.setStore(this);
        }
        this.workingHours = workingHours;
    }

    public List<Employee> getEmployees() {
        return employees;
    }

    public void setEmployees(List<Employee> employees) {
        this.employees = employees;
    }

    public List<Store> getPartnerStores() {
        return partnerStores;
    }

    public void setPartnerStores(List<Store> partnerStores) {
        this.partnerStores = partnerStores;
    }
}