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