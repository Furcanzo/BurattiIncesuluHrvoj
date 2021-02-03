package com.example.demo.controllers;

import com.example.demo.entities.Customer;
import com.example.demo.exceptions.NoSuchEntityException;
import com.example.demo.exceptions.NoTimeSlotsException;
import com.example.demo.exceptions.TimeSlotFullException;
import com.example.demo.entities.LineNumber;
import com.example.demo.entities.Store;
import com.example.demo.entities.TimeSlot;
import com.example.demo.services.CustomerService;
import com.example.demo.services.SecurityService;
import com.google.gson.Gson;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class CustomerRoutes {

    private final CustomerService customerService;

    private final Gson gson;

    private final SecurityService securityService;

    @Autowired
    public CustomerRoutes(CustomerService customerService, Gson gson, SecurityService securityService) {
        this.customerService = customerService;
        this.gson = gson;
        this.securityService = securityService;
    }

    @PostMapping(path = "/book")
    public ResponseEntity<String> bookFutureLineNumber(@RequestBody LineNumber lineNumber, @RequestHeader(name = "bearer") String bearer){
        try {
            Customer customer = customerService.findCustomerByEmail(bearer);
            if (securityService.checkLineNumberStealing(lineNumber, customer)){
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body("The requester is different from the actual customer");
            }
            LineNumber created = customerService.bookFutureLineNUmber(lineNumber);
            return ResponseEntity.status(HttpStatus.OK).body(gson.toJson(created));
        } catch (NoTimeSlotsException e) {
            List<Store> available = customerService.partnerStores(lineNumber.getStore());
            return ResponseEntity.status(HttpStatus.OK).body(gson.toJson(available));
        } catch (TimeSlotFullException e) {
            List<TimeSlot> available = customerService.availableTimeSlots(lineNumber.getStore());
            return ResponseEntity.status(HttpStatus.OK).body(gson.toJson(available));
        }
    }

    @GetMapping(path = "/ETA")
    public ResponseEntity<String> getETA(){
        int eta = customerService.calcETA();
        return ResponseEntity.status(HttpStatus.OK).body(gson.toJson(eta));
    }

    @PostMapping(path = "/retrieve")
    public ResponseEntity<String> retrieveLineNumber(@RequestBody LineNumber lineNumber,  @RequestHeader(name = "bearer") String bearer){
        try {
            Customer customer = customerService.findCustomerByEmail(bearer);
            if (securityService.checkLineNumberStealing(lineNumber, customer)){
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body("The requester is different from the actual customer");
            }
            LineNumber created = customerService.retrieveLineNUmber(lineNumber);
            return ResponseEntity.status(HttpStatus.OK).body(gson.toJson(created));
        } catch (NoTimeSlotsException e) {
            List<TimeSlot> available = customerService.availableTimeSlots(lineNumber.getStore());
            return ResponseEntity.status(HttpStatus.OK).body(gson.toJson(available));
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
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("store not found");
        }
    }
}
