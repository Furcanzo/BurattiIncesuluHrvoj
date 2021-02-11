declare namespace Cypress {
    interface Chainable {
        /**
        * Custom command to login as a specific user to the given CLup implementation
         * Do NOT use to test authentication.
        * */
        login(n: number, type: "customer" | "manager"): Chainable;
    }
}
