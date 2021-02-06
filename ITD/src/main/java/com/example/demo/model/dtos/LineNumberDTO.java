package com.example.demo.model.dtos;

public class LineNumberDTO {

    private final long from;
    private final long until;
    private final int timeSlotId;
    private final int storeId;

    public LineNumberDTO(long from, long until, int timeSlotId, int storeId) {
        this.from = from;
        this.until = until;
        this.timeSlotId = timeSlotId;
        this.storeId = storeId;
    }

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
