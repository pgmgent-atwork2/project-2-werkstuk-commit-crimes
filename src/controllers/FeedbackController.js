import FeedbackItem from "../lib/models/FeedbackItem.js";

export const getAllFeedback = async (req, res) => {
    try {
        if (req.query.user_id) {
            const feedback = await FeedbackItem.query()
                .where("user_id", req.query.user_id)
                .withGraphFetched("user");
            return res.json(feedback);
        }

        const allFeedback = await FeedbackItem.query().withGraphFetched("user");
        res.json(allFeedback);
    } catch (error) {
        console.error("Error getting feedback:", error);
        res.status(500).json({ 
            error: "Failed to retrieve feedback",
            details: error.message 
        });
    }
};

export const postFeedback = async (req, res) => {
    try {
        const { user_id, feedback, rating } = req.body;

        const feedbackData = {
            user_id: Number(user_id),
            feedback: String(feedback),
            rating: Number(rating),
        };

        if (!feedbackData.user_id || !feedbackData.feedback || isNaN(feedbackData.rating)) {
            return res.status(400).json({ error: "Invalid or missing required fields" });
        }

        const newFeedback = await FeedbackItem.query().insert(feedbackData);
        res.status(201).json(newFeedback);
    } catch (error) {
        console.error("Error creating feedback:", error);
        res.status(400).json({ 
            error: "Invalid feedback data",
            details: error.message 
        });
    }
};


export const updateFeedback = async (req, res) => {
    try {
        const { id } = req.params;
        const { feedback, rating } = req.body;

        if (!feedback && rating === undefined) {
            return res.status(400).json({ error: "Nothing to update" });
        }

        const updatedFeedback = await FeedbackItem.query().patchAndFetchById(id, {
            feedback,
            rating,
        });

        if (!updatedFeedback) {
            return res.status(404).json({ error: "Feedback not found" });
        }

        res.json(updatedFeedback);
    } catch (error) {
        console.error("Error updating feedback:", error);
        res.status(500).json({ 
            error: "Failed to update feedback",
            details: error.message 
        });
    }
};

export const deleteFeedback = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedCount = await FeedbackItem.query().deleteById(id);

        if (deletedCount === 0) {
            return res.status(404).json({ error: "Feedback not found" });
        }

        res.json({ success: true });
    } catch (error) {
        console.error("Error deleting feedback:", error);
        res.status(500).json({ 
            error: "Failed to delete feedback",
            details: error.message 
        });
    }
};