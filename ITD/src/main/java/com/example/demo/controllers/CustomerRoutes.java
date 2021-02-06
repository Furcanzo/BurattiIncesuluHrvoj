package com.example.demo.controllers;

import com.example.demo.model.entities.Customer;
import com.example.demo.model.entities.LineNumber;
import com.example.demo.model.entities.Store;
import com.example.demo.model.entities.TimeSlot;
import com.example.demo.model.dtos.CustomerDTO;
import com.example.demo.model.dtos.LineNumberDTO;
import com.example.demo.exceptions.NoSuchEntityException;
import com.example.demo.exceptions.NoTimeSlotsException;
import com.example.demo.exceptions.TimeSlotFullException;
import com.example.demo.services.CustomerService;
import com.google.gson.Gson;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController(value = "/api")
public class CustomerRoutes {

    private final CustomerService customerService;

    private final Gson gson;

    private static final String STORE_NOT_AVAILABLE = "Store not available";
    private static final String TIMESLOT_IS_FULL = "Maximum capacity reached";
    private static final String STORE_NOT_FOUND = "store not found";

    @Autowired
    public CustomerRoutes(CustomerService customerService, Gson gson) {
        this.customerService = customerService;
        this.gson = gson;
    }

    @PostMapping(path = "/book")
    public ResponseEntity<String> bookFutureLineNumber(@RequestBody LineNumberDTO lineNumber, @RequestHeader(name = "bearer") String bearer){
        try {
            Store actualStore = customerService.getStore(lineNumber.getStoreId());
            try {
                Customer customer = customerService.findCustomerByEmail(bearer);
                LineNumber created = customerService.bookFutureLineNUmber(lineNumber, customer, actualStore );
                return ResponseEntity.status(HttpStatus.OK).body(gson.toJson(created));
            } catch (NoTimeSlotsException e) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(STORE_NOT_AVAILABLE);
            } catch (TimeSlotFullException e) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(TIMESLOT_IS_FULL);
            }
        } catch (NoSuchEntityException e){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(STORE_NOT_FOUND);
        }
    }

    @GetMapping(path = "/ETA")
    public ResponseEntity<String> getETA(){
        int eta = customerService.calcETA();
        return ResponseEntity.status(HttpStatus.OK).body(gson.toJson(eta));
    }

    @PostMapping(path = "/retrieve")
    public ResponseEntity<String> retrieveLineNumber(@RequestBody LineNumberDTO lineNumber,  @RequestHeader(name = "bearer") String bearer){
        try {
            Store actualStore = customerService.getStore(lineNumber.getStoreId());
            try {
                Customer customer = customerService.findCustomerByEmail(bearer);
                LineNumber created = customerService.retrieveLineNumber(lineNumber, customer);
                return ResponseEntity.status(HttpStatus.OK).body(gson.toJson(created));
            } catch (NoTimeSlotsException e) {
                List<TimeSlot> available = customerService.availableTimeSlots(actualStore);
                return ResponseEntity.status(HttpStatus.OK).body(gson.toJson(available));
            }
        } catch (NoSuchEntityException e){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(STORE_NOT_FOUND);
        }
    }

    @GetMapping(path = "/store/list")
    public ResponseEntity<String> getStoreList(){
        return ResponseEntity.status(HttpStatus.OK).body(gson.toJson(customerService.getStoreList()));
    }


    @GetMapping(path = "/store")
    public ResponseEntity<String> getStoreDetails(@RequestParam int id){
        try {
            return ResponseEntity.status(HttpStatus.OK).body(gson.toJson(customerService.getStore(id)));
        } catch (NoSuchEntityException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(STORE_NOT_FOUND);
        }
    }

    @PostMapping(path = "/register")
    public ResponseEntity<String> register(@RequestBody CustomerDTO customer){
        return ResponseEntity.status(HttpStatus.OK).body(gson.toJson(customerService.register(customer)));
    }
}
