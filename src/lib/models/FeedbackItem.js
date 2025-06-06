import Knex from "../knex.js";
import { Model } from "objection";

import UserItem from "./UserItem.js";
import SessionItem from "./SessionItem.js";

Model.knex(Knex);

class FeedbackItem extends Model {
  static get tableName() {
    return "feedback_items";
  }

  static get idColumn() {
    return "id";
  }

  static get jsonSchema() {
    return {
      type: "object",
      required: ["name", "age", "session_id"],
      properties: {
        id: { type: "integer" },
        user_id: { type: "integer" },
        quiz_id: { type: "integer" },
        feedback: { type: "string", minLength: 1, maxLength: 255 },
        rating: { type: "integer" },
      },
    };
  }
  static get relationMappings() {
    return {
      user: {
        relation: Model.BelongsToOneRelation,
        modelClass: UserItem,
        join: {
          from: "feedback_items.user_id",
          to: "users.id",
        },
      },
      quiz: {
        relation: Model.BelongsToOneRelation,
        modelClass: SessionItem,
        join: {
          from: "feedback_items.session_id",
          to: "session.id",
        },
      },
    };
  }
}

export default FeedbackItem;
