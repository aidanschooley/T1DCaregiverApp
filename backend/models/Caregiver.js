class Caregiver {
    static async getCaregiverById(id) {
        const query = `SELECT * FROM caregiver WHERE id = $1`;
        const values = [id];
        const result = await db.query(query, values);
        return result.rows[0];
    }
}