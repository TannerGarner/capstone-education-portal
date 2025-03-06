<script setup>
    import { ref, onMounted } from 'vue';
    import { useUsersStore } from '../stores/users.js';
    const userStore = useUsersStore();
    
    onMounted(async () => {
       await userStore.fetchUser(98);
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

</script>

<template>
    <div class="container">
        <div class="header">
            <h1>Account</h1>
        </div>
        <div v-if="userStore.user" class="accountInfo">
            <div class="row">
                <p>First Name</p>
                <p>{{userStore.user.first_name}}</p>
                <button>Edit</button>
            </div>
            <div class="row">
                <p>Last Name</p>
                <p>{{userStore.user.last_name}}</p>
                <button>Edit</button>
            </div>
            <div class="row">
                <p>Username</p>
                <p>{{userStore.user.username}}</p>
                <button>Edit</button>
            </div>
            <div class="row">
                <p>Email</p>
                <p>{{userStore.user.email}}</p>
                <button>Edit</button>
            </div>
            <div class="row">
                <p>Password</p>
                <p>{{userStore.user.password}}</p>
                <button>Edit</button>
            </div>
            <div class="row">
                <p>Street Address</p>
                <p>{{userStore.user.address?.street}}</p>
                <button>Edit</button>
            </div>
            <div class="row">
                <p>City</p>
                <p>{{userStore.user.address?.city}}</p>
                <button>Edit</button>
            </div>
            <div class="row">
                <p>State</p>
                <p>{{userStore.user.address?.state}}</p>
                <button>Edit</button>
            </div>
            <div class="row">
                <p>Country</p>
                <p>{{userStore.user.address?.country}}</p>
                <button>Edit</button>
            </div>
            <div class="row">
                <p>Phone Number</p>
                <p>{{userStore.user.phone_number}}</p>
                <button>Edit</button>
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
        grid-template-columns: 1fr 1fr 1fr;
        align-items: center;
        padding: 10px 0px;
        border-bottom: 2px solid #489FB5;
    }

    .row > * {
        margin-left: 40px;
    }

    button {
        background-color: #489FB5;;
    }
</style>