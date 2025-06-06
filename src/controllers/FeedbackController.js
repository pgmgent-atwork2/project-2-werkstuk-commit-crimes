import FeedbackItem from "../lib/models/FeedbackItem.js";

export const getAllFeedback = async (req, res) => {
    try {
        if (req.query.user_id) {
            const feedback = await FeedbackItem.query()
                .where("user_id", req.query.user_id)
                .withGraphFetched("session");
            return res.json(feedback);
        }

    const allFeedback = await FeedbackItem.query().withGraphFetched("session");
    res.json(allFeedback);
    } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
    }
};

export const updateFeedback = async (req, res) => {
    try {
        const { id } = req.params;
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