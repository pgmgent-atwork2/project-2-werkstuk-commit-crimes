import Knex from "../knex.js";
import { Model } from "objection";

import SessionItem from "./SessionItem.js";
import FeedbackItem from "./FeedbackItem.js";

Model.knex(Knex);

class UserItem extends Model {
  static get tableName() {
    return "user_items";
  }

  static get idColumn() {
    return "id";
  }

  static get jsonSchema() {
    return {
      type: "object",
      required: ["name", "age"],
      properties: {
        id: { type: "integer" },
        name: { type: "string", minLength: 1, maxLength: 255 },
        age: { type: "integer" },
        session_id: { type: ["integer", "null"] },
        language: { type: ["string", "null"], maxLength: 50 },
        first_score: { type: ["integer", "null"] },
        second_score: { type: ["integer", "null"] },
      },
    };
  }

  static get relationMappings() {
    return {
      session: {
        relation: Model.BelongsToOneRelation,
        modelClass: SessionItem,
        join: {
          from: "user_items.session_id",
          to: "session.id",
        },
      },
      feedback: {
        relation: Model.HasManyRelation,
        modelClass: FeedbackItem,
        join: {
          from: "user_items.id",
          to: "feedback_items.user_id",
        },
      },
    }
  }
}

export default UserItem;
