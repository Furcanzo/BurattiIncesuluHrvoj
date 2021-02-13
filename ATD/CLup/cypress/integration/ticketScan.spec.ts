/*
* This function allows a store manager to scan (and validate) a customer’s ticket
* (both at the entrance and the exit of the store).
* This has the double purpose of:
*     updating the data contained into the store overview,
*     and make sure that the flow of customers corresponds to that expected by the system (no one is able to enter before his turn).
* */
import QrScanner from 'qr-scanner';
describe("Ticket Scanner", () => {
    it("should scan a user in the store", () => {
        cy.login(1, "manager", 3).as("newStore")
        cy.login(1, "customer");
        cy.get("@newStore").then(({storeName, ...rest}) => {
            cy.get("a.store").contains(storeName).click();
        });
        cy.get("button#form-btn").click();
        cy.get("img.qr-code").invoke("attr", "src").then((srcUrl) => {
            return new Cypress.Promise((resolve, reject) => {
                QrScanner.scanImage(srcUrl).then((value) => {
                    resolve(value);
                });
            });
        }).as("QRResult");
        cy.login(1, "manager");
        cy.get("#scan-btn").click();
        cy.get("@QRResult").then((result) => {

            cy.get("#ticket").type(result, {force: true});
        })
        cy.get("#form").submit();
        cy.get(".toast").contains("Ticket valid, entrance allowed.").should("exist");

        //Ticket valid, entrance allowed.
        // cy.get("a[href='/explore']").click();

    });
})
