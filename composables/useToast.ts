export enum AlertType {
    SUCCESS = 'success',
    ERROR = 'error',
    WARNING = 'warning',
    INFO = 'info',
}

export interface IAlertInfo {
    type: AlertType;
    message: string;
    timer?: number;
}

export const alertInfo: Ref<IAlertInfo | null> = ref(null);

export function setAlertInfo(payload: IAlertInfo | null) {
    alertInfo.value = payload;
}

export function showError(response: any) {
    console.log(response)
    let alertMessage = 'An error occurred. Please try again later.';
    const errorValue = response?.error?.value;
    if (!errorValue) {
        setAlertInfo({
            type: AlertType.ERROR,
            message: alertMessage
        });
        return;
    }
    if (errorValue.errorCode === 302) {
        window.location.reload(); // Hard reload when we get a 302 error. Normally it fixed the app.
    }
    if (errorValue.data) {
        const firstError = Object.keys(errorValue.data)[0];
        alertMessage = `${firstError}: ${JSON.stringify(
            errorValue.data[firstError]
        )}`;
    } else {
        if (typeof errorValue.message === 'string') {
            alertMessage = errorValue.message;
        } else {
            const firstError = Object.keys(errorValue.message)[0];
            alertMessage = `${firstError}: ${JSON.stringify(
                errorValue.message[firstError]
            )}`;
        }
    }
    setAlertInfo({
        type: AlertType.ERROR,
        message: alertMessage
    });
}

export function showInfo(message: string) {
    setAlertInfo({
        type: AlertType.INFO,
        message
    });
}

export function showWarning(message: string) {
    setAlertInfo({
        type: AlertType.WARNING,
        message
    });
}

export function showSuccess(message: string) {
    setAlertInfo({
        type: AlertType.SUCCESS,
        message: message
    });
}
