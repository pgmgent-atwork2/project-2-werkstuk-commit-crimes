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
      required: ["group", "password"],
      properties: {
        id: { type: "integer" },
        user_id: { type: "integer" },
        group: { type: "integer" },
        attempt_number: { type: "integer" },
        password: { type: "string" },
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
        relation: Model.HasManyRelation,
        modelClass: UserItem,
        join: {
          from: "session.id",
          to: "user_items.session_id",
        },
      },
      quiz: {
        relation: Model.HasOneRelation,
        modelClass: QuizItem,
        join: {
          from: "session.group",
          to: "quiz_items.group_id",
        },
      },
    };
  }
}

export default SessionItem;