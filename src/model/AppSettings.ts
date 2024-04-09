// models/AppSettings.ts

export class AccountSettings {
    emailAddress: string;
    privacy: {
        contact: {
            visible: boolean;
        };
        medical: {
            allergies: boolean;
            medications: boolean;
            vaccinations: boolean;
        };
    };

    constructor() {
        this.emailAddress = "";
        this.privacy = {
            contact: {
                visible: false
            },
            medical: {
                allergies: false,
                medications: false,
                vaccinations: false
            }
        };
    }
}

export class EmailNotificationSettings {
    petMonitoring: boolean;
    newAndUpdates: boolean;

    constructor() {
        this.petMonitoring = true;
        this.newAndUpdates = true;
    }
}

export class SecuritySettings {
    twoFactorEnabled: boolean;
    type: string;
    recipient: string;

    constructor() {
        this.twoFactorEnabled = true;
        this.type = "email";
        this.recipient = "";
    }
}

export class AppSettings {
    account: AccountSettings;
    notification: {
        email: EmailNotificationSettings;
    };
    security: SecuritySettings;

    constructor() {
        this.account = new AccountSettings();
        this.notification = {
            email: new EmailNotificationSettings()
        };
        this.security = new SecuritySettings();
    }
}
