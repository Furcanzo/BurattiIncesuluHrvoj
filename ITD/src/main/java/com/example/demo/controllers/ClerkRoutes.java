package com.example.demo.controllers;

import com.example.demo.exceptions.NoTimeSlotsException;
import com.example.demo.model.dtos.LineNumberDTO;
import com.example.demo.model.entities.*;
import com.example.demo.exceptions.NoSuchEntityException;
import com.example.demo.services.CustomerService;
import com.example.demo.services.EmployeeService;
import com.example.demo.services.SecurityService;
import com.google.gson.Gson;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class ClerkRoutes {

    private final EmployeeService employeeService;

    private final CustomerService customerService;

    private final SecurityService securityService;

    private final Gson gson;

    @Autowired
    public ClerkRoutes(EmployeeService employeeService, CustomerService customerService, SecurityService securityService, Gson gson) {
        this.employeeService = employeeService;
        this.customerService = customerService;
        this.securityService = securityService;
        this.gson = gson;
    }

    @PatchMapping(path = "/checkin")
    public ResponseEntity<String> checkin(@RequestParam int lineNumberId, @RequestHeader(name = "bearer") String bearer){
        try {
            Employee employee = employeeService.findEmployeeByEmail(bearer);
            LineNumber lineNumber = employeeService.findLineNumberById(lineNumberId);
            if (securityService.checkClerk(employee, lineNumber.getStore().getId())) {
                if (employeeService.checkin(lineNumberId)) {
                    return ResponseEntity.status(HttpStatus.OK).body("Ok");
                } else {
                    return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Error");
                }
            } else {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Clerk unauthorized");
            }
        }catch (NoSuchEntityException e){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("lineNumber not found");
        }
    }

    @PatchMapping(path = "/checkout")
    public ResponseEntity<String> checkout(@RequestParam int lineNumberId, @RequestHeader(name = "bearer") String bearer) {
        try {
            Employee employee = employeeService.findEmployeeByEmail(bearer);
            LineNumber lineNumber = employeeService.findLineNumberById(lineNumberId);
            if (securityService.checkClerk(employee, lineNumber.getStore().getId())) {
                if (employeeService.checkout(lineNumberId)) {
                    return ResponseEntity.status(HttpStatus.OK).body("Ok");
                } else {
                    return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Error");
                }
            } else {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Clerk unauthorized");
            }
        } catch (NoSuchEntityException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("lineNumber not found");
        }
    }

    @PostMapping(path = "/guestTicket")
    public ResponseEntity<String> retrieveGuestLineNumber(@RequestBody LineNumberDTO lineNumber, @RequestHeader(name = "bearer") String bearer){
        try {
            Employee employee = employeeService.findEmployeeByEmail(bearer);
            if (securityService.checkClerk(employee, lineNumber.getStoreId())) {
                Store actualStore = customerService.getStore(lineNumber.getStoreId());
                try {
                    LineNumber created = customerService.retrieveLineNumber(lineNumber, null, System.currentTimeMillis());
                    return ResponseEntity.status(HttpStatus.OK).body(gson.toJson(created));
                } catch (NoTimeSlotsException e) {
                    List<TimeSlot> available = customerService.availableTimeSlots(actualStore.getId(), System.currentTimeMillis());
                    return ResponseEntity.status(HttpStatus.OK).body(gson.toJson(available));
                }
            } else {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body("The requester doesn't have the permission to do this");
            }
        } catch (NoSuchEntityException e){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("store not found");
        }
    }
}
