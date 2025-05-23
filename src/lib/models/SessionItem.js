import Knex from "../knex.js";
import { Model } from "objection";

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
        created_at: {
          type: "string",
          format: "date-time"
        }
      },
    };
  }
  
}

export default SessionItem;