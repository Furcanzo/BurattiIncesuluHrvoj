package com.example.demo.model.dtos;

public class WorkingHourDTO {

    private final long from;
    private final long until;

    public WorkingHourDTO(long from, long until) {
        this.from = from;
        this.until = until;
    }

    public long getFrom() {
        return from;
    }

    public long getUntil() {
        return until;
    }

}
