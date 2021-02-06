package com.example.demo.controllers;

import com.example.demo.model.entities.Employee;
import com.example.demo.model.entities.LineNumber;
import com.example.demo.exceptions.NoSuchEntityException;
import com.example.demo.services.EmployeeService;
import com.example.demo.services.SecurityService;
import com.google.gson.Gson;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController(value = "/api")
public class ClerkRoutes {

    private final EmployeeService employeeService;

    private final SecurityService securityService;

    private final Gson gson;

    @Autowired
    public ClerkRoutes(EmployeeService employeeService, SecurityService securityService, Gson gson) {
        this.employeeService = employeeService;
        this.securityService = securityService;
        this.gson = gson;
    }

    @PatchMapping(path = "/checkinout")
    public ResponseEntity<String> checkin(@RequestParam int lineNumberId, @RequestHeader(name = "bearer") String bearer) {
        try {
            Employee employee = employeeService.findEmployeeByEmail(bearer);
            LineNumber lineNumber = employeeService.findLineNumberById(lineNumberId);
            if (securityService.checkClerk(employee, lineNumber.getStore().getId())) {
                if (employeeService.checkInOut(lineNumberId)) {
                    return ResponseEntity.status(HttpStatus.OK).body(gson.toJson(lineNumber));
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
}
