import Knex from "../knex.js";
import { Model } from "objection";
 
// instantiate the model
Model.knex(Knex);
 
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
}
 
export default QuizItem;