import { defineStore } from "pinia";

export const useCoursesStore = defineStore("courses",{
    state: () => ({
        courses: [],
        course: {},
        loading: false,
    }),
    actions: {
        async fetchCourses() {
            const token = JSON.parse(localStorage.getItem('user')).token
            try {
                this.courses = await (await fetch("/api/courses", {
                    method: "GET",
                    headers: { 
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    },
                })).json();
            } catch (error) {
                console.error("Error fetching courses:", error);
            }
        },
        async fetchCourse(courseID) {
            try {
                this.course = await (await fetch(`/api/courses/?searchTerm=${courseID}`, {
                    method: "GET",
                    headers: { 
                        "Content-Type": "application/json", 
                        "Authorization": `Bearer ${token}`
                    },
                })).json();

        
                return this.course;
            } catch (error) {
                console.error("Error fetching course:", error);
            }
        },
        async createCourse(newCourse) {
            try {
                const response = await fetch("/api/courses", {
                    method: "POST",
                    headers: { 
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}` 
                    },
                    body: JSON.stringify(newCourse),
                });
        
                if (!response.ok) {
                    throw new Error("Failed to create course");
                }
        
                this.course = await response.json();
                this.courses.push(this.course);
            } catch (error) {
                console.error("Failed to create course:", error);
            }
        },
        async updateCourse(updateValues) {
            const index = this.courses.findIndex(course => course.id === updateValues.id);
            if (index === -1) return;
        
            const oldCourse = { ...this.courses[index] };
        
            this.courses[index] = { ...this.courses[index], ...updateValues };
        
            try {
                const response = await fetch(`/api/courses/${updateValues.id}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(updateValues),
                });
        
                if (!response.ok) {
                    throw new Error("Failed to update course");
                }
            } catch (error) {
                console.error("Update failed, rolling back:", error);
                this.courses[index] = oldCourse; 
            }
        },
        async deleteCourse(courseID) {
            const index = this.courses.findIndex(course => course.id === courseID);
            if (index === -1) return;
        
            const oldCourse = { ...this.courses[index] };
        
            this.courses.splice(index, 1);
        
            try {
                const response = await fetch(`/api/courses/${courseID}`, {
                    method: "DELETE",
                });
        
                if (!response.ok) {
                    throw new Error("Failed to delete course");
                }
            } catch (error) {
                console.error("Delete failed, rolling back:", error);
                this.courses.splice(index, 0, oldCourse);
            }
        },
    },
});