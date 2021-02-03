package com.example.demo.entities.dtos;

import com.example.demo.entities.Store;
import com.example.demo.entities.WorkingHour;

import java.util.ArrayList;
import java.util.List;

public class StoreDTO {

    private String name;
    private String description;
    private double longitude;
    private double latitude;
    private int maxCustomers;
    private int timeOut;
    private List<WorkingHourDTO> workingHourDTOs;
    private List<Integer> partnerStoreIds;

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

    public Store generateEntity() {
        Store created = new Store();
        created.setName(this.getName());
        created.setDescription(this.getDescription());
        created.setLongitude(this.getLongitude());
        created.setMaxCustomers(this.getMaxCustomers());
        created.setTimeOut(this.getTimeOut());
        List<WorkingHour> workingHours = new ArrayList<>();
        if (this.workingHourDTOs != null) {
            for (WorkingHourDTO whdto : this.workingHourDTOs) {
                workingHours.add(whdto.generateEntity());
            }
            created.setWorkingHours(workingHours);
        }
        List<Store> mockPartnerStores = new ArrayList<>();
        if (this.partnerStoreIds != null) {
            for (Integer id : this.getPartnerStoreIds()) {
                mockPartnerStores.add(new Store(id));
            }
            created.setPartnerStores(mockPartnerStores);
        }
        return created;
    }
}
