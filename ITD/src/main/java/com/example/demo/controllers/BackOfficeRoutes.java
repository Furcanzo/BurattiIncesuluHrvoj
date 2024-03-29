package com.example.demo.controllers;

import com.example.demo.model.dtos.NewStoreDTO;
import com.example.demo.model.entities.Store;
import com.example.demo.services.BackOfficeService;
import com.example.demo.services.SecurityService;
import com.google.gson.Gson;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.transaction.Transactional;

@CrossOrigin
@RestController
@RequestMapping("/api")
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

    @PostMapping(path = "/store", consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<String> createStore(@RequestBody NewStoreDTO store, @RequestHeader(name = "bearer") String bearer) {
        if (securityService.backOffice(bearer)) {
            Store created = backOfficeService.createStore(store);
            return ResponseEntity.status(HttpStatus.OK).body(gson.toJson(created));
        } else {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("The requester doesn't have the permission to do this");
        }
    }
}
