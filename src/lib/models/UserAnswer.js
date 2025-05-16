import { Model } from "objection";
import UserItem from "./UserItem.js";
import AnswerItem from "./AnswerItem.js";

class UserAnswer extends Model {
  static get tableName() {
    return "user_answers";
  }

  static get idColumn() {
    return "id";
  }

  static get jsonSchema() {
    return {
      type: "object",
      required: ["user_id", "answer_id"],
      properties: {
        id: { type: "integer" },
        user_id: { type: "integer" },
        answer_id: { type: "integer" },
      },
    };
  }

  static get relationMappings() {
    return {
      user: {
        relation: Model.BelongsToOneRelation,
        modelClass: UserItem,
        join: {
          from: "user_answers.user_id",
          to: "user_items.id",
        },
      },
      answer: {
        relation: Model.BelongsToOneRelation,
        modelClass: AnswerItem,
        join: {
          from: "user_answers.answer_id",
          to: "answer_items.id",
        },
      },
    };
  }
}

export default UserAnswer;