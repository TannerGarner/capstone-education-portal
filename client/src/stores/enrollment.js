import { defineStore } from "pinia";
import { useUsersStore } from "./users";
import { useCoursesStore } from './courses.js';

export const useEnrollmentStore = defineStore("enrollment",{
    state: () => ({
        enrollUserData: {},
        enrollCourseData: {}
    }),
    actions: {
        async enrollUserInCourse(user_id, course_id) {
            try {
                const userStore = useUsersStore();
                const courseStore = useCoursesStore();

                const response = await fetch(`/api/enrollment/enroll`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${userStore.user.token}`
                    },
                    body: JSON.stringify({ user_id, course_id })
                })

                if (!response.ok) throw new Error("Failed to enroll user in course");

                const enrollData = await response.json();

                return enrollData;
            } catch (error) {
                console.error("Error enrolling user in course:", error);
            }
        },
        async dropCourseFromUser(user_id, course_id) {
            try {
                const userStore = useUsersStore();
                const courseStore = useCoursesStore();

                const response = await fetch(`/api/enrollment/drop`, {
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${userStore.user.token}`
                    },
                    body: JSON.stringify({ user_id, course_id })            
                })

                if(!response.ok) throw new Error("Failed to drop course from user");

                const enrollData = await response.json();

                return enrollData;
            } catch (error) {
                console.error("Error dropping course from user:", error);
            } 
        },
        async getUsersInCourse(course_id) {
            try {
                const userStore = useUsersStore();
                const courseStore = useCoursesStore();

                const response = await fetch(`/api/enrollment/course/${course_id}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${userStore.user.token}`
                    },      
                })

                if(!response.ok) throw new Error("Failed to drop course from user");

                const enrollData = await response.json();

                return enrollData;
            } catch (error) {
                console.error("Error dropping course from user:", error);
            } 
        },
        async getCoursesForUser(user_id) {
            try {
                const userStore = useUsersStore();
                const courseStore = useCoursesStore();

                const response = await fetch(`/api/enrollment/user/${user_id}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${userStore.user.token}`
                    },        
                })

                if(!response.ok) throw new Error("Failed to drop course from user");

                const enrollData = await response.json();

                return enrollData;
            } catch (error) {
                console.error("Error dropping course from user:", error);
            } 
        },

    },
});