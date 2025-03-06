<script setup>
    import { ref, onMounted } from 'vue';
    import { useUsersStore } from '../stores/users.js';
    const userStore = useUsersStore();

    const newUser = ref({
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

    function onSubmit(event){
        event.preventDefault();
        userStore.createUser(newUser.value);
    }

    const emit = defineEmits(["toggle"]);
</script>

<template>
    <div class="container">
        <form class="signUp">
            <h1>Student Registration</h1>
            <div class="row">
                <div class="column c1">
                    <input v-model="newUser.first_name" required type="text" name="firstName" placeholder="First Name">
                    <input v-model="newUser.last_name" required type="text" name="lastName" placeholder="Last Name">
                    <input v-model="newUser.username" required type="text" name="userName" placeholder="Username">
                    <input v-model="newUser.email" required type="email" name="email" placeholder="Email">
                    <input v-model="newUser.password" required type="password" name="password" placeholder="Password">
                </div>
                <div class="column c2">
                    <input v-model="newUser.address.street" required type="text" name="street" placeholder="Street Address">
                    <input v-model="newUser.address.city" required type="text" name="city" placeholder="City">
                    <input v-model="newUser.address.state" required type="text" name="stateRegion" placeholder="State, Region">
                    <input v-model="newUser.address.country" required type="text" name="country" placeholder="Country">
                    <input v-model="newUser.phone_number" required type="tel" name="phone" placeholder="Phone Number">
                </div>
            </div>
            <button @click="onSubmit" type="submit">Sign Up</button>
            <button @click="emit('toggle')">
                Switch to Log In
            </button>
        </form>
    </div>
</template>

<style scoped>
    .container {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100vh;
        width: 100%;
    }

    .signUp{
        background-color: #153131;
        border-radius: 15px;
        padding: 30px 10px;
        width: 70%;
        height: 80%;
        color: #F5F1ED;
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        align-items: center;
    }

    .row {
        display: flex;
        height: 60%;
        width: 100%;    
    }

    .column {
        padding: 10px;
        display: flex;
        flex-direction: column;
        align-items: start;
        justify-content: space-around;
        width: 50%;
    }

    .c1{
        align-items: flex-end;
    }

    input {
        padding: 15px;
        border-radius: 5px;
        border: none;
        background-color: #489FB5;
        font-size: 24px;
        color: #F5F1ED;
        display: flex;
    }

    input::placeholder{
        color: #F5F1ED;
        opacity: 50%;
    }

    button {
        background-color: #FE5E41;
    }

</style>