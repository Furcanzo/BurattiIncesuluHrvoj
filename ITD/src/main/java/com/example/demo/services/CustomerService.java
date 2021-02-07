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

    private int number;

    @Autowired
    public CustomerService(CustomerRepository customerRepository, StoreRepository storeRepository, TimeSlotRepository timeSlotRepository, LineNumberRepository lineNumberRepository) {
        this.customerRepository = customerRepository;
        this.storeRepository = storeRepository;
        this.timeSlotRepository = timeSlotRepository;
        this.lineNumberRepository = lineNumberRepository;
        this.number = 1;
    }

    public LineNumber bookFutureLineNUmber(LineNumberDTO lineNumberDTO, Customer customer, long timestamp) throws TimeSlotFullException, NoTimeSlotsException, NoSuchEntityException {
        Store store = storeRepository.findById(lineNumberDTO.getStoreId()).orElse(null);
        if (store == null){
            throw new NoSuchEntityException();
        }
        deleteOldTimeSlots(store, timestamp);
        createNewTimeSlotsIfNeeded(store, timestamp);
        LineNumber lineNumber = generateLineNumber(lineNumberDTO, customer);
        if(noTimeSlots(lineNumber.getStore())){
            throw new NoTimeSlotsException();
        }
        if (timeSlotFull(lineNumber.getTimeSlot())){
            throw new TimeSlotFullException();
        }
        return lineNumberRepository.save(lineNumber);
    }

    private boolean timeSlotFull(TimeSlot timeSlot) {
        if (timeSlot.getLineNumbers() == null){
            return false;
        }
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

    public List<TimeSlot> availableTimeSlots(int storeId, long timestamp) throws NoSuchEntityException {
        Store store = storeRepository.findById(storeId).orElse(null);
        if (store == null){
            throw new NoSuchEntityException();
        }

        deleteOldTimeSlots(store, timestamp);
        createNewTimeSlotsIfNeeded(store, timestamp);

        List<TimeSlot> availableTimeSlots = new ArrayList<>();
        for (TimeSlot ts : store.getTimeSlots()){
            if (ts.getLineNumbers()== null || ts.getLineNumbers().size()<= store.getMaxCustomers()){
                availableTimeSlots.add(ts);
            }
        }
        return availableTimeSlots;
    }

    private void deleteOldTimeSlots(Store store, long timestamp) {

        List<TimeSlot> toDelete = new ArrayList<>();
        for (TimeSlot ts : store.getTimeSlots()){
            if (ts.getEndTime() < timestamp){
                toDelete.add(ts);
            }
        }
        for (TimeSlot ts : toDelete){
            store.removeTimeSlot(ts);
            timeSlotRepository.delete(ts);
        }
    }

    private void createNewTimeSlotsIfNeeded(Store store, long timestamp) {
        while (!enoughTimeSlots(store, timestamp)){
            createNextTimeSlot(store, timestamp);
        }
        storeRepository.save(store);
    }

    private void createNextTimeSlot(Store store, long timestamp) {
        long max = timestamp;
        for (TimeSlot ts : store.getTimeSlots()){
            if (ts.getEndTime()> max){
                max= ts.getEndTime();
            }
        }
        TimeSlot timeSlot = new TimeSlot();
        if (lastTimeSlotEndsDay(store, timestamp)){
            long startTime = calcTimeStamp(max, store.getWorkingHour().getFrom(), 1);
            timeSlot.setStartTime(startTime);
            timeSlot.setEndTime(startTime + store.getTimeOut());
        }else {
            timeSlot.setStartTime(max);
            timeSlot.setEndTime(max + store.getTimeOut());
        }
        timeSlot.setStore(store);
        timeSlotRepository.save(timeSlot);
        this.number = 1;
    }

    private boolean lastTimeSlotEndsDay(Store store, long timestamp) {
        if(store.getTimeSlots().isEmpty()) {
            return false;
        }
        long max = timestamp;
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
        date.setDate(date.getDate()+ plusDays);
        date.setHours(hour);
        date.setMinutes(0);
        date.setSeconds(0);
        return date.getTime();
    }

    private boolean enoughTimeSlots(Store store, long timestamp) {
        long max = 0;
        for (TimeSlot ts : store.getTimeSlots()){
            if (ts.getEndTime()> max){
                max= ts.getEndTime();
            }
        }
        return  store.getTimeSlots().size() > 380; //max > timestamp + 3*7*24*60*60*1000; //3 weeks
    }

    public int calcETA(LineNumberDTO lineNumberDTO, long timestamp) throws NoSuchEntityException, NoTimeSlotsException {
        Store store = storeRepository.findById(lineNumberDTO.getStoreId()).orElse(null);
        if (store == null){
            throw new NoSuchEntityException();
        }
        deleteOldTimeSlots(store, timestamp);
        createNewTimeSlotsIfNeeded(store, timestamp);
        LineNumber lineNumber = generateLineNumber(lineNumberDTO, null);
        int duration = (int)(lineNumber.getUntil()- lineNumber.getFrom());
        if (testIfFits(duration, timestamp, lineNumber.getStore().getMaxCustomers(), lineNumber.getStore().getId())){
            return 0;
        }
        for (LineNumber  ln : lineNumber.getStore().getLineNumbers()){
            if (ln.getUntil() < calcTimeStamp(lineNumber.getUntil(), lineNumber.getStore().getWorkingHour().getUntil(), 0) && testIfFits(duration, ln.getUntil(), lineNumber.getStore().getMaxCustomers(), lineNumber.getStore().getId())){
                return (int) (ln.getUntil() - timestamp);
            }
        }
        throw new NoTimeSlotsException();
    }

    private boolean testIfFits(int duration, long start, int maxCustomers, int storeId) {
        return lineNumberRepository.overLapsAt(storeId, start) < maxCustomers &&lineNumberRepository.overLapsAt(storeId, start + duration) < maxCustomers;

    }

    public LineNumber retrieveLineNumber(LineNumberDTO lineNumberDTO, Customer customer, long timestamp) throws NoTimeSlotsException, NoSuchEntityException {
        Store store = storeRepository.findById(lineNumberDTO.getStoreId()).orElse(null);
        if (store == null){
            throw new NoSuchEntityException();
        }
        deleteOldTimeSlots(store, timestamp);
        createNewTimeSlotsIfNeeded(store, timestamp);
        LineNumber lineNumber = generateLineNumber(lineNumberDTO, customer);
        if (noTimeSlots(lineNumber.getStore())){
            throw new NoTimeSlotsException();
        }
        long fromTimeStamp = timestamp + calcETA(lineNumberDTO, timestamp);
        lineNumber.setFrom(fromTimeStamp);
        lineNumber.setUntil(fromTimeStamp + (lineNumberDTO.getUntil() - lineNumberDTO.getFrom()));
        TimeSlot timeSlot = timeSlotRepository.getTimeSlotAt(lineNumber.getStore().getId(), fromTimeStamp);
        lineNumber.setTimeSlot(timeSlot);
        lineNumber.setStatus("WAITING");
        return lineNumberRepository.save(lineNumber);
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
        if (store == null){
            throw new NoSuchEntityException();
        }
        lineNumber.setTimeSlot(timeSlot);
        lineNumber.setStore(store);
        lineNumber.setCustomer(customer);
        lineNumber.setNumber(number);
        this.number++;
        return lineNumber;
    }
}
