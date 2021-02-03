package com.example.demo.entities.dtos;

public class LineNumberDTO {

    private String status;
    private int number;
    private long from;
    private long until;
    private int storeId;

    public String getStatus() {
        return status;
    }

    public int getNumber() {
        return number;
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
}
