/*
* This function is a fallback of the first one, indeed, it allows the store manager to insert into the queue any guest requesting it.
* The system will provide the store manager with a digital ticket,
*     which he will have to convert into physical (by printing it) and hand out to the guest.
* Finally, the guest is able to leave the queue at any time before entering the store,
*     by asking the store manager to delete his ticket.
*
* */

describe("Physical Queue", () => {

    it("Check if the tickets store address matches", () => {
        //OK
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
        //OK
        cy.login(2, "manager");
        cy.get("a[href='/overview/ticket/issue']").click();
        cy.get("#close-btn").click();
        cy.get(".toast").should("be.visible");
    })

    it("Check if the ticket can be printed", () => {
        //OK
        cy.login(3, "manager");
        cy.get("a[href='/overview/ticket/issue']").click();
        const printButton = cy.get("#print-btn");
        printButton.should("exist");
        cy.window().then((win) => {
            const printStub = cy.stub(win, "print");
            cy.get("#print-btn").click();
            cy.wrap(printStub).its("calledOnce").should("be.true");
        })
    })

    // R9 The system is able to remove a ticket from a store queue
    it("Check if the ticket can be deleted", () => {
        //OK
        cy.login(4, "manager");
        cy.get("a[href='/overview/ticket/issue']").click();
        const printButton = cy.get("#form-btn");
        printButton.should("exist");
        cy.get("#form-btn").click();
        cy.get("div.report-container:nth-child(2) > span:nth-child(2)").invoke("text").should('eq', "0");
    })

    it("Check if the newly created ticket increases number in line-up", () => {
        //OK
        cy.login(5, "manager");
        cy.get("div.report-container:nth-child(2) > span:nth-child(2)").invoke("text").should('eq', "0");
        cy.get("a[href='/overview/ticket/issue']").click();
        cy.window().then((win) => {
            const printStub = cy.stub(win, "print");
            cy.get("#print-btn").click();
            cy.wrap(win).trigger("afterprint");
        })
        cy.get("#close-btn").click();
        cy.get("div.report-container:nth-child(2) > span:nth-child(2)").invoke("text").should('eq', "1");
    })

    it("Check if manager can issue new ticket if the store is full", () => {
        //OK
        cy.login(6,"manager", 0);
        cy.get("div.report-container:nth-child(2) > span:nth-child(2)").invoke("text").should('eq', "0");
        cy.get("a[href='/overview/ticket/issue']").click();
        cy.window().then((win) => {
            const printStub = cy.stub(win, "print");
            cy.get("#print-btn").click();
            cy.wrap(win).trigger("afterprint");
        })
        cy.get("#close-btn").click();
        cy.get("div.report-container:nth-child(2) > span:nth-child(2)").invoke("text").should('eq', "1");
    })
})
