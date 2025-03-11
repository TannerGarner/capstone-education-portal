<script>
    import { RouterLink } from 'vue-router';
    import { ref } from 'vue';
    import { useUsersStore } from '../stores/users.js';
    // const userStore = useUsersStore();


    function logout(){ 
        // userStore.logout();
    }

</script>

<template>
    <div class="sideNav">
        <div class="user">
            <img src="../assets/vue.svg" alt="user-picture" class="userPic">
            <button @click="logout">Logout</button>
            <h3>Username</h3>
        </div>
        <ul>
            <li @click="" >Courses</li>
            <li>Assignments</li>
            <li>Register</li>
        </ul>
    </div>
</template>

<style scoped>
    .sideNav {
        background-color: #153131;
        color: #F5F1ED;
        padding: 30px;
    }

    ul {
        list-style-type: none;
        padding: 0;
        display: flex;
        flex-direction: column;
        gap: 10px;
    }

    li {
        background-color: #F5F1ED;
        color: #153131;
        padding: 15px;
        border-radius: 5px;
        cursor:default;
        transition: background-color 0.3s, color 0.3s;
    }

    li:hover {
        background-color: #489FB5;
        color: #F5F1ED;
    }

</style>