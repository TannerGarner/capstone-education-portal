<script setup>
    import SideNav from '../components/TopBar.vue';
    import RegisteredCourses from '../components/RegisteredCourses.vue';
    import Register from '../components/Register.vue';
    import Account from '../components/Account.vue';
    import { useRouter, RouterLink } from 'vue-router';
    import { ref, markRaw, onMounted } from 'vue';
    import { useUsersStore } from '../stores/users.js';
    import AdminAllCourses from '../components/AdminAllCourses.vue';
    import AdminAllStudents from '../components/AdminAllStudents.vue';
    import TopBar from '../components/TopBar.vue';
    import Schedule from '../components/Schedule.vue';

    const userStore = useUsersStore();

    const router = useRouter();

    onMounted(async () => {
        const isAuthenticated = await userStore.verifyToken();
        if (!isAuthenticated) {
            router.push("/auth");
        }
    });
</script>

<template>
    <TopBar></TopBar>
    <div v-if="!userStore.user.is_admin" class="view">
        <RegisteredCourses></RegisteredCourses>
        <Schedule></Schedule>
        <Account></Account>
    </div>
    <div v-if="userStore.user.is_admin" class="view">
        <AdminAllCourses></AdminAllCourses>
        <AdminAllStudents></AdminAllStudents>
        <Account></Account>
    </div>
</template>

<style scoped>
    .view {
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 50px;
        margin: 50px 0px;
    }
</style>