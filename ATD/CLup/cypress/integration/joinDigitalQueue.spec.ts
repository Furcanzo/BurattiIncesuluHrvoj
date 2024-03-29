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
    it("R7 - A clupper is able to join a queue. ", () => {
        // OK
        cy.login(1, "manager");
        cy.login(1, "customer");
        cy.visit("/explore");
        const firstStore = cy.get("a.store").first();
        firstStore.within(() => {
            cy.get("div.store-info>h2").invoke('text').as("storeName");
            cy.get("div.store-info>h3").invoke('text').as("numberOfCustomers");
        });
        firstStore.click();
        cy.get("@storeName").then((storeName) => {
            cy.get("body").contains(storeName);
        });

        cy.get("@numberOfCustomers").then((numberOfCustomers) => {
            cy.get("body").contains(numberOfCustomers);
        });

    });

    it("R8 - The system is able to insert a ticket into a store queue", () => {
        // OK
        // Even though the correct sentence for error should be "1 user in the line" :)
        cy.login(6, "manager").as("newStore");
        cy.login(6, "customer");
        cy.get("@newStore").then((newStore) => {
            cy.get("a.store").contains(newStore.storeName).click();
        });
        cy.get("button#form-btn").click();
        cy.get("a[href='/explore']").click();
        cy.get("@newStore").then((newStore) => {
            cy.get("a.store").contains(newStore.storeName).siblings().contains("1 users in line").should("exist");
        });
    });

    it("R16 - A clupper is able to retrieve a previously obtained ticket", () => {
        // OK
        cy.login(7, "manager").as("newStore");
        cy.login(7, "customer");
        cy.get("@newStore").then((newStore) => {
            cy.get("a.store").contains(newStore.storeName).click();
        });
        cy.get("button#form-btn").click();
        cy.get("body").invoke("html").as("ticket");
        cy.get("a[href='/explore']").click();
        cy.login(7, "customer");
        cy.get("a[href='/explore/queue']").click();
        cy.get("@ticket").then((tic) => {
            cy.get("body").invoke("html").should("eq", tic);
        });
    })

    it("R9 - The system is able to remove a ticket from a store queue", () => {
        // OK
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

    it("R7 - A clupper is able to join at most one queue at any time (for any store)", () => {
        // OK
        cy.login(4, "manager").as("firstStore");
        cy.login(5, "manager").as("secondStore");
        cy.login(3, "customer");

        cy.get("@firstStore").then(({storeName, ...rest}) => {
            cy.get(".store").contains(storeName).click();
        });
        cy.get("button#form-btn").click();
        cy.get("a[href='/explore']").click();

        cy.get("@secondStore").then(({storeName, ...rest}) => {
            cy.get(".store").contains(storeName).click();
        });
        cy.get(".btn.disable").should("exist");
        cy.get(".btn.disable").click();
        cy.get(".toast").contains("You can be in one queue at a time.").should("exist");
    });
});
