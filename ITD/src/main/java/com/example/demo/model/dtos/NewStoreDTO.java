package com.example.demo.model.dtos;

import java.util.List;

public class NewStoreDTO {

    private final String name;
    private final String description;
    private final double longitude;
    private final double latitude;
    private final int maxCustomers;
    private final int timeOut;
    private final WorkingHourDTO workingHourDTO;
    private final List<Integer> partnerStoreIds;
    private final String firstManagerEmail;

    public NewStoreDTO(String name, String description, double longitude, double latitude, int maxCustomers, int timeOut, WorkingHourDTO workingHourDTO, List<Integer> partnerStoreIds, String firstManagerEmail) {
        this.name = name;
        this.description = description;
        this.longitude = longitude;
        this.latitude = latitude;
        this.maxCustomers = maxCustomers;
        this.timeOut = timeOut;
        this.workingHourDTO = workingHourDTO;
        this.partnerStoreIds = partnerStoreIds;
        this.firstManagerEmail = firstManagerEmail;
    }

    public String getName() {
        return name;
    }

    public String getDescription() {
        return description;
    }

    public double getLongitude() {
        return longitude;
    }

    public double getLatitude() {
        return latitude;
    }

    public int getMaxCustomers() {
        return maxCustomers;
    }

    public int getTimeOut() {
        return timeOut;
    }

    public WorkingHourDTO getWorkingHourDTO() {
        return workingHourDTO;
    }

    public List<Integer> getPartnerStoreIds() {
        return partnerStoreIds;
    }

    public String getFirstManagerEmail() {
        return firstManagerEmail;
    }
}
