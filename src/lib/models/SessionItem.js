import Knex from "../knex.js";
import { Model } from "objection";

import UserItem from "./UserItem.js";
import QuizItem from "./QuizItem.js";

// instantiate the model
Model.knex(Knex);

// define the CategoryItem model
class SessionItem extends Model {
  static get tableName() {
    return "session";
  }

  static get idColumn() {
    return "id";
  }

  static get jsonSchema() {
    return {
      type: "object",
      properties: {
        id: { type: "integer" },
        user_id: { type: "integer" },
        quiz_id: { type: "integer" },
        attempt_number: { type: "integer" },
        score: { type: "integer" },
        created_at: {
          type: "string",
          format: "date-time"
        }
      },
    };
  }

  static get relationMappings() {
    return {
      user: {
        relation: Model.HasOneRelation,
        modelClass: UserItem,
        join: {
          from: "session.id",
          to: "user_items.session_id",
        },
      },
      quiz: {
        relation: Model.BelongsToOneRelation,
        modelClass: QuizItem,
        join: {
          from: "session.quiz_id",
          to: "quiz_items.id",
        },
      },
    };
  }
  
}

export default SessionItem;