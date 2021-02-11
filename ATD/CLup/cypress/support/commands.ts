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
import {getRandomText} from "../util";

let users = {manager: {}, customer: {}};
const currentSession = getRandomText();
Cypress.Commands.add("login", (n: number, type: "customer" | "manager") => {
    const email = `${n}@${currentSession}-${type}.com`;
    const password = "1234";
    if (!users[type][n]) {
        if (type === "customer") {
            cy.request("POST", "/register", {name: getRandomText(), surname: getRandomText(), email, password});
        } else {
            cy.request("POST", "/register-store", {name: getRandomText(), surname: getRandomText(), email, password, storeName: getRandomText(), address: getRandomText(), vat: getRandomText(), capacity: 0});
        }
        users[type][n] = true;
    }
    cy.request("POST", "/login", {email, password: users[type][n]});
})
