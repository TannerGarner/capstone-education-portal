<script setup>
    const emit = defineEmits(["toggle"]);
</script>

<template>
    <div class="container login">
        <h1>Login</h1>
        <form class="form ">
            <input required type="text" name="userName" placeholder="Username"></input>
            <input required type="password" name="password" placeholder="Password"></input>
            <button type="submit">Login</button>
        </form>
        <button @click="emit('toggle')">
            Switch to Log In
        </button>
    </div>
</template>

<style>
    .login {
        background-color: rgb(21,49,49);
        border-radius: 15px;
        padding: 20px;
        width: 650px;
    }

    form {
        display: flex;
        flex-direction: column;
    }

    .login input {
        margin: 10px;
        padding: 10px;
        border-radius: 5px;
        border: none;
        background-color: rgb(254,94,65);
        color: rgb(245, 241, 237);
    }

    .login input::placeholder{
        color: rgb(245, 241, 237);
        opacity: 50%;
    }
</style>