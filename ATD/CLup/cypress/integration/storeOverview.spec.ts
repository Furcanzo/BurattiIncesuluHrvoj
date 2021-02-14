/*
* This function allows a store manager to have a live overview of the store.
* The system will provide the store manager with:
*     the number of customers inside the store (compared to the capacity)
*     and those in the store queue.
* This data should allow him to regulate the flow of customers.
* This function also offers to the store manager the possibility to update the store capacity in order to adapt to the latest regulations.
*
* */

import QrScanner from "qr-scanner";

describe("Store Overview", () => {
    before(() => {
        cy.login(1, "manager", 3).as("store");
    });

    const generateTicketSrc = () => {
        cy.get("@store").then(({storeName, ...rest}) => {
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

    const updateCapacity = (newCapacity: number) => {
        cy.get("#update-btn").click();
        cy.get("#capacity").type(newCapacity.toString());
        cy.get("button#update-form").click();
    }
    it("R31 - The system is able to retrieve the number of customers currently in a store queue\n" +
        "R32 The system is able to retrieve the number of customers currently inside a store", () => {
        cy.login(1, "customer");
        generateTicketSrc().as("firstInline");

        cy.login(1, "manager");
        cy.get("h2").contains("In line").siblings("span.report").contains("1").should("exist");
        cy.get("h2").contains("Inside").siblings("span.report").contains("0").should("exist");

        cy.login(2, "customer");
        generateTicketSrc().as("secondInline");

        cy.login(1, "manager");
        cy.get("h2").contains("In line").siblings("span.report").contains("2").should("exist");
        cy.get("h2").contains("Inside").siblings("span.report").contains("0").should("exist");
        validateTicket("@firstInline");
        cy.get("h2").contains("In line").siblings("span.report").contains("1").should("exist");
        cy.get("h2").contains("Inside").siblings("span.report").contains("1").should("exist");

        cy.login(3, "customer");
        generateTicketSrc().as("thirdInline");

        cy.login(1, "manager");
        cy.get("h2").contains("In line").siblings("span.report").contains("2").should("exist");
        cy.get("h2").contains("Inside").siblings("span.report").contains("1").should("exist");

        validateTicket("@secondInline");
        cy.get("h2").contains("In line").siblings("span.report").contains("1").should("exist");
        cy.get("h2").contains("Inside").siblings("span.report").contains("2").should("exist");

        validateTicket("@firstInline");
        cy.get("h2").contains("In line").siblings("span.report").contains("1").should("exist");
        cy.get("h2").contains("Inside").siblings("span.report").contains("1").should("exist");

        validateTicket("@thirdInline");
        cy.get("h2").contains("In line").siblings("span.report").contains("0").should("exist");
        cy.get("h2").contains("Inside").siblings("span.report").contains("2").should("exist");

    });

    it("R17 - A store manager is able to change the maximum store capacity at any time", () => {
        cy.login(1, "customer");
        generateTicketSrc().as("firstInline");
        cy.login(2, "customer");
        generateTicketSrc().as("secondInline");

        cy.login(1, "manager");
        validateTicket("@firstInline");

        cy.get("h2").contains("Inside").siblings("span.report.minor").contains("3").should("exist");

        updateCapacity(5);
        cy.get("h2").contains("Inside").siblings("span.report.minor").contains("5").should("exist");

    });

    it("Store capacity can not be reduced below the current amount of customers inside", () => {
        cy.login(1, "customer");
        generateTicketSrc().as("firstInline");
        cy.login(2, "customer");
        generateTicketSrc().as("secondInline");

        cy.login(1, "manager");
        validateTicket("@firstInline");
        validateTicket("@secondInline");

        updateCapacity(1);
        cy.get(".toast").should("exist");
    });
})
