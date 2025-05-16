import { Model } from "objection";
import AnswerItem from "./AnswerItem.js";

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
    };
  }
}

export default UserItem;