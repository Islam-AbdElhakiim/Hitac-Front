import { Url } from "next/dist/shared/lib/router/router";
import { ReactElement, ReactHTMLElement } from "react";

export type SearchParams = {
    classes?: string;
    placeHolder?: string;
    onSearch: (value: string) => void
}

export type NavigationLink = {
    link: any;
    openSecondLevelMenu: (val: string) => void;
    secondLevelMenuOpened: string;
    openThirdLevelMenu: (val: string) => void
    thirdLevelMenuOpened: string;
    pathName: string;
    isActive: boolean;
}

export class Attribute {
    key: string = "";
    values: string[] = [];
}

export type ButtonParams = {
    title?: any;
    icon?: ReactElement;
    classes?: string;
    isLink?: boolean;
    href?: Url;
    as?: string;
    type?: "button" | "submit" | "reset" | undefined;
    isIconRight?: boolean;
    isDisabled?: boolean;
    // ifTrue?: () => void;
    handleOnClick?: (p?: any) => void;
}

export type ModelParams = {
    title?: string;
    body?: string;
    isOpen?: boolean;
    setIsOpen: (arg: any) => void;
    ifTrue: () => void;
}



export type DepartmentTitles = "sales" | "marketing" | "inventory" | "accounting";

export type Department = {
    title: DepartmentTitles,
    selected: boolean
}
export type Segment = {
    title: string,
    selected: boolean
}

export type CreateAuthDto = {
    email: string;
    password: string;
    rememberMe: boolean;
}

export type EmployeeType = {
    _id?: string;
    firstName: string;
    lastName: string;
    role: string;
    isDeleted?: boolean;
    age: number
    salary: number;
    email: string;
    password: string;
    confirmPassword: string;
    telephone: string[];
    modules: DepartmentTitles[];
    accessedAccounts?: string[]
    notifications?: string[]
    pinned?: string[]
    notes: string;
    hiringDate: string;
    image: string;
    [key: string]: string | number | undefined | boolean | string[]; // Adding an index signature

};
export type accountType = {
    _id?: string;
    englishName: string,
    arabicName: string,
    website: string,
    countries: string[],
    emails: string[],
    addresses: string[],
    telephones: string[],
    cities: string[],
    ports: string[],
    segments: { [key: string]: string }[],
    products: { [key: string]: string }[],

    contacts: { [key: string]: string }[],
    [key: string]: string | number | undefined | boolean | string[] | { [key: string]: string }[]; // Adding an index signature

};
export type accountInitalType = {
    _id?: string;
    englishName: string,
    arabicName: string,
    website: string,
    country: string,
    email: string,
    address: string,
    telephone: string,
    city: string,
    port: string,
    segments: string[],
    products: string[],

    contacts: string[],
    [key: string]: string | number | undefined | string[]// Adding an index signature

};
export type contactType = {
    _id?: string;
    firstName: string,
    lastName: string,
    websites: string[],
    countries: string[] | string,
    emails: string[],
    telephones: string[],
    cities: string[] | string,
    ports: string[],
    note: string,
    segments: { [key: string]: string }[],
    products: { [key: string]: string }[],

    account: { [key: string]: string },
    [key: string]: string | number | undefined | boolean | string[] | { [key: string]: string }[] | { [key: string]: string }; // Adding an index signature

};
export type contactInitalType = {
    _id?: string;
    firstName: string,
    lastName: string,
    websites: string,
    country: string,
    email: string,
    telephone: string,
    city: string,
    port: string,
    notes: string,
    segments: string[],
    products: string[],

    account: string,
    [key: string]: string | number | undefined | string[]; // Adding an index signature

};
export type contactinterface = {
    _id?: string;
    firstName: string,
    lastName: string,
    websites: string[],
    countries: string[],
    emails: string[],
    telephones: string[],
    cities: string[],
    ports: string[],
    notes: string,
    segments: string[],
    products: string[],

    account: string,
    [key: string]: string | number | undefined | boolean | string[] | { [key: string]: string }[]; // Adding an index signature

};
export type supplierType = {
    _id?: string;
    firstName: string,
    lastName: string,
    countries: string,
    emails: string[],
    telephones: string[],
    cities: string,
    segments: string[],
    products: string[],
    notes: string,

    [key: string]: string | number | undefined | string[]; // Adding an index signature

};

export type intialSalesType = {
    _id?: string;
    account: string,
    email: string,
    whatsapp: string,
    country: string,
    port: string,
    products: string[],
    packaging: string,
    totalWeight: string,
    unit: string,
    currency: string,
    totalUnits: string,
    rate: string,
    total: string,
    description: string,

    [key: string]: string | number | undefined | string[]; // Adding an index signature

};

export type orderItem = {
    totalWeight: string,
    product: string,
    specifications: { [key: string]: string },


}
export type confirmationSalesType = {
    _id?: string;
    deposit: string;
    percent: string;
    currency: string;
    finalPrice: string;
    paymentPlan: string;
    exportManager: string;
    incoTerms: string;
    orderItems: orderItem[];

    [key: string]: string | number | undefined | orderItem[] | { [key: string]: string }; // Adding an index signature

};
export type successSalesType = {
    _id?: string;
    deposit: string;
    percent: string;
    currency: string;
    finalPrice: string;
    paymentPlan: string;
    remaining: string;
    fulfillment: string;
    fulfillmentDate: string;

    [key: string]: string | number | undefined | orderItem[] | { [key: string]: string }; // Adding an index signature

};
export type supplySalesType = {
    _id?: string;
    supplyOrder: string;
    supplier: string;
    station: string;
    operation: string;
    qualitySpecialist: string;
    logistics: string;

    [key: string]: string | number | undefined | orderItem[] ; // Adding an index signature

};
export type transportingSalesType = {
    _id?: string;
    pot: string;
    shippingName: string;
    cutOff: string;
    bookingNumber: string;
    transportingDate: string;
    arrivingDate: string;

    [key: string]: string | number | undefined | orderItem[] ; // Adding an index signature

};
export type stationType = {
    _id?: string;
    englishName: string,
    arabicName: string,
    address: string,
    countries: string,
    emails: string[],
    telephones: string[],
    cities: string,
    notes: string,

    [key: string]: string | number | undefined | string[]; // Adding an index signature

};
export type supplyOrderType = {
    _id?: string;
    salesOrder: string,
    supplier: { [key: string]: string },
    createdOn: string,
    products: [],
    price: string,
    description: string,
    [key: string]: string | number | undefined | string[] | { [key: string]: string }; // Adding an index signature

};
export type supplyOrderInitalType = {
    _id?: string;
    salesOrder: string,
    supplier: string,
    createdOn: string,
    createdB?: string,
    products: string[],
    price: string,
    description: string,
    [key: string]: string | number | undefined | string[]; // Adding an index signature

};
export type inStockProductsInitalType = {
    _id?: string;
    salesCases: [],
    suppliers: string[],
    station: string,
    packingDate?: string,
    products: string[],
    totalPallets: string,
    description: string,
    qualitySpecialist: string,
    operation: string,
    [key: string]: string | number | undefined | string[]; // Adding an index signature

};
export class variant {
    title: string = "";
    value: string = "";
}

export type variantInitalType = {
    _id?: string;
    arrivingDate?: string,
    equipmentsType: string,
    totalCount: string,
    supplier: string,
    status?: string,
    fulfillDate?: string,
    palletId?: string,
    variants: variant[],
    [key: string]: string | number | undefined | string[] | variant[] // Adding an index signature

};

export type emailInitalType = {
    id?: string;
    to: string;
    sentDate: string;
    status: string;
    agent: string;
    body: string;
    [key: string]: string | number | undefined | string[] | { [key: string]: string }; // Adding an index signature

};
export type whatsappInitalType = {
    id?: string;
    to:  string;
    sentDate:  string;
    status:  string;
    agent:  string;
    template:  string;
    body:  string;
    [key: string]: string | number | undefined | string[] | { [key: string]: string }; // Adding an index signature

};
export type socialInitalType = {
    id?: string;
    platfrom:  string;
    account:  string;
    sentDate:  string;
    status:  string;
    agent:  string;
    body:  string;
    [key: string]: string | number | undefined | string[] | { [key: string]: string }; // Adding an index signature

};
export type palletsInitalType = {
    id?: string;
    patch?: string,
    salesCases?: string,
    supplier: string,
    station: string,
    packingDate?: string,
    product: string,
    brand: string,
    boxWeight: string,
    boxesPerBase: string,
    boxesPerColumn: string,
    totalBoxes: string,
    palletGrossWeight: string,
    palletNetWeight: string,
    status?: string,
    containerSpot: string,
    qrCode?: string,
    qualitySpecialist: string,
    operation: string,
    specifications: { [key: string]: string },
    [key: string]: string | number | undefined | string[] | { [key: string]: string }; // Adding an index signature

};
export type returnRequestsType = {
    _id?: string;
    supplyOrder: { [key: string]: string },
    supplier: { [key: string]: string },
    createdOn: string,
    product: { [key: string]: string },
    price: string,
    description: string,
    [key: string]: string | number | undefined | string[] | { [key: string]: string }; // Adding an index signature

};
export type returnRequestsInitalType = {
    _id?: string;
    supplyOrder: string,
    supplier: string,
    createdOn: string,
    product: string,
    price: string,
    description: string,
    [key: string]: string | number | undefined | string[]; // Adding an index signature

};

export type segmentType = {
    _id?: string;
    name: string,
    description: string,
    image?: string,
    [key: string]: string | number | undefined | string[]; // Adding an index signature

}
export type salesType = {
    _id?: string;
    account: { [key: string]: string },
    origin: string,
    port: string,
    segment: { [key: string]: string },
    createdOn: string,
    status: string,
    isDeleted   : string,

}
export type productType = {
    _id: string;
    name: string,
    description: string,
    size: string,
    segment: { [key: string]: string },
    image?: string,
    isDeleted?: boolean,
    specifications: Attribute[],

}
export type supplierAccountingType = {
    _id?: string;
    type: string,
    supplier: string,
    supplyOrder: string,
    totalBefore: string,
    amount: string,
    totalAfter: string,
    bankAccount: string,
    date: string,
    notes: string,
    isDeleted?: boolean,

}
export type bankAccountType = {
    _id?: string;
    bankName: string,
    holder: string,
    account: string,
    address: string,
    available: string,
    isDeleted?: boolean,

}
export type stationAccountingType = {
    _id?: string;
    type: string,
    station: string,
    supplyOrder: string,
    totalBefore: string,
    amount: string,
    totalAfter: string,
    bankAccount: string,
    date: string,
    notes: string,
    isDeleted?: boolean,

}
export type revenueAccountingType = {
    _id?: string;
    type: string,
    salesCases: string,
    amount: string,
    account: string,
    createdOn: string,
    notes: string,
    isDeleted?: boolean,

}
export type cashType = {
    _id?: string;
    salesCases: string,
    amount: string,
    account: string,
    createdOn: string,
    notes: string,
    isDeleted?: boolean,

}

export type expensesAccountingType = {
    _id?: string;
    type: string,
    amount: string,
    bankAccount: string,
    date: string,
    notes: string,
    isDeleted?: boolean,

}
export type productInitalType = {
    _id?: string;
    name: string,
    description: string,
    segment: string,
    image?: string,
    specifications: Attribute[],


}

export class CreateEmployeeDTO {
    _id?: string;
    firstName: string;
    lastName: string;
    role: string;
    age: number;
    salary: number;
    email: string;
    password?: string;
    telephone: string[];
    modules: DepartmentTitles[];
    accessedAccounts?: string[]
    notes: string;
    hiringDate: string;
    image: string;
    constructor(Emp: EmployeeType) {
        this._id = Emp._id;
        this.firstName = Emp.firstName;
        this.lastName = Emp.lastName;
        this.role = Emp.role;
        this.age = Emp.age;
        this.salary = Emp.salary;
        this.email = Emp.email;
        if (Emp.password) {
            this.password = Emp.password;
        }
        this.telephone = Emp.telephone;
        this.modules = Emp.modules;
        this.salary = Emp.salary;
        this.notes = Emp.notes;
        this.hiringDate = Emp.hiringDate;
        this.image = Emp.image;
        this.accessedAccounts = Emp.accessedAccounts;
    }
}


export type Account = {
    _id: string
    arabicName: string;

    englishName: string;

    emails: string[];

    telephones: string[];

    countries: string[];

    cities: string[];

    ports: string[];

    segments: string[];

    products: string[];

    contacts: string[];

    isDeleted: boolean;
};


// export type empKeys = 

export type validationKeys = "firstName" | "lastName" | "email" | "telephone" | "age" | "salary" | "password" | "confirmPassword" | "role" | "hiringDate" | "modules";
// export type validationKeyss = "firstName" | "lastName" | "email" | "telephone" | "age" | "salary" | "password" | "role";

export type ValidationObject = {
    [key in validationKeys]: singleValidationObject;
}
export type singleValidationObject = {
    regex?: RegExp,
    isValid: boolean
}
export type accountsValidationKeys = "arabicName" | "englishName" | "emails" | "telephones" | "countries" | "cities" | "ports" | "segments" | "products" | "contacts" | "website" | "addresses";
// export type validationKeyss = "firstName" | "lastName" | "email" | "telephone" | "age" | "salary" | "password" | "role";

export type accountsValidationObject = {
    [key in accountsValidationKeys]: singleValidationObject;
}
export type contactsValidationKeys = "arabicName" | "englishName" | "emails" | "telephones" | "country" | "city" | "ports" | "segments" | "products" | "account" | "websites";
// export type validationKeyss = "firstName" | "lastName" | "email" | "telephone" | "age" | "salary" | "password" | "role";

export type contactsValidationObject = {
    [key in contactsValidationKeys]: singleValidationObject;
}
