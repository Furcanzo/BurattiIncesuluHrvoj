package com.example.demo.model;

public class MonitorState {

    private final long timestamp;

    private final int customersInStore;

    private final int storeId;

    public MonitorState(long timestamp, int customersInStore, int storeId) {
        this.timestamp = timestamp;
        this.customersInStore = customersInStore;
        this.storeId = storeId;
    }
}
