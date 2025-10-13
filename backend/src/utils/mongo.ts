import {
  Collection,
  Db,
  Document,
  Filter,
  FindCursor,
  MongoClient,
  WithId,
} from "mongodb";

let client: MongoClient;
let db: Db;

const useMongoUtils = () => {
  const connectMongo = async () => {
    if (!client) {
      const url = <string>process.env.MONGODB_URI;
      const dbName = process.env.MONGODB_NAME;
      client = new MongoClient(url);
      await client.connect();
      db = client.db(dbName);
    }
    return db;
  };

  const find = async <T extends Document>(
    _query: object,
    collectionName: string
  ) => {
    const collection: Collection<T> = db.collection(collectionName);
    const document: WithId<T> | null = await collection.findOne(_query);
    return document;
  };

  const findMany = async <T extends Document>(
    _query: object,
    collectionName: string
  ) => {
    const collection: Collection<T> = db.collection(collectionName);
    const cursor: FindCursor<WithId<T>> = collection.find(_query);
    return await cursor.toArray();
  };

  const insert = async (data: object, collectionName: string) => {
    const collection: Collection = db.collection(collectionName);
    return await collection.insertOne(data);
  };

  const update = async (
    _query: object,
    data: object,
    collectionName: string
  ) => {
    const collection: Collection = db.collection(collectionName);
    console.log(data);
    return await collection.updateOne(_query, { $set: data });
  };

  return {
    connectMongo,
    find,
    findMany,
    insert,
    update,
  };
};

export default useMongoUtils;
