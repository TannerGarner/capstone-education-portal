<script setup>
    import { ref, onMounted } from 'vue';
    import { useUsersStore } from '../stores/users.js';
    import { useRouter } from 'vue-router';
    const userStore = useUsersStore();
    const emit = defineEmits(["toggle"]);
    const router = useRouter(); 


    const login = ref({
        user_id: "",
        password: ""
    });

    onMounted(async () => {
        const isAuthenticated = await userStore.verifyToken();
        if (isAuthenticated) {
            router.push("/"); 
        }
    });

    async function onSubmit(){
        if (await userStore.login(login.value)){
            router.push("/");
        };
    }
</script>

<template>
    <div class="container">
        <form @submit.prevent="onSubmit" class="login">
            <h1>Login</h1>
            <input v-model="login.user_id" required type="text" name="user_id" placeholder="User Id"></input>
            <input v-model="login.password" required type="password" name="password" placeholder="Password"></input>
            <button type="submit">Login</button>
            <button @type="button" @click="emit('toggle')">
                Switch to Sign Up
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
    }

    .login {
        background-color: rgb(21,49,49);
        border-radius: 15px;
        padding: 30px 10px;
        width: 500px;
        height: 400px;
        color: #F5F1ED;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: space-around;
    }

    .login input {
        padding: 15px;
        border-radius: 5px;
        border: none;
        background-color: #FE5E41;
        font-size: 24px;
        color: #F5F1ED;
    }

    .login input::placeholder{
        color: #F5F1ED;
        opacity: 50%;
    }

    button {
        background-color: #489FB5;
    }

</style>