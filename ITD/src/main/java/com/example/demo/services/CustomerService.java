package com.example.demo.services;

import com.example.demo.exceptions.MailAlreadyUsedException;
import com.example.demo.exceptions.NoSuchEntityException;
import com.example.demo.exceptions.NoTimeSlotsException;
import com.example.demo.exceptions.TimeSlotFullException;
import com.example.demo.model.dtos.CustomerDTO;
import com.example.demo.model.dtos.LineNumberDTO;
import com.example.demo.model.entities.Customer;
import com.example.demo.model.entities.LineNumber;
import com.example.demo.model.entities.Store;
import com.example.demo.model.entities.TimeSlot;
import com.example.demo.repositories.CustomerRepository;
import com.example.demo.repositories.LineNumberRepository;
import com.example.demo.repositories.StoreRepository;
import com.example.demo.repositories.TimeSlotRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Service
public class CustomerService {

    private final CustomerRepository customerRepository;

    private final StoreRepository storeRepository;

    private final TimeSlotRepository timeSlotRepository;

    private final LineNumberRepository lineNumberRepository;

    @Autowired
    public CustomerService(CustomerRepository customerRepository, StoreRepository storeRepository, TimeSlotRepository timeSlotRepository, LineNumberRepository lineNumberRepository) {
        this.customerRepository = customerRepository;
        this.storeRepository = storeRepository;
        this.timeSlotRepository = timeSlotRepository;
        this.lineNumberRepository = lineNumberRepository;
    }

    public LineNumber bookFutureLineNUmber(LineNumberDTO lineNumberDTO, Customer customer) throws TimeSlotFullException, NoTimeSlotsException, NoSuchEntityException {
        LineNumber lineNumber = generateLineNumber(lineNumberDTO, customer);
        deleteOldTimeSlots(lineNumber.getStore());
        createNewTimeSlotsIfNeeded(lineNumber.getStore());
        if(noTimeSlots(lineNumber.getStore())){
            throw new NoTimeSlotsException();
        }
        if (timeSlotFull(lineNumber.getTimeSlot())){
            throw new TimeSlotFullException();
        }
        return lineNumberRepository.save(lineNumber);
    }

    private boolean timeSlotFull(TimeSlot timeSlot) {
        return timeSlot.getLineNumbers().size() >= timeSlot.getStore().getMaxCustomers();
    }

    private boolean noTimeSlots(Store store) {
        for (TimeSlot ts : store.getTimeSlots()){
            if (!timeSlotFull(ts)){
                return false;
            }
        }
        return true;
    }

    public List<TimeSlot> availableTimeSlots(int storeId) throws NoSuchEntityException {
        Store store = storeRepository.findById(storeId).orElse(null);
        if (store == null){
            throw new NoSuchEntityException();
        }

        deleteOldTimeSlots(store);
        createNewTimeSlotsIfNeeded(store);

        List<TimeSlot> availableTimeSlots = new ArrayList<>();
        for (TimeSlot ts : store.getTimeSlots()){
            if (ts.getLineNumbers().size()<= store.getMaxCustomers()){
                availableTimeSlots.add(ts);
            }
        }
        return availableTimeSlots;
    }

    private void deleteOldTimeSlots(Store store) {
        for (TimeSlot ts : store.getTimeSlots()){
            if (ts.getEndTime() < System.currentTimeMillis()){
                timeSlotRepository.delete(ts);
            }
        }
    }

    private void createNewTimeSlotsIfNeeded(Store store) {
        if (enoughTimeSlots(store)){
            return;
        }
        createNextTimeSlot(store);
        createNewTimeSlotsIfNeeded(store);
    }

    private void createNextTimeSlot(Store store) {
        long max = System.currentTimeMillis();
        for (TimeSlot ts : store.getTimeSlots()){
            if (ts.getEndTime()> max){
                max= ts.getEndTime();
            }
        }
        TimeSlot timeSlot = new TimeSlot();
        if (lastTimeSlotEndsDay(store)){
            long startTime = calcTimeStamp(max, store.getWorkingHour().getFrom(), 1);
            timeSlot.setStartTime(startTime);
            timeSlot.setEndTime(startTime + store.getTimeOut());
        }else {
            timeSlot.setStartTime(max);
            timeSlot.setEndTime(max + store.getTimeOut());
        }
        timeSlot.setStore(store);
        timeSlotRepository.save(timeSlot);
    }

    private boolean lastTimeSlotEndsDay(Store store) {
        if(store.getTimeSlots().isEmpty()) {
            return false;
        }
        long max = System.currentTimeMillis();
        TimeSlot maxTime = null;
        for (TimeSlot ts : store.getTimeSlots()){
            if (ts.getEndTime()> max){
                max= ts.getEndTime();
                maxTime = ts;
            }
        }
        assert maxTime != null;
        return maxTime.getEndTime() + store.getTimeOut() >= calcTimeStamp(maxTime.getEndTime(), store.getWorkingHour().getUntil(), 0);
    }

    private long calcTimeStamp(long dayTimeStamp, int hour, int plusDays) {
        Date date = new Date(dayTimeStamp);
        date.setDate(date.getDay()+ plusDays);
        date.setHours(hour);
        date.setMinutes(0);
        date.setSeconds(0);
        return date.getTime();
    }

    private boolean enoughTimeSlots(Store store) {
        long max = 0;
        for (TimeSlot ts : store.getTimeSlots()){
            if (ts.getEndTime()> max){
                max= ts.getEndTime();
            }
        }
        return max > System.currentTimeMillis() + 3*7*24*60*60*1000; //3 weeks
    }

    public int calcETA(LineNumberDTO lineNumberDTO) throws NoSuchEntityException {
        LineNumber lineNumber = generateLineNumber(lineNumberDTO, null);
        deleteOldTimeSlots(lineNumber.getStore());
        createNewTimeSlotsIfNeeded(lineNumber.getStore());
        //todo

        return 0;
    }

    public LineNumber retrieveLineNumber(LineNumberDTO lineNumberDTO, Customer customer) throws NoTimeSlotsException, NoSuchEntityException {
        LineNumber lineNumber = generateLineNumber(lineNumberDTO, customer);
        deleteOldTimeSlots(lineNumber.getStore());
        createNewTimeSlotsIfNeeded(lineNumber.getStore());
        if (noTimeSlots(lineNumber.getStore())){
            throw new NoTimeSlotsException();
        }
        //todo

        return null;
    }

    public List<Store> getStoreList() {
        return storeRepository.findAll();
    }

    public Store getStore(int id) throws NoSuchEntityException {
        Store store = storeRepository.findById(id).orElse(null);
        if (store == null){
            throw new NoSuchEntityException();
        }
        return store;
    }

    public Customer findCustomerByEmail(String email) throws NoSuchEntityException {
        Customer customer = customerRepository.findByEmail(email).orElse(null);
        if (customer == null){
            throw new NoSuchEntityException();
        }
        return customer;
    }

    public Customer register(CustomerDTO customer) throws MailAlreadyUsedException {
        Customer created = generateCustomer(customer);
        Customer error = customerRepository.findByEmail(created.getEmail()).orElse(null);
        if (error == null) {
            return customerRepository.save(created);
        }
        throw new MailAlreadyUsedException();
    }

    private Customer generateCustomer(CustomerDTO customerDTO) {
        Customer customer = new Customer();
        customer.setName(customerDTO.getName());
        customer.setSurname(customerDTO.getSurname());
        customer.setPhoneNumber(customerDTO.getPhoneNumber());
        customer.setEmail(customerDTO.getEmail());
        return customer;
    }

    private LineNumber generateLineNumber(LineNumberDTO lineNumberDTO, Customer customer) throws NoSuchEntityException {
        LineNumber lineNumber = new LineNumber();
        lineNumber.setFrom(lineNumberDTO.getFrom());
        lineNumber.setUntil(lineNumberDTO.getUntil());
        TimeSlot timeSlot = timeSlotRepository.findById(lineNumberDTO.getTimeSlotId()).orElse(null);
        Store store = storeRepository.findById(lineNumberDTO.getStoreId()).orElse(null);
        if (store == null || timeSlot == null){
            throw new NoSuchEntityException();
        }
        lineNumber.setTimeSlot(timeSlot);
        lineNumber.setStore(store);
        lineNumber.setCustomer(customer);
        return lineNumber;
    }
}
