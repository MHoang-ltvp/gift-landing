import { MongoClient, Db } from "mongodb";

const uri = process.env.MONGODB_URI;
const dbName = process.env.DB_NAME || "gift_shop";

if (!uri) {
    throw new Error('Missing env: MONGODB_URI');
}

// Cache client in global for dev (hot reload)
declare global {
    // eslint-disable-next-line no-var
    var _mongoClientPromise: Promise<MongoClient> | undefined;
}

let clientPromise: Promise<MongoClient>;

if (process.env.NODE_ENV === "development") {
    if (!global._mongoClientPromise) {
        const client = new MongoClient(uri);
        global._mongoClientPromise = client.connect();
    }
    clientPromise = global._mongoClientPromise;
} else {
    const client = new MongoClient(uri);
    clientPromise = client.connect();
}

export async function getDb(): Promise<Db> {
    const client = await clientPromise;
    return client.db(dbName);
}
