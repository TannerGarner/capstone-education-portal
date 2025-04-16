<script setup>
    import { ref } from 'vue';
    import { useUsersStore } from '../stores/users.js';
    import { useRouter } from 'vue-router';
    const userStore = useUsersStore();
    const emit = defineEmits(["toggle"]);
    const router = useRouter(); 


    const login = ref({
        user_id: null,
        password: ""
    });

    async function onSubmit(){
        login.value.user_id = parseInt(login.value.user_id);
        if (await userStore.login(login.value)){
            router.push("/");
        };
    }
</script>

<template>
    <div class="view">
        <form @submit.prevent="onSubmit" class="login">
            <div class="logo-container">
                <img src="/logo.png" alt="logo" class="logo">
                <h2>Vision<br>Academy</h2>
            </div>
            <h1>Login</h1>
            <input v-model="login.user_id" required type="text" name="user_id" placeholder="User Id"></input>
            <input v-model="login.password" required type="password" name="password" placeholder="Password"></input>
            <button type="submit">Login</button>
            <p>Don't have an Account? <span @click="emit('toggle')">Sign Up</span></p>
        </form>
    </div>
</template>

<style scoped>
    .view {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100vh;
        width: 100%;
        color: #153131;
        background-color: #F5F1ED;
    }

    .login {
        border-radius: 15px;
        padding: 30px 10px;
        width: 70%;
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        align-items: start;
        gap: 30px;
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

    .login input {
        padding: 15px 0px;
        border: none;
        color: #153131;
        border-bottom: #153131 solid 2px;
        background-color: #F5F1ED;
        font-size: 24px;
        display: flex;
        width: 100%;
        max-width: 100%;
    }

    .login input::placeholder{
        color: #153131;
        opacity: 50%;
    }

    input:focus {
        border-color: #489FB5;        
        box-shadow: 0 0 5px #489FB5;  
        outline: none;                
        padding: 15px;
    }

    button {
        background-color: #489FB5;
        width: 100%;
        font-size: 24px;
    }

    button:hover{
        background-color: #FE5E41;
    }

    span{
        color: #489FB5;
        cursor: pointer;
    }
</style>