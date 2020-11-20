export interface IDataRepository {
  get(conditions: Array<Object>): Promise<Object[]>;
  getById(id: any): Promise<Object>;
  add(data: Object, id: string | number): Promise<any>;
  update(data: Object, id: string | number): Promise<any>;
  delete(id: string | number): Promise<any>;
}
