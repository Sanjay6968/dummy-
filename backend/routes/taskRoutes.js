const express = require("express");

const db = require("../db");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();


// GET ALL TASKS
router.get("/", authMiddleware, (req, res) => {

    const sql = `
        SELECT * FROM tasks
        WHERE user_id = ?
        ORDER BY created_at DESC
    `;

    db.query(sql, [req.user.userId], (err, results) => {

        if (err) {
            return res.status(500).json({
                message: "Database error"
            });
        }

        res.json(results);
    });
});


// CREATE TASK
router.post("/", authMiddleware, (req, res) => {

    const { title, description } = req.body;

    if (!title) {
        return res.status(400).json({
            message: "Title is required"
        });
    }

    const sql = `
        INSERT INTO tasks
        (title, description, user_id)
        VALUES (?, ?, ?)
    `;

    db.query(
        sql,
        [title, description, req.user.userId],
        (err, result) => {

            if (err) {
                return res.status(500).json({
                    message: "Failed to create task"
                });
            }

            res.status(201).json({
                message: "Task created",
                taskId: result.insertId
            });
        }
    );
});


// UPDATE TASK
router.put("/:id", authMiddleware, (req, res) => {

    const { title, description, status } = req.body;

    const sql = `
        UPDATE tasks
        SET title = ?, description = ?, status = ?
        WHERE id = ? AND user_id = ?
    `;

    db.query(
        sql,
        [
            title,
            description,
            status,
            req.params.id,
            req.user.userId
        ],
        (err, result) => {

            if (err) {
                return res.status(500).json({
                    message: "Failed to update task"
                });
            }

            res.json({
                message: "Task updated"
            });
        }
    );
});


// DELETE TASK
router.delete("/:id", authMiddleware, (req, res) => {

    const sql = `
        DELETE FROM tasks
        WHERE id = ? AND user_id = ?
    `;

    db.query(
        sql,
        [req.params.id, req.user.userId],
        (err, result) => {

            if (err) {
                return res.status(500).json({
                    message: "Failed to delete task"
                });
            }

            res.json({
                message: "Task deleted"
            });
        }
    );
});


module.exports = router;