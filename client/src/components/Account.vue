<script setup>
    import { ref, onMounted } from 'vue';
    import { useUsersStore } from '../stores/users.js';
    const userStore = useUsersStore();

    onMounted(async () => {
        if (userStore.user){
            await userStore.fetchUser(userStore.user.user_id);
        } else {
            router.push("/auth");
        }
    });

    const editUser = ref({
        first_name: "",
        last_name: "",
        email: "",
        password: "",
        address: {
            street: "",
            city: "",
            state: "",
            country: "",
        },
        phone_number: ""
    })

    const editorState = ref(new Map());

    const toggleEditor = (fieldId) => {

        const isOpen = editorState.value.get(fieldId) || false;

        if (!isOpen) {
            editUser.value = { ...userStore.user, address: { ...userStore.user.address } };
        }

        editorState.value.set(fieldId, !isOpen);
    };

    const isEditorOpen = (fieldId) => editorState.value.get(fieldId) || false;

    const saveChanges = async (fieldId) => {
        if (editUser.value[fieldId] === "") {
            alert("Field cannot be empty");
            return;
        }
        await userStore.updateUser(editUser.value);
        toggleEditor(fieldId);
    };

</script>

<template>
    <div class="container">
        <div class="header">
            <h1>Account</h1>
        </div>
        <div v-if="userStore.user" class="accountInfo">
            <div class="row">
                <p>First Name</p>
                <p v-if="!isEditorOpen('first_name')" class="userDetail">{{userStore.user.first_name}}</p>
                <input v-else v-model="editUser.first_name" class="userDetail"/>
                <button @click="toggleEditor('first_name')">{{ isEditorOpen('first_name') ? 'Cancel' : 'Edit' }}</button>
                <button v-if="isEditorOpen('first_name')" @click="saveChanges('first_name')">Save</button>
            </div>
            <div class="row">
                <p>Last Name</p>
                <p v-if="!isEditorOpen('last_name')" class="userDetail">{{userStore.user.last_name}}</p>
                <input v-else v-model="editUser.last_name" class="userDetail"/>
                <button @click="toggleEditor('last_name')">{{ isEditorOpen('last_name') ? 'Cancel' : 'Edit' }}</button>
                <button v-if="isEditorOpen('last_name')" @click="saveChanges('last_name')">Save</button>
            </div>
            <div class="row">
                <p>Username</p>
                <p v-if="!isEditorOpen('username')" class="userDetail">{{userStore.user.username}}</p>
                <input v-else v-model="editUser.username" class="userDetail"/>
                <button @click="toggleEditor('username')">{{ isEditorOpen('username') ? 'Cancel' : 'Edit' }}</button>
                <button v-if="isEditorOpen('username')" @click="saveChanges('username')">Save</button>
            </div>
            <div class="row">
                <p>Email</p>
                <p v-if="!isEditorOpen('email')" class="userDetail">{{userStore.user.email}}</p>
                <input v-else v-model="editUser.email" class="userDetail"/>
                <button @click="toggleEditor('email')">{{ isEditorOpen('email') ? 'Cancel' : 'Edit' }}</button>
                <button v-if="isEditorOpen('email')" @click="saveChanges('email')">Save</button>
            </div>
            <div class="row">
                <p>Password</p>
                <p v-if="!isEditorOpen('password')" class="userDetail">
                    {{ '•'.repeat(userStore.user.password_length) }}
                </p>
                <input v-else v-model="editUser.password" class="userDetail"/>
                <button @click="toggleEditor('password')">{{ isEditorOpen('password') ? 'Cancel' : 'Edit' }}</button>
                <button v-if="isEditorOpen('password')" @click="saveChanges('password')">Save</button>
            </div>
            <div class="row">
                <p>Street Address</p>
                <p v-if="!isEditorOpen('address.street')" class="userDetail">{{userStore.user.address?.street}}</p>
                <input v-else v-model="editUser.address.street" class="userDetail"/>
                <button @click="toggleEditor('address.street')">{{ isEditorOpen('address.street') ? 'Cancel' : 'Edit' }}</button>
                <button v-if="isEditorOpen('address.street')" @click="saveChanges('address.street')">Save</button>
            </div>
            <div class="row">
                <p>City</p>
                <p v-if="!isEditorOpen('address.city')" class="userDetail">{{userStore.user.address?.city}}</p>
                <input v-else v-model="editUser.address.city" class="userDetail"/>
                <button @click="toggleEditor('address.city')">{{ isEditorOpen('address.city') ? 'Cancel' : 'Edit' }}</button>
                <button v-if="isEditorOpen('address.city')" @click="saveChanges('address.city')">Save</button>
            </div>
            <div class="row">
                <p>State</p>
                <p v-if="!isEditorOpen('address.state')" class="userDetail">{{userStore.user.address?.state}}</p>
                <input v-else v-model="editUser.address.state" class="userDetail"/>
                <button @click="toggleEditor('address.state')">{{ isEditorOpen('address.state') ? 'Cancel' : 'Edit' }}</button>
                <button v-if="isEditorOpen('address.state')" @click="saveChanges('address.state')">Save</button>
            </div>
            <div class="row">
                <p>Country</p>
                <p v-if="!isEditorOpen('address.country')" class="userDetail">{{userStore.user.address?.country}}</p>
                <input v-else v-model="editUser.address.country" class="userDetail"/>
                <button @click="toggleEditor('address.country')">{{ isEditorOpen('address.country') ? 'Cancel' : 'Edit' }}</button>
                <button v-if="isEditorOpen('address.country')" @click="saveChanges('address.country')">Save</button>
            </div>
            <div class="row">
                <p>Phone Number</p>
                <p v-if="!isEditorOpen('phone_number')" class="userDetail">{{userStore.user.phone_number}}</p>
                <input v-else v-model="editUser.phone_number" class="userDetail"/>
                <button @click="toggleEditor('phone_number')">{{ isEditorOpen('phone_number') ? 'Cancel' : 'Edit' }}</button>
                <button v-if="isEditorOpen('phone_number')" @click="saveChanges('phone_number')">Save</button>
            </div>
        </div>
    </div>
</template>

<style scoped>
    .container {
        display: flex;
        flex-direction: column;
        width: 100%;
        height: 100%;
    }

    .accountInfo{
        display: flex;
        flex-direction: column;
        padding: 50px 0px;
        margin: 0px 50px;
    }

    .row {
        display: grid;
        grid-template-columns: 1fr 1fr 1fr 1fr;
        justify-items: center;
        align-items: center;
        padding: 10px 0px;
        border-bottom: 2px solid #489FB5;
    }

    input {
        padding: 5px;
        border: 1px solid #489FB5;
        border-radius: 5px;
    }

    button {
        background-color: #489FB5;
        transition: background-color 0.3s;
    }

    button:hover {
        background-color: #FE5E41;
    }

</style>