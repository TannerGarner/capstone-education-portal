<script setup>
    import { ref, onMounted, watch } from 'vue';
    import { useUsersStore } from '../stores/users.js';
    import EditStudentModal from './modals/EditStudentModal.vue';
    const userStore = useUsersStore();
    const selectedUser = ref(null);
    const isEditStudentModalOpen = ref(false);
    const isNew = ref(false)
    const renderedUsers = ref([]);
    const searchQuery = ref("");

    onMounted(async () => {
        await userStore.fetchUsers();
        filterRenderedUsers();
    });
    watch(searchQuery, filterRenderedUsers);


    function openEditModal(user) {
        selectedUser.value = { ...user };
        isEditStudentModalOpen.value = true;
    }

    function closeEditModal() {
        isNew.value = false;
        isEditStudentModalOpen.value = false;
        selectedUser.value = null;
    }

    // async function saveStudent(userInfo) {
    //     if (isNew.value === true) {
    //         await userStore.createUser(userInfo);
    //         alert(`Successfully created user`);
    //     } else {
    //         console.log(userInfo);
    //         await userStore.updateUser(userInfo);
    //     }
    //     closeEditModal();
    // }

    function createUser() {
        isNew.value = true;
        const userPattern = {
            user_id: null,
            first_name: "",
            last_name: "",
            email: "",
            password: "",
            phone_number: "",
            street: "",
            city: "",
            state: "",
            country: "",
            is_admin: ""
        }
        // selectedUser.value = { ...userPattern };
        openEditModal(userPattern);
    }

    async function deleteUser(user_id){
        if (confirm(`Are you sure you want to delete account with userid: ${user_id}`)) {
            await userStore.deleteUser(user_id);
            // const deleted = await userStore.deleteUser(user_id);
            // alert(`${deleted ? "Deleted Successfully" : "Failed to Delete"}`);
            // if (deleted) router.push("/auth");
        }
    }

    function filterRenderedUsers() {
        if (searchQuery.value === "") {
            renderedUsers.value = [...userStore.users];
        } else {
            const searchQueryLower = searchQuery.value.toLowerCase();

            renderedUsers.value = userStore.users.filter((user) => (
                user.first_name.toLowerCase().includes(searchQueryLower)
                || user.last_name.toLowerCase().includes(searchQueryLower)
                || user.user_id.toString().toLowerCase().startsWith(searchQueryLower)
                || user.email.toLowerCase().includes(searchQueryLower)
            ));
        }
    }

    function tempDebugTesting() {
        console.log("=".repeat(25));
        console.log("searchQuery.value:", searchQuery.value);
        console.log("renderedUsers.value:", renderedUsers.value);
        console.log("=".repeat(25));
    }
</script>

<template>
    <div v-if="userStore.user.is_admin" class="container">
        <div class="header">
            <h2 @dblclick="tempDebugTesting()">Manage Users</h2>
            <input
                class="searchBar"
                type="search"
                v-model="searchQuery"
                placeholder="Search All Users"
            />
            <p @click="createUser" class="createUser">+ Create a New User</p>
        </div>
        <div class="allStudents">
            <div class="studentList">
                <div class="studentHeader">
                    <p>First Name</p>
                    <p>Last Name</p>
                    <p>User ID</p>
                    <p>Role</p>
                </div>
                <div 
                    class="student"
                    v-for="(user, index) in renderedUsers"
                    :key="user.user_id"
                    :class="{ firstStudent: index === 0 }"
                >
                    <p>{{ user.first_name }}</p>
                    <p>{{ user.last_name }}</p>
                    <p>{{ user.user_id }}</p>
                    <p>{{ user.is_admin ? "Admin" : "Student" }}</p>
                    <span class="material-symbols-outlined details" @click="openEditModal(user)">
                        edit_square
                    </span>
                    <span class="material-symbols-outlined delete" @click="deleteUser(user.user_id)">
                        delete
                    </span>
                </div>
            </div>
        </div>
        <EditStudentModal
            v-if="isEditStudentModalOpen"
            :user="selectedUser"
            :isNew="isNew"
            @close="closeEditModal"
        />
            <!-- @save="saveStudent" -->
    </div>
</template>

<style scoped>
    .allStudents {
        display: flex;
        flex-direction: column;
        align-items: center;
        flex-grow: 1;
        overflow: hidden;
        height: 80vh;
    }

    .createUser{
        font-weight: bold;
        font-size: 24px;
        cursor: pointer;
        color: #FE5E41;
    }

    .createUser:hover{
        color: #489FB5;
    }

    .studentList{
        width: 100%;
        display: flex;
        flex-direction: column;
        padding: 0px 2px 0px 2px;
        flex-grow: 1;
        overflow-y: auto;
        overflow-x: hidden;
        position: relative;
    }

    .studentHeader{
        display: grid;
        grid-template-columns: 1fr 1fr 1fr 1fr 0.5fr 0.5fr;
        align-items: center;
        background-color: #F5F1ED;
        color: #153131;
        padding: 25px 15px;
        position: sticky;
        top: 0;
        border-bottom: #489FB5 2px solid;;
    }

    .studentHeader > * {
        overflow: hidden;       
        text-overflow: ellipsis; 
        white-space: nowrap;
        margin-left: 20px;
    }

    .student{
        border-top: solid 2px #489FB5;
        padding: 15px;
        border-radius: 1px;
        display: grid;
        grid-template-columns: 1fr 1fr 1fr 1fr  0.5fr 0.5fr;
        align-items: center;
    }

    .student > * {
        overflow: hidden;       
        text-overflow: ellipsis; 
        white-space: nowrap;
        margin-left: 20px;
    }

    .firstStudent {
        border-top: none;
    }
    
    .details {
        color: #FE5E41;
        cursor: pointer;
    }

    .delete {
        color: #E63946;
        cursor: pointer;    
    }

    @media screen and (max-width: 1200px) {
        .searchBar {
            width: 80%;
        }

        .courseHeader > * {
            margin-left: 0;
        }

        .course > * {
            margin-left: 0;
        }
    }
</style>