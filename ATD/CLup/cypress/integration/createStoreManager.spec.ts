import {getRandomNumber, getRandomText, randomIntegerBetween} from "../util";
import {} from "../support/login";

describe("Register Store Manager", () => {

    beforeEach(() => {
        cy.clearCookies();
    })

    const goToRegisterStorePage = () => {
        cy.visit("/");
        cy.get("a").contains("Sign Up Now").click();
        cy.get("a").contains("Join Us Now").click();
    }

    const loginSucceeds = (email: string, password: string) => {
        cy.request("POST", "/login", {email, password}).its("status").should("eq", 200);
    }

    const fillRegisterFormWith = (email: string, password: string, name: string, surname: string, vat: number) => {
        cy.get('input[name^="email"]').type(email);
        cy.get('input[name^="password"]').type(password);
        cy.get('input[name^="name"]').type(name);
        cy.get('input[name^="surname"]').type(surname);
        cy.get('input[name^="storeName"]').type(getRandomText());
        cy.get('input[name^="vat"]').type(vat.toString());
        cy.get('input[name^="capacity"]').type("20".toString());
        cy.get('input[name^="address"]').then((streets) => {
            const streetIndex = randomIntegerBetween(0, streets.length - 1);
            const houseNumber = randomIntegerBetween(1, 10);
            const address = `Via Monte Bianco, ${houseNumber}, MI`;
            cy.get('input[name^="address"]').type(address);
        })
    }

    it("R1 - will ask for the necessary information to register a user (generalization of Store Manager)", () => {
        // OK
        goToRegisterStorePage();
        ["email", "password", "name", "surname", "address", "storeName", "vat", "capacity"].map((field) => {
            cy.get(`input[name^="${field}"`).should("exist");
        });
    });

    it("R1 - will register a person to the system as a user (generalization of Store Manager)", () => {
        // OK
        goToRegisterStorePage();
        const email = `${getRandomText()}@registerClupper.com`;
        const password = getRandomText();
        fillRegisterFormWith(email, password, getRandomText(), getRandomText(), getRandomNumber());
        cy.get("#form-btn").click();
        cy.url().should('include', 'login');
        loginSucceeds(email, password);
    });

    it("R2 - will verify that the email provided by a person during the registration process is unique (generalization of Store Manager)", () => {
        // OK
        goToRegisterStorePage();
        const email = `${getRandomText()}@registerClupper.com`;
        fillRegisterFormWith(email, getRandomText(), getRandomText(), getRandomText(), getRandomNumber());
        cy.get("#form-btn").click();
        cy.clearCookies();
        goToRegisterStorePage();
        fillRegisterFormWith(email, getRandomText(), getRandomText(), getRandomText(), getRandomNumber());
        cy.get("#form-btn").click();
        cy.url().should("include", "register");
        cy.get(".toast").contains("This email is already in use").should("exist");
    });

    it("R3 - will verify that the VAT number provided by a store manager during the registration process is unique", () => {
        // OK
        goToRegisterStorePage();
        const vat = getRandomNumber();
        fillRegisterFormWith(`${getRandomText()}@registerClupper.com`, getRandomText(), getRandomText(), getRandomText(), vat);
        cy.get("#form-btn").click();
        cy.clearCookies();
        goToRegisterStorePage();
        fillRegisterFormWith(`${getRandomText()}@registerClupper.com`, getRandomText(), getRandomText(), getRandomText(), vat);
        cy.get("#form-btn").click();
        cy.get(".toast").contains("This VAT number is already in use.").should("exist");
    });

    it("R4 - will create a new store after the registration of store manager", () => {
        // OK
        goToRegisterStorePage();
        const email = `${getRandomText()}@registerClupper.com`;
        const password = getRandomText();
        fillRegisterFormWith(email, password, getRandomText(), getRandomText(), getRandomNumber());
        cy.get("#form-btn").click();
        cy.clearCookies();
        cy.visit("/");
        cy.get("a").contains("Sign In").click();
        cy.get('input[name^="email"]').type(email);
        cy.get('input[name^="password"]').type(password);
        cy.get("button").contains("Login").click();
        cy.url().should("include", "overview");
        cy.get("h1").contains("Store overview").should("exist");
    });

    it("R5 - A user (generalization of Store Manager) is able to log into the system by entering his personal credentials", () => {
        // OK
        goToRegisterStorePage();
        const email = `${getRandomText()}@registerClupper.com`;
        const password = getRandomText();
        fillRegisterFormWith(email, password, getRandomText(), getRandomText(), getRandomNumber());
        cy.get("#form-btn").click();
        cy.clearCookies();
        cy.visit("/");
        cy.get("a").contains("Sign In").click();
        cy.get('input[name^="email"]').type(email);
        cy.get('input[name^="password"]').type(password);
        cy.get("button").contains("Login").click();
        cy.url().should("include", "overview");
    });
})
