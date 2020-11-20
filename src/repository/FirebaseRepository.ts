import {
  Firestore,
  CollectionReference,
  Query,
  DocumentData,
  Timestamp,
} from "@google-cloud/firestore";
import { IDataRepository } from "./IDataRepository";
import firestore from "../firestore";

export class FirestoreRepository implements IDataRepository {
  private _db;

  private _collectionRef: CollectionReference;

  private _query: Query;

  constructor(collectionName: string = "") {
    this._db = firestore;
    if (collectionName !== "") this.setCollection(collectionName);
  }

  public setCollection(collectionName: string): void {
    if (collectionName !== "") {
      this._collectionRef = this._db.collection(collectionName);
    } else {
      console.log("Collection name cannot be empty.");
    }
  }

  public async get(conditions: Array<Condition> = null): Promise<Document[]> {
    const documents: Array<Document> = [];

    this._query = this._collectionRef;

    if (this._isCollectionSet) {
      this._setConditions(conditions);

      try {
        (await this._query.get()).forEach((doc) => {
          documents.push({
            id: doc.id,
            data: doc.data(),
          });
        });
      } catch (error) {
        console.log(error);
      }
    }

    return documents;
  }

  public async getById(id: string): Promise<Document> {
    let document: Document = null;

    if (this._isCollectionSet) {
      try {
        const doc = await this._collectionRef.doc(id).get();

        if (doc.exists) {
          document = {
            id: doc.id,
            data: doc.data(),
          };
        } else {
          console.log("Document not found.");
        }
      } catch (error) {
        console.log(error);
      }
    }

    return document;
  }

  public async add(data: Object, id: string = null): Promise<ResultData> {
    let resultData: ResultData = null;

    if (this._isCollectionSet) {
      try {
        const result: any = id
          ? await this._collectionRef.doc(id).set(data)
          : await this._collectionRef.add(data);
        resultData = {
          document: {
            id: id || result.id,
            data,
          },
          writeTime: result.writeTime ? result.writeTime : null,
        };
      } catch (error) {
        console.log(error);
      }
    }

    return resultData;
  }

  public async update(
    data: Object,
    id: string,
    isMerge: boolean = false
  ): Promise<ResultData> {
    let resultData: ResultData = null;

    if (this._isCollectionSet) {
      try {
        const result = await this._collectionRef
          .doc(id)
          .set(data, { merge: isMerge });
        resultData = {
          document: {
            id,
            data,
          },
          writeTime: result.writeTime ? result.writeTime : null,
        };
      } catch (error) {
        console.log(error);
      }
    }

    return resultData;
  }

  public async delete(id: string): Promise<ResultData> {
    let resultData: ResultData = null;

    if (this._isCollectionSet) {
      try {
        const doc = await this._collectionRef.doc(id).get();

        if (doc.exists) {
          const result = await this._collectionRef.doc(id).delete();
          resultData = {
            writeTime: result.writeTime,
            document: {
              id,
              data: doc.data(),
            },
          };
        } else {
          console.log("Document does not exist.");
        }
      } catch (error) {
        console.log(error);
      }
    }

    return resultData;
  }

  private get _isCollectionSet(): boolean {
    let result: boolean = false;

    if (this._collectionRef) {
      result = true;
    } else {
      console.log("Collection is not set.");
    }

    return result;
  }

  private _setConditions(conditions: Array<Condition>): void {
    if (conditions && conditions.length > 0) {
      conditions.forEach((condition) => {
        this._query = this._query.where(
          condition.field,
          condition.operator,
          condition.value
        );
      });
    }
  }
}

// @Types
export interface Document {
  id: string;
  data: DocumentData;
}

export interface ResultData {
  document: Document;
  writeTime?: Timestamp;
}

export enum Operators {
  LessThan = ">",
  LessThanOrEqual = "<=",
  Equal = "==",
  GreaterThan = ">",
  GreaterThanOrEqual = ">=",
}

export interface Condition {
  field: string;
  operator: Operators;
  value: any;
}
