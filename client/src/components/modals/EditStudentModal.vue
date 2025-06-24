<script setup>
    import { ref, watch } from 'vue';
    import EnrollmentList from './EnrollmentList.vue';
    import { useEnrollmentStore } from '../../stores/enrollment';
    const enrollmentStore = useEnrollmentStore();

    const props = defineProps({
        user: Object,
        isNew: Boolean,  
        isOpen: Boolean  
    });

    const emit = defineEmits(['close', 'save']);

    function closeModal() {
        Object.entries(editorState.value).forEach(([key]) => {
            editorState.value[key] = false;
        });
        emit('close');
    }

    function saveChanges() {
        emit('save', editUser.value);
    }

    function deleteUser(userId) {
        if (confirm(`Are you sure you want to delete user with ID: ${userId}?`)) {
            enrollmentStore.deleteUser(userId);
            closeModal();
        }
    }

    function fixString(string){
        let fixed = string.replaceAll("_", " ");
        fixed = fixed.toLowerCase().replace(/\b\w/g, char => char.toUpperCase());
        fixed = fixed.replaceAll(/Or\b/g, "or");
        return fixed;
    }

    const editUser = ref({});
    const editorState = ref({});

    watch(() => props.isOpen, (newVal) => {
        if (props.isOpen) enrollmentStore.getCoursesForUser(props.user.user_id);

        if (newVal) {
            editUser.value = { ...props.user };
            if (props.isNew) {
                Object.keys(props.user).forEach(key => {
                    if (key === 'address') {
                        editorState.value.address = {};
                        Object.keys(props.user.address).forEach(addressKey => {
                            editorState.value.address[addressKey] = true;
                        });
                    } else {
                        editorState.value[key] = true;
                    }
                });
            }
        }
    });
</script>

<template>
    <div v-if="isOpen" class="cover">
        <div class="editStudentModal">
            <div class="studentInfo">
                <div class="smallFields">
                    <div 
                        v-for="key in Object.keys(user).filter((k) => k !== 'user_id')"
                        :key="key"
                        class="row"
                    >
                        <p>{{ fixString(key) }}</p>
                        <input v-model="editUser[key]" type="text">
                    </div>
                </div>
            </div>
            <div class="enrollmentLists">
                <EnrollmentList
                    heading="Enrolled Courses"
                    listType="coursesForUser"
                    class="coursesForUser"
                />
                <EnrollmentList
                    heading="Available Courses"
                    listType="coursesNotForUser"
                    class="coursesNotForUser"
                />
            </div>
            <div class="modalButtons">
                <button class="delete" @click="deleteUser(user.user_id)">
                    <span class="material-symbols-outlined">
                        delete
                    </span>
                    Delete User
                </button>
                <div class="rightButtons">
                    <button class="cancel" @click="closeModal(user.user_id)">
                        Cancel
                    </button>
                    <button class="save" @click="saveChanges(user.user_id)">
                        Save
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
    .cover{
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        background-color: rgba(0, 0, 0, 0.5);
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .editStudentModal {
        position: relative;
        width: 85vw;
        height: 80vh;
        background-color: #F5F1ED;
        border-radius: 10px;
        padding: 50px;
        box-shadow: 0px 0px 500px #153131;
        display: grid;
        grid-template-columns: 2fr 1fr;
        grid-template-rows: auto auto;
        flex-direction: column;
        justify-content: center;
        gap: 1.5rem;
    }

    .studentInfo {
        display: flex;
        flex-direction: column;
    }

    .smallFields {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: clamp(0.5rem, 2vw, 1rem);
        height: 100%;
    }

    .row {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        justify-content: space-between;
        padding: 0.5rem;
        padding-bottom: 1rem;
        border-bottom: 1px solid #489FB5;
        font-size: clamp(0.5rem, 2vw, 1.25rem);
    }

    input {
        padding: clamp(0.5rem, 2vw, 1.25rem);
        font-size: clamp(0.5rem, 2vw, 1.25rem);
        border: 1px solid #489FB5;
        border-radius: 5px;
        max-width: 200px;
    }

    .enrollmentLists {
        max-height: 70vh;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        gap: 1rem;
    }
    

    .modalButtons{
        grid-column: 1 / span 2;
        display: grid;
        grid-template-columns: auto auto;
        gap: 10px;
    }

    .rightButtons{
        justify-self: end;
        display: flex;
        gap: 10px;
        justify-content: end;
    }

    .save:hover{
        background-color: #489FB5;
    }

    .cancel{
        color: #FE5E41;
        background-color: #F5F1ED;
        border: 2px solid #FE5E41;
        cursor: pointer;
    }

    .cancel:hover{
        background-color: #FE5E41;
        color: #F5F1ED;
    }

    .delete{
        grid-column: 1 / span 1;
        justify-self: start;
        background-color: #F5F1ED;
        color: #E63946;
        border: 2px solid #E63946;
        width: auto;
    }

    .delete > *{
        color: #E63946;
    }

    .delete:hover{
        background-color: #E63946;
        color: #F5F1ED;
    }

    .delete:hover > *{
        color: #F5F1ED;
    }

    @media screen and (max-width: 768px) {

        .cover {
            align-items: end; 
        }

        .editStudentModal {
            width: 95vw;
            height: 90vh;
            padding: 20px;
            padding-bottom: 0;
            grid-template-columns: 1fr;
            grid-template-rows: auto auto auto;
            overflow-y: scroll;
        }

        .studentInfo,
        .enrollmentLists,
        .modalButtons {
            grid-column: 1 / -1; 
        }

        .smallFields {
            grid-template-columns: 1fr;
        }

        .row{
            font-size: clamp(0.75rem, 2vw, 1rem);
        }

        input {
            font-size: clamp(0.75rem, 2vw, 1rem);;
            width: 100%;
        }

        .enrollmentLists {
            flex-direction: column;
            gap: 1rem;
        }
        
        .modalButtons {
            position: sticky;
            bottom: 0;
            padding: 10px;
            box-shadow: 0px -2px 10px rgba(0, 0, 0, 0.1);
            border-radius: 5px;
            background-color: #F5F1ED;
            display: flex;
            justify-content: space-between;        
        }

    }

</style>