package com.example.demo.model.dtos;

public class WorkingHourDTO {

    private final int from;
    private final int until;

    public WorkingHourDTO(int from, int until) {
        this.from = from;
        this.until = until;
    }

    public int getFrom() {
        return from;
    }

    public int getUntil() {
        return until;
    }

}
