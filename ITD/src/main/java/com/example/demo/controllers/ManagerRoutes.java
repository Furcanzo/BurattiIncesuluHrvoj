package com.example.demo.controllers;

import com.example.demo.entities.Employee;
import com.example.demo.entities.Store;
import com.example.demo.exceptions.NoSuchEntityException;
import com.example.demo.services.CustomerService;
import com.example.demo.services.ManagerService;
import com.example.demo.services.SecurityService;
import com.google.gson.Gson;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
public class ManagerRoutes {

    private final CustomerService customerService;

    private final ManagerService managerService;

    private final Gson gson;

    private final SecurityService securityService;

    @Autowired
    public ManagerRoutes(CustomerService customerService, ManagerService managerService, Gson gson, SecurityService securityService) {
        this.customerService = customerService;
        this.managerService = managerService;
        this.gson = gson;
        this.securityService = securityService;
    }
/*

    }*/

    @PutMapping(path = "/store")
    public ResponseEntity<String> updateStore(@RequestBody Store store, @RequestHeader(name = "bearer") String bearer) {
        try {
            Employee employee = managerService.findEmployeeByEmail(bearer);
            if (!securityService.managerCheck(employee, store)){
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body("The requester is not a manager of the store");
            }
            Store created = managerService.updateStore(store);
            return ResponseEntity.status(HttpStatus.OK).body(gson.toJson(created));
        } catch (NoSuchEntityException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("store not found");
        }
    }

    @GetMapping
    public ResponseEntity<String> getUser (@RequestParam String type, @RequestParam int id) {
        if (type.equals("customer")){
            try {
                return ResponseEntity.status(HttpStatus.OK).body(gson.toJson(customerService.findCustomerById(id)));
            } catch (NoSuchEntityException e) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("customer not found");
            }
        } else if (type.equals("employee")){
            try {
                return ResponseEntity.status(HttpStatus.OK).body(gson.toJson(managerService.findEmployeeById(id)));
            } catch (NoSuchEntityException e) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("employee not found");
            }
        }else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("specify a valid type of user");
        }
    }

}
