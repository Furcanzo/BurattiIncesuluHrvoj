// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })
import {getRandomNumber, getRandomText, randomIntegerBetween} from "../util";
const registerUser = (email: string, password: string) => {
    cy.visit("/register");
    cy.get('input[name^="email"]').type(email);
    cy.get('input[name^="password"]').type(password);
    cy.get('input[name^="name"]').type(getRandomText());
    cy.get('input[name^="surname"]').type(getRandomText());
    cy.get("#form-btn").click();
}

const registerCompany = (email: string, password: string, capacity: number, storeName:string) => {
    cy.fixture("streetsMilan.json").its("streets").as("streetList");
    cy.visit("/register");
    cy.get("a").contains("Join Us Now").click();
    cy.get('input[name^="email"]').type(email);
    cy.get('input[name^="password"]').type(password);
    cy.get('input[name^="name"]').type(getRandomText());
    cy.get('input[name^="surname"]').type(getRandomText());
    cy.get('input[name^="storeName"]').type(storeName);
    cy.get('input[name^="vat"]').type(getRandomNumber().toString());
    cy.get('input[name^="capacity"]').type(capacity.toString());
    cy.get('@streetList').then((streets) => {
        const streetIndex = randomIntegerBetween(0, streets.length - 1);
        const houseNumber = randomIntegerBetween(1, 10);
        const address = `${streets[streetIndex]}, ${houseNumber}, MI`;
        cy.get('input[name^="address"]').type(address);
    })
    cy.get("#form-btn").click();
    cy.url().then((url) => {
        if (url.indexOf("register-store") !== -1) {
            registerCompany(email, password, capacity, storeName);
        }
    })
};

const login = (email: string, password: string) => {
    cy.visit("/login");
    cy.get('input[name^="email"]').type(email);
    cy.get('input[name^="password"]').type(password);
    cy.get("#form-btn").click();
}
let users = {manager: {}, customer: {}};
const currentSession = getRandomText();
Cypress.Commands.add("login", (n: number, type: "customer" | "manager", capacity: number = 20) => {
    cy.clearCookies();
    cy.visit("/");
    const email = `${n}@${currentSession}-${type}.com`;
    const password = "1234";
    console.log(users);
    if (!users[type][n]) {
        if (type === "customer") {
            registerUser(email, password);
            users[type][n] = true;
        } else {
            const storeName = getRandomText();
            registerCompany(email, password, capacity, storeName);
            users[type][n] = {capacity, storeName};
        }
    }
    cy.clearCookies();
    login(email, password);
    cy.wrap(users[type][n]);
})
