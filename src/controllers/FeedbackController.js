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
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
    }
};

export const postFeedback = async (req, res) => {
    try {
        const { user_id, session_id, feedback, rating } = req.body;

        const newFeedback = await FeedbackItem.query().insert({
            user_id,
            session_id,
            feedback,
            rating,
        });

        res.status(201).json(newFeedback);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

export const updateFeedback = async (req, res) => {
    try {
        const { id } = req.params.id;
        const { feedback } = req.body;

        const updatedFeedback = await FeedbackItem.query().patchAndFetchById(id, {
            feedback,
        });

        res.json(updatedFeedback);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

export const deleteFeedback = async (req, res) => {
    try {
        await FeedbackItem.query().deleteById(req.params.id);
        res.json({ success: true });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};