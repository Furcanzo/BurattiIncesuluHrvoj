package com.example.demo.controllers;

import com.example.demo.entities.Employee;
import com.example.demo.entities.Store;
import com.example.demo.entities.dtos.EmployeeDTO;
import com.example.demo.entities.dtos.StoreDTO;
import com.example.demo.exceptions.NoSuchEntityException;
import com.example.demo.services.BackOfficeService;
import com.example.demo.services.SecurityService;
import com.google.gson.Gson;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("The requester doesn't have the permission to do this");
        }
    }

    @PostMapping(path = "manager")
    public ResponseEntity<String> addFirstManager (@RequestBody EmployeeDTO employee, @RequestHeader(name = "bearer") String bearer){
        if (securityService.backOffice(bearer)){
            try {
                Employee manager = backOfficeService.addEmployee(employee);
                return ResponseEntity.status(HttpStatus.OK).body(gson.toJson(manager));
            } catch (NoSuchEntityException e) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("store not found");
            }
        }
        else {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("The requester doesn't have the permission to do this");
        }
    }
}
