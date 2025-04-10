import { query } from ".";

//Create a new user
async function createUser(username, password) {
    try {
        const res = await query("INSERT INTO users (username, password) VALUES ($1, $2) RETURNING *;", [username, password], []);
        return res.rows[0];
    } catch (err) {
        console.error(err);
        throw new Error("Error creating user.");
    }
}

export { createUser };