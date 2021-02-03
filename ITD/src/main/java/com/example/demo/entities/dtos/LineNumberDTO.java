package com.example.demo.entities.dtos;

public class LineNumberDTO {

    private long from;
    private long until;
    private int timeSlotId;
    private int storeId;

    public long getFrom() {
        return from;
    }

    public long getUntil() {
        return until;
    }

    public int getStoreId() {
        return storeId;
    }

    public int getTimeSlotId() {
        return timeSlotId;
    }
}
