export function separateAddressFromGeneralData(userData) {
    // Initialize separated user data objects:
    const generalData = {
        first_name: null,
        last_name: null,
        password_hash: null,
        email: null,
        phone_number: null,
        is_admin: null
    };
    const address = {
        street: null,
        city: null,
        state_or_region: null,
        country: null
    };

    // Separate the values from userData into generalData or address:
    Object.entries(userData).forEach(([key, value]) => {
        if (key in generalData) generalData[key] = value;
        else if (key in address) address[key] = value;
        // else throwResErr(400, `Invalid object key "${key}"`);
    });

    // Return the organized data:
    return { generalData, address };
}
// export function separateAddressFromGeneralData(userData) {
//     // Make shallow copy of userData:
//     userData = { ...userData };

//     // Extract address:
//     const { address } = userData;
//     delete userData.address;

//     // Return data:
//     return {
//         generalData: userData,
//         address: address
//     };
// }

export function organizeAddressUserData(userData) {
    const addressFields = ["street", "city", "state_or_region", "country"];

    const address = {
        street: "",
        city: "",
        state_or_region: "",
        country: ""
    };

    Object.entries(userData).forEach(([key, value]) => {
        if (addressFields.includes(key)) {
            address[key] = value;
            delete userData[key];
        }
    });

    userData.address = address;

    return userData;
}