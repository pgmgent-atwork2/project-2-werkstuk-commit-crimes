import Knex from "../knex.js";
import { Model } from "objection";

import QuestionItem from "./QuestionItem.js";

// instantiate the model
Model.knex(Knex);

// define the CategoryItem model
class AnswerItem extends Model {
  static get tableName() {
    return "answer_items";
  }

  static get idColumn() {
    return "id";
  }

  static get jsonSchema() {
    return {
      type: "object",
      required: ["answer_text", "is_correct", "question_id"],
      properties: {
        id: { type: "integer" },
        answer_text: { type: "string", minLength: 1, maxLength: 255 },
        is_correct: { type: "boolean" },
        question_id: { type: "integer" },
      },
    };
  }

  static get relationMappings() {
    return {
      question: {
        relation: Model.BelongsToOneRelation,
        modelClass: QuestionItem,
        join: {
          from: "answer_items.question_id",
          to: "question_items.id",
        },
      }
    };
  }
}

export default AnswerItem;