import Knex from "../knex.js";
import { Model } from "objection";

Model.knex(Knex);

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
        session_id: { type: ["integer", "null"] }
      },
    };
  }
}

export default UserItem;
