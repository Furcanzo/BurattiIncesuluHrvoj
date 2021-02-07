package com.example.demo.model.dtos;

import com.google.gson.annotations.Expose;

public class ETADTO {
    @Expose
    private final int etaMilliseconds;

    public ETADTO(int etaMilliseconds) {
        this.etaMilliseconds = etaMilliseconds;
    }
}
