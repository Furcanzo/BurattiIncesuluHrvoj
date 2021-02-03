export class User {
    email: string;
    userType: "manager" | "clerk" | "customer" | "anonymous" | "backoffice";
}
export abstract class State<U extends User> {
    currentUser?: U;
    loading: boolean;
    error?: {
        recoverable?: boolean;
        text?: string;
    };
}
export interface INavigatorItem {
    title: string;
    route: string;
    isDefault: boolean;
    onEnter: (state) => any;
}

export class Component<ComponentState extends State<U>, U extends User> {
    constructor(readonly view: (componentState: ComponentState) => any, readonly initAction: (state: State<U>) => ComponentState, readonly navigation: INavigatorItem[]) {
    }
}
