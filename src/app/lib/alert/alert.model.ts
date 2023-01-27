export class Alert {
    id?: string;
    type?: eAlertType;
    message?: string;
    autoClose?: boolean;
    keepAfterRouteChange?: boolean;
    fade?: boolean;

    //Initialize class partially
    constructor(init?:Partial<Alert>) {
        Object.assign(this, init);
    }
}

export enum eAlertType {
    Success,
    Error,
    Info,
    Warning
}
export enum eAlertClassId {
    ALERT="alert",
    DEFAULT="default-alert",
    DISMISS="alert-dismissible",
    FADE="fade",
    SUCCESS="alert-success",
    ERROR="alert-danger",
    INFO="alert-info",
    WARNING="alert-warning",
}

export class AlertOptions {
    id?: string;
    autoClose?: boolean;
    keepAfterRouteChange?: boolean;
}
