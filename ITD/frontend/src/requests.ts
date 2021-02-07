import {http} from "./effects";
import {
    Clerk,
    IServerCustomerRequest,
    IServerCustomerResponse,
    IServerEmployeeRequest,
    IServerEmployeeResponse, IServerLineNumberRequest, IServerLineNumberResponse, IServerMonitorResponse,
    IServerStoreRequest, IServerStoreResponse, IServerTimeSlot, Manager,
} from "./models";
import {NewStore} from "./backoffice/models";

// Generic

export const reqLogin = (success, fail, email: string) => {
    return http({
        path: "/login?email=" + encodeURIComponent(email),
        method: "GET",
        resultAction: success,
        errorAction: fail,
    })
}
// Manager
export const reqUpdateStore = (success, fail, storeId: number, newStore: IServerStoreRequest) => {
    return http({
        path: "/store?storeId=" + encodeURIComponent(storeId),
        method: "PUT",
        body: newStore,
        resultAction: success,
        errorAction: fail,
    })
}

export const reqGetUser = (success: (state: any, user: IServerCustomerResponse | IServerEmployeeResponse) => any, fail, userType: "customer" | "employee", userId: string) => {
    return http({
        path: `/user?type=${encodeURIComponent(userType)}&id=${encodeURIComponent(userId)}`,
        method: "GET",
        resultAction: success,
        errorAction: fail,
    })
}

export const reqAddEmployee = (success: (state: any, employee: IServerEmployeeResponse) => any, fail, newEmployee: IServerEmployeeRequest) => {
    return http({
        path: "/employee",
        method: "POST",
        body: newEmployee,
        resultAction: success,
        errorAction: fail,
    })
}

export const reqMonitor = (success: (state: any, result: IServerMonitorResponse) => any, fail, storeId: number, showResults: boolean) => {
    return http({
        path: "/monitorLive?id=" + encodeURIComponent(storeId),
        method: "GET",
        resultAction: success,
        errorAction: fail,
        showScreenWhileLoading: showResults,
    })
}

export const reqGetStaffList = (success: (state: any, result: (Clerk | Manager)[]) => any, fail) => {
    return http({
        path: "/employee/list",
        method: "GET",
        resultAction: success,
        errorAction: fail,
    })
}

export const reqChangeRole = (success: (state: any, result: (Clerk | Manager)) => any, fail, employeeId: number, role: "clerk" | "manager") => {
    return http({
        path: `/changeRole?id=${encodeURIComponent(employeeId)}&role=${encodeURIComponent(role)}`,
        method: "PUT",
        resultAction: success,
        errorAction: fail,
    })
}

//Customer
export const reqBookFutureLineNumber = (success: (state: any, result: IServerLineNumberResponse) => any, fail, lineNumber: IServerLineNumberRequest) => {
    return http({
        path: "/book",
        method: "POST",
        resultAction: success,
        errorAction: fail,
    })
}

export const reqETA = (success: (state: any, result: number) => any, fail, lineNumber: IServerLineNumberRequest) => {
    return http({
        path: "/ETA",
        method: "POST",
        body: lineNumber,
        resultAction: success,
        errorAction: fail,
        showScreenWhileLoading: true, // We show loading when the ETA is being fetched.
    })
}

export const reqGetImmediateLineNumber = (success: (state: any, result: IServerLineNumberResponse) => any, fail, lineNumber: IServerLineNumberRequest) => {
    return http({
        path: "/retrieve",
        method: "POST",
        resultAction: success,
        errorAction: fail,
    })
}

export const reqGetStoreList = (success: (state: any, result: IServerStoreResponse[]) => any, fail) => {
    return http({
        path: "/store/list",
        method: "GET",
        resultAction: success,
        errorAction: fail,
    })
}
export const reqGetStore = (success: (state: any, result: IServerStoreResponse) => any, fail, id: number) => {
    return http({
        path: "/store?id=" + encodeURIComponent(id),
        method: "GET",
        resultAction: success,
        errorAction: fail,
    })
}
export const reqRegister = (success: (state: any, result: IServerCustomerResponse) => any, fail, customer: IServerCustomerRequest) => {
    return http({
        path: "/register",
        method: "POST",
        body: customer,
        resultAction: success,
        errorAction: fail,
    })
}

export const reqListLineNumbers = (success: (state: any, result: IServerLineNumberResponse[]) => any, fail) => {
    return http({
        path: "/lineNumber/list",
        method: "GET",
        resultAction: success,
        errorAction: fail
    })
}

export const reqListTimeSlotsOf = (success: (state: any, result: IServerTimeSlot[]) => any, fail, storeId: number) => {
    return http({
        path: "/timeSlot/list?storeId=" + encodeURIComponent(storeId),
        method: "GET",
        resultAction: success,
        errorAction: fail
    })
}
// Clerk
export const reqCheckInOut = (success: (state: any, result: IServerLineNumberResponse) => any, fail, lineNumberId: string) => {
    return http({
        path: "/checkinout?lineNumberId=" + encodeURIComponent(lineNumberId),
        method: "PATCH",
        resultAction: success,
        errorAction: fail,
    });
}

export const reqGenerateQr = (success: (state: any, result: IServerLineNumberResponse) => any, fail, body: IServerLineNumberRequest) => {
    return http({
        path: "/guestTicket",
        method: "POST",
        resultAction: success,
        body: body,
        errorAction: fail
    })
}
//Backoffice
export const reqCreateStore = (success: (state: any, result: null) => any, fail, newStore: NewStore) => {
    return http({
        path: "/store",
        method: "POST",
        body: newStore,
        resultAction: success,
        errorAction: fail,
    })
}
