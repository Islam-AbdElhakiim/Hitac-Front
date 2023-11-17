import { Url } from "next/dist/shared/lib/router/router";
import { ReactElement, ReactHTMLElement } from "react";

export type SearchParams = {
    classes?: string;
    placeHolder?: string;
    onSearch: (value: string) => void
}

export type ButtonParams = {
    title?: any;
    icon?: ReactElement;
    classes?: string;
    isLink?: boolean;
    href?: Url;
    as?: string;
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