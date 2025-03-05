<script setup>
    import { ref } from 'vue';
    // User object requested from database
    const user = ref({
        first_name: "John",
        last_name: "Doe",
        email: "example@email.com",
        password: "password",
        street_address: "1234 Elm St",
        city: "Springfield",
        state: "IL",
        country: "USA",
        phone_number: "555-555-5555"
    });

    const editUser = ref({
        first_name: "",
        last_name: "",
        email: "",
        password: "",
        street_address: "",
        city: "",
        state: "",
        country: "",
        phone_number: ""
    })

    function editUserInfo() {
        user.first_name = editUser?.first_name;
        user.last_name = editUser?.last_name;
        user.email = editUser?.email;
        user.password = editUser?.password;
        user.street_address = editUser?.street_address;
        user.city = editUser?.city;
        user.state = editUser?.state;
        user.country = editUser?.country;
        user.phone_number = editUser?.phone_number;
    }

    function updateEdit() {
        
    }

</script>

<template>
    <div class="container">
        <div class="header">
            <h1>Account</h1>
        </div>
        <div class="accountInfo">
            <div class="row">
                <p>First Name</p>
                <p>{{user.first_name}}</p>
                <button>Edit</button>
            </div>
            <div class="row">
                <p>Last Name</p>
                <p>{{user.last_name}}</p>
                <button>Edit</button>
            </div>
            <div class="row">
                <p>Email</p>
                <p>{{user.email}}</p>
                <button>Edit</button>
            </div>
            <div class="row">
                <p>Password</p>
                <p>{{user.password}}</p>
                <button>Edit</button>
            </div>
            <div class="row">
                <p>Street Address</p>
                <p>{{user.street_address}}</p>
                <button>Edit</button>
            </div>
            <div class="row">
                <p>City</p>
                <p>{{user.city}}</p>
                <button>Edit</button>
            </div>
            <div class="row">
                <p>State</p>
                <p>{{user.state}}</p>
                <button>Edit</button>
            </div>
            <div class="row">
                <p>Country</p>
                <p>{{user.country}}</p>
                <button>Edit</button>
            </div>
            <div class="row">
                <p>Phone Number</p>
                <p>{{user.phone_number}}</p>
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