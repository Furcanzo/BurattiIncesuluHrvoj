package com.example.demo.controllers;

import com.example.demo.entities.User;
import com.example.demo.services.UserService;
import com.google.gson.Gson;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class CustomerRoutes {

    @Autowired
    private UserService userService;

    @Autowired
    private Gson gson;

    @GetMapping(path = "/test")
    public String sayHello(@RequestParam(value = "myName", defaultValue = "World") String name) {
        return String.format("Hello %s!", name);
    }

    @GetMapping(path = "/test2")
    public String findUsers() {
        List<User> a = userService.findAll();
        return gson.toJson(a);
    }

    @GetMapping(path = "/test3")
    public String findUsersByName( @RequestParam(name = "name") String name) {
        List<User> a = userService.findByName(name);
        return gson.toJson(a);
    }

    @PostMapping(path = "/test4")
    public String create( @RequestBody User user) {
        User a = userService.create(user);
        return gson.toJson(a);
    }

}
