<script setup>
    import { ref } from 'vue';
    import { useUsersStore } from '../stores/users.js';
    import { useRouter } from 'vue-router';
    const usersStore = useUsersStore();
    const router = useRouter();

    const defualtUserValues = {
        first_name: "",
        last_name: "",
        email: "",
        password: "",
        street: "",
        city: "",
        state_or_region: "",
        country: "",
        phone_number: "", 
        is_admin: false
    };

    const newUser = ref({ ...defualtUserValues });

    async function onSubmit(){
        await usersStore.createUser(newUser.value);
        newUser.value = { ...defualtUserValues };
        
        router.push("/");
    }

    const emit = defineEmits(["toggle"]);
</script>
 
<template>
    <div class="view">
        <form @submit.prevent="onSubmit" class="signUp">
            <div class="title">
                <div class="logo-container">
                    <img src="/logo.png" alt="logo" class="logo">
                    <h2>Vision<br>Academy</h2>
                </div>
                <h1>Student Registration</h1>
            </div>
            <div class="inputs">
                    <input type="text" placeholder="Profile Pic">
                    <input v-model="newUser.street" required type="text" name="street" placeholder="Street Address">
                    <input v-model="newUser.first_name" required type="text" name="firstName" placeholder="First Name">
                    <input v-model="newUser.city" required type="text" name="city" placeholder="City">
                    <input v-model="newUser.last_name" required type="text" name="lastName" placeholder="Last Name">
                    <input v-model="newUser.state" required type="text" name="stateRegion" placeholder="State, Region">
                    <!-- <input class="input" v-model="newUser.state_or_region" required type="text" name="stateRegion" placeholder="State, Region"> -->
                    <input v-model="newUser.email" required type="email" name="email" placeholder="Email">
                    <input v-model="newUser.country" required type="text" name="country" placeholder="Country">
                    <input v-model="newUser.password" required type="password" name="password" placeholder="Password">
                    <input v-model="newUser.phone_number" required type="tel" name="phone" placeholder="Phone Number">
                </div>
            <button type="submit" class="submit">Sign Up</button>
            <p>Already have an Account? <span @click="emit('toggle')">Login</span></p>
        </form>
    </div>
</template>

<style scoped>

    .signUp{
        border-radius: 15px;
        padding: 30px 10px;
        width: 70%;
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        align-items: start;
        gap: 20px;
    }

    .title{
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 20px;
        width: 100%;
    }

    .logo-container{
        position: relative;
        display: flex;
        justify-content: start;
        align-items: center;
        gap: 10px;
        padding-right: 5%;
    }

    .logo{
        width: 100px;
        height: 100px;
    }

    h2{
        padding-right: 10%;
    }

    h1{
        justify-self: flex-end;
    }

    .inputs {
        display: grid;
        grid-template-columns: 1fr 1fr;
        grid-template-rows: 5fr;
        height: 60%;
        width: 100%;
        gap: 20px;    
    }

    input[type="file"] {
        width: 100%;
        max-width: 100%;
        font-size: 18px;
        display: flex;
        align-items: center;
        text-align: center;
    }
    
    .profile-pic-input {
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .input {
        padding: 15px;
        padding-left: 0px;
        border: none;
        color: #153131;
        border-bottom: #153131 solid 2px;
        background-color: #F5F1ED;
        font-size: 24px;
        display: flex;
        max-width: 100%;
    }

    .input::placeholder{
        color:#153131;
        opacity: 50%;
    }

    .input:focus {
        border-color: #FE5E41;        /* Custom border on focus */
        box-shadow: 0 0 5px #FE5E41;  /* Optional glow or highlight */
        outline: none;                /* Remove default outline */
        padding: 15px;
    }

    button {
        background-color: #FE5E41;
        width: 100%;
        font-size: 24px;
    }

    button:hover {
        background-color: #489FB5;
    }

    span{
        color: #FE5E41;
        cursor: pointer;
    }

    @media screen and (max-width: 1000px) {
        .signUp {
            width: 100%;
            height: 100%;
            padding: 50px;
            gap: 20px;
        }  
    }

    @media screen and (max-width: 768px) {
        .container {
            padding: 0 20px;
            height: 100%;
        }

        .signUp {
            width: 100%;
            height: 100%;
            padding: 20px;
            gap: 20px;
        }

        .inputs {
            grid-template-columns: 1fr;
            grid-template-rows: repeat(8, 1fr);
            gap: 10px;
            overflow-y: scroll;
        }
        
        .input{
            font-size: 18px;
        }
    }
</style>