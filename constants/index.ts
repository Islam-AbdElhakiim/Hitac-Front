import { CreateEmployeeDTO, Department, Segment } from "@/types"

// export const navigationLinks = {
//     "employees": "Employees",
//     "accounts": "Clients (Accounta)",
//     "contacts": "Clients (Contacts)",
//     "suppliers": "Suppliers",
//     "Stations": "Stations",
//     "Products": ["Segments", "Products"],
//     "Supply Management": ["Supply Orders", "Return Requests"],
// }



export const departments: Department[] = [
    {
        title: 'sales',
        selected: false
    },
    {
        title: 'marketing',
        selected: false
    },
    {
        title: 'inventory',
        selected: false
    },
    {
        title: 'accounting',
        selected: false
    },

]
export const segments: Segment[] = [
    {
        title: 'Fresh',
        selected: false
    },
    {
        title: 'Dry',
        selected: false
    },
    {
        title: 'Frozen',
        selected: false
    },


]

export const baseUrl = 'http://localhost:3002'
// export const baseUrl = 'http://34.125.207.14'
export const employeeBase = `${baseUrl}/employees`;
export const endpoints = {
    login: `${employeeBase}/login`,
}




export function checkCookie(cookieName: string) { //thanks to chat GPT
    const cookies = document.cookie.split('; ');

    for (const cookie of cookies) {
        const [name, value] = cookie.split('=');
        if (name === cookieName) {
            return value;
        }
    }

    return null; // Cookie not found
}


// Function to exclude a property
export const excludeProperty = (obj:any, propToExclude:string) => {
    const { [propToExclude]: excludedProp, ...rest } = obj;
    console.log("rest", rest);
    return rest;
};
