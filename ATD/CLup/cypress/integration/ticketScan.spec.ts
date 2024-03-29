/*
* This function allows a store manager to scan (and validate) a customer’s ticket
* (both at the entrance and the exit of the store).
* This has the double purpose of:
*     updating the data contained into the store overview,
*     and make sure that the flow of customers corresponds to that expected by the system (no one is able to enter before his turn).
* */
import QrScanner from 'qr-scanner';

describe("Ticket Scanner", () => {
    const generateTicketSrc = () => {
        cy.get("@newStore").then(({storeName, ...rest}) => {
            cy.get("a.store").contains(storeName).click();
        });
        cy.get("button#form-btn").click();
        return cy.get("img.qr-code").invoke("attr", "src").then((srcUrl) => {
            return new Cypress.Promise((resolve, reject) => {
                QrScanner.scanImage(srcUrl).then((value) => {
                    resolve(value);
                });
            });
        })
    };
    const validateTicket = (alias) => {
        cy.get("#scan-btn").click();
        cy.get(alias).then((result) => {
            cy.get("#ticket").type(result, {force: true});
        })
        cy.get("#form").submit();
    }

    it("R19 - A store manager is able to scan a customer’s ticket at the entrance of the store before letting him in\n" +
        "R22 - The system is able to remove a customer’s ticket from the store queue when it is scanned at the entrance" +
        "R21 - The system is able to perform a validity check on a ticket scanned by a store manager and to inform him about the result", () => {
        // OK
        cy.login(1, "manager", 3).as("newStore");
        cy.login(1, "customer");
        generateTicketSrc().as("QRResult");
        cy.login(1, "manager");
        validateTicket("@QRResult");
        cy.get(".toast").contains("Ticket valid, entrance allowed.").should("exist");
        cy.get("h2").contains("Inside").siblings("span.report").contains("1").should("exist");
        cy.get("h2").contains("In line").siblings("span.report").contains("0").should("exist");
    });

    it("R23 - A customer's ticket is scanned at the exit", () => {
        // OK
        cy.login(2, "manager", 3).as("newStore")
        cy.login(2, "customer");
        generateTicketSrc().as("QRResult");
        cy.login(2, "manager");
        validateTicket("@QRResult");
        validateTicket("@QRResult");
        cy.get(".toast").contains("Ticket valid, exit allowed.").should("exist");
        cy.get("h2").contains("In line").siblings("span.report").contains("0").should("exist");
        cy.get("h2").contains("Inside").siblings("span.report").contains("0").should("exist");

    });

    it("R19 - A store manager is able to scan a customer’s ticket only if the number of customers currently inside does not exceed its maximum capacity\n" +
        "R21 - The system is able to perform a validity check on a ticket scanned by a store manager and to inform him about the result", () => {
        // OK
        cy.login(3, "manager", 1).as("newStore")
        cy.login(3, "customer");
        generateTicketSrc().as("QRResult1");
        cy.login(4, "customer");
        generateTicketSrc().as("QRResult2");
        cy.login(3, "manager");
        validateTicket("@QRResult1");
        validateTicket("@QRResult2");
        cy.get(".toast").contains("The store is full. No information about the validity of the ticket.").should("exist");
        cy.get("h2").contains("In line").siblings("span.report").contains("1").should("exist");
        cy.get("h2").contains("Inside").siblings("span.report").contains("1").should("exist");


    });

    it("R23 - The system is able to invalidate a customer’s ticket\n" +
        "R21 - The system is able to perform a validity check on a ticket scanned by a store manager and to inform him about the result", () => {
        // OK
        cy.login(4, "manager", 1).as("newStore")
        cy.login(5, "customer");
        generateTicketSrc().as("QRResult");
        cy.login(4, "manager");
        validateTicket("@QRResult");
        validateTicket("@QRResult");
        validateTicket("@QRResult");
        cy.get(".toast").contains("No ticket found. Ticket is invalid, access not allowed.").should("exist");
    });

    it("no one should be able to enter before his turn (We can't find a specific requirement for this)\n" +
        "R21 - The system is able to perform a validity check on a ticket scanned by a store manager and to inform him about the result", () => {
        // OK
        cy.login(5, "manager", 1).as("newStore");
        cy.login(6, "customer");
        generateTicketSrc().as("QRResult1");
        cy.login(7, "customer");
        generateTicketSrc().as("QRResult2");
        cy.login(5, "manager");
        validateTicket("@QRResult2");
        cy.get(".toast").contains("This ticket is not the head of the queue, entrance not allowed.").should("exist");
    })

// R20 A store manager is always able to scan a customer’s ticket at the exit of the store before letting him out
    // This seems to be a domain assumption
})
