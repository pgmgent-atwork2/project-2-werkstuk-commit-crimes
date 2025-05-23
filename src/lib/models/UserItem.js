import { Model } from "objection";
import AnswerItem from "./AnswerItem.js";
import SessionItem from "./SessionItem.js";

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
      required: ["name", "age", "session_id"],
      properties: {
        id: { type: "integer" },
        name: { type: "string", minLength: 1, maxLength: 255 },
        age: { type: "integer" },
        session_id: { type: "integer" },
      },
    };
  }

  static get relationMappings() {
    return {
      answers: {
        relation: Model.ManyToManyRelation,
        modelClass: AnswerItem,
        join: {
          from: "user_items.id",
          through: {
            from: "user_answers.user_id",
            to: "user_answers.answer_id",
          },
          to: "answer_items.id",
        },
      },
      session: {
        relation: Model.BelongsToOneRelation,
        modelClass: SessionItem,
        join: {
          from: 'user_items.session_id',
          to: 'session.id',
        },
      },
    };
  }
}

export default UserItem;