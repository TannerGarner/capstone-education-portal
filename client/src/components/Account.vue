<script setup>
    import { ref, onMounted } from 'vue';
    import { useUsersStore } from '../stores/users.js';
    const userStore = useUsersStore();

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
    })

    const editorState = ref(new Map());

    const toggleEditor = (fieldId, isNested = false) => {
        if (isNested) {
            const [parent, child] = fieldId.split('.');
            editorState.value.set(parent, {
                ...editorState.value.get(parent),
                [child]: !(editorState.value.get(parent)?.[child] || false),
            });
        } else {
            const isOpen = editorState.value.get(fieldId) || false;
            if (!isOpen) {
                editUser.value = { ...userStore.user, address: { ...userStore.user.address } };
            }
            editorState.value.set(fieldId, !isOpen);
        }
    };

    const isEditorOpen = (fieldId, isNested = false) => {
        if (isNested) {
            const [parent, child] = fieldId.split('.');
            return editorState.value.get(parent)?.[child] || false;
        }
        return editorState.value.get(fieldId) || false;
    };
    const saveChanges = async (fieldId, isNested = false) => {
        if (isNested) {
            const [parent, child] = fieldId.split('.');
            if (!editUser.value[parent][child]) {
                alert('Field cannot be empty');
                return;
            }
        } else if (!editUser.value[fieldId]) {
            alert('Field cannot be empty');
            return;
        }
        await userStore.updateUser(editUser.value);
        toggleEditor(fieldId, isNested);
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
            <h2>My Account</h2>
            <p>Delete My Account</p>
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
                <p>User ID</p>
                <p class="userDetail">{{userStore.user.user_id}}</p>
                <button class="inactive" >Edit</button>
                <button v-if="isEditorOpen('user_id')">Save</button>
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
                <p v-if="!isEditorOpen('address.street', true)" class="userDetail">{{userStore.user.address?.street}}</p>
                <input v-else v-model="editUser.address.street" class="userDetail"/>
                <button @click="toggleEditor('address.street', true)">{{ isEditorOpen('address.street', true) ? 'Cancel' : 'Edit' }}</button>
                <button v-if="isEditorOpen('address.street', true)" @click="saveChanges('address.street', true)">Save</button>
            </div>
            <div class="row">
                <p>City</p>
                <p v-if="!isEditorOpen('address.city', true)" class="userDetail">{{userStore.user.address?.city}}</p>
                <input v-else v-model="editUser.address.city" class="userDetail"/>
                <button @click="toggleEditor('address.city', true)">{{ isEditorOpen('address.city', true) ? 'Cancel' : 'Edit' }}</button>
                <button v-if="isEditorOpen('address.city', true)" @click="saveChanges('address.city', true)">Save</button>
            </div>
            <div class="row">
                <p>State or Region</p>
                <p v-if="!isEditorOpen('address.state_or_region', true)" class="userDetail">
                    {{ userStore.user.address?.state_or_region }}
                </p>
                <input
                    v-else
                    v-model="editUser.address.state_or_region"
                    class="userDetail"
                />
                <button @click="toggleEditor('address.state_or_region', true)">
                    {{ isEditorOpen('address.state_or_region', true) ? 'Cancel' : 'Edit' }}
                </button>
                <button
                    v-if="isEditorOpen('address.state_or_region', true)"
                    @click="saveChanges('address.state_or_region', true)"
                >
                    Save
                </button>
            </div>
            <div class="row">
                <p>Country</p>
                <p v-if="!isEditorOpen('address.country', true)" class="userDetail">{{userStore.user.address?.country}}</p>
                <input v-else v-model="editUser.address.country" class="userDetail"/>
                <button @click="toggleEditor('address.country', true)">{{ isEditorOpen('address.country', true) ? 'Cancel' : 'Edit' }}</button>
                <button v-if="isEditorOpen('address.country', true)" @click="saveChanges('address.country', true)">Save</button>
            </div>
            <div class="row">
                <p>Phone Number</p>
                <p v-if="!isEditorOpen('phone_number')" class="userDetail">{{userStore.user.phone_number}}</p>
                <input v-else v-model="editUser.phone_number" class="userDetail"/>
                <button @click="toggleEditor('phone_number')">{{ isEditorOpen('phone_number') ? 'Cancel' : 'Edit' }}</button>
                <button v-if="isEditorOpen('phone_number')" @click="saveChanges('phone_number')">Save</button>
            </div>
            <button @click="deleteAccount(userStore.user.user_id)" class="deleteAccount">Delete My Account</button>
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

    .inactive{
        background-color: grey;
        cursor: not-allowed;
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

    .deleteAccount{
        background-color: #E63946;
        width: 200px;
        padding: 20px;
        align-self: center;
        margin-top: 50px;
    }
</style>