<script setup>
    import SideNav from '../components/SideNav.vue';
    import RegisteredCourses from '../components/RegisteredCourses.vue';
    import Register from '../components/Register.vue';
    import Account from '../components/Account.vue';
    import { useRouter, RouterLink } from 'vue-router';
    import { ref, markRaw, onMounted } from 'vue';
    import { useUsersStore } from '../stores/users.js';
    import AdminAllCourses from '../components/AdminAllCourses.vue';
    import AdminAllStudents from '../components/AdminAllStudents.vue';
    const userStore = useUsersStore();

    const router = useRouter();

    const components = {
        Account: markRaw(Account),
        RegisteredCourses: markRaw(RegisteredCourses),
        Register: markRaw(Register), 
        AdminAllCourses: markRaw(AdminAllCourses),
        AdminAllStudents: markRaw(AdminAllStudents)
    };

    const displayComp = ref(components.Account);

    const changeDisplay = (comp) => {
        displayComp.value = comp;
    };

    onMounted(async () => {
        const isAuthenticated = await userStore.verifyToken();
        if (!isAuthenticated) {
            router.push("/auth");
        }
    });
</script>

<template>
    
    <div class="container">
        <SideNav :changeDisplay="changeDisplay" :components="components"/>
        <component :is="displayComp"></component>
    </div>
</template>

<style scoped>
    .container {
        width: 100%;
        height: 100vh;
        display: flex;
    }
</style>