package com.example.demo.controllers;

import com.example.demo.model.entities.Employee;
import com.example.demo.model.entities.Store;
import com.example.demo.model.dtos.EmployeeDTO;
import com.example.demo.model.dtos.StoreDTO;
import com.example.demo.exceptions.NoSuchEntityException;
import com.example.demo.services.CustomerService;
import com.example.demo.services.EmployeeService;
import com.example.demo.services.SecurityService;
import com.google.gson.Gson;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController(value = "/api")
public class ManagerRoutes {

    private final CustomerService customerService;

    private final EmployeeService employeeService;

    private final Gson gson;

    private final SecurityService securityService;

    @Autowired
    public ManagerRoutes(CustomerService customerService, EmployeeService employeeService, Gson gson, SecurityService securityService) {
        this.customerService = customerService;
        this.employeeService = employeeService;
        this.gson = gson;
        this.securityService = securityService;
    }

    @PutMapping(path = "/store")
    public ResponseEntity<String> updateStore(@RequestParam int storeId, @RequestBody StoreDTO store, @RequestHeader(name = "bearer") String bearer) {
        try {
            Employee employee = employeeService.findEmployeeByEmail(bearer);
            if (!securityService.managerCheck(employee, storeId)){
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body("The requester is not a manager of the store");
            }
            Store created = employeeService.updateStore(storeId, store);
            return ResponseEntity.status(HttpStatus.OK).body(gson.toJson(created));
        } catch (NoSuchEntityException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("store not found");
        }
    }

    //todo add security
    @GetMapping(path = "/user")
    public ResponseEntity<String> getUser (@RequestParam String type, @RequestParam int id) {
        if (type.equals("customer")){
            try {
                return ResponseEntity.status(HttpStatus.OK).body(gson.toJson(customerService.findCustomerById(id)));
            } catch (NoSuchEntityException e) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("customer not found");
            }
        } else if (type.equals("employee")){
            try {
                return ResponseEntity.status(HttpStatus.OK).body(gson.toJson(employeeService.findEmployeeById(id)));
            } catch (NoSuchEntityException e) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("employee not found");
            }
        }else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("specify a valid type of user");
        }
    }

    @PostMapping(path = "/employee")
    public ResponseEntity<String> addEmployee (@RequestBody EmployeeDTO employee, @RequestHeader(name = "bearer") String bearer){
        Employee manager = employeeService.findEmployeeByEmail(bearer);
        if (securityService.managerCheck(manager,employee.getStoreId())){
            try {
                Employee newEmployee = employeeService.addEmployee(employee);
                return ResponseEntity.status(HttpStatus.OK).body(gson.toJson(newEmployee));
            } catch (NoSuchEntityException e) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("store not found");
            }
        }
        else {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("The requester doesn't have the permission to do this");
        }
    }

    @GetMapping(path = "/monitorLive")
    public ResponseEntity<String> monitorLive (@RequestParam int id, @RequestHeader(name = "bearer") String bearer) {
        Employee manager = employeeService.findEmployeeByEmail(bearer);
        if (securityService.managerCheck(manager, id)){
            return ResponseEntity.status(HttpStatus.OK).body(gson.toJson(employeeService.monitorLive(id)));
        }else {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("The requester doesn't have the permission to do this");
        }


    }

}
