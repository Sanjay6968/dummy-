const express = require("express");

const db = require("../db");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();


// =======================
// GET ALL TASKS
// =======================

router.get("/", authMiddleware, async (req, res) => {

    try {

        const result = await db.query(
            `
            SELECT *
            FROM tasks
            WHERE user_id = $1
            ORDER BY created_at DESC
            `,
            [req.user.userId]
        );

        res.json(result.rows);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Database error"
        });
    }
});


// =======================
// CREATE TASK
// =======================

router.post("/", authMiddleware, async (req, res) => {

    const { title, description } = req.body;

    if (!title) {
        return res.status(400).json({
            message: "Title is required"
        });
    }

    try {

        const result = await db.query(
            `
            INSERT INTO tasks
            (title, description, user_id)
            VALUES ($1, $2, $3)
            RETURNING *
            `,
            [
                title,
                description,
                req.user.userId
            ]
        );

        res.status(201).json({
            message: "Task created",
            task: result.rows[0]
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Failed to create task"
        });
    }
});


// =======================
// UPDATE TASK
// =======================

router.put("/:id", authMiddleware, async (req, res) => {

    const { title, description, status } = req.body;

    try {

        const result = await db.query(
            `
            UPDATE tasks
            SET
                title = $1,
                description = $2,
                status = $3
            WHERE id = $4
            AND user_id = $5
            RETURNING *
            `,
            [
                title,
                description,
                status,
                req.params.id,
                req.user.userId
            ]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "Task not found"
            });
        }

        res.json({
            message: "Task updated",
            task: result.rows[0]
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Failed to update task"
        });
    }
});


// =======================
// DELETE TASK
// =======================

router.delete("/:id", authMiddleware, async (req, res) => {

    try {

        const result = await db.query(
            `
            DELETE FROM tasks
            WHERE id = $1
            AND user_id = $2
            RETURNING *
            `,
            [
                req.params.id,
                req.user.userId
            ]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "Task not found"
            });
        }

        res.json({
            message: "Task deleted"
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Failed to delete task"
        });
    }
});


module.exports = router;