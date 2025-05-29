import Knex from "../knex.js";
import { Model } from "objection";

Model.knex(Knex);

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
      },
    };
  }

  static get relationMappings() {
  return {
    session: {
      relation: Model.BelongsToOneRelation,
      modelClass: SessionItem,
      join: {
        from: "user_items.session_id",
        to: "session.id",
      },
    },
  };
}
}

export default UserItem;