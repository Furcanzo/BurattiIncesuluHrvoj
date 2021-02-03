package com.example.demo.services;

import com.example.demo.entities.Store;
import com.example.demo.entities.WorkingHour;
import com.example.demo.entities.dtos.StoreDTO;
import com.example.demo.repositories.StoreRepository;
import com.example.demo.repositories.WorkingHourRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.ArrayList;
import java.util.List;

@Service
public class BackOfficeService {

    private final StoreRepository storeRepository;

    private final WorkingHourRepository workingHourRepository;

    @Autowired
    public BackOfficeService(StoreRepository storeRepository, WorkingHourRepository workingHourRepository) {
        this.storeRepository = storeRepository;
        this.workingHourRepository = workingHourRepository;
    }

    @Transactional
    public Store createStore(StoreDTO store) {
        Store created = store.generateEntity();
        List<Store> partnerStores = new ArrayList<>();
        if (created.getPartnerStores() != null) {
            for (Store ps : created.getPartnerStores()) {
                partnerStores.add(storeRepository.findById(ps.getId()).orElse(null));
            }
            created.setPartnerStores(partnerStores);
        }
        Store saved = storeRepository.save(created);
        if (created.getWorkingHours() != null){
            for (WorkingHour wh : created.getWorkingHours()){
                workingHourRepository.save(wh);
            }
        }
        return saved;
    }
}
