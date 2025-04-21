<script setup>
    import { ref, onMounted } from 'vue';
    import { useUsersStore } from '../stores/users.js';
    const userStore = useUsersStore();
    const editMode = ref(false);

    onMounted(async () => {
        if (userStore.user){
            await userStore.fetchUser(userStore.user.user_id);
            console.log(userStore.user)
        } else {
            router.push("/auth");
        }
    });

    const editUser = ref({
        user_id: userStore.user.user_id,
        first_name: "",
        last_name: "",
        email: "",
        password: "",
        address: {
            street: "",
            city: "",
            state_or_region: "",
            country: "",
        },
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
        { label: 'Street Address', field: 'address.street', editable: true, nested: true },
        { label: 'City', field: 'address.city', editable: true, nested: true },
        { label: 'State or Region', field: 'address.state_or_region', editable: true, nested: true },
        { label: 'Country', field: 'address.country', editable: true, nested: true },
        { label: 'Phone Number', field: 'phone_number', editable: true }
    ];

    const toggleEditMode = () => {
        if (!editMode.value) {
            editUser.value = { ...userStore.user, address: { ...userStore.user.address } };
        }
        editMode.value = !editMode.value;
    };

    const saveAllChanges = async () => {
        await userStore.updateUser(editUser.value);
        editMode.value = false;
    };

    const getValue = (field, nested) => {
        if (nested) {
            const [parent, child] = field.split('.');
            return userStore.user[parent]?.[child];
        }
        if (field === 'password') {
            return '•'.repeat(userStore.user.password_length);
        }
        return userStore.user[field];
    };

    const getEditValue = (field, nested) => {
        if (nested) {
            const [parent, child] = field.split('.');
            return editUser.value[parent][child];
        }
        return editUser.value[field];
    };

    const updateEditValue = (field, value, nested) => {
        if (nested) {
            const [parent, child] = field.split('.');
            editUser.value[parent][child] = value;
        } else {
            editUser.value[field] = value;
        }
    };

    async function deleteAccount(userID){
        if (confirm(`Are you sure you want to delete account with userid: ${userID}`)) {
            const deleted = userStore.deleteUser(userID)
            alert(`${deleted ? "Deleted Successfully" : "Failed to Delete"}`)
            router.push("/auth")
        } else {
            console.log("User clicked Cancel!");
        }
    }
</script>

<template>
    <div class="container">
        <div class="header">
            <h2>Account</h2>
            <div class="deleteBox" @click="deleteAccount(userStore.user.user_id)">
                <p>Delete My Account</p>
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
                            <p class="userDetail">{{ getValue(item.field, item.nested) }}</p>
                        </template>
                        <template v-else>
                            <input v-if="item.editable"
                                :value="getEditValue(item.field, item.nested)"
                                @input="e => updateEditValue(item.field, e.target.value, item.nested)"
                                class="userDetail"
                                :type="item.isPassword ? 'password' : 'text'"
                            />
                            <p v-else class="userDetail">{{ getValue(item.field, item.nested) }}</p>
                        </template>
                    </div>
                </div>
                <div class="column">
                    <div v-for="item in contactData" :key="item.field" class="row">
                        <p>{{ item.label }}</p>
                        <template v-if="!editMode">
                            <p class="userDetail">{{ getValue(item.field, item.nested) }}</p>
                        </template>
                        <template v-else>
                            <input v-if="item.editable"
                                :value="getEditValue(item.field, item.nested)"
                                @input="e => updateEditValue(item.field, e.target.value, item.nested)"
                                class="userDetail"
                                :type="item.isPassword ? 'password' : 'text'"
                            />
                            <p v-else class="userDetail">{{ getValue(item.field, item.nested) }}</p>
                        </template>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
    .container {
        display: flex;
        flex-direction: column;
        border: #489FB5 2px solid;
        border-radius: 30px;
    }

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

    .deleteBox{
        color: #E63946;
        font-weight: bold;
    }

    .deleteBox:hover{
        cursor: pointer;
        color: #FE5E41;
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