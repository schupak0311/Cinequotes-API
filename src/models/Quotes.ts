import { FirestoreRepository } from '../repository/FirebaseRepository';

const quotesRepository = new FirestoreRepository();
quotesRepository.setCollection('quotes');

export default quotesRepository;
