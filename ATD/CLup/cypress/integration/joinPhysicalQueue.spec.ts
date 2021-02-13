/*
* This function is a fallback of the first one, indeed, it allows the store manager to insert into the queue any guest requesting it.
* The system will provide the store manager with a digital ticket,
*     which he will have to convert into physical (by printing it) and hand out to the guest.
* Finally, the guest is able to leave the queue at any time before entering the store,
*     by asking the store manager to delete his ticket.
*
* */

describe("Physical Queue", () => {



    it("Create physical ticket", () => {
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

    it("Check if physical ticket can be printable", () => {
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


    })

