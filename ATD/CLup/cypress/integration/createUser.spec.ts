import {getRandomText} from "../util";

describe("Register Clupper", () => {
    beforeEach(() => {
        cy.clearCookies();
    })

    const goToRegisterPage = () => {
        cy.visit("/");
        cy.get("a").contains("Sign Up Now").click();
    }
    const loginSucceeds = (email: string, password: string) => {
        cy.request("POST", "/login", {email, password}).its("status").should("eq", 200);
    }

    const fillRegisterFormWith = (email: string, password: string, name: string, surname: string) => {

        cy.get('input[name^="email"]').type(email);
        cy.get('input[name^="password"]').type(password);
        cy.get('input[name^="name"]').type(name);
        cy.get('input[name^="surname"]').type(surname);
    }
    it("R1 - will ask for the necessary information to register a user (generalization of Clupper)", () => {
        // OK
        goToRegisterPage();
        ["email", "password", "name", "surname"].map((field) => {
            cy.get(`input[name^="${field}"`).should("exist");
        });
    });
    it("R1 - will register a person to the system as a user (generalization of Clupper)", () => {
        // OK
        goToRegisterPage();
        const email = `${getRandomText()}@registerClupper.com`;
        const password = getRandomText();
        fillRegisterFormWith(email, password, getRandomText(), getRandomText());
        cy.get("#form-btn").click();
        cy.url().should('include', 'login');
        loginSucceeds(email, password);
    });

    it("R2 - will verify that the email provided by a person during the registration process is unique (generalization of Clupper)", () => {
        // OK
        goToRegisterPage();
        const email = `${getRandomText()}@registerClupper.com`;
        fillRegisterFormWith(email, getRandomText(), getRandomText(), getRandomText());
        cy.get("#form-btn").click();
        cy.clearCookies();
        goToRegisterPage();
        fillRegisterFormWith(email, getRandomText(), getRandomText(), getRandomText());
        cy.get("#form-btn").click();
        cy.url().should("include", "register");
        cy.get(".toast").contains("This email is already in use").should("exist");
    });

    it("R5 - A user (generalization of Clupper) is able to log into the system by entering his personal credentials", () => {
        // OK
        goToRegisterPage();
        const email = `${getRandomText()}@registerClupper.com`;
        const password = getRandomText();
        fillRegisterFormWith(email, password, getRandomText(), getRandomText());
        cy.get("#form-btn").click();
        cy.clearCookies();
        cy.visit("/");
        cy.get("a").contains("Sign In").click();
        cy.get('input[name^="email"]').type(email);
        cy.get('input[name^="password"]').type(password);
        cy.get("button").contains("Login").click();
        cy.url().should("include", "explore");
    });
})
