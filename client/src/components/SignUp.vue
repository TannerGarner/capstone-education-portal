<script setup>
    const emit = defineEmits(["toggle"]);
</script>

<template>
    <div class="container">
        <form class="signUp">
            <h1>Student Registration</h1>
            <div class="row">
                <div class="column c1">
                    <input required type="text" name="firstName" placeholder="First Name" ></input>
                    <input required type="text" name="lastName" placeholder="Last Name"></input>
                    <input required type="text" name="userName" placeholder="Username"></input>
                    <input required type="email" name="email" placeholder="Email"></input>
                    <input required type="password" name="password" placeholder="Password"></input>
                </div>
                <div class="column c2">
                    <input required type="text" name="address" placeholder="Street Address"></input>
                    <input required type="text" name="city" placeholder="City"></input>
                    <input required type="text" name="stateRegion" placeholder="State, Region"></input>
                    <input required type="text" name="country" placeholder="Country"></input>
                    <input required type="phone" name="phone" placeholder="Phone Number"></input>
                </div>
            </div>
            <button type="submit">Sign Up</button>
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
        background-color: rgb(21,49,49);
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