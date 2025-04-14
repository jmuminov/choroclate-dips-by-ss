import { query } from ".";

// Create a new user
async function createUser(username, password) {
    try {
        const res = await query("INSERT INTO users (username, password) VALUES ($1, $2) RETURNING *;", [username, password], []);
        return res.rows[0];
    } catch (err) {
        console.error(err);
        throw new Error("Error creating user.");
    }
}

// Fetch all users
async function getAllUsers() {
    try {
        const res = await query("SELECT * FROM users;", []);
        return res.rows;
    } catch (err) {
        console.error(err);
        throw new Error("Error fetching users.");
    }
}

// Fetch a user by ID
async function getUserById(id) {
    try {
        const res = await query("SELECT * FROM users WHERE id = $1;", [id], []);
        if (res.rows.length === 0) {
            throw new Error("User not found.");
        }
        return res.rows[0];
    } catch (err) {
        console.error(err);
        throw new Error("Error fetching user.");
    }
}

// Fetch user's info based on user ID
async function getUserInfoById(id) {
    try {
        const res = await query("SELECT * FROM user_info WHERE user_id = $1;", [id], []);
        if (res.rows.length === 0) {
            throw new Error("User info not found.");
        }
        return res.rows[0];
    } catch (err) {
        console.error(err);
        throw new Error("Error fetching user info.");
    }
}

// Create a new user info entry
async function createUserInfo(userId, info) {
    try {
        const res = await query("INSERT INTO user_info (user_id, info) VALUES ($1, $2) RETURNING *;", [userId, info], []);
        return res.rows[0];
    } catch (err) {
        console.error(err);
        throw new Error("Error creating user info.");
    }
}

// Update user info by ID
async function updateUserInfoById(id, info) {
    try {
        const res = await query("UPDATE user_info SET info = $1 WHERE id = $2 RETURNING *;", [info, id], []);
        if (res.rows.length === 0) {
            throw new Error("User info not found.");
        }
        return res.rows[0];
    } catch (err) {
        console.error(err);
        throw new Error("Error updating user info.");
    }
}

// Delete a user and user info by user ID
async function deleteUserById(id) {
    try {
        await query("DELETE FROM user_info WHERE user_id = $1;", [id], []);
        await query("DELETE FROM users WHERE id = $1;", [id], []);
    } catch (err) {
        console.error(err);
        throw new Error("Error deleting user.");
    }
}

export { createUser, getAllUsers, getUserById, getUserInfoById, createUserInfo, updateUserInfoById, deleteUserById };