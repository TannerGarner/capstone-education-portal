export function separateAddressFromGeneralData(userData) {
    // Make shallow copy of userData:
    userData = { ...userData };

    // Extract address:
    const { address } = userData;
    delete userData.address;

    // Return data:
    return {
        generalData: userData,
        address: address
    };
}

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