package com.example.demo.model.dtos;

import com.example.demo.model.entities.WorkingHour;

public class WorkingHourDTO {

    private long from;
    private long until;

    public long getFrom() {
        return from;
    }

    public long getUntil() {
        return until;
    }

    public WorkingHour generateEntity() {
        WorkingHour workingHour = new WorkingHour();
        workingHour.setFrom(this.from);
        workingHour.setUntil(this.until);
        return workingHour;
    }
}
