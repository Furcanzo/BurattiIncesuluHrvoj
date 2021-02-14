/*
* This function allows a clupper to line up for the desired store without having to immediately reach the store.
* After selecting a supermarket from the list
* the clupper will be able to see its details:
*    (name, address, number of customers already in line)
* and to join the queue.
* The system will provide the clupper with a digital ticket, which he will be able to see directly from the application.
* Finally, the clupper is able to leave the queue at any time before entering the store,
*   this results in the deletion of his ticket.
* */

describe("JoinDigitalQueue", () => {
    before(()=>{
        cy.login(1, "customer");
    });
    beforeEach(()=>{
        cy.visit("/explore");
    });
    it("Select a supermarket", () => {
        const firstStore = cy.get("a.store").first();
        firstStore.within(()=>{
            cy.get("div.store-info>h2").invoke('text').as("storeName");
            cy.get("div.store-info>h3").invoke('text').as("numberOfCustomers");
        });
        firstStore.click();
        cy.get("@storeName").then((storeName)=>{
            cy.get("body").contains(storeName);
        });

        cy.get("@numberOfCustomers").then((numberOfCustomers)=>{
            cy.get("body").contains(numberOfCustomers);
        });

    });

    // R6 The system is able to generate a new ticket after receiving a request

    // R8 The system is able to insert a ticket into a store queue

    // R16 A clupper is able to retrieve a previously obtained ticket
    it("Join the queue", ()=>{
        cy.login(1, "manager").as("newStore");
        cy.login(1, "customer");
        cy.get("@newStore").then((newStore) => {
            cy.get("a.store").contains(newStore.storeName).click();
        });
        cy.get("button#form-btn").click();
        cy.get("body").then(($el) => {
            cy.wrap($el.html());
        }).as("ticket");
        cy.get("a[href='/explore']").click();
        cy.login(1, "customer");
        cy.get("a[href='/explore/queue']").click();
        cy.get("@ticket").then((tic)=>{
            cy.get("body").then(($el) => {
                cy.wrap($el.html());
            }).should("eq",tic);
        });
    });

    // R9 The system is able to remove a ticket from a store queue

    it.only("Leave the queue", ()=>{
        cy.login(2, "manager").as("newStore");
        cy.login(2, "customer");
        cy.get("@newStore").then((newStore) => {
            cy.get("a.store").contains(newStore.storeName).click();
        });
        cy.get("button#form-btn").click();
        cy.get("a[href='/explore']").click();
        cy.login(2, "customer");
        cy.get("a[href='/explore/queue']").click();
        cy.get("button#form-btn").click();
        cy.get("a[href='/explore/queue']").click();
        cy.get(".toast").contains("No ticket found.").should("exist");

    });

    // R7 A clupper is able to join at most one queue at any time (for any store)

});
