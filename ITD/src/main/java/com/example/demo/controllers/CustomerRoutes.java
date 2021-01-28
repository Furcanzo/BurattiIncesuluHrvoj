package com.example.demo.controllers;

import com.example.demo.entities.User;
import com.example.demo.services.CustomerService;
import com.google.gson.Gson;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class CustomerRoutes {

    @Autowired
    private CustomerService customerService;

    @Autowired
    private Gson gson;

    @GetMapping(path = "/test")
    public ResponseEntity<String> sayHello(@RequestParam(value = "myName", defaultValue = "World") String name) {
        return ResponseEntity.status(HttpStatus.OK).body( "Hello " + name);
    }

    @GetMapping(path = "/test2")
    public String findUsers() {
        List<User> a = customerService.findAll();
        return gson.toJson(a);
    }

    @GetMapping(path = "/test3")
    public String findUsersByName( @RequestParam(name = "name") String name) {
        List<User> a = customerService.findByName(name);
        return gson.toJson(a);
    }

    @PostMapping(path = "/test4")
    public String create( @RequestBody User user) {
        User a = customerService.create(user);
        return gson.toJson(a);
    }

}
