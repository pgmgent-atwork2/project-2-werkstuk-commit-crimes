import Knex from "../knex.js";
import { Model } from "objection";
 
// instantiate the model
Model.knex(Knex);

import QuestionItem from "./QuestionItem.js";
 
class QuizItem extends Model {
  static get tableName() {
    return "quiz_items";
  }
 
  static get idColumn() {
    return "id";
  }
 
  static get jsonSchema() {
    return {
      type: "object",
      required: ["language", "title"],
      properties: {
        id: { type: "integer" },
        language: { type: "string", minLength: 1, maxLength: 255 },
        title: { type: "string", minLength: 1, maxLength: 255 },
        created_at: {
          type: "string",
          format: "date-time"
        },
      },
    };
  }
  static get relationMappings() {
    return {
      questions: {
        relation: Model.HasManyRelation,
        modelClass: QuestionItem,
        join: {
          from: "quiz_items.id",
          to: "question_items.quiz_id",
        },
      },
    };
  }
}
 
export default QuizItem;