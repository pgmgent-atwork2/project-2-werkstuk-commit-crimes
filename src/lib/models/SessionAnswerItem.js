import Knex from "../knex.js";
import { Model } from "objection";

import SessionItem from "./SessionItem.js";
import QuestionItem from "./QuestionItem.js";
import AnswerItem from "./AnswerItem.js";

// instantiate the model
Model.knex(Knex);

// define the CategoryItem model
class SessionAnswerItem extends Model {
  static get tableName() {
    return "session_answer_items";
  }

  static get idColumn() {
    return "id";
  }

  static get jsonSchema() {
    return {
      type: "object",
      properties: {
        id: { type: "integer" },
        attempt_id: { type: "integer" },
        question_id: { type: "integer" },
        answer_id: { type: "integer" },
      },
    };
  }

  static get relationMappings() {
    return {
      session: {
        relation: Model.BelongsToOneRelation,
        modelClass: SessionItem,
        join: {
          from: "session_answer_items.attempt_id",
          to: "sessions.id",
        },
      },
      question: {
        relation: Model.BelongsToOneRelation,
        modelClass: QuestionItem,
        join: {
          from: "session_answer_items.question_id",
          to: "question_items.id",
        },
      },
      answer: {
        relation: Model.BelongsToOneRelation,
        modelClass: AnswerItem,
        join: {
          from: "session_answer_items.answer_id",
          to: "answer_items.id",
        },
      },
    };
  }
}

export default SessionAnswerItem;