package com.example.demo.controllers;

import com.example.demo.entities.Store;
import com.example.demo.exceptions.NoSuchEntityException;
import com.example.demo.services.CustomerService;
import com.example.demo.services.ManagerService;
import com.google.gson.Gson;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
public class ManagerRoutes {

    @Autowired
    private CustomerService customerService;

    @Autowired
    private ManagerService managerService;

    @Autowired
    private Gson gson;

    @PostMapping(path = "/store")
    public ResponseEntity<String> createStore(@RequestBody Store store) {
        Store created = managerService.createStore(store);
        return ResponseEntity.status(HttpStatus.OK).body(gson.toJson(created));
    }

    @PutMapping(path = "/store")
    public ResponseEntity<String> updateStore(@RequestBody Store store) {
        try {
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
