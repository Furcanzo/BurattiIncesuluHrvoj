/*
* This function is a fallback of the first one, indeed, it allows the store manager to insert into the queue any guest requesting it.
* The system will provide the store manager with a digital ticket,
*     which he will have to convert into physical (by printing it) and hand out to the guest.
* Finally, the guest is able to leave the queue at any time before entering the store,
*     by asking the store manager to delete his ticket.
*
* */

describe("Physical Queue", () => {

    // R6 The system is able to generate a new ticket after receiving a request
    // R8 The system is able to insert a ticket into a store queue
    it("Check if the tickets store address matches", () => {
        cy.login(1, "manager");
        const addressComponent = cy.get(".store-details > h2:nth-child(2)");
        addressComponent.should("be.visible");
        addressComponent.invoke("text").as("storeAdress");
        cy.get("a[href='/overview/ticket/issue']").click();
        cy.get("img.qr-code").should("exist");
        cy.get("@storeAdress").then((addr) => {
            cy.get("div.info-container:nth-child(1) > div:nth-child(2) > h2:nth-child(2)").invoke("text").should("eq", addr)
        })
    })

    it("Check if the ticket cannot be closed before it is printed", () => {
        cy.login(1, "manager");
        cy.get("a[href='/overview/ticket/issue']").click();
        cy.get("#close-btn").click();
        cy.get(".toast").should("be.visible");
    })

    it("Check if the ticket can be printed", () => {
        cy.login(1, "manager");
        cy.get("a[href='/overview/ticket/issue']").click();
        const printButton = cy.get("#print-btn");
        printButton.should("exist");
        // window.print
        cy.window().then((win) => {
            const printStub = cy.stub(win, "print");
            cy.get("#print-btn").click();
            cy.wrap(printStub).its("calledOnce").should("be.true");
        })
    })

    // R9 The system is able to remove a ticket from a store queue
    it("Check if the ticket can be deleted", () => {
        cy.login(1, "manager");
        cy.get("a[href='/overview/ticket/issue']").click();
        const printButton = cy.get("#form-btn");
        printButton.should("exist");
        cy.get("#form-btn").click();
        cy.get("div.report-container:nth-child(2) > span:nth-child(2)").invoke("text").should('eq', "0");
    })

    // Is this hardcoded in a bad way if it checks "In line" from 0 to 1?
    it("Check if the newly created ticket increases number in line-up", () => {
        cy.login(1, "manager");
        cy.get("div.report-container:nth-child(2) > span:nth-child(2)").invoke("text").should('eq', "0");
        cy.get("a[href='/overview/ticket/issue']").click();
        cy.get("#print-btn").click();
        cy.get("#close-btn").click();
        cy.get("div.report-container:nth-child(2) > span:nth-child(2)").invoke("text").should('eq', "1");
    })

    it.only("Check if manager can issue new ticket if the store is full", () => {
        cy.login(2,"manager", 0);
        cy.get("div.report-container:nth-child(2) > span:nth-child(2)").invoke("text").should('eq', "0");
        cy.get("a[href='/overview/ticket/issue']").click();
        cy.get("#print-btn").click();
        cy.get("#close-btn").click();
        cy.get("div.report-container:nth-child(2) > span:nth-child(2)").invoke("text").should('eq', "1");
    })
})

