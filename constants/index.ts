import { CreateEmployeeDTO, Department } from "@/types"

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

export const baseUrl = 'http://localhost:3002'
export const employeeBase = `${baseUrl}/employees`;
export const endpoints = {
    login: `${employeeBase}/login`,
}


export const getAllEmployees = async () => {
    const result = await fetch(`${employeeBase}`);
    const data = await result.json();
    return data;
}

export const getUserById = async (id: string) => {
    const result = await fetch(`${employeeBase}/${id}`);
    const data = await result.json();
    // console.log(data)
    return data;
}

export const deleteUserById = async (id: string) => {
    const result = await fetch(`${employeeBase}/delete/${id}`, {
        method: "DELETE",
    });
    const data = await result.json();
    // console.log(data)
    return data;
}

export const updateEmp = async (id: string, newEmp: CreateEmployeeDTO) => {
    const result = await fetch(`${employeeBase}/${id}`, {
        method: "PUT",
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json', 
        },
        body: JSON.stringify(newEmp)
    });
    const data = await result.json();
    // console.log(data)
    return data;
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
