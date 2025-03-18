<script setup>
    import { useRouter, RouterLink } from 'vue-router';
    import { ref } from 'vue';
    import { useUsersStore } from '../stores/users.js';
    const userStore = useUsersStore();
    const router = useRouter();
    const props = defineProps(['changeDisplay', 'components']);

    const activeComponent = ref(props.components.Account);

    function changeActiveComponent(component) {
        activeComponent.value = component;
        props.changeDisplay(component); 
    }

    function logout(){ 
        userStore.logout();
        router.push("/auth");
    }

</script>

<template>
    <div class="sideNav">
        <div class="user">
            <img src="../assets/vue.svg" alt="user-picture" class="userPic">
            <h3>{{ userStore.user.first_name }} {{ userStore.user.last_name }}</h3>
            <button class="logout" @click="logout">Logout</button>
        </div>
        <nav class="links">
            <button 
                @click="changeActiveComponent(components.Account)" 
                :class="{ active: activeComponent === components.Account }">
                Account
            </button>
            <button 
                @click="changeActiveComponent(components.RegisteredCourses)" 
                :class="{ active: activeComponent === components.RegisteredCourses }">
                Registered Courses
            </button>
            <button 
                @click="changeActiveComponent(components.Register)" 
                :class="{ active: activeComponent === components.Register }">
                Register
            </button>
            <button 
                v-if="userStore.user.is_admin"
                @click="changeActiveComponent(components.AdminAllCourses)" 
                :class="{ active: activeComponent === components.AdminAllCourses }">
                Admin All Courses
            </button>
            <button 
                v-if="userStore.user.is_admin"
                @click="changeActiveComponent(components.AdminAllStudents)" 
                :class="{ active: activeComponent === components.AdminAllStudents }">
                Admin All Students
            </button>
        </nav>
    </div>
</template>

<style scoped>
    .sideNav {
        background-color: #153131;
        color: #F5F1ED;
        padding: 30px;
        min-width: 10%;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 20px;
    }

    .user {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 20px;
    }

    .logout{
        background-color: #F5F1ED;
    }

    .logout:hover{
        background-color: #E63946;
        color: #F5F1ED;
    }

    .links {
        padding: 0;
        display: flex;
        flex-direction: column;
        gap: 10px;
    }

    button {
        background-color: #F5F1ED;
        color: #153131;
        width: 160px;
        padding: 15px;
        border-radius: 5px;
        cursor:default;
        transition: background-color 0.3s, color 0.3s;
    }

    button:hover {
        background-color: #489FB5;
        color: #F5F1ED;
    }

    .active {
        background-color:  #489FB5;
        color: #F5F1ED;
        font-weight: bold;
    }

</style>