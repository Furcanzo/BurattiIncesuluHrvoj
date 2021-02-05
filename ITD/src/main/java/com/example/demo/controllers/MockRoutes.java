package com.example.demo.controllers;

import com.example.demo.entities.User;
import com.example.demo.services.UserService;
import com.google.gson.Gson;
import org.apache.catalina.Store;
import org.apache.coyote.Response;
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
    public StoreLocation(Float lat, Float lon) {
        this.lat = lat;
        this.lon = lon;
    }
}
class StoreSummary {
    public String name;
    public StoreLocation location;

}

class TimeSlot {
    public long start;
    public long end;

    public TimeSlot(long start, long end) {
        this.start = start;
        this.end = end;
    }
}
class LineNumber {
    public int number;
    public String id;
    public Store store;
    public TimeSlot slot;

    public LineNumber(int number, String id, Store store, TimeSlot slot) {
        this.number = number;
        this.id = id;
        this.store = store;
        this.slot = slot;
    }
}
class QRCodeVerifyRequest {
    public String code;
}


class Credentials {
    public String email;
}
@RestController
public class MockRoutes {
    private LineNumber mockLineNumber = new LineNumber(1, "id", null, new TimeSlot(1612469296447L, 1612469296447L));
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

    @PostMapping(path = "/test/login", produces = {"application/json"})
    public String login(@RequestBody Credentials cred) {
        return this.getMe(cred.email);
    }

    @PostMapping(path = "/test/QR/verify", produces = {"application/json"})
    public String verifyQR(@RequestBody QRCodeVerifyRequest req) {
        return gson.toJson(this.mockLineNumber);
    }

    @PostMapping(path = "/test/QR/generate", produces = {"application/json"})
    public String generateQR() {
        return gson.toJson(this.mockLineNumber);
    }

}
