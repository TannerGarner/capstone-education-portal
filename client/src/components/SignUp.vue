<script setup>
    const emit = defineEmits(["toggle"]);
</script>

<template>
    <div class="container black">
        <h1>Sign Up</h1>
        <form class="form signUp">
            <div>
                <input required type="text" name="firstName" placeholder="First Name" ></input>
                <input required type="text" name="lastName" placeholder="Last Name"></input>
                <input required type="text" name="userName" placeholder="Username"></input>
                <input required type="email" name="email" placeholder="Email"></input>
                <input required type="password" name="password" placeholder="Password"></input>
            </div>
            <div>
                <input required type="text" name="address" placeholder="Street Address"></input>
                <input required type="text" name="city" placeholder="City"></input>
                <input required type="text" name="stateRegion" placeholder="State, Region"></input>
                <input required type="text" name="country" placeholder="Country"></input>
                <input required type="phone" name="phone" placeholder="Phone Number"></input>
            </div>
            <button type="submit">Sign Up</button>
        </form>
        <button @click="emit('toggle')">
            Switch to Sign Up
        </button>
    </div>
</template>

<style>

</style>