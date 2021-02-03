package com.example.demo.services;

import com.example.demo.entities.Store;
import com.example.demo.repositories.StoreRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class BackOfficeService {

    private final StoreRepository storeRepository;

    @Autowired
    public BackOfficeService(StoreRepository storeRepository) {
        this.storeRepository = storeRepository;
    }

    public Store createStore(Store store) {
        return storeRepository.save(store);
    }
}
