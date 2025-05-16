import Knex from "../knex.js";
import { Model } from "objection";

import AnswerItem from "./AnswerItem.js";
 
// instantiate the model
Model.knex(Knex);
 
class QuestionItem extends Model {
  static get tableName() {
    return "question_items";
  }
 
  static get idColumn() {
    return "id";
  }
 
  static get jsonSchema() {
    return {
      type: "object",
      required: ["question", "image_path"],
      properties: {
        id: { type: "integer" },
        question: { type: "string", minLength: 1, maxLength: 255 },
        image_path: { type: "string", maxLength: 255 },
      },
    };
  }
  
  static get relationMappings() {
    return {
      answers: {
        relation: Model.HasManyRelation,
        modelClass: AnswerItem,
        join: {
          from: "question_items.id",
          to: "answer_items.question_id",
        },
      },
    };
  }
}
 
export default QuestionItem;