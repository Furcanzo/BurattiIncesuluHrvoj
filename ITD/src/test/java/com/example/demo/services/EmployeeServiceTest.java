package com.example.demo.services;

import com.example.demo.exceptions.MailAlreadyUsedException;
import com.example.demo.exceptions.NoSuchEntityException;
import com.example.demo.model.MonitorState;
import com.example.demo.model.dtos.EmployeeDTO;
import com.example.demo.model.dtos.StoreDTO;
import com.example.demo.model.dtos.WorkingHourDTO;
import com.example.demo.model.entities.*;
import com.example.demo.repositories.*;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.Mock;
import org.mockito.junit.MockitoJUnitRunner;

import java.util.Arrays;
import java.util.Optional;

import static org.junit.Assert.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@RunWith(MockitoJUnitRunner.class)
public class EmployeeServiceTest {

    @Mock
    private StoreRepository mockStoreRepository;
    @Mock
    private EmployeeRepository mockEmployeeRepository;
    @Mock
    private LineNumberRepository mockLineNumberRepository;
    @Mock
    private TimeSlotRepository mockTimeSlotRepository;
    @Mock
    private WorkingHourRepository mockWorkingHourRepository;

    private EmployeeService employeeServiceUnderTest;

    @Before
    public void setUp() {
        employeeServiceUnderTest = new EmployeeService(mockStoreRepository, mockEmployeeRepository, mockLineNumberRepository, mockTimeSlotRepository, mockWorkingHourRepository);
    }

    @Test
    public void testUpdateStore() {
        // Setup
        final StoreDTO store = new StoreDTO("name", "description", 0.0, 0.0, 0, 0, new WorkingHourDTO(0, 0), Arrays.asList(0));

        // Configure StoreRepository.findById(...).
        final Store store2 = new Store();
        store2.setId(0);
        store2.setName("name");
        store2.setDescription("description");
        store2.setLongitude(0.0);
        store2.setLatitude(0.0);
        store2.setMaxCustomers(0);
        store2.setTimeOut(0);
        final LineNumber lineNumber = new LineNumber();
        lineNumber.setId(0);
        lineNumber.setStatus("status");
        lineNumber.setNumber(0);
        lineNumber.setFrom(0L);
        lineNumber.setUntil(0L);
        final TimeSlot timeSlot = new TimeSlot();
        timeSlot.setId(0);
        timeSlot.setStartTime(0L);
        timeSlot.setEndTime(0L);
        timeSlot.setStore(new Store());
        timeSlot.setLineNumbers(Arrays.asList(new LineNumber()));
        lineNumber.setTimeSlot(timeSlot);
        lineNumber.setStore(new Store());
        final Customer customer = new Customer();
        customer.setId(0);
        customer.setName("name");
        customer.setSurname("surname");
        customer.setPhoneNumber("phoneNumber");
        customer.setEmail("email");
        customer.setLineNumbers(Arrays.asList(new LineNumber()));
        lineNumber.setCustomer(customer);
        store2.setLineNumbers(Arrays.asList(lineNumber));
        final WorkingHour workingHour = new WorkingHour();
        workingHour.setId(0);
        workingHour.setFrom(0);
        workingHour.setUntil(0);
        workingHour.setStore(new Store());
        store2.setWorkingHour(workingHour);
        final Employee employee = new Employee();
        employee.setId(0);
        employee.setEmail("email");
        employee.setRole("role");
        employee.setStore(new Store());
        store2.setEmployees(Arrays.asList(employee));
        final Optional<Store> store1 = Optional.of(store2);
        when(mockStoreRepository.findById(0)).thenReturn(store1);

        // Configure WorkingHourRepository.save(...).
        final WorkingHour workingHour1 = new WorkingHour();
        workingHour1.setId(0);
        workingHour1.setFrom(0);
        workingHour1.setUntil(0);
        final Store store3 = new Store();
        store3.setId(0);
        store3.setName("name");
        store3.setDescription("description");
        store3.setLongitude(0.0);
        store3.setLatitude(0.0);
        store3.setMaxCustomers(0);
        store3.setTimeOut(0);
        final LineNumber lineNumber1 = new LineNumber();
        lineNumber1.setId(0);
        lineNumber1.setStatus("status");
        lineNumber1.setNumber(0);
        lineNumber1.setFrom(0L);
        lineNumber1.setUntil(0L);
        final TimeSlot timeSlot1 = new TimeSlot();
        timeSlot1.setId(0);
        timeSlot1.setStartTime(0L);
        timeSlot1.setEndTime(0L);
        timeSlot1.setStore(new Store());
        timeSlot1.setLineNumbers(Arrays.asList(new LineNumber()));
        lineNumber1.setTimeSlot(timeSlot1);
        lineNumber1.setStore(new Store());
        final Customer customer1 = new Customer();
        customer1.setId(0);
        customer1.setName("name");
        customer1.setSurname("surname");
        customer1.setPhoneNumber("phoneNumber");
        customer1.setEmail("email");
        customer1.setLineNumbers(Arrays.asList(new LineNumber()));
        lineNumber1.setCustomer(customer1);
        store3.setLineNumbers(Arrays.asList(lineNumber1));
        store3.setWorkingHour(new WorkingHour());
        final Employee employee1 = new Employee();
        employee1.setId(0);
        employee1.setEmail("email");
        employee1.setRole("role");
        employee1.setStore(new Store());
        store3.setEmployees(Arrays.asList(employee1));
        workingHour1.setStore(store3);
        when(mockWorkingHourRepository.save(any(WorkingHour.class))).thenReturn(workingHour1);

        // Configure StoreRepository.save(...).
        final Store store4 = new Store();
        store4.setId(0);
        store4.setName("name");
        store4.setDescription("description");
        store4.setLongitude(0.0);
        store4.setLatitude(0.0);
        store4.setMaxCustomers(0);
        store4.setTimeOut(0);
        final LineNumber lineNumber2 = new LineNumber();
        lineNumber2.setId(0);
        lineNumber2.setStatus("status");
        lineNumber2.setNumber(0);
        lineNumber2.setFrom(0L);
        lineNumber2.setUntil(0L);
        final TimeSlot timeSlot2 = new TimeSlot();
        timeSlot2.setId(0);
        timeSlot2.setStartTime(0L);
        timeSlot2.setEndTime(0L);
        timeSlot2.setStore(new Store());
        timeSlot2.setLineNumbers(Arrays.asList(new LineNumber()));
        lineNumber2.setTimeSlot(timeSlot2);
        lineNumber2.setStore(new Store());
        final Customer customer2 = new Customer();
        customer2.setId(0);
        customer2.setName("name");
        customer2.setSurname("surname");
        customer2.setPhoneNumber("phoneNumber");
        customer2.setEmail("email");
        customer2.setLineNumbers(Arrays.asList(new LineNumber()));
        lineNumber2.setCustomer(customer2);
        store4.setLineNumbers(Arrays.asList(lineNumber2));
        final WorkingHour workingHour2 = new WorkingHour();
        workingHour2.setId(0);
        workingHour2.setFrom(0);
        workingHour2.setUntil(0);
        workingHour2.setStore(new Store());
        store4.setWorkingHour(workingHour2);
        final Employee employee2 = new Employee();
        employee2.setId(0);
        employee2.setEmail("email");
        employee2.setRole("role");
        employee2.setStore(new Store());
        store4.setEmployees(Arrays.asList(employee2));
        when(mockStoreRepository.save(any(Store.class))).thenReturn(store4);

        // Run the test
        final Store result = employeeServiceUnderTest.updateStore(0, store);

        // Verify the results
        verify(mockWorkingHourRepository).delete(any(WorkingHour.class));
    }

    @Test(expected = NoSuchEntityException.class)
    public void testUpdateStore_ThrowsNoSuchEntityException() {
        // Setup
        final StoreDTO store = new StoreDTO("name", "description", 0.0, 0.0, 0, 0, new WorkingHourDTO(0, 0), Arrays.asList(0));

        // Configure StoreRepository.findById(...).
        final Store store2 = new Store();
        store2.setId(0);
        store2.setName("name");
        store2.setDescription("description");
        store2.setLongitude(0.0);
        store2.setLatitude(0.0);
        store2.setMaxCustomers(0);
        store2.setTimeOut(0);
        final LineNumber lineNumber = new LineNumber();
        lineNumber.setId(0);
        lineNumber.setStatus("status");
        lineNumber.setNumber(0);
        lineNumber.setFrom(0L);
        lineNumber.setUntil(0L);
        final TimeSlot timeSlot = new TimeSlot();
        timeSlot.setId(0);
        timeSlot.setStartTime(0L);
        timeSlot.setEndTime(0L);
        timeSlot.setStore(new Store());
        timeSlot.setLineNumbers(Arrays.asList(new LineNumber()));
        lineNumber.setTimeSlot(timeSlot);
        lineNumber.setStore(new Store());
        final Customer customer = new Customer();
        customer.setId(0);
        customer.setName("name");
        customer.setSurname("surname");
        customer.setPhoneNumber("phoneNumber");
        customer.setEmail("email");
        customer.setLineNumbers(Arrays.asList(new LineNumber()));
        lineNumber.setCustomer(customer);
        store2.setLineNumbers(Arrays.asList(lineNumber));
        final WorkingHour workingHour = new WorkingHour();
        workingHour.setId(0);
        workingHour.setFrom(0);
        workingHour.setUntil(0);
        workingHour.setStore(new Store());
        store2.setWorkingHour(workingHour);
        final Employee employee = new Employee();
        employee.setId(0);
        employee.setEmail("email");
        employee.setRole("role");
        employee.setStore(new Store());
        store2.setEmployees(Arrays.asList(employee));
        final Optional<Store> store1 = Optional.of(store2);
        when(mockStoreRepository.findById(0)).thenReturn(store1);

        // Configure WorkingHourRepository.save(...).
        final WorkingHour workingHour1 = new WorkingHour();
        workingHour1.setId(0);
        workingHour1.setFrom(0);
        workingHour1.setUntil(0);
        final Store store3 = new Store();
        store3.setId(0);
        store3.setName("name");
        store3.setDescription("description");
        store3.setLongitude(0.0);
        store3.setLatitude(0.0);
        store3.setMaxCustomers(0);
        store3.setTimeOut(0);
        final LineNumber lineNumber1 = new LineNumber();
        lineNumber1.setId(0);
        lineNumber1.setStatus("status");
        lineNumber1.setNumber(0);
        lineNumber1.setFrom(0L);
        lineNumber1.setUntil(0L);
        final TimeSlot timeSlot1 = new TimeSlot();
        timeSlot1.setId(0);
        timeSlot1.setStartTime(0L);
        timeSlot1.setEndTime(0L);
        timeSlot1.setStore(new Store());
        timeSlot1.setLineNumbers(Arrays.asList(new LineNumber()));
        lineNumber1.setTimeSlot(timeSlot1);
        lineNumber1.setStore(new Store());
        final Customer customer1 = new Customer();
        customer1.setId(0);
        customer1.setName("name");
        customer1.setSurname("surname");
        customer1.setPhoneNumber("phoneNumber");
        customer1.setEmail("email");
        customer1.setLineNumbers(Arrays.asList(new LineNumber()));
        lineNumber1.setCustomer(customer1);
        store3.setLineNumbers(Arrays.asList(lineNumber1));
        store3.setWorkingHour(new WorkingHour());
        final Employee employee1 = new Employee();
        employee1.setId(0);
        employee1.setEmail("email");
        employee1.setRole("role");
        employee1.setStore(new Store());
        store3.setEmployees(Arrays.asList(employee1));
        workingHour1.setStore(store3);
        when(mockWorkingHourRepository.save(any(WorkingHour.class))).thenReturn(workingHour1);

        // Configure StoreRepository.save(...).
        final Store store4 = new Store();
        store4.setId(0);
        store4.setName("name");
        store4.setDescription("description");
        store4.setLongitude(0.0);
        store4.setLatitude(0.0);
        store4.setMaxCustomers(0);
        store4.setTimeOut(0);
        final LineNumber lineNumber2 = new LineNumber();
        lineNumber2.setId(0);
        lineNumber2.setStatus("status");
        lineNumber2.setNumber(0);
        lineNumber2.setFrom(0L);
        lineNumber2.setUntil(0L);
        final TimeSlot timeSlot2 = new TimeSlot();
        timeSlot2.setId(0);
        timeSlot2.setStartTime(0L);
        timeSlot2.setEndTime(0L);
        timeSlot2.setStore(new Store());
        timeSlot2.setLineNumbers(Arrays.asList(new LineNumber()));
        lineNumber2.setTimeSlot(timeSlot2);
        lineNumber2.setStore(new Store());
        final Customer customer2 = new Customer();
        customer2.setId(0);
        customer2.setName("name");
        customer2.setSurname("surname");
        customer2.setPhoneNumber("phoneNumber");
        customer2.setEmail("email");
        customer2.setLineNumbers(Arrays.asList(new LineNumber()));
        lineNumber2.setCustomer(customer2);
        store4.setLineNumbers(Arrays.asList(lineNumber2));
        final WorkingHour workingHour2 = new WorkingHour();
        workingHour2.setId(0);
        workingHour2.setFrom(0);
        workingHour2.setUntil(0);
        workingHour2.setStore(new Store());
        store4.setWorkingHour(workingHour2);
        final Employee employee2 = new Employee();
        employee2.setId(0);
        employee2.setEmail("email");
        employee2.setRole("role");
        employee2.setStore(new Store());
        store4.setEmployees(Arrays.asList(employee2));
        when(mockStoreRepository.save(any(Store.class))).thenReturn(store4);

        // Run the test
        employeeServiceUnderTest.updateStore(0, store);
    }

    @Test
    public void testUpdateStore_StoreRepositoryFindByIdReturnsAbsent() {
        // Setup
        final StoreDTO store = new StoreDTO("name", "description", 0.0, 0.0, 0, 0, new WorkingHourDTO(0, 0), Arrays.asList(0));
        when(mockStoreRepository.findById(0)).thenReturn(Optional.empty());

        // Configure WorkingHourRepository.save(...).
        final WorkingHour workingHour = new WorkingHour();
        workingHour.setId(0);
        workingHour.setFrom(0);
        workingHour.setUntil(0);
        final Store store1 = new Store();
        store1.setId(0);
        store1.setName("name");
        store1.setDescription("description");
        store1.setLongitude(0.0);
        store1.setLatitude(0.0);
        store1.setMaxCustomers(0);
        store1.setTimeOut(0);
        final LineNumber lineNumber = new LineNumber();
        lineNumber.setId(0);
        lineNumber.setStatus("status");
        lineNumber.setNumber(0);
        lineNumber.setFrom(0L);
        lineNumber.setUntil(0L);
        final TimeSlot timeSlot = new TimeSlot();
        timeSlot.setId(0);
        timeSlot.setStartTime(0L);
        timeSlot.setEndTime(0L);
        timeSlot.setStore(new Store());
        timeSlot.setLineNumbers(Arrays.asList(new LineNumber()));
        lineNumber.setTimeSlot(timeSlot);
        lineNumber.setStore(new Store());
        final Customer customer = new Customer();
        customer.setId(0);
        customer.setName("name");
        customer.setSurname("surname");
        customer.setPhoneNumber("phoneNumber");
        customer.setEmail("email");
        customer.setLineNumbers(Arrays.asList(new LineNumber()));
        lineNumber.setCustomer(customer);
        store1.setLineNumbers(Arrays.asList(lineNumber));
        store1.setWorkingHour(new WorkingHour());
        final Employee employee = new Employee();
        employee.setId(0);
        employee.setEmail("email");
        employee.setRole("role");
        employee.setStore(new Store());
        store1.setEmployees(Arrays.asList(employee));
        workingHour.setStore(store1);
        when(mockWorkingHourRepository.save(any(WorkingHour.class))).thenReturn(workingHour);

        // Configure StoreRepository.save(...).
        final Store store2 = new Store();
        store2.setId(0);
        store2.setName("name");
        store2.setDescription("description");
        store2.setLongitude(0.0);
        store2.setLatitude(0.0);
        store2.setMaxCustomers(0);
        store2.setTimeOut(0);
        final LineNumber lineNumber1 = new LineNumber();
        lineNumber1.setId(0);
        lineNumber1.setStatus("status");
        lineNumber1.setNumber(0);
        lineNumber1.setFrom(0L);
        lineNumber1.setUntil(0L);
        final TimeSlot timeSlot1 = new TimeSlot();
        timeSlot1.setId(0);
        timeSlot1.setStartTime(0L);
        timeSlot1.setEndTime(0L);
        timeSlot1.setStore(new Store());
        timeSlot1.setLineNumbers(Arrays.asList(new LineNumber()));
        lineNumber1.setTimeSlot(timeSlot1);
        lineNumber1.setStore(new Store());
        final Customer customer1 = new Customer();
        customer1.setId(0);
        customer1.setName("name");
        customer1.setSurname("surname");
        customer1.setPhoneNumber("phoneNumber");
        customer1.setEmail("email");
        customer1.setLineNumbers(Arrays.asList(new LineNumber()));
        lineNumber1.setCustomer(customer1);
        store2.setLineNumbers(Arrays.asList(lineNumber1));
        final WorkingHour workingHour1 = new WorkingHour();
        workingHour1.setId(0);
        workingHour1.setFrom(0);
        workingHour1.setUntil(0);
        workingHour1.setStore(new Store());
        store2.setWorkingHour(workingHour1);
        final Employee employee1 = new Employee();
        employee1.setId(0);
        employee1.setEmail("email");
        employee1.setRole("role");
        employee1.setStore(new Store());
        store2.setEmployees(Arrays.asList(employee1));
        when(mockStoreRepository.save(any(Store.class))).thenReturn(store2);

        // Run the test
        final Store result = employeeServiceUnderTest.updateStore(0, store);

        // Verify the results
        verify(mockWorkingHourRepository).delete(any(WorkingHour.class));
    }

    @Test
    public void testFindEmployeeById() {
        // Setup

        // Configure EmployeeRepository.findById(...).
        final Employee employee1 = new Employee();
        employee1.setId(0);
        employee1.setEmail("email");
        employee1.setRole("role");
        final Store store = new Store();
        store.setId(0);
        store.setName("name");
        store.setDescription("description");
        store.setLongitude(0.0);
        store.setLatitude(0.0);
        store.setMaxCustomers(0);
        store.setTimeOut(0);
        final LineNumber lineNumber = new LineNumber();
        lineNumber.setId(0);
        lineNumber.setStatus("status");
        lineNumber.setNumber(0);
        lineNumber.setFrom(0L);
        lineNumber.setUntil(0L);
        final TimeSlot timeSlot = new TimeSlot();
        timeSlot.setId(0);
        timeSlot.setStartTime(0L);
        timeSlot.setEndTime(0L);
        timeSlot.setStore(new Store());
        timeSlot.setLineNumbers(Arrays.asList(new LineNumber()));
        lineNumber.setTimeSlot(timeSlot);
        lineNumber.setStore(new Store());
        final Customer customer = new Customer();
        customer.setId(0);
        customer.setName("name");
        customer.setSurname("surname");
        customer.setPhoneNumber("phoneNumber");
        customer.setEmail("email");
        customer.setLineNumbers(Arrays.asList(new LineNumber()));
        lineNumber.setCustomer(customer);
        store.setLineNumbers(Arrays.asList(lineNumber));
        final WorkingHour workingHour = new WorkingHour();
        workingHour.setId(0);
        workingHour.setFrom(0);
        workingHour.setUntil(0);
        workingHour.setStore(new Store());
        store.setWorkingHour(workingHour);
        store.setEmployees(Arrays.asList(new Employee()));
        employee1.setStore(store);
        final Optional<Employee> employee = Optional.of(employee1);
        when(mockEmployeeRepository.findById(0)).thenReturn(employee);

        // Run the test
        final Employee result = employeeServiceUnderTest.findEmployeeById(0);

        // Verify the results
    }

    @Test(expected = NoSuchEntityException.class)
    public void testFindEmployeeById_ThrowsNoSuchEntityException() {
        // Setup

        // Configure EmployeeRepository.findById(...).
        final Employee employee1 = new Employee();
        employee1.setId(0);
        employee1.setEmail("email");
        employee1.setRole("role");
        final Store store = new Store();
        store.setId(0);
        store.setName("name");
        store.setDescription("description");
        store.setLongitude(0.0);
        store.setLatitude(0.0);
        store.setMaxCustomers(0);
        store.setTimeOut(0);
        final LineNumber lineNumber = new LineNumber();
        lineNumber.setId(0);
        lineNumber.setStatus("status");
        lineNumber.setNumber(0);
        lineNumber.setFrom(0L);
        lineNumber.setUntil(0L);
        final TimeSlot timeSlot = new TimeSlot();
        timeSlot.setId(0);
        timeSlot.setStartTime(0L);
        timeSlot.setEndTime(0L);
        timeSlot.setStore(new Store());
        timeSlot.setLineNumbers(Arrays.asList(new LineNumber()));
        lineNumber.setTimeSlot(timeSlot);
        lineNumber.setStore(new Store());
        final Customer customer = new Customer();
        customer.setId(0);
        customer.setName("name");
        customer.setSurname("surname");
        customer.setPhoneNumber("phoneNumber");
        customer.setEmail("email");
        customer.setLineNumbers(Arrays.asList(new LineNumber()));
        lineNumber.setCustomer(customer);
        store.setLineNumbers(Arrays.asList(lineNumber));
        final WorkingHour workingHour = new WorkingHour();
        workingHour.setId(0);
        workingHour.setFrom(0);
        workingHour.setUntil(0);
        workingHour.setStore(new Store());
        store.setWorkingHour(workingHour);
        store.setEmployees(Arrays.asList(new Employee()));
        employee1.setStore(store);
        final Optional<Employee> employee = Optional.of(employee1);
        when(mockEmployeeRepository.findById(0)).thenReturn(employee);

        // Run the test
        employeeServiceUnderTest.findEmployeeById(0);
    }

    @Test
    public void testFindEmployeeById_EmployeeRepositoryReturnsAbsent() {
        // Setup
        when(mockEmployeeRepository.findById(0)).thenReturn(Optional.empty());

        // Run the test
        final Employee result = employeeServiceUnderTest.findEmployeeById(0);

        // Verify the results
    }

    @Test
    public void testFindEmployeeByEmail() {
        // Setup

        // Configure EmployeeRepository.findByEmail(...).
        final Employee employee1 = new Employee();
        employee1.setId(0);
        employee1.setEmail("email");
        employee1.setRole("role");
        final Store store = new Store();
        store.setId(0);
        store.setName("name");
        store.setDescription("description");
        store.setLongitude(0.0);
        store.setLatitude(0.0);
        store.setMaxCustomers(0);
        store.setTimeOut(0);
        final LineNumber lineNumber = new LineNumber();
        lineNumber.setId(0);
        lineNumber.setStatus("status");
        lineNumber.setNumber(0);
        lineNumber.setFrom(0L);
        lineNumber.setUntil(0L);
        final TimeSlot timeSlot = new TimeSlot();
        timeSlot.setId(0);
        timeSlot.setStartTime(0L);
        timeSlot.setEndTime(0L);
        timeSlot.setStore(new Store());
        timeSlot.setLineNumbers(Arrays.asList(new LineNumber()));
        lineNumber.setTimeSlot(timeSlot);
        lineNumber.setStore(new Store());
        final Customer customer = new Customer();
        customer.setId(0);
        customer.setName("name");
        customer.setSurname("surname");
        customer.setPhoneNumber("phoneNumber");
        customer.setEmail("email");
        customer.setLineNumbers(Arrays.asList(new LineNumber()));
        lineNumber.setCustomer(customer);
        store.setLineNumbers(Arrays.asList(lineNumber));
        final WorkingHour workingHour = new WorkingHour();
        workingHour.setId(0);
        workingHour.setFrom(0);
        workingHour.setUntil(0);
        workingHour.setStore(new Store());
        store.setWorkingHour(workingHour);
        store.setEmployees(Arrays.asList(new Employee()));
        employee1.setStore(store);
        final Optional<Employee> employee = Optional.of(employee1);
        when(mockEmployeeRepository.findByEmail("email")).thenReturn(employee);

        // Run the test
        final Employee result = employeeServiceUnderTest.findEmployeeByEmail("email");

        // Verify the results
    }

    @Test(expected = NoSuchEntityException.class)
    public void testFindEmployeeByEmail_ThrowsNoSuchEntityException() {
        // Setup

        // Configure EmployeeRepository.findByEmail(...).
        final Employee employee1 = new Employee();
        employee1.setId(0);
        employee1.setEmail("email");
        employee1.setRole("role");
        final Store store = new Store();
        store.setId(0);
        store.setName("name");
        store.setDescription("description");
        store.setLongitude(0.0);
        store.setLatitude(0.0);
        store.setMaxCustomers(0);
        store.setTimeOut(0);
        final LineNumber lineNumber = new LineNumber();
        lineNumber.setId(0);
        lineNumber.setStatus("status");
        lineNumber.setNumber(0);
        lineNumber.setFrom(0L);
        lineNumber.setUntil(0L);
        final TimeSlot timeSlot = new TimeSlot();
        timeSlot.setId(0);
        timeSlot.setStartTime(0L);
        timeSlot.setEndTime(0L);
        timeSlot.setStore(new Store());
        timeSlot.setLineNumbers(Arrays.asList(new LineNumber()));
        lineNumber.setTimeSlot(timeSlot);
        lineNumber.setStore(new Store());
        final Customer customer = new Customer();
        customer.setId(0);
        customer.setName("name");
        customer.setSurname("surname");
        customer.setPhoneNumber("phoneNumber");
        customer.setEmail("email");
        customer.setLineNumbers(Arrays.asList(new LineNumber()));
        lineNumber.setCustomer(customer);
        store.setLineNumbers(Arrays.asList(lineNumber));
        final WorkingHour workingHour = new WorkingHour();
        workingHour.setId(0);
        workingHour.setFrom(0);
        workingHour.setUntil(0);
        workingHour.setStore(new Store());
        store.setWorkingHour(workingHour);
        store.setEmployees(Arrays.asList(new Employee()));
        employee1.setStore(store);
        final Optional<Employee> employee = Optional.of(employee1);
        when(mockEmployeeRepository.findByEmail("email")).thenReturn(employee);

        // Run the test
        employeeServiceUnderTest.findEmployeeByEmail("email");
    }

    @Test
    public void testFindEmployeeByEmail_EmployeeRepositoryReturnsAbsent() {
        // Setup
        when(mockEmployeeRepository.findByEmail("email")).thenReturn(Optional.empty());

        // Run the test
        final Employee result = employeeServiceUnderTest.findEmployeeByEmail("email");

        // Verify the results
    }

    @Test
    public void testAddEmployee() {
        // Setup
        final EmployeeDTO employeeDTO = new EmployeeDTO("email", "role");

        // Configure StoreRepository.findById(...).
        final Store store1 = new Store();
        store1.setId(0);
        store1.setName("name");
        store1.setDescription("description");
        store1.setLongitude(0.0);
        store1.setLatitude(0.0);
        store1.setMaxCustomers(0);
        store1.setTimeOut(0);
        final LineNumber lineNumber = new LineNumber();
        lineNumber.setId(0);
        lineNumber.setStatus("status");
        lineNumber.setNumber(0);
        lineNumber.setFrom(0L);
        lineNumber.setUntil(0L);
        final TimeSlot timeSlot = new TimeSlot();
        timeSlot.setId(0);
        timeSlot.setStartTime(0L);
        timeSlot.setEndTime(0L);
        timeSlot.setStore(new Store());
        timeSlot.setLineNumbers(Arrays.asList(new LineNumber()));
        lineNumber.setTimeSlot(timeSlot);
        lineNumber.setStore(new Store());
        final Customer customer = new Customer();
        customer.setId(0);
        customer.setName("name");
        customer.setSurname("surname");
        customer.setPhoneNumber("phoneNumber");
        customer.setEmail("email");
        customer.setLineNumbers(Arrays.asList(new LineNumber()));
        lineNumber.setCustomer(customer);
        store1.setLineNumbers(Arrays.asList(lineNumber));
        final WorkingHour workingHour = new WorkingHour();
        workingHour.setId(0);
        workingHour.setFrom(0);
        workingHour.setUntil(0);
        workingHour.setStore(new Store());
        store1.setWorkingHour(workingHour);
        final Employee employee = new Employee();
        employee.setId(0);
        employee.setEmail("email");
        employee.setRole("role");
        employee.setStore(new Store());
        store1.setEmployees(Arrays.asList(employee));
        final Optional<Store> store = Optional.of(store1);
        when(mockStoreRepository.findById(0)).thenReturn(store);

        // Configure EmployeeRepository.findByEmail(...).
        final Employee employee2 = new Employee();
        employee2.setId(0);
        employee2.setEmail("email");
        employee2.setRole("role");
        final Store store2 = new Store();
        store2.setId(0);
        store2.setName("name");
        store2.setDescription("description");
        store2.setLongitude(0.0);
        store2.setLatitude(0.0);
        store2.setMaxCustomers(0);
        store2.setTimeOut(0);
        final LineNumber lineNumber1 = new LineNumber();
        lineNumber1.setId(0);
        lineNumber1.setStatus("status");
        lineNumber1.setNumber(0);
        lineNumber1.setFrom(0L);
        lineNumber1.setUntil(0L);
        final TimeSlot timeSlot1 = new TimeSlot();
        timeSlot1.setId(0);
        timeSlot1.setStartTime(0L);
        timeSlot1.setEndTime(0L);
        timeSlot1.setStore(new Store());
        timeSlot1.setLineNumbers(Arrays.asList(new LineNumber()));
        lineNumber1.setTimeSlot(timeSlot1);
        lineNumber1.setStore(new Store());
        final Customer customer1 = new Customer();
        customer1.setId(0);
        customer1.setName("name");
        customer1.setSurname("surname");
        customer1.setPhoneNumber("phoneNumber");
        customer1.setEmail("email");
        customer1.setLineNumbers(Arrays.asList(new LineNumber()));
        lineNumber1.setCustomer(customer1);
        store2.setLineNumbers(Arrays.asList(lineNumber1));
        final WorkingHour workingHour1 = new WorkingHour();
        workingHour1.setId(0);
        workingHour1.setFrom(0);
        workingHour1.setUntil(0);
        workingHour1.setStore(new Store());
        store2.setWorkingHour(workingHour1);
        store2.setEmployees(Arrays.asList(new Employee()));
        employee2.setStore(store2);
        final Optional<Employee> employee1 = Optional.of(employee2);
        when(mockEmployeeRepository.findByEmail("email")).thenReturn(employee1);

        // Configure EmployeeRepository.save(...).
        final Employee employee3 = new Employee();
        employee3.setId(0);
        employee3.setEmail("email");
        employee3.setRole("role");
        final Store store3 = new Store();
        store3.setId(0);
        store3.setName("name");
        store3.setDescription("description");
        store3.setLongitude(0.0);
        store3.setLatitude(0.0);
        store3.setMaxCustomers(0);
        store3.setTimeOut(0);
        final LineNumber lineNumber2 = new LineNumber();
        lineNumber2.setId(0);
        lineNumber2.setStatus("status");
        lineNumber2.setNumber(0);
        lineNumber2.setFrom(0L);
        lineNumber2.setUntil(0L);
        final TimeSlot timeSlot2 = new TimeSlot();
        timeSlot2.setId(0);
        timeSlot2.setStartTime(0L);
        timeSlot2.setEndTime(0L);
        timeSlot2.setStore(new Store());
        timeSlot2.setLineNumbers(Arrays.asList(new LineNumber()));
        lineNumber2.setTimeSlot(timeSlot2);
        lineNumber2.setStore(new Store());
        final Customer customer2 = new Customer();
        customer2.setId(0);
        customer2.setName("name");
        customer2.setSurname("surname");
        customer2.setPhoneNumber("phoneNumber");
        customer2.setEmail("email");
        customer2.setLineNumbers(Arrays.asList(new LineNumber()));
        lineNumber2.setCustomer(customer2);
        store3.setLineNumbers(Arrays.asList(lineNumber2));
        final WorkingHour workingHour2 = new WorkingHour();
        workingHour2.setId(0);
        workingHour2.setFrom(0);
        workingHour2.setUntil(0);
        workingHour2.setStore(new Store());
        store3.setWorkingHour(workingHour2);
        store3.setEmployees(Arrays.asList(new Employee()));
        employee3.setStore(store3);
        when(mockEmployeeRepository.save(any(Employee.class))).thenReturn(employee3);

        // Run the test
        final Employee result = employeeServiceUnderTest.addEmployee(employeeDTO, 0);

        // Verify the results
    }

    @Test(expected = NoSuchEntityException.class)
    public void testAddEmployee_ThrowsNoSuchEntityException() {
        // Setup
        final EmployeeDTO employeeDTO = new EmployeeDTO("email", "role");

        // Configure StoreRepository.findById(...).
        final Store store1 = new Store();
        store1.setId(0);
        store1.setName("name");
        store1.setDescription("description");
        store1.setLongitude(0.0);
        store1.setLatitude(0.0);
        store1.setMaxCustomers(0);
        store1.setTimeOut(0);
        final LineNumber lineNumber = new LineNumber();
        lineNumber.setId(0);
        lineNumber.setStatus("status");
        lineNumber.setNumber(0);
        lineNumber.setFrom(0L);
        lineNumber.setUntil(0L);
        final TimeSlot timeSlot = new TimeSlot();
        timeSlot.setId(0);
        timeSlot.setStartTime(0L);
        timeSlot.setEndTime(0L);
        timeSlot.setStore(new Store());
        timeSlot.setLineNumbers(Arrays.asList(new LineNumber()));
        lineNumber.setTimeSlot(timeSlot);
        lineNumber.setStore(new Store());
        final Customer customer = new Customer();
        customer.setId(0);
        customer.setName("name");
        customer.setSurname("surname");
        customer.setPhoneNumber("phoneNumber");
        customer.setEmail("email");
        customer.setLineNumbers(Arrays.asList(new LineNumber()));
        lineNumber.setCustomer(customer);
        store1.setLineNumbers(Arrays.asList(lineNumber));
        final WorkingHour workingHour = new WorkingHour();
        workingHour.setId(0);
        workingHour.setFrom(0);
        workingHour.setUntil(0);
        workingHour.setStore(new Store());
        store1.setWorkingHour(workingHour);
        final Employee employee = new Employee();
        employee.setId(0);
        employee.setEmail("email");
        employee.setRole("role");
        employee.setStore(new Store());
        store1.setEmployees(Arrays.asList(employee));
        final Optional<Store> store = Optional.of(store1);
        when(mockStoreRepository.findById(0)).thenReturn(store);

        // Configure EmployeeRepository.findByEmail(...).
        final Employee employee2 = new Employee();
        employee2.setId(0);
        employee2.setEmail("email");
        employee2.setRole("role");
        final Store store2 = new Store();
        store2.setId(0);
        store2.setName("name");
        store2.setDescription("description");
        store2.setLongitude(0.0);
        store2.setLatitude(0.0);
        store2.setMaxCustomers(0);
        store2.setTimeOut(0);
        final LineNumber lineNumber1 = new LineNumber();
        lineNumber1.setId(0);
        lineNumber1.setStatus("status");
        lineNumber1.setNumber(0);
        lineNumber1.setFrom(0L);
        lineNumber1.setUntil(0L);
        final TimeSlot timeSlot1 = new TimeSlot();
        timeSlot1.setId(0);
        timeSlot1.setStartTime(0L);
        timeSlot1.setEndTime(0L);
        timeSlot1.setStore(new Store());
        timeSlot1.setLineNumbers(Arrays.asList(new LineNumber()));
        lineNumber1.setTimeSlot(timeSlot1);
        lineNumber1.setStore(new Store());
        final Customer customer1 = new Customer();
        customer1.setId(0);
        customer1.setName("name");
        customer1.setSurname("surname");
        customer1.setPhoneNumber("phoneNumber");
        customer1.setEmail("email");
        customer1.setLineNumbers(Arrays.asList(new LineNumber()));
        lineNumber1.setCustomer(customer1);
        store2.setLineNumbers(Arrays.asList(lineNumber1));
        final WorkingHour workingHour1 = new WorkingHour();
        workingHour1.setId(0);
        workingHour1.setFrom(0);
        workingHour1.setUntil(0);
        workingHour1.setStore(new Store());
        store2.setWorkingHour(workingHour1);
        store2.setEmployees(Arrays.asList(new Employee()));
        employee2.setStore(store2);
        final Optional<Employee> employee1 = Optional.of(employee2);
        when(mockEmployeeRepository.findByEmail("email")).thenReturn(employee1);

        // Configure EmployeeRepository.save(...).
        final Employee employee3 = new Employee();
        employee3.setId(0);
        employee3.setEmail("email");
        employee3.setRole("role");
        final Store store3 = new Store();
        store3.setId(0);
        store3.setName("name");
        store3.setDescription("description");
        store3.setLongitude(0.0);
        store3.setLatitude(0.0);
        store3.setMaxCustomers(0);
        store3.setTimeOut(0);
        final LineNumber lineNumber2 = new LineNumber();
        lineNumber2.setId(0);
        lineNumber2.setStatus("status");
        lineNumber2.setNumber(0);
        lineNumber2.setFrom(0L);
        lineNumber2.setUntil(0L);
        final TimeSlot timeSlot2 = new TimeSlot();
        timeSlot2.setId(0);
        timeSlot2.setStartTime(0L);
        timeSlot2.setEndTime(0L);
        timeSlot2.setStore(new Store());
        timeSlot2.setLineNumbers(Arrays.asList(new LineNumber()));
        lineNumber2.setTimeSlot(timeSlot2);
        lineNumber2.setStore(new Store());
        final Customer customer2 = new Customer();
        customer2.setId(0);
        customer2.setName("name");
        customer2.setSurname("surname");
        customer2.setPhoneNumber("phoneNumber");
        customer2.setEmail("email");
        customer2.setLineNumbers(Arrays.asList(new LineNumber()));
        lineNumber2.setCustomer(customer2);
        store3.setLineNumbers(Arrays.asList(lineNumber2));
        final WorkingHour workingHour2 = new WorkingHour();
        workingHour2.setId(0);
        workingHour2.setFrom(0);
        workingHour2.setUntil(0);
        workingHour2.setStore(new Store());
        store3.setWorkingHour(workingHour2);
        store3.setEmployees(Arrays.asList(new Employee()));
        employee3.setStore(store3);
        when(mockEmployeeRepository.save(any(Employee.class))).thenReturn(employee3);

        // Run the test
        employeeServiceUnderTest.addEmployee(employeeDTO, 0);
    }

    @Test(expected = MailAlreadyUsedException.class)
    public void testAddEmployee_ThrowsMailAlreadyUsedException() {
        // Setup
        final EmployeeDTO employeeDTO = new EmployeeDTO("email", "role");

        // Configure StoreRepository.findById(...).
        final Store store1 = new Store();
        store1.setId(0);
        store1.setName("name");
        store1.setDescription("description");
        store1.setLongitude(0.0);
        store1.setLatitude(0.0);
        store1.setMaxCustomers(0);
        store1.setTimeOut(0);
        final LineNumber lineNumber = new LineNumber();
        lineNumber.setId(0);
        lineNumber.setStatus("status");
        lineNumber.setNumber(0);
        lineNumber.setFrom(0L);
        lineNumber.setUntil(0L);
        final TimeSlot timeSlot = new TimeSlot();
        timeSlot.setId(0);
        timeSlot.setStartTime(0L);
        timeSlot.setEndTime(0L);
        timeSlot.setStore(new Store());
        timeSlot.setLineNumbers(Arrays.asList(new LineNumber()));
        lineNumber.setTimeSlot(timeSlot);
        lineNumber.setStore(new Store());
        final Customer customer = new Customer();
        customer.setId(0);
        customer.setName("name");
        customer.setSurname("surname");
        customer.setPhoneNumber("phoneNumber");
        customer.setEmail("email");
        customer.setLineNumbers(Arrays.asList(new LineNumber()));
        lineNumber.setCustomer(customer);
        store1.setLineNumbers(Arrays.asList(lineNumber));
        final WorkingHour workingHour = new WorkingHour();
        workingHour.setId(0);
        workingHour.setFrom(0);
        workingHour.setUntil(0);
        workingHour.setStore(new Store());
        store1.setWorkingHour(workingHour);
        final Employee employee = new Employee();
        employee.setId(0);
        employee.setEmail("email");
        employee.setRole("role");
        employee.setStore(new Store());
        store1.setEmployees(Arrays.asList(employee));
        final Optional<Store> store = Optional.of(store1);
        when(mockStoreRepository.findById(0)).thenReturn(store);

        // Configure EmployeeRepository.findByEmail(...).
        final Employee employee2 = new Employee();
        employee2.setId(0);
        employee2.setEmail("email");
        employee2.setRole("role");
        final Store store2 = new Store();
        store2.setId(0);
        store2.setName("name");
        store2.setDescription("description");
        store2.setLongitude(0.0);
        store2.setLatitude(0.0);
        store2.setMaxCustomers(0);
        store2.setTimeOut(0);
        final LineNumber lineNumber1 = new LineNumber();
        lineNumber1.setId(0);
        lineNumber1.setStatus("status");
        lineNumber1.setNumber(0);
        lineNumber1.setFrom(0L);
        lineNumber1.setUntil(0L);
        final TimeSlot timeSlot1 = new TimeSlot();
        timeSlot1.setId(0);
        timeSlot1.setStartTime(0L);
        timeSlot1.setEndTime(0L);
        timeSlot1.setStore(new Store());
        timeSlot1.setLineNumbers(Arrays.asList(new LineNumber()));
        lineNumber1.setTimeSlot(timeSlot1);
        lineNumber1.setStore(new Store());
        final Customer customer1 = new Customer();
        customer1.setId(0);
        customer1.setName("name");
        customer1.setSurname("surname");
        customer1.setPhoneNumber("phoneNumber");
        customer1.setEmail("email");
        customer1.setLineNumbers(Arrays.asList(new LineNumber()));
        lineNumber1.setCustomer(customer1);
        store2.setLineNumbers(Arrays.asList(lineNumber1));
        final WorkingHour workingHour1 = new WorkingHour();
        workingHour1.setId(0);
        workingHour1.setFrom(0);
        workingHour1.setUntil(0);
        workingHour1.setStore(new Store());
        store2.setWorkingHour(workingHour1);
        store2.setEmployees(Arrays.asList(new Employee()));
        employee2.setStore(store2);
        final Optional<Employee> employee1 = Optional.of(employee2);
        when(mockEmployeeRepository.findByEmail("email")).thenReturn(employee1);

        // Configure EmployeeRepository.save(...).
        final Employee employee3 = new Employee();
        employee3.setId(0);
        employee3.setEmail("email");
        employee3.setRole("role");
        final Store store3 = new Store();
        store3.setId(0);
        store3.setName("name");
        store3.setDescription("description");
        store3.setLongitude(0.0);
        store3.setLatitude(0.0);
        store3.setMaxCustomers(0);
        store3.setTimeOut(0);
        final LineNumber lineNumber2 = new LineNumber();
        lineNumber2.setId(0);
        lineNumber2.setStatus("status");
        lineNumber2.setNumber(0);
        lineNumber2.setFrom(0L);
        lineNumber2.setUntil(0L);
        final TimeSlot timeSlot2 = new TimeSlot();
        timeSlot2.setId(0);
        timeSlot2.setStartTime(0L);
        timeSlot2.setEndTime(0L);
        timeSlot2.setStore(new Store());
        timeSlot2.setLineNumbers(Arrays.asList(new LineNumber()));
        lineNumber2.setTimeSlot(timeSlot2);
        lineNumber2.setStore(new Store());
        final Customer customer2 = new Customer();
        customer2.setId(0);
        customer2.setName("name");
        customer2.setSurname("surname");
        customer2.setPhoneNumber("phoneNumber");
        customer2.setEmail("email");
        customer2.setLineNumbers(Arrays.asList(new LineNumber()));
        lineNumber2.setCustomer(customer2);
        store3.setLineNumbers(Arrays.asList(lineNumber2));
        final WorkingHour workingHour2 = new WorkingHour();
        workingHour2.setId(0);
        workingHour2.setFrom(0);
        workingHour2.setUntil(0);
        workingHour2.setStore(new Store());
        store3.setWorkingHour(workingHour2);
        store3.setEmployees(Arrays.asList(new Employee()));
        employee3.setStore(store3);
        when(mockEmployeeRepository.save(any(Employee.class))).thenReturn(employee3);

        // Run the test
        employeeServiceUnderTest.addEmployee(employeeDTO, 0);
    }

    @Test
    public void testAddEmployee_StoreRepositoryReturnsAbsent() {
        // Setup
        final EmployeeDTO employeeDTO = new EmployeeDTO("email", "role");
        when(mockStoreRepository.findById(0)).thenReturn(Optional.empty());

        // Configure EmployeeRepository.findByEmail(...).
        final Employee employee1 = new Employee();
        employee1.setId(0);
        employee1.setEmail("email");
        employee1.setRole("role");
        final Store store = new Store();
        store.setId(0);
        store.setName("name");
        store.setDescription("description");
        store.setLongitude(0.0);
        store.setLatitude(0.0);
        store.setMaxCustomers(0);
        store.setTimeOut(0);
        final LineNumber lineNumber = new LineNumber();
        lineNumber.setId(0);
        lineNumber.setStatus("status");
        lineNumber.setNumber(0);
        lineNumber.setFrom(0L);
        lineNumber.setUntil(0L);
        final TimeSlot timeSlot = new TimeSlot();
        timeSlot.setId(0);
        timeSlot.setStartTime(0L);
        timeSlot.setEndTime(0L);
        timeSlot.setStore(new Store());
        timeSlot.setLineNumbers(Arrays.asList(new LineNumber()));
        lineNumber.setTimeSlot(timeSlot);
        lineNumber.setStore(new Store());
        final Customer customer = new Customer();
        customer.setId(0);
        customer.setName("name");
        customer.setSurname("surname");
        customer.setPhoneNumber("phoneNumber");
        customer.setEmail("email");
        customer.setLineNumbers(Arrays.asList(new LineNumber()));
        lineNumber.setCustomer(customer);
        store.setLineNumbers(Arrays.asList(lineNumber));
        final WorkingHour workingHour = new WorkingHour();
        workingHour.setId(0);
        workingHour.setFrom(0);
        workingHour.setUntil(0);
        workingHour.setStore(new Store());
        store.setWorkingHour(workingHour);
        store.setEmployees(Arrays.asList(new Employee()));
        employee1.setStore(store);
        final Optional<Employee> employee = Optional.of(employee1);
        when(mockEmployeeRepository.findByEmail("email")).thenReturn(employee);

        // Configure EmployeeRepository.save(...).
        final Employee employee2 = new Employee();
        employee2.setId(0);
        employee2.setEmail("email");
        employee2.setRole("role");
        final Store store1 = new Store();
        store1.setId(0);
        store1.setName("name");
        store1.setDescription("description");
        store1.setLongitude(0.0);
        store1.setLatitude(0.0);
        store1.setMaxCustomers(0);
        store1.setTimeOut(0);
        final LineNumber lineNumber1 = new LineNumber();
        lineNumber1.setId(0);
        lineNumber1.setStatus("status");
        lineNumber1.setNumber(0);
        lineNumber1.setFrom(0L);
        lineNumber1.setUntil(0L);
        final TimeSlot timeSlot1 = new TimeSlot();
        timeSlot1.setId(0);
        timeSlot1.setStartTime(0L);
        timeSlot1.setEndTime(0L);
        timeSlot1.setStore(new Store());
        timeSlot1.setLineNumbers(Arrays.asList(new LineNumber()));
        lineNumber1.setTimeSlot(timeSlot1);
        lineNumber1.setStore(new Store());
        final Customer customer1 = new Customer();
        customer1.setId(0);
        customer1.setName("name");
        customer1.setSurname("surname");
        customer1.setPhoneNumber("phoneNumber");
        customer1.setEmail("email");
        customer1.setLineNumbers(Arrays.asList(new LineNumber()));
        lineNumber1.setCustomer(customer1);
        store1.setLineNumbers(Arrays.asList(lineNumber1));
        final WorkingHour workingHour1 = new WorkingHour();
        workingHour1.setId(0);
        workingHour1.setFrom(0);
        workingHour1.setUntil(0);
        workingHour1.setStore(new Store());
        store1.setWorkingHour(workingHour1);
        store1.setEmployees(Arrays.asList(new Employee()));
        employee2.setStore(store1);
        when(mockEmployeeRepository.save(any(Employee.class))).thenReturn(employee2);

        // Run the test
        final Employee result = employeeServiceUnderTest.addEmployee(employeeDTO, 0);

        // Verify the results
    }

    @Test
    public void testAddEmployee_EmployeeRepositoryFindByEmailReturnsAbsent() {
        // Setup
        final EmployeeDTO employeeDTO = new EmployeeDTO("email", "role");

        // Configure StoreRepository.findById(...).
        final Store store1 = new Store();
        store1.setId(0);
        store1.setName("name");
        store1.setDescription("description");
        store1.setLongitude(0.0);
        store1.setLatitude(0.0);
        store1.setMaxCustomers(0);
        store1.setTimeOut(0);
        final LineNumber lineNumber = new LineNumber();
        lineNumber.setId(0);
        lineNumber.setStatus("status");
        lineNumber.setNumber(0);
        lineNumber.setFrom(0L);
        lineNumber.setUntil(0L);
        final TimeSlot timeSlot = new TimeSlot();
        timeSlot.setId(0);
        timeSlot.setStartTime(0L);
        timeSlot.setEndTime(0L);
        timeSlot.setStore(new Store());
        timeSlot.setLineNumbers(Arrays.asList(new LineNumber()));
        lineNumber.setTimeSlot(timeSlot);
        lineNumber.setStore(new Store());
        final Customer customer = new Customer();
        customer.setId(0);
        customer.setName("name");
        customer.setSurname("surname");
        customer.setPhoneNumber("phoneNumber");
        customer.setEmail("email");
        customer.setLineNumbers(Arrays.asList(new LineNumber()));
        lineNumber.setCustomer(customer);
        store1.setLineNumbers(Arrays.asList(lineNumber));
        final WorkingHour workingHour = new WorkingHour();
        workingHour.setId(0);
        workingHour.setFrom(0);
        workingHour.setUntil(0);
        workingHour.setStore(new Store());
        store1.setWorkingHour(workingHour);
        final Employee employee = new Employee();
        employee.setId(0);
        employee.setEmail("email");
        employee.setRole("role");
        employee.setStore(new Store());
        store1.setEmployees(Arrays.asList(employee));
        final Optional<Store> store = Optional.of(store1);
        when(mockStoreRepository.findById(0)).thenReturn(store);

        when(mockEmployeeRepository.findByEmail("email")).thenReturn(Optional.empty());

        // Configure EmployeeRepository.save(...).
        final Employee employee1 = new Employee();
        employee1.setId(0);
        employee1.setEmail("email");
        employee1.setRole("role");
        final Store store2 = new Store();
        store2.setId(0);
        store2.setName("name");
        store2.setDescription("description");
        store2.setLongitude(0.0);
        store2.setLatitude(0.0);
        store2.setMaxCustomers(0);
        store2.setTimeOut(0);
        final LineNumber lineNumber1 = new LineNumber();
        lineNumber1.setId(0);
        lineNumber1.setStatus("status");
        lineNumber1.setNumber(0);
        lineNumber1.setFrom(0L);
        lineNumber1.setUntil(0L);
        final TimeSlot timeSlot1 = new TimeSlot();
        timeSlot1.setId(0);
        timeSlot1.setStartTime(0L);
        timeSlot1.setEndTime(0L);
        timeSlot1.setStore(new Store());
        timeSlot1.setLineNumbers(Arrays.asList(new LineNumber()));
        lineNumber1.setTimeSlot(timeSlot1);
        lineNumber1.setStore(new Store());
        final Customer customer1 = new Customer();
        customer1.setId(0);
        customer1.setName("name");
        customer1.setSurname("surname");
        customer1.setPhoneNumber("phoneNumber");
        customer1.setEmail("email");
        customer1.setLineNumbers(Arrays.asList(new LineNumber()));
        lineNumber1.setCustomer(customer1);
        store2.setLineNumbers(Arrays.asList(lineNumber1));
        final WorkingHour workingHour1 = new WorkingHour();
        workingHour1.setId(0);
        workingHour1.setFrom(0);
        workingHour1.setUntil(0);
        workingHour1.setStore(new Store());
        store2.setWorkingHour(workingHour1);
        store2.setEmployees(Arrays.asList(new Employee()));
        employee1.setStore(store2);
        when(mockEmployeeRepository.save(any(Employee.class))).thenReturn(employee1);

        // Run the test
        final Employee result = employeeServiceUnderTest.addEmployee(employeeDTO, 0);

        // Verify the results
    }

    @Test
    public void testCheckInOut() {
        // Setup

        // Configure LineNumberRepository.findById(...).
        final LineNumber lineNumber1 = new LineNumber();
        lineNumber1.setId(0);
        lineNumber1.setStatus("status");
        lineNumber1.setNumber(0);
        lineNumber1.setFrom(0L);
        lineNumber1.setUntil(0L);
        final TimeSlot timeSlot = new TimeSlot();
        timeSlot.setId(0);
        timeSlot.setStartTime(0L);
        timeSlot.setEndTime(0L);
        final Store store = new Store();
        store.setId(0);
        store.setName("name");
        store.setDescription("description");
        store.setLongitude(0.0);
        store.setLatitude(0.0);
        store.setMaxCustomers(0);
        store.setTimeOut(0);
        store.setLineNumbers(Arrays.asList(new LineNumber()));
        final WorkingHour workingHour = new WorkingHour();
        workingHour.setId(0);
        workingHour.setFrom(0);
        workingHour.setUntil(0);
        workingHour.setStore(new Store());
        store.setWorkingHour(workingHour);
        final Employee employee = new Employee();
        employee.setId(0);
        employee.setEmail("email");
        employee.setRole("role");
        employee.setStore(new Store());
        store.setEmployees(Arrays.asList(employee));
        timeSlot.setStore(store);
        timeSlot.setLineNumbers(Arrays.asList(new LineNumber()));
        lineNumber1.setTimeSlot(timeSlot);
        final Store store1 = new Store();
        store1.setId(0);
        store1.setName("name");
        store1.setDescription("description");
        store1.setLongitude(0.0);
        store1.setLatitude(0.0);
        store1.setMaxCustomers(0);
        store1.setTimeOut(0);
        store1.setLineNumbers(Arrays.asList(new LineNumber()));
        final WorkingHour workingHour1 = new WorkingHour();
        workingHour1.setId(0);
        workingHour1.setFrom(0);
        workingHour1.setUntil(0);
        workingHour1.setStore(new Store());
        store1.setWorkingHour(workingHour1);
        final Employee employee1 = new Employee();
        employee1.setId(0);
        employee1.setEmail("email");
        employee1.setRole("role");
        employee1.setStore(new Store());
        store1.setEmployees(Arrays.asList(employee1));
        lineNumber1.setStore(store1);
        final Customer customer = new Customer();
        customer.setId(0);
        customer.setName("name");
        customer.setSurname("surname");
        customer.setPhoneNumber("phoneNumber");
        customer.setEmail("email");
        customer.setLineNumbers(Arrays.asList(new LineNumber()));
        lineNumber1.setCustomer(customer);
        final Optional<LineNumber> lineNumber = Optional.of(lineNumber1);
        when(mockLineNumberRepository.findById(0)).thenReturn(lineNumber);

        // Configure LineNumberRepository.save(...).
        final LineNumber lineNumber2 = new LineNumber();
        lineNumber2.setId(0);
        lineNumber2.setStatus("status");
        lineNumber2.setNumber(0);
        lineNumber2.setFrom(0L);
        lineNumber2.setUntil(0L);
        final TimeSlot timeSlot1 = new TimeSlot();
        timeSlot1.setId(0);
        timeSlot1.setStartTime(0L);
        timeSlot1.setEndTime(0L);
        final Store store2 = new Store();
        store2.setId(0);
        store2.setName("name");
        store2.setDescription("description");
        store2.setLongitude(0.0);
        store2.setLatitude(0.0);
        store2.setMaxCustomers(0);
        store2.setTimeOut(0);
        store2.setLineNumbers(Arrays.asList(new LineNumber()));
        final WorkingHour workingHour2 = new WorkingHour();
        workingHour2.setId(0);
        workingHour2.setFrom(0);
        workingHour2.setUntil(0);
        workingHour2.setStore(new Store());
        store2.setWorkingHour(workingHour2);
        final Employee employee2 = new Employee();
        employee2.setId(0);
        employee2.setEmail("email");
        employee2.setRole("role");
        employee2.setStore(new Store());
        store2.setEmployees(Arrays.asList(employee2));
        timeSlot1.setStore(store2);
        timeSlot1.setLineNumbers(Arrays.asList(new LineNumber()));
        lineNumber2.setTimeSlot(timeSlot1);
        final Store store3 = new Store();
        store3.setId(0);
        store3.setName("name");
        store3.setDescription("description");
        store3.setLongitude(0.0);
        store3.setLatitude(0.0);
        store3.setMaxCustomers(0);
        store3.setTimeOut(0);
        store3.setLineNumbers(Arrays.asList(new LineNumber()));
        final WorkingHour workingHour3 = new WorkingHour();
        workingHour3.setId(0);
        workingHour3.setFrom(0);
        workingHour3.setUntil(0);
        workingHour3.setStore(new Store());
        store3.setWorkingHour(workingHour3);
        final Employee employee3 = new Employee();
        employee3.setId(0);
        employee3.setEmail("email");
        employee3.setRole("role");
        employee3.setStore(new Store());
        store3.setEmployees(Arrays.asList(employee3));
        lineNumber2.setStore(store3);
        final Customer customer1 = new Customer();
        customer1.setId(0);
        customer1.setName("name");
        customer1.setSurname("surname");
        customer1.setPhoneNumber("phoneNumber");
        customer1.setEmail("email");
        customer1.setLineNumbers(Arrays.asList(new LineNumber()));
        lineNumber2.setCustomer(customer1);
        when(mockLineNumberRepository.save(any(LineNumber.class))).thenReturn(lineNumber2);

        // Run the test
        final boolean result = employeeServiceUnderTest.checkInOut(0);

        // Verify the results
        assertTrue(result);
    }

    @Test
    public void testCheckInOut_LineNumberRepositoryFindByIdReturnsAbsent() {
        // Setup
        when(mockLineNumberRepository.findById(0)).thenReturn(Optional.empty());

        // Configure LineNumberRepository.save(...).
        final LineNumber lineNumber = new LineNumber();
        lineNumber.setId(0);
        lineNumber.setStatus("status");
        lineNumber.setNumber(0);
        lineNumber.setFrom(0L);
        lineNumber.setUntil(0L);
        final TimeSlot timeSlot = new TimeSlot();
        timeSlot.setId(0);
        timeSlot.setStartTime(0L);
        timeSlot.setEndTime(0L);
        final Store store = new Store();
        store.setId(0);
        store.setName("name");
        store.setDescription("description");
        store.setLongitude(0.0);
        store.setLatitude(0.0);
        store.setMaxCustomers(0);
        store.setTimeOut(0);
        store.setLineNumbers(Arrays.asList(new LineNumber()));
        final WorkingHour workingHour = new WorkingHour();
        workingHour.setId(0);
        workingHour.setFrom(0);
        workingHour.setUntil(0);
        workingHour.setStore(new Store());
        store.setWorkingHour(workingHour);
        final Employee employee = new Employee();
        employee.setId(0);
        employee.setEmail("email");
        employee.setRole("role");
        employee.setStore(new Store());
        store.setEmployees(Arrays.asList(employee));
        timeSlot.setStore(store);
        timeSlot.setLineNumbers(Arrays.asList(new LineNumber()));
        lineNumber.setTimeSlot(timeSlot);
        final Store store1 = new Store();
        store1.setId(0);
        store1.setName("name");
        store1.setDescription("description");
        store1.setLongitude(0.0);
        store1.setLatitude(0.0);
        store1.setMaxCustomers(0);
        store1.setTimeOut(0);
        store1.setLineNumbers(Arrays.asList(new LineNumber()));
        final WorkingHour workingHour1 = new WorkingHour();
        workingHour1.setId(0);
        workingHour1.setFrom(0);
        workingHour1.setUntil(0);
        workingHour1.setStore(new Store());
        store1.setWorkingHour(workingHour1);
        final Employee employee1 = new Employee();
        employee1.setId(0);
        employee1.setEmail("email");
        employee1.setRole("role");
        employee1.setStore(new Store());
        store1.setEmployees(Arrays.asList(employee1));
        lineNumber.setStore(store1);
        final Customer customer = new Customer();
        customer.setId(0);
        customer.setName("name");
        customer.setSurname("surname");
        customer.setPhoneNumber("phoneNumber");
        customer.setEmail("email");
        customer.setLineNumbers(Arrays.asList(new LineNumber()));
        lineNumber.setCustomer(customer);
        when(mockLineNumberRepository.save(any(LineNumber.class))).thenReturn(lineNumber);

        // Run the test
        final boolean result = employeeServiceUnderTest.checkInOut(0);

        // Verify the results
        assertTrue(result);
    }

    @Test
    public void testFindLineNumberById() {
        // Setup

        // Configure LineNumberRepository.findById(...).
        final LineNumber lineNumber1 = new LineNumber();
        lineNumber1.setId(0);
        lineNumber1.setStatus("status");
        lineNumber1.setNumber(0);
        lineNumber1.setFrom(0L);
        lineNumber1.setUntil(0L);
        final TimeSlot timeSlot = new TimeSlot();
        timeSlot.setId(0);
        timeSlot.setStartTime(0L);
        timeSlot.setEndTime(0L);
        final Store store = new Store();
        store.setId(0);
        store.setName("name");
        store.setDescription("description");
        store.setLongitude(0.0);
        store.setLatitude(0.0);
        store.setMaxCustomers(0);
        store.setTimeOut(0);
        store.setLineNumbers(Arrays.asList(new LineNumber()));
        final WorkingHour workingHour = new WorkingHour();
        workingHour.setId(0);
        workingHour.setFrom(0);
        workingHour.setUntil(0);
        workingHour.setStore(new Store());
        store.setWorkingHour(workingHour);
        final Employee employee = new Employee();
        employee.setId(0);
        employee.setEmail("email");
        employee.setRole("role");
        employee.setStore(new Store());
        store.setEmployees(Arrays.asList(employee));
        timeSlot.setStore(store);
        timeSlot.setLineNumbers(Arrays.asList(new LineNumber()));
        lineNumber1.setTimeSlot(timeSlot);
        final Store store1 = new Store();
        store1.setId(0);
        store1.setName("name");
        store1.setDescription("description");
        store1.setLongitude(0.0);
        store1.setLatitude(0.0);
        store1.setMaxCustomers(0);
        store1.setTimeOut(0);
        store1.setLineNumbers(Arrays.asList(new LineNumber()));
        final WorkingHour workingHour1 = new WorkingHour();
        workingHour1.setId(0);
        workingHour1.setFrom(0);
        workingHour1.setUntil(0);
        workingHour1.setStore(new Store());
        store1.setWorkingHour(workingHour1);
        final Employee employee1 = new Employee();
        employee1.setId(0);
        employee1.setEmail("email");
        employee1.setRole("role");
        employee1.setStore(new Store());
        store1.setEmployees(Arrays.asList(employee1));
        lineNumber1.setStore(store1);
        final Customer customer = new Customer();
        customer.setId(0);
        customer.setName("name");
        customer.setSurname("surname");
        customer.setPhoneNumber("phoneNumber");
        customer.setEmail("email");
        customer.setLineNumbers(Arrays.asList(new LineNumber()));
        lineNumber1.setCustomer(customer);
        final Optional<LineNumber> lineNumber = Optional.of(lineNumber1);
        when(mockLineNumberRepository.findById(0)).thenReturn(lineNumber);

        // Run the test
        final LineNumber result = employeeServiceUnderTest.findLineNumberById(0);

        // Verify the results
    }

    @Test(expected = NoSuchEntityException.class)
    public void testFindLineNumberById_ThrowsNoSuchEntityException() {
        // Setup

        // Configure LineNumberRepository.findById(...).
        final LineNumber lineNumber1 = new LineNumber();
        lineNumber1.setId(0);
        lineNumber1.setStatus("status");
        lineNumber1.setNumber(0);
        lineNumber1.setFrom(0L);
        lineNumber1.setUntil(0L);
        final TimeSlot timeSlot = new TimeSlot();
        timeSlot.setId(0);
        timeSlot.setStartTime(0L);
        timeSlot.setEndTime(0L);
        final Store store = new Store();
        store.setId(0);
        store.setName("name");
        store.setDescription("description");
        store.setLongitude(0.0);
        store.setLatitude(0.0);
        store.setMaxCustomers(0);
        store.setTimeOut(0);
        store.setLineNumbers(Arrays.asList(new LineNumber()));
        final WorkingHour workingHour = new WorkingHour();
        workingHour.setId(0);
        workingHour.setFrom(0);
        workingHour.setUntil(0);
        workingHour.setStore(new Store());
        store.setWorkingHour(workingHour);
        final Employee employee = new Employee();
        employee.setId(0);
        employee.setEmail("email");
        employee.setRole("role");
        employee.setStore(new Store());
        store.setEmployees(Arrays.asList(employee));
        timeSlot.setStore(store);
        timeSlot.setLineNumbers(Arrays.asList(new LineNumber()));
        lineNumber1.setTimeSlot(timeSlot);
        final Store store1 = new Store();
        store1.setId(0);
        store1.setName("name");
        store1.setDescription("description");
        store1.setLongitude(0.0);
        store1.setLatitude(0.0);
        store1.setMaxCustomers(0);
        store1.setTimeOut(0);
        store1.setLineNumbers(Arrays.asList(new LineNumber()));
        final WorkingHour workingHour1 = new WorkingHour();
        workingHour1.setId(0);
        workingHour1.setFrom(0);
        workingHour1.setUntil(0);
        workingHour1.setStore(new Store());
        store1.setWorkingHour(workingHour1);
        final Employee employee1 = new Employee();
        employee1.setId(0);
        employee1.setEmail("email");
        employee1.setRole("role");
        employee1.setStore(new Store());
        store1.setEmployees(Arrays.asList(employee1));
        lineNumber1.setStore(store1);
        final Customer customer = new Customer();
        customer.setId(0);
        customer.setName("name");
        customer.setSurname("surname");
        customer.setPhoneNumber("phoneNumber");
        customer.setEmail("email");
        customer.setLineNumbers(Arrays.asList(new LineNumber()));
        lineNumber1.setCustomer(customer);
        final Optional<LineNumber> lineNumber = Optional.of(lineNumber1);
        when(mockLineNumberRepository.findById(0)).thenReturn(lineNumber);

        // Run the test
        employeeServiceUnderTest.findLineNumberById(0);
    }

    @Test
    public void testFindLineNumberById_LineNumberRepositoryReturnsAbsent() {
        // Setup
        when(mockLineNumberRepository.findById(0)).thenReturn(Optional.empty());

        // Run the test
        final LineNumber result = employeeServiceUnderTest.findLineNumberById(0);

        // Verify the results
    }

    @Test
    public void testMonitorLive() {
        // Setup
        when(mockLineNumberRepository.monitor(0)).thenReturn(0);

        // Run the test
        final MonitorState result = employeeServiceUnderTest.monitorLive(0);

        // Verify the results
    }

    @Test
    public void testChangeRole() {
        // Setup
        final Employee employee = new Employee();
        employee.setId(0);
        employee.setEmail("email");
        employee.setRole("role");
        final Store store = new Store();
        store.setId(0);
        store.setName("name");
        store.setDescription("description");
        store.setLongitude(0.0);
        store.setLatitude(0.0);
        store.setMaxCustomers(0);
        store.setTimeOut(0);
        final LineNumber lineNumber = new LineNumber();
        lineNumber.setId(0);
        lineNumber.setStatus("status");
        lineNumber.setNumber(0);
        lineNumber.setFrom(0L);
        lineNumber.setUntil(0L);
        final TimeSlot timeSlot = new TimeSlot();
        timeSlot.setId(0);
        timeSlot.setStartTime(0L);
        timeSlot.setEndTime(0L);
        timeSlot.setStore(new Store());
        timeSlot.setLineNumbers(Arrays.asList(new LineNumber()));
        lineNumber.setTimeSlot(timeSlot);
        lineNumber.setStore(new Store());
        final Customer customer = new Customer();
        customer.setId(0);
        customer.setName("name");
        customer.setSurname("surname");
        customer.setPhoneNumber("phoneNumber");
        customer.setEmail("email");
        customer.setLineNumbers(Arrays.asList(new LineNumber()));
        lineNumber.setCustomer(customer);
        store.setLineNumbers(Arrays.asList(lineNumber));
        final WorkingHour workingHour = new WorkingHour();
        workingHour.setId(0);
        workingHour.setFrom(0);
        workingHour.setUntil(0);
        workingHour.setStore(new Store());
        store.setWorkingHour(workingHour);
        store.setEmployees(Arrays.asList(new Employee()));
        employee.setStore(store);

        // Configure EmployeeRepository.save(...).
        final Employee employee1 = new Employee();
        employee1.setId(0);
        employee1.setEmail("email");
        employee1.setRole("role");
        final Store store1 = new Store();
        store1.setId(0);
        store1.setName("name");
        store1.setDescription("description");
        store1.setLongitude(0.0);
        store1.setLatitude(0.0);
        store1.setMaxCustomers(0);
        store1.setTimeOut(0);
        final LineNumber lineNumber1 = new LineNumber();
        lineNumber1.setId(0);
        lineNumber1.setStatus("status");
        lineNumber1.setNumber(0);
        lineNumber1.setFrom(0L);
        lineNumber1.setUntil(0L);
        final TimeSlot timeSlot1 = new TimeSlot();
        timeSlot1.setId(0);
        timeSlot1.setStartTime(0L);
        timeSlot1.setEndTime(0L);
        timeSlot1.setStore(new Store());
        timeSlot1.setLineNumbers(Arrays.asList(new LineNumber()));
        lineNumber1.setTimeSlot(timeSlot1);
        lineNumber1.setStore(new Store());
        final Customer customer1 = new Customer();
        customer1.setId(0);
        customer1.setName("name");
        customer1.setSurname("surname");
        customer1.setPhoneNumber("phoneNumber");
        customer1.setEmail("email");
        customer1.setLineNumbers(Arrays.asList(new LineNumber()));
        lineNumber1.setCustomer(customer1);
        store1.setLineNumbers(Arrays.asList(lineNumber1));
        final WorkingHour workingHour1 = new WorkingHour();
        workingHour1.setId(0);
        workingHour1.setFrom(0);
        workingHour1.setUntil(0);
        workingHour1.setStore(new Store());
        store1.setWorkingHour(workingHour1);
        store1.setEmployees(Arrays.asList(new Employee()));
        employee1.setStore(store1);
        when(mockEmployeeRepository.save(any(Employee.class))).thenReturn(employee1);

        // Run the test
        final Employee result = employeeServiceUnderTest.changeRole(employee, "role");

        // Verify the results
    }

    @Test
    public void testGenerateWorkingHour() {
        // Setup
        final WorkingHourDTO workingHourDTO = new WorkingHourDTO(0, 0);

        // Run the test
        final WorkingHour result = employeeServiceUnderTest.generateWorkingHour(workingHourDTO);

        // Verify the results
    }
}
