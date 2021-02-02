package com.example.demo.controllers;

import com.example.demo.entities.Credentials;
import com.example.demo.entities.User;
import com.example.demo.services.UserService;
import com.google.gson.Gson;
import org.apache.catalina.Store;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

class UserResponse {
    public String email;
    public String userType;

    public UserResponse(String email, String userType) {
        this.email = email;
        this.userType = userType;
    }
}

class StoreLocation {
    public Float lat;
    public Float lon;
}
class StoreSummary {
    public String name;
    public StoreLocation location;
}
@RestController
public class MockRoutes {

    @Autowired
    private Gson gson;

    @GetMapping(path = "/test/me", produces = {"application/json"})
    public String getMe(@RequestHeader(name = "Bearer", defaultValue = "") String email) {
        String userType = "customer";
        if (email.isEmpty()) {
            userType = "anonymous";
        }
        if (email.contains("manager")) {
            userType = "manager";
        }
        if (email.contains("clerk")) {
            userType = "clerk";
        }
        if (email.contains("backoffice")) {
            userType = "backoffice";
        }
        return gson.toJson(new UserResponse(email, userType));
    }

    @GetMapping(path = "/test/logout", produces = {"application/json"})
    public String logout() {
        return gson.toJson(new UserResponse("", "anonymous"));
    }

    @GetMapping(path = "/test/login", produces = {"application/json"})
    public String login(@RequestBody Credentials cred) {
        return this.getMe(cred.email);
    }


}
