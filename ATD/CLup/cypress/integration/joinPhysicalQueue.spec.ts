/*
* This function is a fallback of the first one, indeed, it allows the store manager to insert into the queue any guest requesting it.
* The system will provide the store manager with a digital ticket,
*     which he will have to convert into physical (by printing it) and hand out to the guest.
* Finally, the guest is able to leave the queue at any time before entering the store,
*     by asking the store manager to delete his ticket.
*
* */

describe("Physical Queue", () => {

    it("R6 - The system is able to generate a new ticket after receiving a request", () => {
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

    it("Check if the ticket cannot be closed before it is printed (We couldn't find a requirement for this)", () => {
        //OK
        cy.login(2, "manager");
        cy.get("a[href='/overview/ticket/issue']").click();
        cy.get("#close-btn").click();
        cy.get(".toast").should("be.visible");
    })

    it("Check if the ticket can be printed (We couldn't find a requirement for this, however it is mentioned as a function in the RASD)", () => {
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

    it("R9 - The system is able to remove a ticket from a store queue", () => {
        //OK
        cy.login(4, "manager");
        cy.get("a[href='/overview/ticket/issue']").click();
        const printButton = cy.get("#form-btn");
        printButton.should("exist");
        cy.get("#form-btn").click();
        cy.get("div.report-container:nth-child(2) > span:nth-child(2)").invoke("text").should('eq', "0");
    })

    it("R31 - The system is able to retrieve the number of customers currently in a store queue", () => {
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

    it("R6 - The system is able to generate a new ticket after receiving a request even when the store is full", () => {
        //OK
        // We wanted to check this given that the ability to create tickets and check in can easily be mixed by developers.

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
