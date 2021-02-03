package com.example.demo.controllers;

import com.example.demo.entities.Store;
import com.example.demo.entities.dtos.StoreDTO;
import com.example.demo.services.BackOfficeService;
import com.example.demo.services.SecurityService;
import com.google.gson.Gson;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class BackOfficeRoutes {

    private final SecurityService securityService;

    private final Gson gson;

    private BackOfficeService backOfficeService;

    @Autowired
    public BackOfficeRoutes(SecurityService securityService, Gson gson, BackOfficeService backOfficeService) {
        this.securityService = securityService;
        this.gson = gson;
        this.backOfficeService = backOfficeService;
    }

    @PostMapping(path = "/store")
    public ResponseEntity<String> createStore(@RequestBody StoreDTO store, @RequestHeader(name = "bearer") String bearer) {
        if (securityService.backOffice(bearer)) {
            Store created = backOfficeService.createStore(store);
            return ResponseEntity.status(HttpStatus.OK).body(gson.toJson(created));
        }else {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("The requester have not the permission to do this");
        }
    }
}
