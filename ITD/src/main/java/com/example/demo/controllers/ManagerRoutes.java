package com.example.demo.controllers;

import com.example.demo.exceptions.MailAlreadyUsedException;
import com.example.demo.exceptions.NoSuchEntityException;
import com.example.demo.model.dtos.EmployeeDTO;
import com.example.demo.model.dtos.StoreDTO;
import com.example.demo.model.entities.BackOfficeUser;
import com.example.demo.model.entities.Customer;
import com.example.demo.model.entities.Employee;
import com.example.demo.model.entities.Store;
import com.example.demo.services.CustomerService;
import com.example.demo.services.EmployeeService;
import com.example.demo.services.SecurityService;
import com.google.gson.Gson;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@CrossOrigin
@RestController
@RequestMapping("/api")
public class ManagerRoutes {

    private final EmployeeService employeeService;

    private final CustomerService customerService;

    private final Gson gson;

    private final SecurityService securityService;

    private static final String FORBIDDEN = "The requester doesn't have the permission to do this";

    private static final String NOT_FOUND = "entity not found";

    @Autowired
    public ManagerRoutes(EmployeeService employeeService, CustomerService customerService, Gson gson, SecurityService securityService) {
        this.employeeService = employeeService;
        this.customerService = customerService;
        this.gson = gson;
        this.securityService = securityService;
    }

    @PutMapping(path = "/store", consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<String> updateStore(@RequestBody StoreDTO store, @RequestHeader(name = "bearer") String bearer) {
        try {
            Employee manager = employeeService.findEmployeeByEmail(bearer);
            if (!securityService.managerCheck(manager, manager.getStore().getId())) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body(FORBIDDEN);
            }
            Store created = employeeService.updateStore(manager.getStore().getId(), store);
            return ResponseEntity.status(HttpStatus.OK).body(gson.toJson(created));
        } catch (NoSuchEntityException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(NOT_FOUND);
        }
    }


    @GetMapping(path = "/employee/list")
    public ResponseEntity<String> getAllEmployees(@RequestHeader(name = "bearer") String bearer) {
        try {
            Employee manager = employeeService.findEmployeeByEmail(bearer);
            if (securityService.managerCheck(manager, manager.getStore().getId())) {
                return ResponseEntity.status(HttpStatus.OK).body(gson.toJson(manager.getStore().getEmployees()));
            } else {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body(FORBIDDEN);
            }
        } catch (NoSuchEntityException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("bad request");
        }
    }

    @GetMapping(path = "/employee")
    public ResponseEntity<String> getEmployee(@RequestParam int id, @RequestHeader(name = "bearer") String bearer) {
        try {
            Employee manager = employeeService.findEmployeeByEmail(bearer);
            Employee requested = employeeService.findEmployeeById(id);
            if (securityService.managerCheck(manager, requested.getStore().getId())) {
                return ResponseEntity.status(HttpStatus.OK).body(gson.toJson(requested));
            } else {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body(FORBIDDEN);
            }
        } catch (NoSuchEntityException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(NOT_FOUND);
        }
    }

    @PostMapping(path = "/employee", consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<String> addEmployee(@RequestBody EmployeeDTO employee, @RequestHeader(name = "bearer") String bearer) {
        try {
            Employee manager = employeeService.findEmployeeByEmail(bearer);
            if (securityService.managerCheck(manager, employee.getStoreId())) {
                Employee newEmployee = employeeService.addEmployee(employee);
                return ResponseEntity.status(HttpStatus.OK).body(gson.toJson(newEmployee));
            } else {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body(FORBIDDEN);
            }
        } catch (NoSuchEntityException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(NOT_FOUND);
        } catch (MailAlreadyUsedException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("email already used");
        }
    }

    @PutMapping(path = "/changeRole")
    public ResponseEntity<String> changeRole(@RequestParam int id, @RequestParam String role, @RequestHeader(name = "bearer") String bearer) {
        try {
            Employee manager = employeeService.findEmployeeByEmail(bearer);
            Employee requested = employeeService.findEmployeeById(id);
            if (id == manager.getId()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("You can not change your own role");
            }
            if (securityService.managerCheck(manager, requested.getStore().getId())) {
                Employee employee = employeeService.changeRole(requested, role);
                return ResponseEntity.status(HttpStatus.OK).body(gson.toJson(employee));
            } else {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body(FORBIDDEN);
            }
        } catch (NoSuchEntityException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(NOT_FOUND);
        }
    }

    @GetMapping(path = "/monitorLive")
    public ResponseEntity<String> monitorLive(@RequestHeader(name = "bearer") String bearer) {
        try {
            Employee manager = employeeService.findEmployeeByEmail(bearer);
            if (securityService.managerCheck(manager, manager.getStore().getId())) {
                return ResponseEntity.status(HttpStatus.OK).body(gson.toJson(employeeService.monitorLive(manager.getStore().getId())));
            } else {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body(FORBIDDEN);
            }
        } catch (NoSuchEntityException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(NOT_FOUND);
        }

    }

    @GetMapping(path = "/login")
    public ResponseEntity<String> login(@RequestParam(name = "email") String email) {
        if (email.equals("backOffice")) {
            return ResponseEntity.status(HttpStatus.OK).body(gson.toJson(new BackOfficeUser()));
        }
        try {
            Employee employee = employeeService.findEmployeeByEmail(email);
            return ResponseEntity.status(HttpStatus.OK).body(gson.toJson(employee));
        } catch (NoSuchEntityException e) {
            try {
                Customer customer = customerService.findCustomerByEmail(email);
                return ResponseEntity.status(HttpStatus.OK).body(gson.toJson(customer));
            } catch (NoSuchEntityException e1) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("User not registered");
            }
        }
    }

}
