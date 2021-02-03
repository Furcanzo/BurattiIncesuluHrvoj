package com.example.demo.services;

import com.example.demo.entities.Store;
import com.example.demo.entities.dtos.StoreDTO;
import com.example.demo.repositories.StoreRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class BackOfficeService {

    private final StoreRepository storeRepository;

    @Autowired
    public BackOfficeService(StoreRepository storeRepository) {
        this.storeRepository = storeRepository;
    }

    public Store createStore(StoreDTO store) {
        Store created = store.generateEntity();
        List<Store> partnerStores = new ArrayList<>();
        for (Store ps : created.getPartnerStores()){
            partnerStores.add(storeRepository.findById(ps.getId()).orElse(null));
        }
        created.setPartnerStores(partnerStores);
        return storeRepository.save(created);
    }
}
