import { defineStore } from "pinia";

export const useUsersStore = defineStore('users',{
    state: () => ({
        users: [],
        user: {},
        loading: false,
    }),
    actions: {
        async fetchUsers() {
            this.loading = true;
            try {
                this.courses = await (await fetch("/api/users", {
                    method: "GET",
                    headers: { "Content-Type": "application/json" },
                })).json();
            } catch (error) {
                console.error("Error fetching users:", error);
            } finally {
                this.loading = false;
            }
        },
        async fetchUser(userID) {
            try {
                const response = await fetch(`/api/user/${userID}`, {
                    method: "GET",
                    headers: { "Content-Type": "application/json" },
                });
        
                this.user = await response.json();
                console.log("User:", this.user);
            } catch (error) {
                console.error("Error fetching user:", error);
            }
        },
        async createUser(newUser) {
            try {
                const response = await fetch("/api/user", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(newUser),
                });
        
                if (!response.ok) {
                    throw new Error("Failed to create user");
                }
        
                const user = await response.json();
                this.users.push(user);
            } catch (error) {
                console.error("Failed to create user:", error);
            }
        },
        async updateUser(updateValues) {
            const index = this.users.findIndex(user => user.id === updateValues.id);
            if (index === -1) return;
        
            const oldUser = { ...this.users[index] };
        
            this.users[index] = { ...this.users[index], ...updateValues };
        
            try {
                const response = await fetch(`/api/users/${updateValues.id}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(updateValues),
                });
        
                if (!response.ok) {
                    throw new Error("Failed to update user");
                }
            } catch (error) {
                console.error("Update failed, rolling back:", error);
                this.users[index] = oldUser; 
            }
        },
        async deleteUser(userID) {
            const index = this.users.findIndex(user => user.id === userID);
            if (index === -1) return;
        
            const oldUser = { ...this.users[index] };
        
            this.users.splice(index, 1);
        
            try {
                const response = await fetch(`/api/users/${userID}`, {
                    method: "DELETE",
                });
        
                if (!response.ok) {
                    throw new Error("Failed to delete user");
                }
            } catch (error) {
                console.error("Delete failed, rolling back:", error);
                this.users.splice(index, 0, oldUser);
            }
        },
    },
});