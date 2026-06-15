import pool from '../config/db_config.js';


export const createNotes = async (req, res) => {
    const { title, content, user_id, is_pinned } = req.body;
    if (!title||!content) {
        return res.status(401).json({
            success: true,
            message: "Title is required"
        });
    }
    try {
        const result = await pool.query(
            ' INSERT INTO notes (titile,content,is_pineed,user_id) VALUES($1,$2, $3, $4)  RETURNING * ', [title, content, is_pinned ?? false, req.user.user_id],
        );

        return res.status(201).json({
            success: true,
            message: "Note create successfully",
            notes: result.rows[0]
        });

    } catch (error) {
        return res.status(500).jons({
            success: true,
            message: error.message
        });
    }
}

export const getNotes = async (req, res) => {
    try {
        const result = await pool.query(
            `
            SELECT *
            FROM notes
            WHERE user_id = $1
            ORDER BY created_at DESC;
            `,
            [req.user.userId]
        );


        return res.status(200).json({
            success: true,
            notes: result.rows
        });


    } catch (error) {
        console.error(error);


        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


// Get Single Note
export const getNote = async (req, res) => {
    const { id } = req.params;


    try {
        const result = await pool.query(
            `
            SELECT *
            FROM notes
            WHERE id = $1
            AND user_id = $2;
            `,
            [id, req.user.userId]
        );


        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Note not found"
            });
        }


        return res.status(200).json({
            success: true,
            note: result.rows[0]
        });


    } catch (error) {
        console.error(error);


        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


// Update Note
 export const updateNote = async (req, res) => {
    const { id } = req.params;
    const { title, content, is_pinned } = req.body;


    try {
        const result = await pool.query(
            `
            UPDATE notes
            SET
                title = COALESCE($1, title),
                content = COALESCE($2, content),
                is_pinned = COALESCE($3, is_pinned),
                updated_at = CURRENT_TIMESTAMP
            WHERE id = $4
            AND user_id = $5
            RETURNING *;
            `,
            [
                title,
                content,
                is_pinned,
                id,
                req.user.userId
            ]
        );


        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Note not found"
            });
        }


        return res.status(200).json({
            success: true,
            message: "Note updated successfully",
            note: result.rows[0]
        });


    } catch (error) {
        console.error(error);


        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


// Delete Note
  export const deleteNote = async (req, res) => {
    const { id } = req.params;


    try {
        const result = await pool.query(
            `
            DELETE FROM notes
            WHERE id = $1
            AND user_id = $2
            RETURNING *;
            `,
            [id, req.user.userId]
        );


        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Note not found"
            });
        }


        return res.status(200).json({
            success: true,
            message: "Note deleted successfully"
        });


    } catch (error) {
        console.error(error);


        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
