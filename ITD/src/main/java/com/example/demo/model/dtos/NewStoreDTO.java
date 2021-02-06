package com.example.demo.model.dtos;

import java.util.List;

public class NewStoreDTO {

    private final String name;
    private final String description;
    private final double longitude;
    private final double latitude;
    private final int maxCustomers;
    private final int timeOut;
    private final List<WorkingHourDTO> workingHourDTOs;
    private final List<Integer> partnerStoreIds;
    private final String firstManagerEmail;

    public NewStoreDTO(String name, String description, double longitude, double latitude, int maxCustomers, int timeOut, List<WorkingHourDTO> workingHourDTOs, List<Integer> partnerStoreIds, String firstManagerEmail) {
        this.name = name;
        this.description = description;
        this.longitude = longitude;
        this.latitude = latitude;
        this.maxCustomers = maxCustomers;
        this.timeOut = timeOut;
        this.workingHourDTOs = workingHourDTOs;
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

    public List<WorkingHourDTO> getWorkingHourDTOs() {
        return workingHourDTOs;
    }

    public List<Integer> getPartnerStoreIds() {
        return partnerStoreIds;
    }

    public String getFirstManagerEmail() {
        return firstManagerEmail;
    }
}
