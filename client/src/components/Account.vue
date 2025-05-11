<script setup>
    import { ref } from 'vue';
    import { useUsersStore } from '../stores/users.js';
    const userStore = useUsersStore();
    const editMode = ref(false);

    const editUser = ref({
        user_id: userStore.user.user_id,
        first_name: "",
        last_name: "",
        email: "",
        password: "",
        street: "",
        city: "",
        state_or_region: "",
        country: "",
        phone_number: ""
    });

    const personalData = [
        { label: 'First Name', field: 'first_name', editable: true },
        { label: 'Last Name', field: 'last_name', editable: true },
        { label: 'User ID', field: 'user_id', editable: false },
        { label: 'Email', field: 'email', editable: true },
        { label: 'Password', field: 'password', editable: true, isPassword: true },
    ];

    const contactData = [
        { label: 'Street Address', field: 'street', editable: true },
        { label: 'City', field: 'city', editable: true },
        { label: 'State or Region', field: 'state_or_region', editable: true },
        { label: 'Country', field: 'country', editable: true },
        { label: 'Phone Number', field: 'phone_number', editable: true }
    ];

    const toggleEditMode = () => {
        if (!editMode.value) {
            const { user_id, first_name, last_name, email, password, street, city, state_or_region, country, phone_number, is_admin } = userStore.user;
            editUser.value = { user_id, first_name, last_name, email, password, street, city, state_or_region, country, phone_number, is_admin };
        }
        editMode.value = !editMode.value;
    };

    const saveAllChanges = async () => {
        await userStore.updateUser(editUser.value);
        editMode.value = false;
    };

    const getValue = (field) => {
        if (field === 'password') {
            return '•'.repeat(userStore.user.password_length);
        }
        return userStore.user[field];
    };

    const getEditValue = (field) => {
        
        return editUser.value[field];
    };

    const updateEditValue = (field, value) => {
        
        editUser.value[field] = value;
        
    };

    async function deleteAccount(){
        if (confirm("Are you sure you want to delete your account?")) {
            const deleted = await userStore.deleteUser(userStore.user.user_id);
            alert(`${deleted ? "Deleted Successfully" : "Failed to Delete"}`);
            if (deleted) userStore.logout();
        } else {
            console.log("User clicked Cancel!");
        }
    }
</script>

<template>
    <div class="container">
        <div class="header">
            <h2>Account</h2>
            <div class="deleteBox" @click="deleteAccount()">
                <p class="deleteText">Delete My Account</p>
                <span class="material-symbols-outlined deleteText">
                    delete
                </span>
            </div>
        </div>
        <div v-if="userStore.user" class="accountInfo">
            <div class="profileHeader">
                <div class="profilePictureContainer">
                    <img src="/logo.png" alt="Profile Picture" class="profilePicture" />
                    <span class="editPic">Edit</span>
                </div>
                <div class="edit-controls">
                    <button v-if="!editMode" @click="toggleEditMode">Edit Details</button>
                    <template v-else>
                        <button @click="toggleEditMode">Cancel</button>
                        <button @click="saveAllChanges">Save All</button>
                    </template>
                </div>
            </div>
            <div class="columns-container">
                <div class="column">
                    <div v-for="item in personalData" :key="item.field" class="row">
                        <p>{{ item.label }}</p>
                        <template v-if="!editMode">
                            <p class="userDetail">{{ getValue(item.field) }}</p>
                        </template>
                        <template v-else>
                            <input v-if="item.editable"
                                :value="getEditValue(item.field)"
                                @input="e => updateEditValue(item.field, e.target.value, item.nested)"
                                class="userDetail"
                                :type="item.isPassword ? 'password' : 'text'"
                            />
                            <p v-else class="userDetail">{{ getValue(item.field) }}</p>
                        </template>
                    </div>
                </div>
                <div class="column">
                    <div v-for="item in contactData" :key="item.field" class="row">
                        <p>{{ item.label }}</p>
                        <template v-if="!editMode">
                            <p class="userDetail">{{ getValue(item.field) }}</p>
                        </template>
                        <template v-else>
                            <input v-if="item.editable"
                                :value="getEditValue(item.field)"
                                @input="e => updateEditValue(item.field, e.target.value)"
                                class="userDetail"
                                :type="item.isPassword ? 'password' : 'text'"
                            />
                            <p v-else class="userDetail">{{ getValue(item.field) }}</p>
                        </template>
                        
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>

    .accountInfo{
        display: flex;
        flex-direction: column;
        padding: 1rem 3rem;
        overflow-y: auto;
    }

    .profileHeader{
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 1rem 0px;
    }

    .profilePictureContainer {
        display: flex;
        align-items: center;
        gap: 10px;
    }

    .profilePicture {
        width: 100px;
        height: 100px;
        border-radius: 50%;
    }

    .editPic {
        align-self: flex-end;
        color: #FE5E41;
        cursor: pointer;
    }

    .edit-controls {
        display: flex;
        justify-content: center;
        gap: 10px;
        margin-bottom: 20px;
    }

    .columns-container {
        display: flex;
        gap: 40px;
        justify-content: space-between;
    }

    .column {
        flex: 1;
    }

    .row {
        display: grid;
        grid-template-columns: 1fr 1fr;
        width: 100%;
        justify-items: start;
        align-items: center;
        padding: 20px 0px;
        border-bottom: 2px solid #153131;
    }

    input {
        padding: 5px;
        border: 1px solid #489FB5;
        border-radius: 5px;
    }

    button {
        background-color: #F5F1ED;
        color: #FE5E41;
        border: #FE5E41 2px solid;
        transition: background-color 0.3s;
        font-weight: bold;
    }

    button:hover {
        background-color: #FE5E41;
        color: #F5F1ED;
    }

    .deleteBox {
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 10px;
        background-color: #F5F1ED;
        border-radius: 5px;
        border: 2px solid #E63946;
        transition: background-color 0.3s, color 0.3s;
    }

    .deleteBox:hover {
        background-color: #E63946;
        color: #F5F1ED;
        cursor: pointer;
        border: 2px solid #E63946;
    }

    .deleteText{
        color: #E63946;
        font-weight: bold;
        transition: color 0.3s;
    }

    .deleteBox:hover .deleteText {
        color: #F5F1ED;
    }

    @media screen and (max-width: 768px) {
        .profilePicture {
            width: 50px;
            height: 50px;
        }
        .columns-container {
            flex-direction: column;
            gap: 0px;
        }
    }
</style>