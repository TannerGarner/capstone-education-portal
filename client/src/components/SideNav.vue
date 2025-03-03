<script>
    import { RouterLink } from 'vue-router';
    import { ref } from 'vue';


    function logout(){ 
        localStorage.removeItem('token');
        window.location.href = '/auth';
    }
</script>

<template>
    <div class="sideNav">
        <div class="user">
            <img src="../assets/vue.svg" alt="user-picture" class="userPic">
            <h2 @click="logout">Logout</h2>
            <h3>Username</h3>
        </div>
        <ul>
            <li>Courses</li>
            <li>Assignments</li>
            <li>+ New Course</li>
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
        padding: 10px;
        border-radius: 5px;
    }
</style>