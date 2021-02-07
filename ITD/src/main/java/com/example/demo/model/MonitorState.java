package com.example.demo.model;

import com.google.gson.annotations.Expose;

public class MonitorState {

    @Expose
    private final long timestamp;

    @Expose
    private final int customersInStore;

    @Expose
    private final int storeId;

    public MonitorState(long timestamp, int customersInStore, int storeId) {
        this.timestamp = timestamp;
        this.customersInStore = customersInStore;
        this.storeId = storeId;
    }
}
